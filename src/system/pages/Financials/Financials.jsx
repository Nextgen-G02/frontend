import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar, 
  ArrowUpRight,
  PieChart,
  Target,
  Loader2,
  ArrowRight,
  Download,
  ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminFinancials() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [dailyData, setDailyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchAllData();
  }, [dates]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const [summaryRes, dailyRes, monthlyRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/financial/summary`, { 
          params: dates, 
          ...config 
        }),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/financial/daily-revenue`, { 
          params: dates, 
          ...config 
        }),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/financial/monthly-revenue`, { 
          params: { year: new Date(dates.endDate).getFullYear() }, 
          ...config 
        })
      ]);

      setSummary(summaryRes.data.data);
      setDailyData(dailyRes.data.data);
      setMonthlyData(monthlyRes.data.data);
    } catch (error) {
      toast.error("Data synchronization protocols failed");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    try {
      if (!dailyData.length) {
        toast.error("No data available for export");
        return;
      }

      const headers = ["Date", "Orders", "Revenue (Rs.)"];
      const rows = dailyData.map(day => [day._id, day.orders, day.revenue]);
      
      const csvContent = "data:text/csv;charset=utf-8," + 
        [headers, ...rows].map(e => e.join(",")).join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `Financial_Report_${dates.startDate}_to_${dates.endDate}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Financial ledger exported successfully");
    } catch (error) {
      toast.error("Export operation failed");
    }
  };

  // Custom Chart Component
  const SimpleBarChart = ({ data, colorClass = "bg-primary" }) => {
    const maxValue = useMemo(() => {
      const vals = data.map(d => Number(d.revenue));
      const max = Math.max(...vals, 1);
      return isNaN(max) ? 1 : max;
    }, [data]);
    
    return (
      <div className="flex items-end gap-1 h-48 w-full px-2 border-b border-slate-100">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-end group relative h-full justify-end">
            <div 
              className={`w-full rounded-t-sm transition-all duration-1000 ease-out ${colorClass} opacity-80 group-hover:opacity-100 group-hover:scale-x-105 shadow-sm`}
              style={{ height: `${(Number(d.revenue) / maxValue) * 100}%`, minHeight: Number(d.revenue) > 0 ? '2px' : '0' }}
            >
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-900 text-white text-[9px] py-1.5 px-2.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap z-50 shadow-2xl border border-white/10 font-bold">
                Rs.{Number(d.revenue).toLocaleString()}
              </div>
            </div>
            <span className="text-[7px] text-slate-400 mt-2 font-bold uppercase rotate-45 origin-left whitespace-nowrap">{d._id.split('-').pop()}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-10 max-w-[1500px] mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-10 h-1 bg-primary rounded-full"></span>
            <p className="text-primary font-black uppercase tracking-[0.4em] text-[8px] md:text-[9px]">Performance Ledger infrastructure</p>
          </div>
          <h1 className="heading-premium text-2xl md:text-5xl leading-tight">
             Financial <span className="italic font-medium text-slate-400">Intelligence</span>
          </h1>
          <p className="text-slate-400 font-medium mt-2 md:mt-3 text-sm md:text-base">Comprehensive analysis of revenue streams and operational burn rates.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3.5 bg-slate-50 p-1.5 rounded-2xl border border-slate-100 shadow-xl shadow-slate-100/50 relative z-10">
            <div className="flex items-center gap-3.5 px-5 py-1.5">
              <Calendar size={16} md:size={18} className="text-primary" />
              <div className="flex flex-col">
                 <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Period Start</span>
                 <input 
                   type="date" 
                   value={dates.startDate}
                   onChange={(e) => setDates({...dates, startDate: e.target.value})}
                   className="border-none bg-transparent outline-none text-[11px] font-black uppercase text-slate-900 tracking-tight cursor-pointer mt-0.5"
                 />
              </div>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div className="flex items-center gap-3.5 px-5 py-1.5">
              <div className="flex flex-col">
                 <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Period End</span>
                 <input 
                   type="date" 
                   value={dates.endDate}
                   onChange={(e) => setDates({...dates, endDate: e.target.value})}
                   className="border-none bg-transparent outline-none text-[11px] font-black uppercase text-slate-900 tracking-tight cursor-pointer mt-0.5"
                 />
              </div>
            </div>
          </div>
          <button 
            onClick={handleExport}
            className="p-4 bg-slate-900 text-white rounded-2xl shadow-xl hover:bg-primary transition-all group"
          >
            <Download size={20} className="group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="h-96 flex flex-col items-center justify-center gap-6">
          <Loader2 className="animate-spin text-primary" size={56} />
          <p className="font-black uppercase tracking-[0.4em] text-[10px] text-slate-400 italic">Processing Ledger Data Protocols...</p>
        </div>
      ) : summary ? (
        <div className="space-y-10 animate-in fade-in duration-1000">
          {/* Top Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="glass-card p-8 rounded-[32px] bg-white border border-slate-100 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-150 transition-transform duration-1000" />
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="bg-slate-900 text-emerald-400 p-3 rounded-[18px] shadow-2xl"><TrendingUp size={20} /></div>
                <div>
                   <h3 className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em] leading-none">Gross Yield</h3>
                </div>
              </div>
              <div className="flex flex-col relative z-10">
                <span className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">Rs.{(summary?.grossYield || 0).toLocaleString()}</span>
                <span className="mt-3 text-[8px] font-black text-slate-400 uppercase tracking-[0.3em] bg-slate-50 py-1 px-3 rounded-full w-fit">{(summary?.orderCount || 0)} Transactions</span>
              </div>
            </div>

            <div className="glass-card p-8 rounded-[32px] bg-white border border-slate-100 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-150 transition-transform duration-1000" />
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="bg-slate-900 text-rose-400 p-3 rounded-[18px] shadow-2xl"><TrendingDown size={20} /></div>
                <div>
                   <h3 className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em] leading-none">Ops Burn</h3>
                </div>
              </div>
              <div className="flex flex-col relative z-10">
                <span className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">Rs.{(summary?.opsBurn || 0).toLocaleString()}</span>
                <span className="mt-3 text-[8px] font-black text-slate-400 uppercase tracking-[0.3em] bg-slate-50 py-1 px-3 rounded-full w-fit">Procurement</span>
              </div>
            </div>

            <div className="glass-card p-8 rounded-[32px] bg-white border border-slate-100 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-150 transition-transform duration-1000" />
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="bg-slate-900 text-indigo-400 p-3 rounded-[18px] shadow-2xl"><DollarSign size={20} /></div>
                <div>
                   <h3 className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em] leading-none">Manual Costs</h3>
                </div>
              </div>
              <div className="flex flex-col relative z-10">
                <span className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">Rs.{(summary?.totalManualExpenses || 0).toLocaleString()}</span>
                <span className="mt-3 text-[8px] font-black text-slate-400 uppercase tracking-[0.3em] bg-slate-50 py-1 px-3 rounded-full w-fit">Operational Costs</span>
              </div>
            </div>

            <div className="glass-card p-8 rounded-[32px] bg-slate-900 text-white border-none shadow-2xl relative overflow-hidden group">
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-primary rounded-full blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity" />
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="bg-white/10 text-gold p-3 rounded-[18px] backdrop-blur-xl border border-white/5"><DollarSign size={20} /></div>
                <div>
                   <h3 className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] leading-none">Net Retained</h3>
                </div>
              </div>
              <div className="flex flex-col relative z-10">
                <span className="text-2xl md:text-3xl font-black tracking-tighter text-white">Rs.{(summary?.netRetained || 0).toLocaleString()}</span>
                <span className={`mt-3 text-[9px] font-black uppercase tracking-[0.3em] flex items-center gap-2 ${(summary?.netRetained || 0) >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${(summary?.netRetained || 0) >= 0 ? "bg-emerald-400" : "bg-rose-400"} shadow-[0_0_8px]`} />
                  {(summary?.netRetained || 0) >= 0 ? "Profit" : "Loss"}
                </span>
              </div>
            </div>
          </div>

          {/* Expense Breakdown */}
          {summary?.expenseBreakdown && (
            <div className="glass-card p-10 rounded-[48px] bg-white border border-slate-100 shadow-xl">
               <div className="flex items-center gap-4 mb-10">
                 <div className="p-4 bg-slate-50 text-slate-900 rounded-2xl"><PieChart size={24} /></div>
                 <div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Expense <span className="text-slate-400 italic">Breakdown</span></h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Operational cost distribution</p>
                 </div>
               </div>
               <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                 {Object.entries(summary.expenseBreakdown).map(([category, amount]) => (
                   <div key={category} className="p-6 bg-slate-50 rounded-3xl border border-slate-100/50 hover:bg-slate-900 hover:text-white transition-all group">
                     <p className="text-[9px] font-black text-slate-400 group-hover:text-white/50 uppercase tracking-[0.3em] mb-3">{category}</p>
                     <p className="text-xl font-black tracking-tighter">Rs.{amount.toLocaleString()}</p>
                   </div>
                 ))}
               </div>
            </div>
          )}

          {/* Charts Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
             <div className="glass-card p-8 md:p-10 rounded-[32px] md:rounded-[48px] bg-white border border-slate-100 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-50 text-primary rounded-xl border border-slate-100"><BarChart3 size={20} /></div>
                    <div>
                      <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Daily Trajectory</h2>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Revenue Velocity (30 Days)</p>
                    </div>
                  </div>
                  <TrendingUp size={20} className="text-emerald-500" />
                </div>
                {dailyData.length > 0 ? (
                  <SimpleBarChart data={dailyData} colorClass="bg-slate-900" />
                ) : (
                  <div className="h-48 flex items-center justify-center text-slate-400 text-[10px] font-black uppercase tracking-widest bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    No spectral data available for this range
                  </div>
                )}
             </div>

             <div className="glass-card p-8 md:p-10 rounded-[32px] md:rounded-[48px] bg-white border border-slate-100 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-50 text-indigo-500 rounded-xl border border-slate-100"><TrendingUp size={20} /></div>
                    <div>
                      <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Monthly Scale</h2>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Yearly Yield Aggregation</p>
                    </div>
                  </div>
                  <PieChart size={20} className="text-indigo-400" />
                </div>
                {monthlyData.length > 0 ? (
                  <SimpleBarChart data={monthlyData} colorClass="bg-indigo-600" />
                ) : (
                  <div className="h-48 flex items-center justify-center text-slate-400 text-[10px] font-black uppercase tracking-widest bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    Awaiting yearly transmission synchronization
                  </div>
                )}
             </div>
          </div>

          {/* Deep Insights */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 md:gap-10">
            <div className="glass-card p-8 md:p-10 rounded-[32px] md:rounded-[48px] bg-white border border-slate-100 shadow-xl relative group overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3.5 bg-slate-50 text-primary rounded-xl border border-slate-100 shadow-sm"><PieChart size={20} md:size={24} /></div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">Revenue Dynamics</h2>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">Flow Analysis</p>
                  </div>
                </div>
                <ArrowRight size={20} md:size={24} className="text-slate-200 group-hover:text-primary transition-colors hover:translate-x-1" />
              </div>
              <div className="space-y-6 relative z-10">
                <div className="p-6 md:p-7 bg-slate-50 rounded-[24px] md:rounded-[32px] border border-slate-100/50">
                  <p className="text-[9px] font-black text-slate-900 uppercase tracking-[0.3em] mb-3">Transmission Synchronization</p>
                  <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-medium italic">"Revenue streams are aggregated across automated POS terminals and individual order settlements. Current liquidity indicates optimal operational velocity."</p>
                </div>
                <button 
                  onClick={handleExport}
                  className="w-full py-4.5 md:py-5 bg-slate-900 text-white rounded-xl md:rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] shadow-xl hover:bg-primary transition-all duration-500 flex items-center justify-center gap-2.5"
                >
                  Export P&L Data
                  <ArrowUpRight size={16} />
                </button>
              </div>
            </div>

            <div className="glass-card p-8 md:p-10 rounded-[32px] md:rounded-[48px] bg-white border border-slate-100 shadow-xl relative group overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3.5 bg-slate-50 text-primary rounded-xl border border-slate-100 shadow-sm"><Target size={20} md:size={24} /></div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">Expansion Goals</h2>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">Success Metrics</p>
                  </div>
                </div>
                <TrendingUp size={20} md:size={24} className="text-emerald-500" />
              </div>
              <div className="space-y-6">
                <div className="p-6 md:p-7 bg-slate-50 rounded-[24px] md:rounded-[32px] border border-slate-100/50">
                  <p className="text-[9px] font-black text-primary uppercase tracking-[0.3em] mb-3">Efficiency Variance</p>
                  <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-medium italic">"Registry optimization indicates 94.2% operational efficiency. Targeting a 3% reduction in procurement overhead to bolster quarterly yield."</p>
                </div>
                <div className="space-y-3">
                    <div className="flex justify-between text-[9px] font-black uppercase tracking-[0.3em]">
                       <span className="text-slate-400">Quarterly Target</span>
                       <span className="text-primary">85% Complete</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                       <div className="w-[85%] h-full bg-primary shadow-[0_0_12px_rgba(127,29,29,0.5)] transition-all duration-1000" />
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}