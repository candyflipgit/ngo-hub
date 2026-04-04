'use client';
import { Users, UserPlus, Trash2, CheckCircle2, CalendarDays, MapPin, Bell, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function TeamWorkspace() {
  const token = Cookies.get('token');
  const api = axios.create({ baseURL: `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001"}`, headers: { Authorization: `Bearer ${token}` } });
  const queryClient = useQueryClient();
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

  // Fetch team (managers/admins)
  const { data: team = [], isLoading: teamLoading } = useQuery({
    queryKey: ['team'],
    queryFn: async () => {
       const { data } = await api.get('/team');
       return data;
    }
  });

  // Fetch events with their approved volunteers
  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: ['ngoTeamEvents'],
    queryFn: async () => {
       const { data } = await api.get('/events/ngo/team');
       return data;
    }
  });

  const removeMutation = useMutation({
     mutationFn: async (id: string) => {
        if (!confirm('Remove member?')) throw new Error('Canceled');
        await api.delete(`/team/${id}`);
     },
     onSuccess: () => queryClient.invalidateQueries({ queryKey: ['team'] })
  });

  const notifyMutation = useMutation({
     mutationFn: async (eventId: string) => {
        const { data } = await api.post(`/events/${eventId}/notify-followers`);
        return data;
     },
     onSuccess: (data: any) => {
        alert(data.message || 'All followers have been notified!');
     },
     onError: (err: any) => alert(err.response?.data?.message || 'Failed to notify followers.')
  });

  const isLoading = teamLoading || eventsLoading;
  if (isLoading) return <div className="p-8 text-slate-500 font-bold">Loading team structures...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Team Workspace</h1>
        <p className="text-slate-500 mt-2 font-medium">View your events, volunteer teams, and manage your NGO staff.</p>
      </div>

      {/* ── Section 1: Event Teams ── */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 flex items-center mb-6">
          <CalendarDays className="w-5 h-5 text-teal-600 mr-2" /> Event Teams ({events.length})
        </h2>

        {events.length === 0 && (
          <div className="text-center py-16 text-slate-400 font-bold border-2 border-dashed border-slate-200 rounded-3xl">
            <CalendarDays className="w-10 h-10 mx-auto mb-3 opacity-40" />
            No events created yet. Create an event first!
          </div>
        )}

        <div className="space-y-4">
          {events.map((event: any) => {
            const isExpanded = expandedEvent === event.id;
            const volunteers = event.applications || [];
            return (
              <div key={event.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                {/* Event Header Row */}
                <div
                  className="p-6 flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedEvent(isExpanded ? null : event.id)}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-sm ${event.isActive ? 'bg-gradient-to-br from-teal-500 to-emerald-600' : 'bg-slate-400'}`}>
                       {event.title.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{event.title}</h3>
                      <div className="flex items-center text-sm text-slate-500 font-medium space-x-4 mt-1">
                        <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1" />{event.location}</span>
                        <span className="flex items-center"><CalendarDays className="w-3.5 h-3.5 mr-1" />{new Date(event.date).toLocaleDateString()}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${event.isActive ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                          {event.isActive ? 'ACTIVE' : 'ENDED'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                     <div className="flex items-center bg-teal-50 px-3 py-1.5 rounded-full border border-teal-200">
                        <Users className="w-4 h-4 text-teal-600 mr-1.5" />
                        <span className="text-sm font-bold text-teal-700">{volunteers.length} volunteer{volunteers.length !== 1 ? 's' : ''}</span>
                     </div>
                     <button
                        onClick={(e) => { e.stopPropagation(); notifyMutation.mutate(event.id); }}
                        disabled={notifyMutation.isPending}
                        className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-xl font-semibold text-sm shadow-md shadow-orange-500/20 hover:bg-orange-600 transition-all hover:-translate-y-0.5 disabled:opacity-50"
                     >
                        <Bell className="w-4 h-4 mr-1.5" />
                        {notifyMutation.isPending ? 'Sending...' : 'Invite Volunteers'}
                     </button>
                     {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                  </div>
                </div>

                {/* Expanded Volunteer List */}
                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-4">
                    {volunteers.length === 0 ? (
                       <p className="text-sm text-slate-400 font-medium text-center py-6">No approved volunteers for this event yet.</p>
                    ) : (
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {volunteers.map((app: any) => (
                             <div key={app.id} className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center space-x-4 hover:shadow-sm transition-shadow">
                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                   {app.volunteer?.firstName?.charAt(0) || 'V'}
                                </div>
                                <div className="flex-1 min-w-0">
                                   <h4 className="text-sm font-bold text-slate-900 truncate">
                                      {app.volunteer?.firstName} {app.volunteer?.lastName}
                                   </h4>
                                   <p className="text-xs text-slate-500 truncate">{app.volunteer?.user?.email}</p>
                                </div>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${app.attended ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-blue-50 text-blue-600 border border-blue-200'}`}>
                                   {app.attended ? 'ATTENDED' : 'CONFIRMED'}
                                </span>
                             </div>
                          ))}
                       </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Section 2: NGO Staff / Managers ── */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 flex items-center mb-6">
          <Users className="w-5 h-5 text-teal-600 mr-2" /> NGO Staff ({team.length})
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {team.map((m: any) => (
            <div key={m.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-shadow">
               <div className="flex items-center space-x-6">
                 <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center border border-slate-200">
                    <Users className="w-6 h-6 text-slate-400" />
                 </div>
                 <div className="flex flex-col">
                   <h3 className="text-lg font-bold text-slate-900">{m.user.email}</h3>
                   <div className="flex items-center text-sm font-medium text-slate-500 space-x-3 mt-1">
                     <span className="flex items-center text-emerald-600"><CheckCircle2 className="w-4 h-4 mr-1"/> Active</span>
                   </div>
                 </div>
               </div>
               
               <div className="flex items-center space-x-4">
                 <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${m.role === 'ADMIN' ? 'bg-orange-50 text-orange-600 border-orange-200' : 'bg-blue-50 text-blue-600 border-blue-200'}`}>
                   {m.role}
                 </span>
                 <button onClick={() => removeMutation.mutate(m.id)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors bg-rose-50 rounded-lg border border-rose-100"><Trash2 className="w-5 h-5" /></button>
               </div>
            </div>
          ))}
          {team.length === 0 && <div className="text-center py-12 text-slate-400 font-bold border-2 border-dashed border-slate-200 rounded-3xl">No additional managers yet!</div>}
        </div>
      </div>
    </div>
  );
}
