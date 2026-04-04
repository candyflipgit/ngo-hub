'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, CalendarDays, ShieldCheck, LogOut, FileCheck, BarChart, Users, ClipboardList, Award, HeartHandshake, Bell, MessageSquare, Search as SearchIcon } from 'lucide-react';
import Cookies from 'js-cookie';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [role, setRole] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = Cookies.get('token');
    if (!t) router.push('/login');
    setToken(t || null);
    setRole(Cookies.get('role') || 'VOLUNTEER');
  }, []);

  const api = axios.create({ baseURL: `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001"}`, headers: { Authorization: `Bearer ${token}` } });

  const { data: searchResults = [] } = useQuery({
     queryKey: ['globalSearch', searchQuery],
     queryFn: async () => {
        if (searchQuery.length < 2) return [];
        const { data } = await api.get(`/ngo?query=${searchQuery}`);
        return data;
     },
     enabled: !!token && searchQuery.length > 1
  });

  const logout = () => {
    Cookies.remove('token');
    Cookies.remove('role');
    router.push('/login');
  };

  const navs = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Events', href: '/dashboard/events', icon: CalendarDays },
    { name: 'Applications', href: '/dashboard/applications', icon: ClipboardList, hide: role !== 'NGO' },
    { name: 'Certificates', href: '/dashboard/certificates', icon: Award },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart, hide: role !== 'NGO' },
    { name: 'Docs & Compliance', href: '/dashboard/legal/documents', icon: FileCheck, hide: role !== 'NGO' },
    { name: 'Collaborations', href: '/dashboard/collaborations', icon: HeartHandshake, hide: role !== 'NGO' },
    { name: 'Team', href: '/dashboard/team', icon: Users, hide: role !== 'NGO' },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col pt-6 pb-4">
        <div className="px-6 mb-8">
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight">NGO Hub</span>
          <div className="mt-1 text-xs font-semibold text-slate-500 bg-slate-100 uppercase inline-block px-2 py-0.5 rounded shadow-sm">{role} PORTAL</div>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navs.filter(n => !n.hide).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href} className={`flex items-center px-3 py-2.5 rounded-xl font-medium transition-all ${isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-700' : 'text-slate-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 mt-auto">
          <button onClick={logout} className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-slate-600 rounded-xl hover:bg-red-50 hover:text-red-700 transition-colors">
            <LogOut className="w-5 h-5 mr-3 text-slate-400" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
        <header className="h-16 px-8 bg-white border-b border-slate-200 flex items-center justify-between z-10">
          <div className="flex-1 flex items-center">
            <div className="w-full max-w-md relative group">
               <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
               <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search NGOs, Events, Skills..." 
                className="w-full bg-slate-50 border border-slate-200 text-sm rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-teal-500/30 transition-shadow peer" 
               />
               
               {searchQuery.length > 1 && (
                 <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-slate-200 rounded-2xl shadow-xl z-[60] py-2 overflow-hidden hidden peer-focus:block hover:block">
                    {searchResults.length > 0 ? (
                      searchResults.map((n: any) => (
                        <div 
                          key={n.id} 
                          onMouseDown={() => {
                            router.push(`/dashboard/ngos/${n.id}`);
                            setSearchQuery('');
                          }}
                          className="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0"
                        >
                           <h4 className="text-sm font-bold text-slate-900">{n.name}</h4>
                           <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">NGO • {n.location || 'India'}</p>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-slate-500 text-center">No results found for "{searchQuery}"</div>
                    )}
                 </div>
               )}
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/feed" className="text-slate-400 hover:text-teal-600 transition-colors tooltip" title="Community Feed">
               <LayoutDashboard className="w-5 h-5" />
            </Link>
            <Link href="/chat" className="text-slate-400 hover:text-teal-600 transition-colors relative" title="Messages">
               <MessageSquare className="w-5 h-5" />
               <span className="absolute top-0 right-0 w-2 h-2 bg-orange-500 rounded-full border-2 border-white translate-x-1/2 -translate-y-1/2"></span>
            </Link>
            <button className="text-slate-400 hover:text-teal-600 transition-colors relative" title="Notifications">
               <Bell className="w-5 h-5" />
               <span className="absolute top-0 right-0 w-2 h-2 bg-teal-500 rounded-full border-2 border-white translate-x-1/2 -translate-y-1/2"></span>
            </button>
            <Link href="/profile" className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm border border-teal-200 hover:shadow-md transition-shadow">
               {role.charAt(0)}
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto w-full relative">
          {children}
        </main>
      </div>
    </div>
  );
}
