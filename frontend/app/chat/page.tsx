'use client';
import { useState, useEffect, useRef } from 'react';
import { Send, Search, PhoneCall, Video, Info, Paperclip, X } from 'lucide-react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function ChatSystem() {
  const [token, setToken] = useState<string | null>(null);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [mediaFile, setMediaFile] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCalling, setIsCalling] = useState(false);
  const [isVideo, setIsVideo] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const queryClient = useQueryClient();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setToken(Cookies.get('token') || null);
    setIsMounted(true);
  }, []);

  const api = axios.create({ baseURL: `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001"}`, headers: { Authorization: `Bearer ${token}` } });

  const { data: conversations = [] } = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const { data } = await api.get('/chat');
      return data;
    },
    enabled: !!token
  });

  const { data: searchResults = [] } = useQuery({
    queryKey: ['chatSearch', searchQuery],
    queryFn: async () => {
      if (!searchQuery) return [];
      const { data } = await api.get(`/chat/search?q=${searchQuery}`);
      return data;
    },
    enabled: !!token && searchQuery.length > 1
  });

  const { data: messages = [] } = useQuery({
    queryKey: ['messages', activeChatId],
    queryFn: async () => {
      if (!activeChatId) return [];
      const { data } = await api.get(`/chat/${activeChatId}/messages`);
      return data;
    },
    enabled: !!token && !!activeChatId,
    refetchInterval: 3000
  });

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const sendMutation = useMutation({
    mutationFn: async ({ text, mediaUrl }: { text: string; mediaUrl?: string | null }) => {
      if (!activeChatId) throw new Error('No active chat');
      await api.post(`/chat/${activeChatId}/messages`, { text, mediaUrl });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', activeChatId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      setMessage('');
      setMediaFile(null);
    }
  });

  const startMutation = useMutation({
     mutationFn: async (targetUserId: string) => {
        const { data } = await api.post(`/chat/start/${targetUserId}`);
        return data as string;
     },
     onSuccess: (chatId) => {
        setSearchQuery('');
        setActiveChatId(chatId);
        queryClient.invalidateQueries({ queryKey: ['conversations'] });
     }
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
     const file = e.target.files?.[0];
     if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setMediaFile(reader.result as string);
        reader.readAsDataURL(file);
     }
  };

  if (!isMounted) return null;

  const activeChat = conversations.find((c: any) => c.id === activeChatId);

  return (
    <div className="flex h-screen bg-slate-50 relative">
      {/* Calling Overlay Layer */}
      {isCalling && activeChat && (
        <div className="absolute inset-0 z-50 bg-slate-900/90 flex flex-col items-center justify-center text-white backdrop-blur-sm">
           <div className="w-24 h-24 bg-teal-500 rounded-full flex items-center justify-center text-3xl font-bold mb-6 animate-pulse shadow-[0_0_40px_rgba(20,184,166,0.5)]">
               {activeChat.name.charAt(0).toUpperCase()}
           </div>
           <h2 className="text-3xl font-bold mb-2">{activeChat.name}</h2>
           <p className="text-teal-400 font-medium tracking-widest text-sm mb-12 animate-pulse">
              {isVideo ? 'CONNECTING VIDEO...' : 'RINGING...'}
           </p>
           <button onClick={() => { setIsCalling(false); setIsVideo(false); }} className="w-16 h-16 bg-rose-500 rounded-full flex items-center justify-center shadow-lg hover:bg-rose-600 hover:scale-105 transition-all text-white">
               <PhoneCall className="w-6 h-6 rotate-[135deg]" />
           </button>
        </div>
      )}

      <aside className="w-80 bg-white border-r border-slate-200 flex flex-col z-20">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
           <Link href="/dashboard" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-indigo-600">NGO Hub Chat</Link>
        </div>
        <div className="p-4 border-b border-slate-100">
           <div className="relative">
             <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
             <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search NGOs & users..." className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm w-full focus:outline-none focus:ring-2 focus:ring-teal-500/50" />
           </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
           {searchQuery ? (
              <div className="p-2">
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-2">Search Results</p>
                 {searchResults.map((u: any) => (
                    <div key={u.id} onClick={() => startMutation.mutate(u.id)} className="flex p-3 cursor-pointer hover:bg-slate-50 transition-colors rounded-xl">
                       <div className="w-10 h-10 bg-slate-200 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-slate-500 mr-3">{u.name.charAt(0).toUpperCase()}</div>
                       <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <h4 className="text-sm font-bold text-slate-900 truncate">{u.name}</h4>
                          <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full inline-block w-max mt-1">{u.role}</span>
                       </div>
                    </div>
                 ))}
                 {searchResults.length === 0 && <p className="text-center text-slate-500 text-sm mt-4">No match found</p>}
              </div>
           ) : (
             <>
               {conversations.map((c: any) => (
                  <div key={c.id} onClick={() => setActiveChatId(c.id)} className={`flex p-4 cursor-pointer hover:bg-slate-50 transition-colors border-l-4 ${activeChatId === c.id ? 'border-teal-500 bg-teal-50/50' : 'border-transparent'}`}>
                     <div className="w-12 h-12 bg-slate-200 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-slate-500 mr-4 shadow-sm">{c.name.charAt(0).toUpperCase()}</div>
                     <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                           <h4 className="text-sm font-bold text-slate-900 truncate">{c.name}</h4>
                        </div>
                        <p className={`text-xs truncate mt-1 ${activeChatId === c.id ? 'text-teal-700 font-semibold' : 'text-slate-500'}`}>
                           {c.preview.startsWith('data:image') ? '📸 Photo attached' : c.preview}
                        </p>
                     </div>
                  </div>
               ))}
               {conversations.length === 0 && <p className="text-center text-slate-400 text-sm mt-10">No messages yet. Search to start chat!</p>}
             </>
           )}
        </div>
      </aside>

      <main className="flex-1 flex flex-col bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-slate-50 relative">
        {activeChatId ? (
          <>
            <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-10">
               <div className="flex items-center">
                  <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold mr-4 shadow-sm">{activeChat?.name.charAt(0).toUpperCase()}</div>
                  <div>
                     <h2 className="font-bold text-slate-900">{activeChat?.name}</h2>
                     <p className="text-xs text-emerald-500 font-semibold flex items-center"><span className="w-2 h-2 bg-emerald-500 rounded-full mr-1 animate-pulse"></span> Online</p>
                  </div>
               </div>
               <div className="flex space-x-4 text-slate-400 items-center">
                  <button onClick={() => { setIsCalling(true); setIsVideo(false); }} className="hover:text-teal-600 transition-colors p-1 rounded-full hover:bg-slate-100"><PhoneCall className="w-5 h-5" /></button>
                  <button onClick={() => { setIsCalling(true); setIsVideo(true); }} className="hover:text-teal-600 transition-colors p-1 rounded-full hover:bg-slate-100"><Video className="w-5 h-5" /></button>
                  <button className="hover:text-teal-600 transition-colors p-1 rounded-full hover:bg-slate-100"><Info className="w-5 h-5" /></button>
               </div>
            </header>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col">
               {messages.map((m: any) => (
                  <div key={m.id} className={`flex items-end ${m.isMe ? 'justify-end' : ''}`}>
                     {m.isMe && <span className="text-xs text-slate-400 mr-2 font-medium">{new Date(m.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>}
                     <div className={`max-w-md ${m.isMe ? 'bg-teal-600 rounded-2xl rounded-br-sm shadow-md shadow-teal-500/20' : 'bg-white rounded-2xl rounded-bl-sm shadow-sm border border-slate-100'}`}>
                        {m.mediaUrl && <img src={m.mediaUrl} alt="Attached" className="max-w-full rounded-t-2xl object-cover" />}
                        {m.text && <p className={`px-5 py-3 ${m.isMe ? 'text-teal-50' : 'text-slate-700'} text-[15px] font-medium tracking-wide`}>{m.text}</p>}
                     </div>
                     {!m.isMe && <span className="text-xs text-slate-400 ml-2 font-medium">{new Date(m.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>}
                  </div>
               ))}
            </div>

            <div className="p-4 bg-white border-t border-slate-200 z-10 relative">
               {mediaFile && (
                 <div className="absolute bottom-full left-4 mb-2 p-2 bg-white rounded-2xl border border-slate-200 shadow-lg shrink-0">
                    <img src={mediaFile} className="h-24 rounded-lg object-contain bg-slate-50" />
                    <button onClick={() => setMediaFile(null)} className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 shadow-md hover:bg-rose-600"><X className="w-4 h-4" /></button>
                 </div>
               )}
               <form onSubmit={(e) => { e.preventDefault(); if(message.trim() || mediaFile) sendMutation.mutate({ text: message, mediaUrl: mediaFile }); }} className="flex items-center bg-slate-50 rounded-full border border-slate-200 p-1 pr-2">
                  <label className="cursor-pointer p-2 ml-1 text-slate-400 hover:text-teal-600 transition-colors">
                     <Paperclip className="w-5 h-5" />
                     <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                  </label>
                  <input type="text" value={message} onChange={e => setMessage(e.target.value)} placeholder="Type your message..." className="flex-1 bg-transparent px-3 py-3 outline-none text-sm font-medium" />
                  <button type="submit" disabled={sendMutation.isPending || (!message.trim() && !mediaFile)} className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center shadow-md shadow-teal-500/30 hover:bg-teal-700 focus:scale-95 transition-all text-white disabled:opacity-50 disabled:hover:scale-100 shrink-0">
                     <Send className="w-4 h-4 ml-0.5" />
                  </button>
               </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center flex-col text-slate-400">
             <Send className="w-16 h-16 text-slate-200 mb-4" />
             <h2 className="text-xl font-bold text-slate-500">Your Messages</h2>
             <p className="mt-2 text-sm font-medium">Search for an NGO or volunteer to start a direct message.</p>
          </div>
        )}
      </main>
    </div>
  );
}
