import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  Calendar, 
  ChevronLeft, 
  ChefHat, 
  Clock, 
  Package, 
  Printer, 
  User,
  CheckCircle2,
  Play,
  Check,
  TrendingUp,
  LayoutDashboard
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProductionSummary = () => {
    const navigate = useNavigate();
    const getDefaultEndDate = (days) => {
        const date = new Date();
        date.setDate(date.getDate() + days);
        return date.toISOString().split('T')[0];
    };

    const [rangeHours, setRangeHours] = useState(6);
    const [rangeDays, setRangeDays] = useState(1);
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(getDefaultEndDate(1));
    const [startTime, setStartTime] = useState("00:00");
    const [endTime, setEndTime] = useState("23:59");
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState([]);
    const [categoryGroups, setCategoryGroups] = useState({});

    useEffect(() => {
        fetchOrders();
    }, [startDate, endDate, startTime, endTime]);

    const handleQuickHourFilter = (hours) => {
        const now = new Date();
        const startStr = now.toISOString().split('T')[0];
        const startTim = now.toTimeString().slice(0, 5);
        const future = new Date(now.getTime() + hours * 60 * 60 * 1000);
        const endStr = future.toISOString().split('T')[0];
        const endTim = future.toTimeString().slice(0, 5);
        setStartDate(startStr); setStartTime(startTim); setEndDate(endStr); setEndTime(endTim);
    };

    const handleQuickDayFilter = (days) => {
        const now = new Date();
        const startStr = now.toISOString().split('T')[0];
        const future = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
        const endStr = future.toISOString().split('T')[0];
        setStartDate(startStr); setStartTime("00:00"); setEndDate(endStr); setEndTime("23:59");
    };

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const filtered = response.data.filter(order => {
                const oDate = order.scheduleDate;
                const oTime = order.scheduleTime || "00:00";
                const isInDateRange = oDate >= startDate && oDate <= endDate;
                let isInTimeRange = true;
                if (oDate === startDate && oTime < startTime) isInTimeRange = false;
                if (oDate === endDate && oTime > endTime) isInTimeRange = false;
                return isInDateRange && isInTimeRange && ['Confirmed', 'Preparing'].includes(order.orderStatus);
            });

            setOrders(filtered);
            aggregateProduction(filtered);
        } catch (error) {
            toast.error("Failed to fetch production data");
        } finally {
            setLoading(false);
        }
    };

    const aggregateProduction = (activeOrders) => {
        const prodMap = {};
        const groups = {};
        
        activeOrders.forEach(order => {
            order.items.forEach(item => {
                const cat = item.category || 'General';
                const key = `${item.pName} (${cat}) [${item.unit || 'pcs'}]`;
                
                if (!prodMap[key]) {
                    prodMap[key] = { name: item.pName, category: cat, unit: item.unit || 'pcs', totalQuantity: 0, orders: [] };
                }
                prodMap[key].totalQuantity += item.quantity;
                prodMap[key].orders.push({
                    id: order._id, customer: order.customerName, quantity: item.quantity,
                    unit: item.unit || 'pcs', time: order.scheduleTime || 'Not set',
                    note: item.description || '', status: order.orderStatus
                });

                if (!groups[cat]) groups[cat] = [];
                if (!groups[cat].find(x => x.name === item.pName)) {
                    groups[cat].push({ name: item.pName, total: 0 });
                }
                groups[cat].find(x => x.name === item.pName).total += item.quantity;
            });
        });

        setSummary(Object.values(prodMap).sort((a, b) => b.totalQuantity - a.totalQuantity));
        setCategoryGroups(groups);
    };

    const handleBatchUpdate = async (fromStatus, toStatus, successMsg) => {
        const targetOrders = orders.filter(o => o.orderStatus === fromStatus);
        if (targetOrders.length === 0) return toast.error(`No orders in ${fromStatus} state.`);
        if (!window.confirm(`Transition ${targetOrders.length} orders to ${toStatus}?`)) return;
        try {
            const token = localStorage.getItem('token');
            await Promise.all(targetOrders.map(order => 
                axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${order._id}/status`, 
                    { orderStatus: toStatus }, { headers: { Authorization: `Bearer ${token}` } }
                )
            ));
            toast.success(successMsg); fetchOrders();
        } catch (error) { toast.error("Batch transition failed"); }
    };

    const stats = {
        totalItems: summary.reduce((sum, i) => sum + i.totalQuantity, 0),
        totalClients: new Set(orders.map(o => o.customerName)).size,
        prepWork: orders.filter(o => o.orderStatus === 'Preparing').length,
        pendingWork: orders.filter(o => o.orderStatus === 'Confirmed').length
    };

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20 overflow-x-hidden">
            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    @page { margin: 1cm; size: portrait; }
                    body { background: white !important; -webkit-print-color-adjust: exact; }
                    .print\\:hidden { display: none !important; }
                }
            `}} />

            {/* Header Area */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-slate-200 px-4 md:px-8 py-5 print:hidden">
                <div className="max-w-[1600px] mx-auto flex flex-col xl:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-6">
                        <button onClick={() => navigate('/orders')} className="w-12 h-12 flex items-center justify-center bg-slate-100 hover:bg-slate-900 hover:text-white rounded-2xl transition-all"><ChevronLeft size={20} /></button>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none flex items-center gap-3">
                                <ChefHat className="text-primary" size={28} /> Production <span className="text-primary italic">Summary</span>
                            </h1>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Core Operational Manifest</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-5">
                        {/* Time Windows */}
                        <div className="flex items-center gap-3 bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200">
                            <div className="flex items-center gap-2 px-3">
                                <Clock size={14} className="text-slate-400" />
                                <input type="number" value={rangeHours} onChange={(e) => setRangeHours(e.target.value)} className="w-8 bg-transparent font-black text-xs text-slate-900 outline-none" />
                                <span className="text-[9px] font-black text-slate-400 uppercase">Hrs</span>
                            </div>
                            <button onClick={() => handleQuickHourFilter(rangeHours)} className="bg-slate-900 text-gold px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-primary transition-all">Apply</button>
                        </div>

                        <div className="flex items-center gap-3 bg-emerald-50/50 p-1.5 rounded-2xl border border-emerald-100">
                            <div className="flex items-center gap-2 px-3">
                                <Calendar size={14} className="text-emerald-400" />
                                <input type="number" value={rangeDays} onChange={(e) => setRangeDays(e.target.value)} className="w-8 bg-transparent font-black text-xs text-emerald-700 outline-none" />
                                <span className="text-[9px] font-black text-emerald-400 uppercase">Days</span>
                            </div>
                            <button onClick={() => handleQuickDayFilter(rangeDays)} className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all">Apply</button>
                        </div>

                        {/* Batch Controls */}
                        <div className="flex items-center gap-3 border-l border-slate-200 pl-5">
                            <button onClick={() => handleBatchUpdate('Confirmed', 'Preparing', 'Batch production started')} className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-emerald-600/10 flex items-center gap-2"><Play size={14} /> Start</button>
                            <button onClick={() => handleBatchUpdate('Preparing', 'Ready', 'Batch marked as ready')} className="px-6 py-3 bg-slate-900 text-gold rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-lg flex items-center gap-2"><Check size={14} /> Finish</button>
                            <button onClick={() => window.print()} className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-slate-900 rounded-xl transition-all shadow-sm"><Printer size={20} /></button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto p-4 md:p-8 space-y-12">
                {/* Operations Pulse Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 print:hidden">
                    {[
                        { label: 'Bake List Magnitude', val: stats.totalItems, sub: 'Units in Pipeline', color: 'text-slate-900', icon: Package },
                        { label: 'Client Pipeline', val: stats.totalClients, sub: 'Unique Destinations', color: 'text-primary', icon: User },
                        { label: 'Active Preparation', val: stats.prepWork, sub: 'Live At Stations', color: 'text-emerald-600', icon: TrendingUp },
                        { label: 'Awaiting Initiation', val: stats.pendingWork, sub: 'Confirmed Registry', color: 'text-amber-500', icon: Clock }
                    ].map((s, i) => (
                        <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-200/60 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:scale-125 transition-transform duration-700"><s.icon size={56} /></div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">{s.label}</p>
                            <h3 className={`text-3xl font-black ${s.color} tracking-tighter`}>{s.val}</h3>
                            <p className="text-[8px] font-bold text-slate-400 uppercase mt-1 tracking-widest">{s.sub}</p>
                        </div>
                    ))}
                </div>

                {loading ? (
                    <div className="py-60 text-center">
                        <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-8 shadow-xl"></div>
                        <p className="font-black uppercase tracking-[0.5em] text-[11px] text-slate-400 animate-pulse">Synchronizing Fulfillment Data...</p>
                    </div>
                ) : summary.length === 0 ? (
                    <div className="py-40 bg-white rounded-[48px] border-2 border-dashed border-slate-200 text-center relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-[28px] flex items-center justify-center mx-auto mb-8 shadow-sm group-hover:scale-110 transition-transform"><LayoutDashboard size={40} className="text-slate-200" /></div>
                            <h3 className="text-slate-900 font-black uppercase tracking-[0.4em] text-xs">No Active Production</h3>
                            <p className="text-slate-400 text-[9px] mt-3 font-bold uppercase tracking-widest opacity-60 italic">Registry reports no items for this window.</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {/* Categorized Station Aggregates */}
                        <div className="bg-slate-900 rounded-[48px] p-10 md:p-14 text-white relative overflow-hidden shadow-2xl group">
                            <div className="absolute top-0 right-0 p-16 opacity-[0.02] group-hover:scale-110 transition-transform duration-1000"><ChefHat size={240} /></div>
                            
                            <div className="flex items-center gap-4 mb-14 relative z-10">
                                <div className="w-2 h-6 bg-gold rounded-full"></div>
                                <h3 className="text-[12px] font-black text-gold uppercase tracking-[0.5em]">Station Aggregate Manifesto</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 relative z-10">
                                {Object.keys(categoryGroups).map((cat, idx) => (
                                    <div key={idx} className="space-y-6">
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">{cat}</span>
                                            <div className="flex-1 h-[1px] bg-white/10"></div>
                                        </div>
                                        <div className="space-y-5">
                                            {categoryGroups[cat].map((item, iIdx) => (
                                                <div key={iIdx} className="flex justify-between items-end group/item cursor-default">
                                                    <p className="text-[11px] font-black text-white/60 uppercase tracking-tight group-hover/item:text-gold transition-colors">{item.name}</p>
                                                    <span className="text-2xl font-black tracking-tighter leading-none group-hover/item:scale-110 transition-transform">{item.total}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Fulfillment Matrix */}
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                            {summary.map((item, idx) => (
                                <div key={idx} className="bg-white rounded-[32px] border border-slate-200/60 shadow-sm hover:shadow-2xl transition-all duration-700 overflow-hidden group/card flex flex-col">
                                    <div className="p-8 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center group-hover/card:bg-white transition-all">
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 group-hover/card:text-primary transition-all shadow-sm"><Package size={24} /></div>
                                            <div>
                                                <h4 className="font-black text-slate-900 uppercase tracking-tight text-base">{item.name}</h4>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-2"><TrendingUp size={12} />{item.category}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-3xl font-black text-slate-900 tracking-tighter">{item.totalQuantity}</p>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{item.unit}</p>
                                        </div>
                                    </div>

                                    <div className="p-8 space-y-4 flex-1">
                                        {item.orders.map((ord, oIdx) => (
                                            <div key={oIdx} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-slate-100 group/row hover:bg-white hover:border-primary/20 transition-all duration-500">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-2.5 h-2.5 rounded-full ${ord.status === 'Preparing' ? 'bg-purple-500 animate-pulse shadow-[0_0_10px_rgba(168,85,247,0.4)]' : 'bg-primary shadow-[0_0_10px_rgba(212,175,55,0.3)]'}`}></div>
                                                    <div>
                                                        <div className="flex items-center gap-3">
                                                            <p className="text-[12px] font-black text-slate-900 uppercase">{ord.customer}</p>
                                                            <span className={`text-[8px] font-black px-2.5 py-1 rounded-full ${ord.status === 'Preparing' ? 'bg-purple-500 text-white' : 'bg-primary text-white'}`}>{ord.status}</span>
                                                        </div>
                                                        {ord.note && <p className="text-[10px] text-slate-500 font-bold italic mt-2 leading-relaxed opacity-70">"{ord.note}"</p>}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-8">
                                                    <div className="text-right">
                                                        <p className="text-[12px] font-black text-slate-900">{ord.quantity} <span className="text-[9px] text-slate-400 uppercase">{ord.unit}</span></p>
                                                        <div className="flex items-center justify-end gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5 opacity-60"><Clock size={12} className="text-primary" /> {ord.time}</div>
                                                    </div>
                                                    {ord.status !== 'Ready' && (
                                                        <button onClick={async () => {
                                                            try {
                                                                const token = localStorage.getItem('token');
                                                                await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${ord.id}/status`, { orderStatus: 'Ready' }, { headers: { Authorization: `Bearer ${token}` } });
                                                                toast.success("State synchronized"); fetchOrders();
                                                            } catch (error) { toast.error("Violation"); }
                                                        }} className="p-3 bg-white text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all border border-slate-100 md:opacity-0 group-hover/row:opacity-100 shadow-sm active:scale-90"><CheckCircle2 size={20} /></button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductionSummary;
