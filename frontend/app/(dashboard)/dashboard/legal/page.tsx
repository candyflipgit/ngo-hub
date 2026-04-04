'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Cookies from 'js-cookie';
import { FileText, PlayCircle, Loader2 } from 'lucide-react';

export default function LegalAssistant() {
  const token = Cookies.get('token');
  const api = axios.create({ baseURL: `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001"}`, headers: { Authorization: `Bearer ${token}` } });
  const queryClient = useQueryClient();

  const { data: workflows = [], isLoading } = useQuery({
    queryKey: ['legal-workflows'],
    queryFn: async () => {
      const { data } = await api.get('/legal/workflows');
      return data;
    }
  });

  const startMutation = useMutation({
    mutationFn: async (type: string) => {
      await api.post('/legal/workflows', { type });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['legal-workflows'] })
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, progress }: { id: string, progress: number }) => {
      await api.patch(`/legal/workflows/${id}`, { progress });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['legal-workflows'] })
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 flex flex-col md:flex-row gap-8">
      
      <div className="flex-1 space-y-8">
         <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Legal Hub</h1>
            <p className="text-slate-500 mt-2 font-medium">Manage registrations and dynamically track your statutory workflows.</p>
         </div>

         {/* Workflows */}
         <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Active Workflows</h2>
            {isLoading ? <Loader2 className="w-8 h-8 text-teal-500 animate-spin" /> : (
              <div className="space-y-6">
                 {workflows.map((w: any) => (
                    <div key={w.id} className="border border-slate-200 p-6 rounded-2xl">
                       <div className="flex justify-between mb-2">
                          <h3 className="font-bold text-slate-900">{w.type} Registration</h3>
                          <span className="text-sm font-bold text-teal-600">{w.progress}%</span>
                       </div>
                       <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-4">
                          <div className="h-full bg-teal-500 transition-all duration-1000" style={{ width: `${w.progress}%` }}></div>
                       </div>
                       <div className="flex space-x-3">
                          <button onClick={() => updateMutation.mutate({ id: w.id, progress: Math.min(100, w.progress + 25) })} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold hover:text-teal-600 transition-colors">Fill Next Step (+25%)</button>
                       </div>
                    </div>
                 ))}
                 
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                    <button onClick={() => startMutation.mutate('Trust')} className="py-3 px-4 border border-dashed border-slate-300 rounded-xl font-bold text-slate-500 hover:border-teal-500 hover:text-teal-600 transition-colors text-sm"><PlayCircle className="inline w-4 h-4 mr-2" /> Start Trust</button>
                    <button onClick={() => startMutation.mutate('Society')} className="py-3 px-4 border border-dashed border-slate-300 rounded-xl font-bold text-slate-500 hover:border-orange-500 hover:text-orange-600 transition-colors text-sm"><PlayCircle className="inline w-4 h-4 mr-2" /> Start Society</button>
                    <button onClick={() => startMutation.mutate('Section 8')} className="py-3 px-4 border border-dashed border-slate-300 rounded-xl font-bold text-slate-500 hover:border-indigo-500 hover:text-indigo-600 transition-colors text-sm"><PlayCircle className="inline w-4 h-4 mr-2" /> Start Sec 8</button>
                 </div>
              </div>
            )}
         </div>

         {/* Draft Deed */}
         <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center"><FileText className="w-5 h-5 mr-3 text-indigo-500"/> Trust Deed Drafting</h2>
            <textarea placeholder="Begin drafting your Trust Deed here. Edits autosave to your PostgreSQL instance..." className="w-full h-32 bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" defaultValue="This DECLARATION OF TRUST is made on..." />
            <button className="mt-4 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-md hover:bg-indigo-700 transition-colors">Save Draft</button>
         </div>
      </div>

    </div>
  );
}
