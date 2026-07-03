import React, { useState, useEffect } from "react";
import { 
  Users, 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  Clock, 
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Loader2
} from "lucide-react";
import { useAuth } from "../../../shared/context/AuthContext";
import toast from "react-hot-toast";

const StatCard = ({ icon: Icon, label, value, trend, trendType, isLoading }) => (
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
    {isLoading ? (
      <div className="h-10 w-24 bg-slate-100 animate-pulse rounded-lg"></div>
    ) : (
      <p className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter">{value}</p>
    )}
  </div>
);

export default function AdminDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    stats: {
      registryAssets: 120,
      activeTransmissions: 15,
      customerBase: 350,
      grossYield: 150000
    },
    activities: [
      { text: "System Boot Initialized", time: "08:00 AM" },
      { text: "Inventory Sync Completed", time: "08:15 AM" }
    ],
    health: {
      integrity: 95,
      capacity: 65
    }
  });

  return (
    <div className="space-y-10 max-w-[1500px] mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-10 h-1 bg-primary rounded-full"></span>
            <p className="text-primary font-black uppercase tracking-[0.4em] text-[9px]">Dashboard Overview</p>
          </div>
          <h1 className="heading-premium text-2xl md:text-5xl leading-tight">
            Welcome back, <span className="italic font-medium text-slate-400">{user?.firstName}</span>
          </h1>
          <p className="text-slate-400 font-medium mt-2 md:mt-3 text-sm md:text-base tracking-tight max-w-2xl">Check your shop's performance and recent activity at a glance.</p>
        </div>
      </header>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard 
          icon={Package} 
          label="Total Products" 
          value={data.stats.registryAssets} 
          trend="+12% today" 
          trendType="up" 
          isLoading={loading}
        />
        <StatCard 
          icon={ShoppingBag} 
          label="Live Orders" 
          value={data.stats.activeTransmissions} 
          trend="+5% weeky" 
          trendType="up" 
          isLoading={loading}
        />
        <StatCard 
          icon={Users} 
          label="Total Customers" 
          value={data.stats.customerBase >= 1000 ? `${(data.stats.customerBase / 1000).toFixed(1)}k` : data.stats.customerBase} 
          trend="+8% monthly" 
          trendType="up" 
          isLoading={loading}
        />
        <StatCard 
          icon={TrendingUp} 
          label="Total Revenue" 
          value={`Rs.${data.stats.grossYield >= 1000 ? `${(data.stats.grossYield / 1000).toFixed(1)}k` : data.stats.grossYield}`} 
          trend="-2% vs yesterday" 
          trendType="down" 
          isLoading={loading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Activity Feed */}
        <div className="lg:col-span-8 glass-card p-5 md:p-8 rounded-[24px] md:rounded-[40px] bg-white/70 backdrop-blur-xl border-none shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 md:mb-10">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Recent Activity</h2>
              <p className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-0.5 italic">Latest updates from the shop</p>
            </div>
            <button className="px-5 py-2.5 rounded-lg bg-slate-50 text-[9px] font-black text-slate-900 uppercase tracking-widest hover:bg-slate-100 transition-colors border border-slate-100 font-mono">
              View History
            </button>
          </div>

          <div className="space-y-6 md:space-y-8">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-primary" size={32} />
              </div>
            ) : data.activities.map((act, idx) => (
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
              Shop Status
              <ShieldCheck className="text-gold" size={20} md:size={24} />
            </h2>
            
            <div className="space-y-8 relative z-10">
              <div className="space-y-3">
                <div className="flex justify-between text-[9px] font-black uppercase tracking-[0.2em]">
                  <span className="text-slate-500">Stock Integrity</span>
                  <span className={data.health.integrity > 80 ? "text-emerald-400" : "text-amber-400"}>
                    {data.health.integrity > 90 ? "Optimal" : data.health.integrity > 70 ? "Stable" : "Warning"}
                  </span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${data.health.integrity > 80 ? 'bg-emerald-400' : 'bg-amber-400'}`} 
                    style={{ width: `${data.health.integrity}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-[9px] font-black uppercase tracking-[0.2em]">
                  <span className="text-slate-500">Inventory Capacity</span>
                  <span className="text-gold">{data.health.capacity}% Load</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gold transition-all duration-1000" 
                    style={{ width: `${data.health.capacity}%` }}
                  ></div>
                </div>
              </div>

              <button className="w-full mt-4 py-4.5 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl shadow-primary/20 hover:bg-white hover:text-primary transition-all duration-500 flex items-center justify-center gap-3">
                <ArrowUpRight size={16} />
                Check System
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
