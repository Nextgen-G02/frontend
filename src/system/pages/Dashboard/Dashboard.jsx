import React from "react";
import { 
  Users, 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  Clock, 
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck
} from "lucide-react";
import { useAuth } from "../../../shared/context/AuthContext";

const StatCard = ({ icon: Icon, label, value, trend, trendType }) => (
  <div className="glass-card p-5 md:p-8 rounded-[24px] md:rounded-[36px] group transition-all duration-500 hover:shadow-xl">
    <div className="flex justify-between items-start mb-4 md:mb-6">
      <div className="p-2.5 md:p-3 rounded-lg md:rounded-xl bg-slate-900 text-gold group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-lg shadow-slate-100">
        <Icon size={20} md:size={24} />
      </div>
      <div className={`flex items-center gap-1.5 px-2.5 py-1 md:px-3 md:py-1 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest border ${
        trendType === 'up' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
      }`}>
        {trend} {trendType === 'up' ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
      </div>
    </div>
    <h3 className="text-slate-400 text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] mb-1.5 md:mb-2">{label}</h3>
    <p className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter">{value}</p>
  </div>
);

export default function AdminDashboard() {
  const { user } = useAuth();

  const activities = [
    { text: "Logistics: New order procurement #4429 initiated", time: "2 mins ago", type: "order" },
    { text: "Registry: Stock threshold alert for 'Chocolate Cake'", time: "15 mins ago", type: "stock" },
    { text: "Intelligence: Monthly performance report generated", time: "1 hour ago", type: "report" },
    { text: "Personnel: Saman authenticated and updated inventory", time: "3 hours ago", type: "staff" },
  ];

  return (
    <div className="space-y-10 max-w-[1500px] mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-10 h-1 bg-primary rounded-full"></span>
            <p className="text-primary font-black uppercase tracking-[0.4em] text-[9px]">Operations Intelligence</p>
          </div>
          <h1 className="heading-premium text-2xl md:text-5xl leading-tight">
            Welcome back, <span className="italic font-medium text-slate-400">{user?.firstName}</span>
          </h1>
          <p className="text-slate-400 font-medium mt-2 md:mt-3 text-sm md:text-base tracking-tight max-w-2xl">Monitor your ecosystem's real-time performance and metrics.</p>
        </div>

        <div className="flex items-center gap-2.5 md:gap-3 bg-slate-50 p-1.5 md:p-2 rounded-xl border border-slate-100">
          <div className="p-1.5 md:p-2 bg-white rounded-lg shadow-sm">
            <TrendingUp className="text-primary" size={18} md:size={20} />
          </div>
          <div className="pr-3 md:pr-4">
            <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Global Growth</p>
            <p className="text-[11px] md:text-xs font-bold text-slate-900 mt-0.5">+14.2% Growth</p>
          </div>
        </div>
      </header>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard 
          icon={Package} 
          label="Registry Assets" 
          value="128" 
          trend="+12% today" 
          trendType="up" 
        />
        <StatCard 
          icon={ShoppingBag} 
          label="Active Transmissions" 
          value="42" 
          trend="+5% weeky" 
          trendType="up" 
        />
        <StatCard 
          icon={Users} 
          label="Customer Base" 
          value="1.2k" 
          trend="+8% monthly" 
          trendType="up" 
        />
        <StatCard 
          icon={TrendingUp} 
          label="Gross Yield" 
          value="Rs.84k" 
          trend="-2% vs yesterday" 
          trendType="down" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Activity Feed */}
        <div className="lg:col-span-8 glass-card p-5 md:p-8 rounded-[24px] md:rounded-[40px] bg-white/70 backdrop-blur-xl border-none shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 md:mb-10">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Transmission Feed</h2>
              <p className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-0.5 italic">Real-time Event Synchronization</p>
            </div>
            <button className="px-5 py-2.5 rounded-lg bg-slate-50 text-[9px] font-black text-slate-900 uppercase tracking-widest hover:bg-slate-100 transition-colors border border-slate-100 font-mono">
              View History
            </button>
          </div>

          <div className="space-y-6 md:space-y-8">
            {activities.map((act, idx) => (
              <div key={idx} className="flex gap-3 md:gap-6 items-start group">
                <div className="mt-1.5 w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-slate-100 border-2 md:border-[3px] border-primary group-hover:scale-125 transition-all shadow-inner shrink-0"></div>
                <div className="flex-1 pb-4 md:pb-6 border-b border-slate-50 last:border-0">
                  <p className="text-slate-900 font-black text-sm md:text-base leading-snug group-hover:text-primary transition-colors uppercase tracking-tight">{act.text}</p>
                  <div className="flex items-center gap-2 md:gap-2.5 mt-2 text-slate-400">
                    <Clock size={10} md:size={12} className="text-primary/50" />
                    <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em]">{act.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions / Performance */}
        <div className="lg:col-span-4 space-y-6 md:space-y-8">
          <div className="glass-card p-6 md:p-10 rounded-[28px] md:rounded-[40px] border-none shadow-xl bg-slate-900 relative overflow-hidden group">
            <div className="absolute bottom-0 right-0 w-32 md:w-48 h-32 md:h-48 bg-primary rounded-full blur-[60px] md:blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
            
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight mb-6 md:mb-8 relative z-10 flex items-center justify-between">
              Core Health
              <ShieldCheck className="text-gold" size={20} md:size={24} />
            </h2>
            
            <div className="space-y-8 relative z-10">
              <div className="space-y-3">
                <div className="flex justify-between text-[9px] font-black uppercase tracking-[0.2em]">
                  <span className="text-slate-500">Registry Integrity</span>
                  <span className="text-emerald-400">Optimal</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 w-[94%] shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-[9px] font-black uppercase tracking-[0.2em]">
                  <span className="text-slate-500">Inventory Capacity</span>
                  <span className="text-gold">82% Load</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gold w-[82%] shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>
                </div>
              </div>

              <button className="w-full mt-4 py-4.5 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl shadow-primary/20 hover:bg-white hover:text-primary transition-all duration-500 flex items-center justify-center gap-3">
                <ArrowUpRight size={16} />
                Diagnostics
              </button>
            </div>
          </div>

          <div className="p-0.5 w-full bg-gradient-to-r from-primary via-gold to-primary rounded-[20px]">
             <div className="bg-white rounded-[19px] p-5 text-center">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Internal Memo</p>
                <p className="font-serif italic text-slate-900 text-base">"Excellence is not an act, but a habit."</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
