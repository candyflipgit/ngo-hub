'use client';
import { Check, Star, Zap } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
  const tiers = [
    {
      name: 'Basic',
      price: 'Free',
      description: 'Perfect for small local NGOs starting their digital journey.',
      features: ['Up to 5 active events', 'Basic volunteer management', 'Standard support', 'Community feed access'],
      icon: <Star className="w-5 h-5" />,
      popular: false
    },
    {
      name: 'Professional',
      price: '₹2,999/mo',
      description: 'Advanced tools for growing organizations seeking scale.',
      features: ['Unlimited events', 'Advanced analytics dashboard', 'Priority 24/7 support', 'Custom certificate branding', 'Collaboration hub matching'],
      icon: <Zap className="w-5 h-5 text-orange-500" />,
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'Dedicated infrastructure for nationwide entities and CSRs.',
      features: ['Dedicated account manager', 'API access & integrations', 'Custom legal workflow builder', 'White-labeled volunteer portal', 'SLA guarantees'],
      icon: <Star className="w-5 h-5 text-indigo-500" />,
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="fixed w-full top-0 left-0 glass z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-indigo-600 tracking-tight">NGO Hub</Link>
          <div className="flex space-x-6 text-sm font-semibold text-slate-500">
             <Link href="/ngos" className="hover:text-teal-600 transition-colors">Discover</Link>
             <Link href="/dashboard" className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors shadow-sm">Dashboard</Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto pt-32 pb-24 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto mb-16">
           <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-6">Scale Your Impact, Not Your Costs</h1>
           <p className="text-xl text-slate-500 font-medium leading-relaxed">Choose the perfect tier that aligns with your organization's mission and technical requirements. No hidden fees, ever.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {tiers.map((t, index) => (
             <div key={index} className={`bg-white rounded-[2.5rem] p-10 flex flex-col items-start text-left border-2 ${t.popular ? 'border-orange-400 shadow-xl shadow-orange-500/10 scale-105 z-10' : 'border-slate-100 shadow-sm'} transition-transform relative`}>
               {t.popular && <div className="absolute top-0 right-10 -translate-y-1/2 bg-orange-500 text-white text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md">Most Popular</div>}
               
               <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border-2 ${t.popular ? 'border-orange-100 bg-orange-50 text-orange-600' : 'border-slate-100 bg-slate-50 text-slate-400'}`}>
                  {t.icon}
               </div>

               <h3 className="text-2xl font-black text-slate-900 mb-2">{t.name}</h3>
               <p className="text-slate-500 font-medium h-12 mb-6 leading-snug">{t.description}</p>
               
               <div className="flex items-end mb-8">
                  <span className="text-4xl font-extrabold text-slate-900 tracking-tight">{t.price}</span>
                  {t.price !== 'Free' && t.price !== 'Custom' && <span className="text-slate-400 font-semibold mb-1 ml-1">&nbsp;billing</span>}
               </div>

               <button className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all mb-8 shadow-md border ${t.popular ? 'bg-orange-500 text-white hover:bg-orange-600 border-orange-600 hover:-translate-y-0.5' : 'bg-slate-50 text-slate-900 hover:bg-slate-100 border-slate-200'}`}>
                 {t.price === 'Custom' ? 'Contact Sales' : 'Get Started'}
               </button>

               <ul className="space-y-4 w-full">
                 {t.features.map((f, i) => (
                    <li key={i} className="flex items-start">
                       <Check className="w-5 h-5 text-emerald-500 mr-3 shrink-0" />
                       <span className="text-slate-600 font-semibold text-sm">{f}</span>
                    </li>
                 ))}
               </ul>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
