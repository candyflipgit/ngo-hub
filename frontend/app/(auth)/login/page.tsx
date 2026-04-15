'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Cookies from 'js-cookie';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://ngo-hub-production.up.railway.app"}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const data = await res.json();
        Cookies.set('token', data.access_token);
        Cookies.set('role', data.user.role);
        router.push('/dashboard');
      } else {
        alert('Invalid credentials');
      }
    } catch(err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Link>
      <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Welcome back</h2>
      <p className="text-slate-600 mb-8 font-medium">Log in to continue making an impact.</p>

      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700">Email address</label>
          <input required type="email" className="mt-1 block w-full rounded-xl border border-slate-200 px-4 py-3 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-sm"
                 value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Password</label>
          <input required type="password" minLength={6} className="mt-1 block w-full rounded-xl border border-slate-200 px-4 py-3 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-sm"
                 value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
        </div>

        <button type="submit" className="w-full py-3 px-4 rounded-xl border border-transparent text-sm font-bold shadow-lg shadow-blue-500/30 text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all hover:-translate-y-0.5 mt-4">
          Log in
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600 font-medium">
        Don't have an account?{' '}
        <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
          Register now
        </Link>
      </p>
    </div>
  );
}
