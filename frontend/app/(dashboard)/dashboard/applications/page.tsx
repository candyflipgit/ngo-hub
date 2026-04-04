'use client';
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Search, CheckCircle, XCircle, Filter, FileText } from 'lucide-react';
import Link from 'next/link';

export default function ApplicationsManagement() {
  const [activeTab, setActiveTab] = useState('PENDING');
  const [eventId, setEventId] = useState('');
  const queryClient = useQueryClient();
  const token = Cookies.get('token');
  const api = axios.create({ baseURL: `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001"}`, headers: { Authorization: `Bearer ${token}` } });

  // First fetch my events to pick the first one's ID
  const { data: events = [] } = useQuery({
    queryKey: ['my-events'],
    queryFn: async () => {
      const { data } = await api.get('/events');
      return data;
    }
  });

  useEffect(() => {
    if (events.length > 0 && !eventId) {
       setEventId(events[0].id);
    }
  }, [events, eventId]);

  // Fetch applications for that event
  const { data: applicants = [], isLoading } = useQuery({
    queryKey: ['applications', eventId],
    queryFn: async () => {
      if (!eventId) return [];
      const { data } = await api.get(`/events/${eventId}/applications`);
      return data;
    },
    enabled: !!eventId
  });

  const updateMutation = useMutation({
    mutationFn: async ({ appId, status }: { appId: string, status: 'APPROVED'|'REJECTED' }) => {
      await api.patch(`/events/applications/${appId}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications', eventId] });
      alert('Application updated successfully!');
    }
  });

  const attendMutation = useMutation({
    mutationFn: async ({ appId, hours }: { appId: string, hours: number }) => {
      await api.post(`/events/applications/${appId}/attend`, { hours });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications', eventId] });
      alert('Attendance officially marked and Certificate instantly generated!');
    }
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Applications</h1>
        <p className="text-slate-500 mt-2 font-medium">Review and manage volunteer requests.</p>
      </div>

      {events.length > 0 && (
         <select className="p-3 bg-white border border-slate-200 rounded-xl" value={eventId} onChange={e => setEventId(e.target.value)}>
            {events.map((e: any) => <option key={e.id} value={e.id}>{e.title}</option>)}
         </select>
      )}

      <div className="flex justify-between items-center bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex space-x-2 bg-slate-50 p-1 rounded-2xl">
          {['PENDING', 'APPROVED', 'REJECTED'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === tab ? 'bg-white shadow-sm text-teal-600' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}>
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {isLoading && <div className="text-center py-10">Loading applications...</div>}
        
        {applicants.filter((a: any) => a.status === activeTab).map((a: any) => (
          <div key={a.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-shadow">
             <div className="flex flex-col">
               <h3 className="text-lg font-bold text-slate-900">{a.volunteer.user.email}</h3>
               <div className="flex items-center text-sm font-medium text-slate-500 space-x-3 mt-1">
                 <span>Applied for <b className="text-slate-700">Event #{eventId.substring(0,6)}</b></span>
               </div>
             </div>
             
             {activeTab === 'PENDING' ? (
               <div className="flex space-x-4">
                 <button onClick={() => updateMutation.mutate({ appId: a.id, status: 'APPROVED' })} className="flex items-center px-4 py-2 bg-emerald-50 text-emerald-600 font-semibold rounded-xl hover:bg-emerald-600 hover:text-white border border-emerald-200 transition-all">
                   <CheckCircle className="w-4 h-4 mr-2" /> Approve
                 </button>
                 <button onClick={() => updateMutation.mutate({ appId: a.id, status: 'REJECTED' })} className="flex items-center px-4 py-2 bg-rose-50 text-rose-600 font-semibold rounded-xl hover:bg-rose-600 hover:text-white border border-rose-200 transition-all">
                   <XCircle className="w-4 h-4 mr-2" /> Reject
                 </button>
               </div>
             ) : activeTab === 'APPROVED' ? (
                <div className="flex space-x-4">
                  <button onClick={() => {
                        const h = prompt('Enter the number of certified hours to log for this volunteer:', '5');
                        if (h && !isNaN(parseInt(h))) {
                           attendMutation.mutate({ appId: a.id, hours: parseInt(h) });
                        }
                  }} disabled={attendMutation.isPending} className="flex items-center px-4 py-2 bg-indigo-50 text-indigo-600 font-semibold rounded-xl hover:bg-indigo-600 hover:text-white border border-indigo-200 transition-all disabled:opacity-50">
                     {attendMutation.isPending ? 'Processing...' : 'Mark Attendance'}
                  </button>
                </div>
             ) : null}
          </div>
        ))}
        {!isLoading && applicants.filter((a: any) => a.status === activeTab).length === 0 && (
          <div className="text-center py-20 text-slate-400 font-medium">No {activeTab.toLowerCase()} applications for this event.</div>
        )}
      </div>
    </div>
  );
}
