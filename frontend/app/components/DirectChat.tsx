'use client';
import { useState, useEffect, useRef } from 'react';
import { Send, PhoneCall, Video, Info, Paperclip, X } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function DirectChat({ targetUserId, title, avatar }: { targetUserId: string, title: string, avatar: string }) {
  const [token, setToken] = useState<string | null>(null);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [mediaFile, setMediaFile] = useState<string | null>(null);
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

  // Ensure chat exists
  useEffect(() => {
    if (token && targetUserId) {
        api.post(`/chat/start/${targetUserId}`).then(res => {
           setActiveChatId(res.data);
        }).catch(err => console.error(err));
    }
  }, [token, targetUserId]);

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
      setMessage('');
      setMediaFile(null);
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

  return (
    <div className="flex flex-col h-[500px] border border-slate-200 rounded-2xl overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-slate-50 relative shadow-sm">
      {/* Calling Overlay Layer */}
      {isCalling && (
        <div className="absolute inset-0 z-50 bg-slate-900/90 flex flex-col items-center justify-center text-white backdrop-blur-sm rounded-2xl">
           <div className="w-20 h-20 bg-teal-500 rounded-full flex items-center justify-center text-3xl font-bold mb-4 animate-pulse shadow-[0_0_40px_rgba(20,184,166,0.5)]">
               {avatar.charAt(0).toUpperCase()}
           </div>
           <h2 className="text-2xl font-bold mb-2">{title}</h2>
           <p className="text-teal-400 font-medium tracking-widest text-sm mb-8 animate-pulse">
              {isVideo ? 'CONNECTING VIDEO...' : 'RINGING...'}
           </p>
           <button onClick={() => { setIsCalling(false); setIsVideo(false); }} className="w-14 h-14 bg-rose-500 rounded-full flex items-center justify-center shadow-lg hover:bg-rose-600 hover:scale-105 transition-all text-white">
               <PhoneCall className="w-5 h-5 rotate-[135deg]" />
           </button>
        </div>
      )}

      {/* Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-10 shrink-0">
         <div className="flex items-center">
            <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold mr-4 shadow-sm">{avatar.charAt(0).toUpperCase()}</div>
            <div>
               <h2 className="font-bold text-slate-900">{title}</h2>
               <p className="text-xs text-emerald-500 font-semibold flex items-center"><span className="w-2 h-2 bg-emerald-500 rounded-full mr-1 animate-pulse"></span> Online</p>
            </div>
         </div>
         <div className="flex space-x-4 text-slate-400 items-center">
            <button onClick={() => { setIsCalling(true); setIsVideo(false); }} className="hover:text-teal-600 transition-colors p-1 rounded-full hover:bg-slate-100"><PhoneCall className="w-5 h-5" /></button>
            <button onClick={() => { setIsCalling(true); setIsVideo(true); }} className="hover:text-teal-600 transition-colors p-1 rounded-full hover:bg-slate-100"><Video className="w-5 h-5" /></button>
            <button className="hover:text-teal-600 transition-colors p-1 rounded-full hover:bg-slate-100"><Info className="w-5 h-5" /></button>
         </div>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col pt-8">
         {messages.length === 0 && <p className="m-auto text-slate-400 text-sm font-medium">Say hi to {title}!</p>}
         {messages.map((m: any) => (
            <div key={m.id} className={`flex items-end ${m.isMe ? 'justify-end' : ''}`}>
               {m.isMe && <span className="text-xs text-slate-400 mr-2 font-medium">{new Date(m.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>}
               <div className={`max-w-[80%] ${m.isMe ? 'bg-teal-600 rounded-2xl rounded-br-sm shadow-md shadow-teal-500/20' : 'bg-white rounded-2xl rounded-bl-sm shadow-sm border border-slate-200'}`}>
                  {m.mediaUrl && <img src={m.mediaUrl} alt="Attached" className="max-w-full rounded-t-2xl object-cover" />}
                  {m.text && <p className={`px-4 py-2 ${m.isMe ? 'text-teal-50' : 'text-slate-700'} text-[14px] font-medium tracking-wide`}>{m.text}</p>}
               </div>
               {!m.isMe && <span className="text-xs text-slate-400 ml-2 font-medium">{new Date(m.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>}
            </div>
         ))}
      </div>

      {/* Input */}
      <div className="p-3 bg-white border-t border-slate-200 z-10 relative shrink-0">
         {mediaFile && (
           <div className="absolute bottom-full left-4 mb-2 p-2 bg-white rounded-2xl border border-slate-200 shadow-lg shrink-0">
              <img src={mediaFile} className="h-20 rounded-lg object-contain bg-slate-50" />
              <button onClick={() => setMediaFile(null)} className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 shadow-md hover:bg-rose-600"><X className="w-3 h-3" /></button>
           </div>
         )}
         <form onSubmit={(e) => { e.preventDefault(); if(message.trim() || mediaFile) sendMutation.mutate({ text: message, mediaUrl: mediaFile }); }} className="flex items-center bg-slate-50 rounded-full border border-slate-200 p-1 pr-1.5">
            <label className="cursor-pointer p-2 ml-1 text-slate-400 hover:text-teal-600 transition-colors">
               <Paperclip className="w-4 h-4" />
               <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
            </label>
            <input type="text" value={message} onChange={e => setMessage(e.target.value)} placeholder="Send a message..." className="flex-1 bg-transparent px-3 py-2 outline-none text-sm font-medium" />
            <button type="submit" disabled={sendMutation.isPending || (!message.trim() && !mediaFile)} className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center shadow-md shadow-teal-500/30 hover:bg-teal-700 focus:scale-95 transition-all text-white disabled:opacity-50 disabled:hover:scale-100 shrink-0">
               <Send className="w-3.5 h-3.5 ml-0.5" />
            </button>
         </form>
      </div>
    </div>
  );
}
