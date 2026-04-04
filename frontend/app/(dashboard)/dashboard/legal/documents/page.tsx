'use client';
import { Download, Upload, ShieldCheck, FileText, Loader2, X } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useState } from 'react';

export default function DocumentVault() {
  const token = Cookies.get('token');
  const queryClient = useQueryClient();
  const api = axios.create({ baseURL: `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001"}`, headers: { Authorization: `Bearer ${token}` } });

  const [showUpload, setShowUpload] = useState(false);
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState<'TRUST' | 'SOCIETY' | 'SECTION_8'>('TRUST');
  const [baseFile, setBaseFile] = useState('');

  const { data: documents = [], isLoading } = useQuery({
     queryKey: ['legal-documents'],
     queryFn: async () => {
        const { data } = await api.get('/legal/documents');
        return data;
     }
  });

  const uploadMutation = useMutation({
     mutationFn: async () => {
        await api.post('/legal/documents', { name: docName, type: docType, data: baseFile });
     },
     onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['legal-documents'] });
        setShowUpload(false);
        setDocName(''); setBaseFile('');
        alert('Document securely added to vault!');
     }
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
     const file = e.target.files?.[0];
     if (!file) return;
     const reader = new FileReader();
     reader.readAsDataURL(file);
     reader.onload = () => setBaseFile(reader.result as string);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 relative">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Document Vault</h1>
          <p className="text-slate-500 mt-2 font-medium">Securely store and manage your verified legal NGO documents.</p>
        </div>
        <button onClick={() => setShowUpload(true)} className="flex items-center px-4 py-2.5 bg-slate-900 text-white rounded-xl font-semibold shadow-md hover:bg-slate-800 transition-all hover:-translate-y-0.5 whitespace-nowrap">
          <Upload className="w-5 h-5 mr-2" /> Upload Document
        </button>
      </div>

      {isLoading ? (
         <div className="flex justify-center p-20"><Loader2 className="w-8 h-8 animate-spin text-teal-500"/></div>
      ) : documents.length > 0 ? (
         <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-max">
            <thead>
               <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-xs">
                  <th className="p-6 font-semibold">Document Details</th>
                  <th className="p-6 font-semibold">Date Added</th>
                  <th className="p-6 font-semibold text-right">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {documents.map((doc: any) => (
                  <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-6 flex items-center">
                     <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center mr-4 group-hover:bg-teal-100 transition-colors">
                        <FileText className="w-5 h-5 text-teal-600" />
                     </div>
                     <div>
                        <h3 className="font-bold text-slate-900 flex items-center">{doc.name}</h3>
                        <p className="text-xs text-slate-500 font-medium mt-0.5 tracking-wide">{doc.type}</p>
                     </div>
                  </td>
                  <td className="p-6 text-sm font-semibold text-slate-500">{new Date(doc.createdAt).toLocaleDateString()}</td>
                  <td className="p-6 text-right">
                     <button onClick={() => {
                        const link = document.createElement('a'); 
                        link.href = doc.data; 
                        link.download = doc.name.includes('.') ? doc.name : doc.name + '.pdf'; 
                        link.click();
                     }} className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors inline-block" title="Download Base64 File">
                        <Download className="w-5 h-5" />
                     </button>
                  </td>
                  </tr>
               ))}
            </tbody>
            </table>
         </div>
      ) : (
         <div className="text-center py-24 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem]">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900">Your Vault is Empty</h3>
            <p className="text-slate-500 font-medium mt-2 max-w-sm mx-auto">Upload your NGO trust deeds, compliance bonds, and verified tax exempt forms here.</p>
         </div>
      )}

      {/* Upload Modal */}
      {showUpload && (
         <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white max-w-md w-full rounded-3xl p-8 shadow-2xl relative">
               <button onClick={() => setShowUpload(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-800 transition"><X className="w-5 h-5"/></button>
               <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center"><Upload className="w-5 h-5 mr-3 text-slate-700"/> Secure Upload</h2>
               
               <form onSubmit={e => { e.preventDefault(); uploadMutation.mutate(); }} className="space-y-4">
                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Document Name</label>
                     <input type="text" value={docName} onChange={e => setDocName(e.target.value)} placeholder="e.g. Trust_Deed_2024" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-sm font-semibold" required />
                  </div>
                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Registration Type</label>
                     <select value={docType} onChange={(e: any) => setDocType(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-sm font-semibold">
                        <option value="TRUST">Trust</option>
                        <option value="SOCIETY">Society</option>
                        <option value="SECTION_8">Section 8</option>
                     </select>
                  </div>
                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">File Attachment</label>
                     <label className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-slate-400 hover:text-slate-600 transition-colors cursor-pointer w-full text-center group bg-slate-50/50">
                        <span className="font-bold text-sm text-slate-600">{baseFile ? 'File attached.' : 'Click to insert file...'}</span>
                        <input type="file" className="hidden" onChange={handleFileUpload} required />
                     </label>
                  </div>
                  <button type="submit" disabled={uploadMutation.isPending || !baseFile} className="w-full py-3 mt-4 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-slate-800 transition disabled:opacity-50">
                     {uploadMutation.isPending ? 'Encrypting...' : 'Upload to Vault'}
                  </button>
               </form>
            </div>
         </div>
      )}

    </div>
  );
}
