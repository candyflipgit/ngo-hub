'use client';
import { Search, MapPin, Tag, ShieldCheck, ArrowRight, Activity } from 'lucide-react';
import Link from 'next/link';

export default function NGODiscovery() {
  const ngos = [
    { id: 1, name: 'EduCare India', cause: 'Education', location: 'Mumbai, MH', verified: true, activeEvents: 12, followers: '4.2k', image: 'E' },
    { id: 2, name: 'Green Earth Trust', cause: 'Environment', location: 'Bangalore, KA', verified: true, activeEvents: 5, followers: '1.8k', image: 'G' },
    { id: 3, name: 'Swasthya Foundation', cause: 'Healthcare', location: 'Delhi, DL', verified: false, activeEvents: 8, followers: '900', image: 'S' },
    { id: 4, name: 'Women Empowerment Cell', cause: 'Social Justice', location: 'Pune, MH', verified: true, activeEvents: 20, followers: '5.5k', image: 'W' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-8">
      {/* Dynamic Header */}
      <header className="fixed w-full top-0 left-0 glass z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-indigo-600 tracking-tight">NGO Hub</Link>
          <div className="flex space-x-6 text-sm font-semibold text-slate-500">
             <Link href="/dashboard" className="hover:text-teal-600 transition-colors">Dashboard</Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto pt-24 space-y-8">
        {/* Search & Filters Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end w-full gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Discover NGOs</h1>
            <p className="text-slate-500 mt-2 text-lg font-medium">Find and connect with verified organizations making a difference near you.</p>
          </div>
          
          <div className="flex space-x-2 w-full md:w-auto">
             <div className="relative flex-1 md:w-72">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
               <input type="text" placeholder="Search by name or cause..." className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-teal-500/50 outline-none hover:border-slate-300 transition-colors" />
             </div>
             <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-400" />
                <input type="text" placeholder="City / State" className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-500/50 outline-none hover:border-slate-300 transition-colors" />
             </div>
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex space-x-2 overflow-x-auto pb-4 scrollbar-hide">
           {['All', 'Education', 'Environment', 'Healthcare', 'Social Justice'].map(tag => (
              <button key={tag} className="px-4 py-2 rounded-full border border-slate-200 bg-white shadow-sm text-sm font-bold text-slate-600 hover:text-teal-600 hover:border-teal-200 hover:bg-teal-50 transition-colors whitespace-nowrap">
                 {tag}
              </button>
           ))}
        </div>

        {/* NGO Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ngos.map(ngo => (
            <div key={ngo.id} className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden flex flex-col">
               {/* Decorative background blob */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-50 to-indigo-50 rounded-full mix-blend-multiply blur-2xl opacity-50 -translate-y-8 translate-x-8"></div>
               
               <div className="flex justify-between items-start mb-6 align-top">
                  <div className="w-16 h-16 bg-gradient-to-tr from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center font-bold text-slate-400 text-xl border border-white shadow-inner">{ngo.image}</div>
                  {ngo.verified && <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center px-3 py-1 rounded-full text-xs font-bold shadow-sm"><ShieldCheck className="w-3.5 h-3.5 mr-1" /> Verified</span>}
               </div>
               
               <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight group-hover:text-teal-700 transition-colors">{ngo.name}</h3>
               <p className="text-sm text-slate-500 line-clamp-2 mb-6 font-medium">Focused on elevating societal standards and bringing direct impact to local communities across India.</p>
               
               {/* Badges */}
               <div className="space-y-2 mb-6">
                 <div className="flex items-center text-sm font-semibold text-slate-500 bg-slate-50 w-fit px-3 py-1 rounded-lg">
                   <Tag className="w-3.5 h-3.5 mr-2 text-indigo-400" /> {ngo.cause}
                 </div>
                 <div className="flex items-center text-sm font-semibold text-slate-500 bg-slate-50 w-fit px-3 py-1 rounded-lg">
                   <MapPin className="w-3.5 h-3.5 mr-2 text-rose-400" /> {ngo.location}
                 </div>
                 <div className="flex items-center text-sm font-semibold text-slate-500 bg-slate-50 w-fit px-3 py-1 rounded-lg">
                   <Activity className="w-3.5 h-3.5 mr-2 text-orange-400" /> {ngo.activeEvents} Active Events
                 </div>
               </div>
               
               {/* Footer */}
               <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
                 <span className="text-sm font-bold text-slate-400"><strong className="text-slate-700">{ngo.followers}</strong> Followers</span>
                 <button className="flex items-center justify-center bg-teal-50 text-teal-700 hover:bg-teal-600 hover:text-white p-2.5 rounded-xl transition-colors shadow-sm font-bold text-sm group/btn">
                    View Profile <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                 </button>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
