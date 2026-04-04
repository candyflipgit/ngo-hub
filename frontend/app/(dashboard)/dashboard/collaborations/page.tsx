'use client';
import { Handshake, Search, UserPlus2, CheckCircle2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Cookies from 'js-cookie';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CollaborationsHub() {
  const [searchQuery, setSearchQuery] = useState('');
  const token = Cookies.get('token');
  const api = axios.create({ baseURL: `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001"}`, headers: { Authorization: `Bearer ${token}` } });
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: collabs = [], isLoading } = useQuery({
     queryKey: ['collaborations'],
     queryFn: async () => {
        const { data } = await api.get('/collaborations');
        return data;
     }
  });

  const { data: searchResults = [] } = useQuery({
     queryKey: ['ngoList', searchQuery],
     queryFn: async () => {
       if (searchQuery.length < 2) return [];
       const { data } = await api.get(`/ngo?query=${searchQuery}`);
       return data;
     },
     enabled: searchQuery.length > 1
  });

  const respondMutation = useMutation({
     mutationFn: async ({ id, status }: { id: string, status: 'APPROVED' | 'REJECTED' }) => {
        await api.patch(`/collaborations/${id}`, { status });
     },
     onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['collaborations'] });
         alert('Collaboration response recorded.');
     }
  });

  const pendingRequests = collabs.filter((c: any) => c.status === 'PENDING');
  const activeCollabs = collabs.filter((c: any) => c.status === 'APPROVED');

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Collaboration Hub</h1>
          <p className="text-slate-500 mt-2 font-medium">Partner with other NGOs and multiply your impact natively.</p>
        </div>
        <div className="relative w-72">
           <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
           <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search NGOs by name..." className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-orange-500/50 outline-none shadow-sm peer" />
           
           {searchQuery.length > 1 && (
             <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto hidden peer-focus:block hover:block">
               {searchResults.length === 0 ? (
                 <p className="p-4 text-sm text-slate-500 text-center">No NGOs found.</p>
               ) : (
                 searchResults.map((n: any) => (
                    <div key={n.id} onClick={() => router.push(`/dashboard/ngos/${n.id}`)} className="p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50">
                       <h4 className="font-bold text-slate-900 text-sm">{n.name}</h4>
                       <p className="text-xs text-slate-500">{n.location}</p>
                    </div>
                 ))
               )}
             </div>
           )}
        </div>
      </div>

      {/* Requests */}
      <h2 className="text-lg font-bold text-slate-900 flex items-center mb-6">
        <UserPlus2 className="w-5 h-5 text-teal-600 mr-2"/> Partner Requests ({pendingRequests.length})
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
         {pendingRequests.map((r: any) => (
            <div key={r.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col group hover:shadow-md transition-shadow">
               <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mr-4">
                       <Handshake className="w-6 h-6 text-slate-400" />
                    </div>
                    <div>
                       <h3 className="font-bold text-slate-900">{r.sender.name || 'Unknown NGO'}</h3>
                       <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">{r.sender.location || 'Local'}</p>
                    </div>
                  </div>
               </div>
               <p className="text-sm text-slate-600 font-medium p-4 bg-slate-50 rounded-2xl border border-slate-100 italic mb-6">
                 "{r.title}"
               </p>
               <div className="flex space-x-3 mt-auto">
                 <button onClick={() => respondMutation.mutate({ id: r.id, status: 'APPROVED' })} className="flex-1 py-2.5 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition-colors shadow-sm text-sm">Accept</button>
                 <button onClick={() => respondMutation.mutate({ id: r.id, status: 'REJECTED' })} className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm text-sm">Decline</button>
               </div>
            </div>
         ))}
         {!isLoading && pendingRequests.length === 0 && <div className="col-span-2 text-center text-slate-400 font-bold py-10">No pending partnership requests.</div>}
      </div>

      {/* Shared Plannings */}
      <h2 className="text-lg font-bold text-slate-900 flex items-center mb-6">
        <Handshake className="w-5 h-5 text-teal-600 mr-2"/> Active Collaborations
      </h2>
      <div className="grid grid-cols-1 gap-6">
         {activeCollabs.map((c: any) => (
             <div key={c.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center">
                 <CheckCircle2 className="w-8 h-8 text-emerald-500 mr-4" />
                 <div>
                    <h3 className="font-bold text-slate-900">{c.title} Partner</h3>
                    <p className="font-medium text-slate-500 text-sm">You are legally and actively collaborating on joint campaigns together in local regions.</p>
                 </div>
             </div>
         ))}
         {!isLoading && activeCollabs.length === 0 && (
             <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 h-64 flex flex-col items-center justify-center text-slate-400 font-medium group hover:border-teal-300 hover:text-teal-600 transition-colors cursor-pointer">
               <Handshake className="w-12 h-12 mb-4 opacity-50 group-hover:opacity-100 transition-opacity"/>
               No active collaborative events currently.
             </div>
         )}
      </div>
    </div>
  );
}
