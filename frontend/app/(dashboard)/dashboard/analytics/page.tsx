'use client';
import { BarChart3, TrendingUp, Users, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function AnalyticsDashboard() {
  const token = Cookies.get('token');
  const api = axios.create({ baseURL: `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001"}`, headers: { Authorization: `Bearer ${token}` } });

  const { data: stats, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const { data } = await api.get('/analytics');
      return data;
    }
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Analytics Overview</h1>
        <p className="text-slate-500 mt-2 font-medium">Detailed metrics of your impact and volunteer engagement.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           <div className="h-32 bg-slate-100 animate-pulse rounded-3xl" />
           <div className="h-32 bg-slate-100 animate-pulse rounded-3xl" />
           <div className="h-32 bg-slate-100 animate-pulse rounded-3xl" />
           <div className="h-32 bg-slate-100 animate-pulse rounded-3xl" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { title: 'Total Volunteers', value: stats?.totalVolunteers || '0', icon: Users, color: 'text-teal-600 bg-teal-50 border-teal-100', trend: '+12%' },
            { title: 'Events Hosted', value: stats?.events || '0', icon: Calendar, color: 'text-indigo-600 bg-indigo-50 border-indigo-100', trend: '+4%' },
            { title: 'Hours Logged', value: stats?.hoursLogged || '0', icon: BarChart3, color: 'text-orange-600 bg-orange-50 border-orange-100', trend: '+24%' },
            { title: 'Engagement Rate', value: stats?.participationRate || '0%', icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50 border-emerald-100', trend: '+8%' },
          ].map((stat, i) => (
            <div key={i} className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 border ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-slate-500 mb-1">{stat.title}</p>
              <div className="flex items-end space-x-3">
                <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{stat.value}</h3>
                <span className="text-sm font-semibold text-emerald-600 mb-1">{stat.trend}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mock Chart Area */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Engagement Overview</h2>
        <div className="h-72 w-full bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_19px,rgba(0,0,0,.05)_20px)] bg-[length:20px_20px] pointer-events-none"></div>
          <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_19px,rgba(0,0,0,.05)_20px)] bg-[length:20px_20px] pointer-events-none"></div>
          <p className="text-slate-400 font-medium relative z-10 glass-dark px-4 py-2 rounded-xl text-sm">Interactive Growth Chart visualization locked in MVP</p>
        </div>
      </div>
    </div>
  );
}
