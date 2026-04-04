'use client';
import { useState, useEffect } from 'react';
import { MessageSquare, Heart, RefreshCw, Send, ImagePlus, UserCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function Feed() {
  const mockPosts = [
    { id: 1, user: 'Green Earth Foundation', time: '1h ago', content: 'Our Juhu Beach cleanup was a huge success today! Thanks to all 485 volunteers who showed up early morning. We collected 2 tonnes of plastic waste.', likes: 142, comments: 28 },
    { id: 2, user: 'Education First', time: '3h ago', content: 'We are organizing an open-source book donation camp next week in Bandra...', likes: 89, comments: 5 },
    { id: 3, user: 'Animal Rescue Alliance', time: '6h ago', content: 'URGENT: Temporary foster homes needed in Andheri East!', likes: 215, comments: 64 },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="fixed w-full top-0 glass z-50 border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-indigo-600 tracking-tight">NGO Hub</Link>
          <div className="flex space-x-6 text-sm font-semibold text-slate-500">
             <Link href="/ngos" className="hover:text-teal-600 transition-colors">Discover NGOs</Link>
             <Link href="/dashboard" className="hover:text-teal-600 transition-colors">Dashboard</Link>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto pt-24 pb-20 px-4">
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm mb-8 flex flex-col">
          <div className="flex items-center space-x-4 mb-4">
             <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
               <UserCircle2 className="w-8 h-8" />
             </div>
             <textarea placeholder="Share an update or milestone..." className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-sm font-medium h-24" />
          </div>
          <div className="flex justify-between items-center pl-16">
             <button className="text-teal-600 font-semibold text-sm flex items-center bg-teal-50 hover:bg-teal-100 py-2 px-4 rounded-full transition-colors"><ImagePlus className="w-4 h-4 mr-2" /> Add Media</button>
             <button className="py-2.5 px-6 rounded-full bg-teal-600 text-white font-bold tracking-wide shadow-md shadow-teal-500/30 hover:bg-teal-700 hover:-translate-y-0.5 transition-all text-sm flex items-center"><Send className="w-4 h-4 mr-2"/> Post</button>
          </div>
        </div>

        <div className="space-y-6">
           {mockPosts.map(post => (
             <div key={post.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
               <div className="flex items-center space-x-4 mb-4">
                 <div className="w-12 h-12 bg-gradient-to-tr from-teal-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">{post.user.charAt(0)}</div>
                 <div>
                   <h3 className="font-bold text-slate-900">{post.user}</h3>
                   <p className="text-xs font-semibold text-slate-500">{post.time}</p>
                 </div>
               </div>
               <p className="text-slate-800 text-[15px] font-medium leading-relaxed tracking-wide mb-6">{post.content}</p>
               
               <div className="flex border-t border-slate-100 pt-4 space-x-2 text-slate-500 text-sm font-semibold">
                 <button className="flex-1 flex items-center justify-center py-2 hover:bg-slate-50 hover:text-rose-600 rounded-xl transition-colors"><Heart className="w-4 h-4 mr-2" /> {post.likes}</button>
                 <button className="flex-1 flex items-center justify-center py-2 hover:bg-slate-50 hover:text-teal-600 rounded-xl transition-colors"><MessageSquare className="w-4 h-4 mr-2" /> {post.comments}</button>
                 <button className="flex-1 flex items-center justify-center py-2 hover:bg-slate-50 hover:text-indigo-600 rounded-xl transition-colors"><RefreshCw className="w-4 h-4 mr-2" /> Share</button>
               </div>
             </div>
           ))}
        </div>
      </main>
    </div>
  );
}
