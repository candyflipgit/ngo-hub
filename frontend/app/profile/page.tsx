'use client';
import { UserCircle, MapPin, Mail, Target, Award, Edit3, CalendarCheck, Clock8 } from 'lucide-react';
import Link from 'next/link';

export default function VolunteerProfile() {
  const profile = {
    name: 'Ankit Sharma',
    bio: 'Software Engineer by day, environmental activist by weekend. Passionate about empowering local communities.',
    skills: ['Education', 'Tech Support', 'Environment', 'Management'],
    hours: 142,
    badges: 4,
    eventsAttended: 12,
    location: 'Mumbai, India',
    email: 'volunteer@example.com'
  };

  const timeline = [
    { event: 'Juhu Beach Mega Cleanup', date: 'March 20, 2026', hours: 6, role: 'Team Lead' },
    { event: 'Code for Cause Hackathon', date: 'February 15, 2026', hours: 24, role: 'Mentor' },
    { event: 'Bandra Tree Plantation', date: 'January 4, 2026', hours: 4, role: 'Volunteer' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-8">
      <header className="fixed w-full top-0 left-0 glass z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-indigo-600 tracking-tight">NGO Hub</Link>
          <div className="flex space-x-6 text-sm font-semibold text-slate-500">
             <Link href="/dashboard" className="px-5 py-2.5 bg-teal-600 text-white rounded-xl shadow-md hover:bg-teal-700 transition-colors">Dashboard</Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto pt-32 pb-20 space-y-8">
         {/* Profile Card */}
         <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-50 to-teal-50 rounded-full mix-blend-multiply blur-3xl opacity-50 -translate-y-10 translate-x-10 pointer-events-none"></div>

            <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-tr from-teal-400 to-indigo-500 rounded-3xl flex-shrink-0 flex items-center justify-center shadow-xl border-4 border-white z-10">
               <span className="text-6xl font-black text-white mix-blend-overlay">{profile.name.charAt(0)}</span>
            </div>

            <div className="flex-1 text-center md:text-left z-10 w-full">
               <div className="flex flex-col md:flex-row md:justify-between items-center md:items-start mb-4">
                 <div>
                   <h1 className="text-4xl font-black text-slate-900 tracking-tight">{profile.name}</h1>
                   <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4 mt-3 text-slate-500 font-semibold text-sm">
                     <span className="flex items-center justify-center md:justify-start"><MapPin className="w-4 h-4 mr-1 text-slate-400" /> {profile.location}</span>
                     <span className="hidden md:block">&bull;</span>
                     <span className="flex items-center justify-center md:justify-start"><Mail className="w-4 h-4 mr-1 text-slate-400" /> {profile.email}</span>
                   </div>
                 </div>
                 <button className="hidden md:flex items-center justify-center bg-slate-50 border border-slate-200 text-slate-600 hover:text-teal-600 hover:border-teal-200 px-4 py-2 rounded-xl transition-colors font-bold text-sm shadow-sm group/btn mt-4 md:mt-0">
                    <Edit3 className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" /> Edit Profile
                 </button>
               </div>
               
               <p className="text-slate-600 font-medium leading-relaxed mt-6 mb-6">
                 {profile.bio}
               </p>

               <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {profile.skills.map((skill, i) => (
                    <span key={i} className="bg-slate-50 text-slate-600 border border-slate-200 font-bold px-3 py-1.5 rounded-lg text-xs tracking-wide">
                      {skill}
                    </span>
                  ))}
               </div>
            </div>
         </div>

         {/* Stats */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center space-x-6">
               <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center flex-shrink-0"><Clock8 className="w-7 h-7" /></div>
               <div>
                 <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Hours Logged</p>
                 <h3 className="text-3xl font-black text-slate-900 tracking-tight">{profile.hours}</h3>
               </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center space-x-6">
               <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center flex-shrink-0"><CalendarCheck className="w-7 h-7" /></div>
               <div>
                 <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Events</p>
                 <h3 className="text-3xl font-black text-slate-900 tracking-tight">{profile.eventsAttended}</h3>
               </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center space-x-6">
               <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0"><Award className="w-7 h-7" /></div>
               <div>
                 <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Badges</p>
                 <h3 className="text-3xl font-black text-slate-900 tracking-tight">{profile.badges}</h3>
               </div>
            </div>
         </div>

         {/* Timeline */}
         <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 tracking-tight flex items-center">
               <Target className="w-6 h-6 mr-3 text-teal-500" /> Event Timeline
            </h2>
            <div className="space-y-8 pl-4 relative">
               <div className="absolute left-[1.35rem] top-2 bottom-0 w-0.5 bg-slate-100"></div>
               
               {timeline.map((item, i) => (
                  <div key={i} className="relative flex items-start group">
                     <div className="absolute -left-1.5 top-1 w-3 h-3 bg-white border-[3px] border-teal-500 rounded-full z-10 group-hover:scale-150 transition-transform"></div>
                     <div className="ml-8 w-full">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                           <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors">{item.event}</h3>
                           <span className="text-sm font-semibold text-slate-400 sm:ml-4 whitespace-nowrap">{item.date}</span>
                        </div>
                        <div className="flex items-center space-x-3 text-sm font-semibold">
                           <span className="bg-slate-50 text-slate-600 border border-slate-100 px-3 py-1 rounded-lg">Role: {item.role}</span>
                           <span className="bg-teal-50 text-teal-700 border border-teal-100 px-3 py-1 rounded-lg">+{item.hours} hrs</span>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </main>
    </div>
  );
}
