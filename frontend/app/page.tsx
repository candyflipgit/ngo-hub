'use client';
import Link from 'next/link';
import { ArrowRight, Globe, ShieldCheck, Users } from 'lucide-react';

export default function LandingPage() {
  return (
    <main className="flex-grow flex flex-col bg-slate-50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      {/* Nav */}
      <header className="fixed w-full top-0 glass z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight">NGO Hub</span>
            <div className="flex space-x-4">
              <Link href="/login" className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors">Login</Link>
              <Link href="/register" className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-full shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:shadow-blue-600/40 transition-all hover:-translate-y-0.5">Get Started</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 mb-8 mt-12 animate-fade-in">
          <Globe className="w-4 h-4" />
          <span className="text-sm font-medium">Empowering India's Changemakers</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
          The Network For <br className="hidden md:block"/>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600">Social Impact</span>
        </h1>
        
        <p className="max-w-2xl text-lg md:text-xl text-slate-600 mb-10 leading-relaxed">
          A unified ecosystem where non-profits, volunteers, and legal workflows converge. Join the movement to make a difference seamlessly.
        </p>

        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <Link href="/register?type=NGO" className="px-8 py-4 rounded-full bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-all flex items-center justify-center space-x-2 group hover:shadow-xl hover:-translate-y-0.5">
            <span>Register your NGO</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/register?type=VOLUNTEER" className="px-8 py-4 rounded-full bg-white text-slate-900 font-semibold border border-slate-200 hover:border-blue-200 hover:bg-blue-50 transition-all flex items-center justify-center hover:shadow-lg hover:-translate-y-0.5">
            Become a Volunteer
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <FeatureCard 
              icon={<Users className="w-8 h-8 text-blue-500" />}
              title="A LinkedIn for NGOs"
              description="Connect, collaborate, and grow your non-profit network. Post updates and expand your reach."
            />
            <FeatureCard 
              icon={<ShieldCheck className="w-8 h-8 text-indigo-500" />}
              title="Legal Registration Assistant"
              description="Streamline Trust, Society, and Section 8 registrations with dynamic guided workflows."
            />
            <FeatureCard 
              icon={<Globe className="w-8 h-8 text-purple-500" />}
              title="Volunteer Management"
              description="Find passionate volunteers, track hours, and auto-generate certificates of impact."
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-slate-50 mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}
