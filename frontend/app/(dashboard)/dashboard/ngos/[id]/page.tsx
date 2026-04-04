'use client';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useParams, useRouter } from 'next/navigation';
import { BuildingIcon, MapPin, SearchCheck, CheckCircle2, ShieldCheck, Mail, HeartHandshake } from 'lucide-react';
import DirectChat from '../../../../components/DirectChat';

export default function NgoProfileView() {
  const { id } = useParams() as { id: string };
  const token = Cookies.get('token');
  const role = Cookies.get('role');
  const api = axios.create({ baseURL: `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001"}`, headers: { Authorization: `Bearer ${token}` } });
  const router = useRouter();

  const { data: ngo, isLoading } = useQuery({
    queryKey: ['ngoProfile', id],
    queryFn: async () => {
       const { data } = await api.get(`/ngo/${id}`);
       return data;
    },
    enabled: !!token && !!id
  });

  const collabMutation = useMutation({
     mutationFn: async (title: string) => {
        await api.post('/collaborations', { receiverId: id, title });
     },
     onSuccess: () => {
        alert('Collaboration request sent successfully.');
     }
  });

  const { data: followData, refetch: refetchFollow } = useQuery({
    queryKey: ['followStatus', id],
    queryFn: async () => {
       const { data } = await api.get(`/ngo/${id}/follow-status`);
       return data;
    },
    enabled: !!token && !!id && role !== 'NGO'
  });

  const followMutation = useMutation({
     mutationFn: async () => {
        const { data } = await api.post(`/ngo/${id}/follow`);
        return data;
     },
     onSuccess: () => {
        refetchFollow();
     }
  });

  if (isLoading) return <div className="p-8 max-w-7xl mx-auto flex items-center justify-center h-full"><SearchCheck className="w-10 h-10 animate-spin text-teal-600" /></div>;
  if (!ngo) return <div className="p-8 max-w-7xl mx-auto text-center font-bold text-slate-500">NGO Not Found</div>;

  const isFollowing = followData?.isFollowing;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <BuildingIcon className="w-48 h-48" />
        </div>
        
        <div className="flex items-center space-x-6 relative z-10">
           <div className="w-24 h-24 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white text-4xl font-black shadow-lg shadow-teal-500/30">
              {ngo.name.charAt(0)}
           </div>
           <div>
              <div className="flex items-center space-x-3 mb-2">
                 <h1 className="text-3xl font-black text-slate-900 tracking-tight">{ngo.name}</h1>
                 {ngo.isVerified && <span title="Verified Organization"><CheckCircle2 className="w-6 h-6 text-emerald-500" /></span>}
              </div>
              <p className="text-slate-500 font-medium flex items-center">
                 <MapPin className="w-4 h-4 mr-1" /> {ngo.location || 'Nationwide / Remote'}
              </p>
           </div>
        </div>

        {role !== 'NGO' && (
           <div className="mt-6 md:mt-0 relative z-10 flex space-x-3">
              <button 
                onClick={() => followMutation.mutate()} 
                disabled={followMutation.isPending}
                className={`px-6 py-2.5 rounded-xl font-bold shadow-sm transition-all text-sm ${isFollowing ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-red-600' : 'bg-teal-600 text-white hover:bg-teal-700 hover:shadow-md hover:-translate-y-0.5'}`}>
                 {followMutation.isPending ? 'Updating...' : isFollowing ? 'Following' : 'Follow'}
              </button>
           </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative z-10 -mt-2 mx-0 lg:mx-8">
        {ngo.description && (
           <p className="text-slate-600 leading-relaxed font-medium bg-slate-50 p-4 rounded-xl border border-slate-100">
             {ngo.description}
           </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Details & Actions */}
        <div className="space-y-8">
           <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
             <h3 className="font-bold text-slate-900 text-lg mb-4 flex items-center"><ShieldCheck className="w-5 h-5 mr-2 text-teal-600" /> Organization Facts</h3>
             
             <div className="space-y-4">
                <div className="bg-slate-50 p-3 rounded-2xl">
                   <p className="text-xs font-bold text-slate-400 uppercase">Mission</p>
                   <p className="text-sm font-semibold text-slate-800 mt-1">{ngo.missionStatement || 'To impact society positively.'}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl">
                   <p className="text-xs font-bold text-slate-400 uppercase">Events Organized</p>
                   <p className="text-sm font-semibold text-slate-800 mt-1">{ngo._count?.events || 0} active/past events</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl">
                   <p className="text-xs font-bold text-slate-400 uppercase">Members & Reach</p>
                   <p className="text-sm font-semibold text-slate-800 mt-1">100+ Network Members</p>
                </div>
             </div>
           </div>

           {role === 'NGO' && (
             <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl p-8 text-white shadow-xl shadow-orange-500/20">
               <HeartHandshake className="w-8 h-8 mb-4 opacity-90" />
               <h3 className="font-bold text-xl mb-2">Propose Collaboration</h3>
               <p className="text-orange-100 text-sm font-medium mb-6">Want to joint-host an event, share resources, or amplify impact with {ngo.name}?</p>
               <button onClick={() => {
                   const title = prompt('Enter a brief title for your collaboration request (e.g. Joint Tree Plantation):');
                   if (title) collabMutation.mutate(title);
               }} className="w-full bg-white text-orange-600 font-bold py-3 rounded-xl hover:bg-orange-50 transition-colors shadow-sm">
                 Send Request
               </button>
             </div>
           )}
        </div>

        {/* Right Column: Embedded Chat */}
        <div className="lg:col-span-2">
           <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 text-lg mb-4 flex items-center"><Mail className="w-5 h-5 mr-2 text-teal-600" /> Direct Messaging</h3>
              <p className="text-slate-500 text-sm font-medium mb-6">You are actively interacting with {ngo.name}. Messages are secure and private.</p>
              
              <DirectChat targetUserId={ngo.user.id} title={ngo.name} avatar={ngo.name.charAt(0)} />
           </div>
        </div>
      </div>
    </div>
  );
}
