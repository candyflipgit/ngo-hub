'use client';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Users, CalendarDays, Award, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export default function DashboardOverview() {
  const [role, setRole] = useState('');
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    setRole(Cookies.get('role') || '');
    setToken(Cookies.get('token') || '');
  }, []);

  const { data: stats = { totalVolunteers: 0, events: 0, certificatesIssued: 0, overallImpact: '0%' }, isLoading } = useQuery({
     queryKey: ['dashboardStats'],
     queryFn: async () => {
        if (!token) return { totalVolunteers: 0, events: 0, certificatesIssued: 0, overallImpact: '0%' };
        const api = axios.create({ baseURL: `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001"}`, headers: { Authorization: `Bearer ${token}` } });
        const { data } = await api.get('/analytics');
        return data;
     },
     enabled: !!token && !!role
  });

  return (
    <div className="p-8">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
        <p className="text-slate-500 mt-2 font-medium">Welcome back! Here's what's happening today.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-10">
        <StatCard title={role === 'NGO' ? 'Total Volunteers' : 'Hours Volunteered'} value={stats.totalVolunteers} icon={Users} color="bg-blue-50 text-blue-600 border-blue-100" />
        <StatCard title={role === 'NGO' ? 'Active Events' : 'Events Joined'} value={stats.events} icon={CalendarDays} color="bg-indigo-50 text-indigo-600 border-indigo-100" />
        <StatCard title="Certificates Issued" value={stats.certificatesIssued} icon={Award} color="bg-purple-50 text-purple-600 border-purple-100" />
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pattern-diagonal-lines-sm"></div>
        <h2 className="text-xl font-bold text-slate-900 mb-6 relative z-10">Recent Activity Activity</h2>
        <div className="space-y-6 relative z-10">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mr-4 flex-shrink-0">
                <CalendarDays className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{role === 'NGO' ? 'New volunteer created application for Tree Plantation' : 'You applied for Beach Cleanup Drive'}</p>
                <p className="text-xs text-slate-500 mt-1">{i * 2} hours ago</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 border ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-slate-900 font-sans tracking-tight">{value}</h3>
    </div>
  );
}
