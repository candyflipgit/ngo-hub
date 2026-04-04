'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function Register() {
  const router = useRouter();
  const [role, setRole] = useState<'NGO' | 'VOLUNTEER'>('NGO');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001"}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role }),
      });
      if (res.ok) {
        const data = await res.json();
        document.cookie = `token=${data.access_token}; path=/`;
        router.push('/dashboard');
      } else {
        alert('Registration failed');
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
      <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Create an account</h2>
      <p className="text-slate-600 mb-8 font-medium">Join the impact revolution.</p>

      <form onSubmit={handleRegister} className="space-y-6">
        <div className="flex space-x-4 mb-4 bg-slate-100 p-1 rounded-xl">
          <button type="button" onClick={() => setRole('NGO')} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${role === 'NGO' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>
            NGO
          </button>
          <button type="button" onClick={() => setRole('VOLUNTEER')} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${role === 'VOLUNTEER' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>
            Volunteer
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            {role === 'NGO' ? 'Organization Name' : 'Full Name'}
          </label>
          <input required type="text" className="mt-1 block w-full rounded-xl border border-slate-200 px-4 py-3 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-sm"
                 value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
        </div>

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
          Sign up
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600 font-medium">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
          Log in instead
        </Link>
      </p>
    </div>
  );
}
