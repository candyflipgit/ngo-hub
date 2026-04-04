'use client';
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Cookies from 'js-cookie';
import { MapPin, Calendar as CalendarIcon, Users, CheckCircle } from 'lucide-react';

export default function EventsManagement() {
  const [role, setRole] = useState('VOLUNTEER');
  const [token, setToken] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', description: '', date: '', location: '', requiredVolunteers: 10 });
  const [isMounted, setIsMounted] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
     setRole(Cookies.get('role') || 'VOLUNTEER');
     setToken(Cookies.get('token') || null);
     setIsMounted(true);
  }, []);

  const api = axios.create({ baseURL: `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001"}`, headers: { Authorization: `Bearer ${token}` } });

  // Fetch Events
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      if (!token) return [];
      const { data } = await api.get('/events');
      return data;
    },
    enabled: !!token
  });

  // Create Event Mutation
  const createMutation = useMutation({
    mutationFn: async (eventData: typeof newEvent) => {
      await api.post('/events', eventData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      setShowModal(false);
      alert('Event created successfully!');
    }
  });

  // Apply Mutation
  const applyMutation = useMutation({
    mutationFn: async (eventId: string) => {
      await api.post(`/events/${eventId}/apply`);
    },
    onSuccess: () => {
      alert('Applied successfully!');
      queryClient.invalidateQueries({ queryKey: ['events'] });
    }
  });

  // Deactivate Mutation
  const deactivateMutation = useMutation({
    mutationFn: async (eventId: string) => {
      await api.patch(`/events/${eventId}/deactivate`);
    },
    onSuccess: () => {
      alert('Event deactivated.');
      queryClient.invalidateQueries({ queryKey: ['events'] });
    }
  });

  if (!isMounted) return null;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Events</h1>
           <p className="text-slate-500 mt-2 font-medium">Discover opportunities or manage your volunteer campaigns.</p>
        </div>
        {role === 'NGO' && (
          <button onClick={() => setShowModal(true)} className="px-5 py-2.5 bg-teal-600 text-white font-bold rounded-xl shadow-md hover:bg-teal-700 transition">
            Create Event
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {[1,2,3].map(i => <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-3xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((e: any) => (
             <div key={e.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative group overflow-hidden hover:shadow-lg transition">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-teal-500 rounded-l-3xl"></div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{e.title}</h3>
                <p className="text-sm text-slate-600 mb-6 font-medium line-clamp-2">{e.description}</p>
                <div className="space-y-3 mb-6">
                   <div className="flex items-center text-sm font-semibold text-slate-500">
                      <CalendarIcon className="w-4 h-4 mr-3 text-indigo-400" /> {new Date(e.date).toLocaleDateString()}
                   </div>
                   <div className="flex items-center text-sm font-semibold text-slate-500">
                      <MapPin className="w-4 h-4 mr-3 text-orange-400" /> {e.location}
                   </div>
                   <div className="flex items-center text-sm font-semibold text-slate-500">
                      <Users className="w-4 h-4 mr-3 text-emerald-400" /> {e.requiredVolunteers} Volunteers needed
                   </div>
                </div>
                
                {role === 'VOLUNTEER' ? (
                   e.isActive ? (
                     <button 
                       onClick={() => applyMutation.mutate(e.id)}
                       disabled={applyMutation.isPending}
                       className="w-full py-3 bg-teal-50 text-teal-700 font-bold rounded-xl hover:bg-teal-600 hover:text-white transition-colors border border-teal-100"
                     >
                       {applyMutation.isPending ? 'Applying...' : 'Apply Now'}
                     </button>
                   ) : (
                     <button 
                       disabled
                       className="w-full py-3 bg-slate-100 text-slate-400 font-bold rounded-xl border border-slate-200 cursor-not-allowed"
                     >
                       Registration Closed
                     </button>
                   )
                ) : (
                   <div className="flex space-x-3">
                     <div className={`flex-1 py-3 font-bold rounded-xl text-center border ${e.isActive ? 'bg-slate-50 text-slate-500 border-slate-100' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                       {e.isActive ? 'Active Event' : 'Deactivated'}
                     </div>
                     {e.isActive && (
                       <button onClick={() => deactivateMutation.mutate(e.id)} disabled={deactivateMutation.isPending} className="flex-1 py-3 bg-rose-50 text-rose-600 font-bold rounded-xl text-center border border-rose-100 hover:bg-rose-600 hover:text-white transition">
                         {deactivateMutation.isPending ? 'Working...' : 'Deactivate'}
                       </button>
                     )}
                   </div>
                )}
             </div>
          ))}
          {events.length === 0 && <div className="col-span-3 text-center py-20 text-slate-400 font-medium">No events found.</div>}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl relative">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Create New Event</h2>
              <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate(newEvent); }} className="space-y-4">
                <input required placeholder="Event Title" className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} />
                <textarea required placeholder="Description" className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none h-24" value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} />
                <input required type="date" className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} />
                <input required placeholder="Location" className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})} />
                <input required type="number" placeholder="Required Volunteers" className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" value={newEvent.requiredVolunteers} onChange={e => setNewEvent({...newEvent, requiredVolunteers: parseInt(e.target.value)})} />
                
                <div className="flex space-x-4 pt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200">Cancel</button>
                  <button type="submit" disabled={createMutation.isPending} className="flex-1 py-3 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700">{createMutation.isPending ? 'Saving...' : 'Create'}</button>
                </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
