'use client';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ShieldCheck, Calendar, MapPin, Award } from 'lucide-react';

export default function VerifyCertificate({ params }: { params: { id: string } }) {
   const { data: cert, isLoading, isError } = useQuery({
      queryKey: ['certificate', params.id],
      queryFn: async () => {
         const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001"}/certificates/${params.id}`);
         return data;
      }
   });

   if (isLoading) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-400">Verifying Ledger...</div>;
   if (isError || !cert) return <div className="min-h-screen flex items-center justify-center font-bold text-rose-500">Invalid or Corrupt Certificate Reference</div>;

   return (
      <div className="min-h-screen bg-slate-50 font-sans flex items-center justify-center p-4">
         <div className="w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden border-2 border-slate-100 flex flex-col md:flex-row relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50 rounded-full mix-blend-multiply blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="bg-gradient-to-br from-slate-900 to-teal-900 p-12 text-center md:text-left text-white flex flex-col justify-between md:w-1/3 relative overflow-hidden">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
               <div className="relative z-10 w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl mx-auto md:mx-0 flex flex-col items-center justify-center border border-white/20 shadow-xl mb-12">
                  <Award className="w-12 h-12 text-teal-300 relative z-20" />
               </div>
               
               <div className="relative z-10 space-y-4">
                 <h3 className="text-xl font-bold tracking-tight opacity-80">VERIFICATION TRACE</h3>
                 <p className="font-mono text-sm tracking-widest break-all bg-black/20 p-4 rounded-xl border border-white/10">{cert.id.toUpperCase()}</p>
                 <div className="flex items-center justify-center md:justify-start text-emerald-400 font-bold tracking-widest text-sm pt-4"><ShieldCheck className="w-5 h-5 mr-2" /> VALID RECORD</div>
               </div>
            </div>

            <div className="p-12 md:p-16 flex-1 bg-[url('https://www.transparenttextures.com/patterns/clean-textile.png')]">
               <h1 className="text-2xl font-bold text-teal-700 tracking-[0.2em] mb-4 uppercase">Certificate of Accomplishment</h1>
               <p className="text-lg text-slate-500 font-medium mb-8">This document formally asserts that</p>
               
               <h2 className="text-5xl font-black text-slate-900 mb-8 font-serif">{cert.volunteer.firstName} {cert.volunteer.lastName}</h2>
               
               <p className="text-xl text-slate-600 font-medium leading-relaxed mb-12 max-w-lg">
                 has successfully dedicated <b className="text-slate-900">{cert.application.hoursLogged} hours</b> of their time to the initiative <b className="text-slate-900">"{cert.application.event.title}"</b> organized by <b className="text-slate-900">{cert.application.event.ngo.name}</b>.
               </p>

               <div className="grid grid-cols-2 gap-8 border-t border-slate-200 pt-8 mt-auto">
                 <div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2"><Calendar className="w-4 h-4 inline mr-1" /> Issue Date</p>
                    <p className="font-bold text-slate-900">{new Date(cert.issueDate).toLocaleDateString()}</p>
                 </div>
                 <div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2"><MapPin className="w-4 h-4 inline mr-1" /> Locality</p>
                    <p className="font-bold text-slate-900">{cert.application.event.location}</p>
                 </div>
               </div>
            </div>
         </div>
      </div>
   );
}
