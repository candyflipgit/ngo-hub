'use client';
import { notFound } from 'next/navigation';
import { CheckCircle, MapPin, Globe, Phone, Mail, Image, Heart, Users, Activity } from 'lucide-react';

export default function NgoProfile({ params }: { params: { id: string } }) {
  if (params.id !== '1' && params.id !== '2' && params.id !== '3') {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      {/* Banner */}
      <div className="h-64 md:h-80 w-full bg-gradient-to-r from-teal-600 via-emerald-600 to-indigo-700 relative overflow-hidden">
         <div className="absolute inset-0 bg-black/20 mix-blend-multiply pointer-events-none"></div>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/10 font-black text-9xl uppercase tracking-tighter mix-blend-overlay">NGO Profile</div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-8 md:p-12 mb-8">
           <div className="flex flex-col md:flex-row items-start md:items-end justify-between -mt-24 mb-8">
              <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-3xl p-2 shadow-lg border border-slate-100 flex-shrink-0">
                 <div className="w-full h-full bg-slate-100 rounded-2xl flex items-center justify-center">
                    <Image className="w-12 h-12 text-slate-300" />
                 </div>
              </div>
              <div className="flex items-center space-x-4 mt-6 md:mt-0 w-full md:w-auto">
                 <button className="flex-1 md:flex-none border border-teal-200 text-teal-700 bg-teal-50 hover:bg-teal-100 font-bold px-6 py-2.5 rounded-xl transition-colors shadow-sm text-sm">Follow Page</button>
                 <button className="flex-1 md:flex-none bg-orange-500 text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-md shadow-orange-500/30 hover:bg-orange-600 hover:-translate-y-0.5 text-sm flex items-center justify-center"><Heart className="w-4 h-4 mr-2" /> Donate</button>
              </div>
           </div>

           <div>
              <h1 className="text-4xl font-black text-slate-900 flex items-center tracking-tight">Green Earth Foundation <CheckCircle className="w-8 h-8 text-emerald-500 ml-3 shrink-0 bg-emerald-50 rounded-full" /></h1>
              <p className="text-xl text-slate-500 font-medium mt-2 max-w-2xl leading-relaxed">Dedicated to preserving coastal ecosystems through community-driven cleanup initiatives and marine research.</p>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-8 border-t border-slate-100">
              <div className="flex items-center space-x-3 text-slate-600 font-medium">
                <MapPin className="w-5 h-5 text-indigo-400" /> <span>Mumbai, Maharashtra</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-600 font-medium">
                <Globe className="w-5 h-5 text-teal-400" /> <a href="#" className="hover:text-teal-600 hover:underline">greenearth.org.in</a>
              </div>
              <div className="flex items-center space-x-3 text-slate-600 font-medium">
                <Phone className="w-5 h-5 text-emerald-400" /> <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-600 font-medium">
                <Mail className="w-5 h-5 text-rose-400" /> <a href="mailto:contact@greenearth.org" className="hover:text-teal-600 hover:underline">contact@greenearth.org</a>
              </div>
           </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
           <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm text-center flex flex-col items-center justify-center group hover:bg-slate-50 transition-colors cursor-pointer">
              <Users className="w-8 h-8 text-teal-500 mb-3 group-hover:scale-110 transition-transform" />
              <p className="text-3xl font-black text-slate-900 tracking-tight">1.2K</p>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Followers</p>
           </div>
           <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm text-center flex flex-col items-center justify-center group hover:bg-slate-50 transition-colors cursor-pointer">
              <Activity className="w-8 h-8 text-indigo-500 mb-3 group-hover:scale-110 transition-transform" />
              <p className="text-3xl font-black text-slate-900 tracking-tight">48</p>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Past Events</p>
           </div>
           <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm text-center flex flex-col items-center justify-center group hover:bg-slate-50 transition-colors cursor-pointer">
              <Heart className="w-8 h-8 text-rose-500 mb-3 group-hover:scale-110 transition-transform" />
              <p className="text-3xl font-black text-slate-900 tracking-tight">5K+</p>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Hours Logged</p>
           </div>
        </div>

        {/* Active Events Tab */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8">
           <h2 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight">Active Events (3)</h2>
           <div className="space-y-4">
              <div className="p-6 border border-slate-200 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center hover:border-teal-300 hover:shadow-md transition-all group">
                 <div className="mb-4 sm:mb-0">
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Juhu Beach Mega Cleanup</h3>
                    <p className="text-slate-500 text-sm font-medium flex items-center max-w-md"><MapPin className="w-4 h-4 mr-1"/> Juhu Beach, Mumbai</p>
                 </div>
                 <div className="flex bg-slate-100 rounded-xl overflow-hidden p-1 shrink-0 h-12 w-32 border border-slate-200">
                    <button className="bg-white text-teal-600 font-bold w-full rounded-lg shadow-sm tracking-wide text-sm active:scale-95 transition-transform border border-slate-100">Apply</button>
                 </div>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
