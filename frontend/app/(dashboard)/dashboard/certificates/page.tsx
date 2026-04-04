'use client';
import { Award, Download, Share2, ShieldQuestion, Upload, PlusCircle, Search } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';

export default function Certificates() {
  const token = Cookies.get('token');
  const queryClient = useQueryClient();
  const api = axios.create({ baseURL: `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001"}`, headers: { Authorization: `Bearer ${token}` } });
  
  const [role, setRole] = useState('');
  useEffect(() => setRole(Cookies.get('role') || ''), []);

  const [showUpload, setShowUpload] = useState(false);
  const [appId, setAppId] = useState('');
  const [volId, setVolId] = useState('');
  const [certBase64, setCertBase64] = useState('');

  const { data: certs = [], isLoading } = useQuery({
    queryKey: ['certificates'],
    queryFn: async () => {
       const { data } = await api.get('/certificates');
       return data;
    }
  });

  const uploadMutation = useMutation({
    mutationFn: async () => {
       await api.post('/certificates/upload', { applicationId: appId, volunteerId: volId, base64: certBase64 });
    },
    onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['certificates'] });
       setShowUpload(false);
       setAppId(''); setVolId(''); setCertBase64('');
       alert('Certificate officially stored in the Vault!');
    }
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
     const file = e.target.files?.[0];
     if (!file) return;
     const reader = new FileReader();
     reader.readAsDataURL(file);
     reader.onload = () => setCertBase64(reader.result as string);
  };

  if (isLoading) return <div className="p-10 text-center font-bold text-slate-400">Loading your legacy...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Certificates Vault</h1>
          <p className="text-slate-500 mt-2 font-medium">Verify, share, download, and store off-chain authenticated achievements.</p>
        </div>
        {role === 'NGO' && (
           <button onClick={() => setShowUpload(true)} className="flex items-center px-4 py-3 bg-amber-500 text-white rounded-xl font-bold shadow-lg shadow-amber-500/30 hover:bg-amber-600 transition-all hover:-translate-y-0.5">
              <Upload className="w-5 h-5 mr-2" /> Issue Certificate Vault
           </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        {certs.map((cert: any) => (
           <div key={cert.id} className="bg-white p-8 rounded-[2rem] border-2 border-slate-100 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-full mix-blend-multiply filter blur-2xl opacity-50 -translate-y-1/2 translate-x-1/4"></div>
              
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg mb-8">
                 <Award className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-2xl font-black text-slate-900 mb-2 font-serif">{cert.application?.event?.title || 'External'} Achievement</h3>
              <p className="text-sm text-slate-600 font-medium mb-1">Holder: <strong className="text-slate-800">{cert.volunteer?.user?.email}</strong></p>
              <p className="text-sm text-slate-600 font-medium mb-6">Log Record: <strong className="text-slate-800">{cert.application?.hoursLogged || 0} Hours</strong></p>
              
              <div className="flex space-x-4 border-t border-slate-100 pt-6">
                 {/* Execute Download Protocol using base64 downloadUrl */}
                 <button onClick={() => {
                     if (cert.downloadUrl) {
                        const link = document.createElement('a');
                        link.href = cert.downloadUrl;
                        link.download = `Certificate_${cert.id.substring(0,8)}.pdf`;
                        link.click();
                     } else { alert("No valid buffer attached"); }
                 }} className="flex-1 flex items-center justify-center space-x-2 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-md">
                   <Download className="w-4 h-4"/> <span>Download File</span>
                 </button>
                 <button onClick={() => {
                     navigator.clipboard.writeText(`http://localhost:3000/certificate/${cert.id}`);
                     alert('Public verification link copied to clipboard!');
                 }} className="flex-1 flex items-center justify-center space-x-2 py-3 bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-bold hover:text-teal-600 transition-colors shadow-sm">
                   <Share2 className="w-4 h-4"/> <span>{cert.id.substring(0,8)}</span>
                 </button>
              </div>

              <div className="absolute top-8 right-8 flex flex-col items-end">
                <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full"><ShieldQuestion className="w-3 h-3 mr-1"/> Validated</span>
                <span className="text-xs font-mono text-slate-400 mt-2 uppercase">{cert.id.substring(0,6)}</span>
              </div>
           </div>
        ))}
        {certs.length === 0 && (
           <div className="col-span-2 text-center py-20 bg-slate-50 rounded-3xl border border-slate-200 border-dashed text-slate-400 font-bold">
               No certificates available in the vault yet.
           </div>
        )}
      </div>

      {showUpload && (
         <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white max-w-sm w-full rounded-3xl p-8 shadow-2xl">
               <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center"><Award className="w-5 h-5 text-amber-500 mr-2"/> Force Issue Vault</h2>
               <p className="text-xs font-semibold text-slate-500 mb-4">You are uploading a permanent base64 certificate overriding auto-generation.</p>
               <form onSubmit={(e) => { e.preventDefault(); uploadMutation.mutate(); }} className="space-y-4">
                  <input type="text" placeholder="Application Auth ID (from Applications tab)" value={appId} onChange={e => setAppId(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm font-semibold" required />
                  <input type="text" placeholder="Volunteer DB ID" value={volId} onChange={e => setVolId(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm font-semibold" required />
                  <label className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-slate-400 hover:border-amber-500 hover:text-amber-600 transition-colors cursor-pointer w-full text-center">
                     <Upload className="w-8 h-8 mb-2 opacity-50"/>
                     <span className="font-bold text-xs">{certBase64 ? 'Document buffer selected.' : 'Deploy Valid PDF/Image...'}</span>
                     <input type="file" className="hidden" onChange={handleFileUpload} accept="application/pdf,image/*" required />
                  </label>
                  <div className="flex space-x-3 pt-4">
                     <button type="button" onClick={() => setShowUpload(false)} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition">Cancel</button>
                     <button type="submit" disabled={uploadMutation.isPending || !certBase64} className="flex-1 py-3 bg-amber-500 text-white font-bold rounded-xl shadow-md hover:bg-amber-600 transition disabled:opacity-50 flex justify-center items-center">
                        {uploadMutation.isPending ? 'Minting...' : 'Mint to Record'}
                     </button>
                  </div>
               </form>
            </div>
         </div>
      )}

    </div>
  );
}
