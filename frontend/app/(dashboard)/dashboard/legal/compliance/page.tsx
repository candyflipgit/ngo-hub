'use client';
import { CalendarClock, AlertCircle, CheckCircle2, FileWarning } from 'lucide-react';

export default function ComplianceCalendar() {
  const complianceTasks = [
    { name: '12A Renewal', deadline: '2026-12-31', status: 'Upcoming', days: 280, critical: false },
    { name: '80G Revalidation', deadline: '2026-05-15', status: 'Action Required', days: 50, critical: true },
    { name: 'FCRA Annual Return', deadline: '2025-12-31', status: 'Completed', days: 0, critical: false }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Compliance Calendar</h1>
           <p className="text-slate-500 mt-2 font-medium">Never miss a statutory NGO deadline again.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <div className="bg-orange-50 p-6 rounded-[2rem] border border-orange-100 flex items-center shadow-sm">
            <div className="bg-white text-orange-600 p-4 rounded-2xl shadow-sm mr-4 border border-orange-100 shrink-0"><AlertCircle className="w-8 h-8"/></div>
            <div>
               <p className="text-orange-600 font-bold text-sm tracking-wide uppercase mb-1">Critical Tasks</p>
               <h3 className="text-4xl font-black text-orange-700 tracking-tight">1</h3>
            </div>
         </div>
         <div className="bg-teal-50 p-6 rounded-[2rem] border border-teal-100 flex items-center shadow-sm">
            <div className="bg-white text-teal-600 p-4 rounded-2xl shadow-sm mr-4 border border-teal-100 shrink-0"><CalendarClock className="w-8 h-8"/></div>
            <div>
               <p className="text-teal-600 font-bold text-sm tracking-wide uppercase mb-1">Upcoming Events</p>
               <h3 className="text-4xl font-black text-teal-700 tracking-tight">1</h3>
            </div>
         </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-xs">
              <th className="p-6 font-semibold">Requirement</th>
              <th className="p-6 font-semibold">Deadline</th>
              <th className="p-6 font-semibold">Status</th>
              <th className="p-6 font-semibold text-right">Countdown</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
             {complianceTasks.map((t, i) => (
               <tr key={i} className={`hover:bg-slate-50/50 transition-colors group ${t.critical ? 'bg-orange-50/30' : ''}`}>
                 <td className="p-6 font-bold text-slate-900 flex items-center">
                   {t.critical && <FileWarning className="w-5 h-5 text-orange-500 mr-3" />}
                   {!t.critical && t.status === 'Completed' ? <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-3" /> : ''}
                   {!t.critical && t.status === 'Upcoming' ? <CalendarClock className="w-5 h-5 text-teal-500 mr-3" /> : ''}
                   {t.name}
                 </td>
                 <td className="p-6 text-sm font-semibold text-slate-500">{t.deadline}</td>
                 <td className="p-6">
                   <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                     t.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' :
                     t.status === 'Action Required' ? 'bg-orange-50 text-orange-600' :
                     'bg-teal-50 text-teal-600'
                   }`}>
                     {t.status}
                   </span>
                 </td>
                 <td className={`p-6 text-right font-black ${
                     t.status === 'Completed' ? 'text-slate-300' :
                     t.status === 'Action Required' ? 'text-orange-600' :
                     'text-teal-600'
                 }`}>
                   {t.days > 0 ? `${t.days} Days` : '--'}
                 </td>
               </tr>
             ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
