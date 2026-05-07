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
  Filter,
  CheckCircle2,
  AlertCircle,
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
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(getDefaultEndDate(1));
    const [startTime, setStartTime] = useState("00:00");
    const [endTime, setEndTime] = useState("23:59");
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState([]);

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
        
        setStartDate(startStr);
        setStartTime(startTim);
        setEndDate(endStr);
        setEndTime(endTim);
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

                const isActionable = ['Confirmed', 'Preparing'].includes(order.orderStatus);
                return isInDateRange && isInTimeRange && isActionable;
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
        activeOrders.forEach(order => {
            order.items.forEach(item => {
                const key = `${item.pName} (${item.category}) [${item.unit || 'pcs'}]`;
                if (!prodMap[key]) {
                    prodMap[key] = {
                        name: item.pName,
                        category: item.category,
                        unit: item.unit || 'pcs',
                        totalQuantity: 0,
                        orders: []
                    };
                }
                prodMap[key].totalQuantity += item.quantity;
                prodMap[key].orders.push({
                    id: order._id,
                    customer: order.customerName,
                    quantity: item.quantity,
                    unit: item.unit || 'pcs',
                    time: order.scheduleTime || 'Not set',
                    note: item.description || '',
                    status: order.orderStatus
                });
            });
        });

        const sortedArray = Object.values(prodMap).sort((a, b) => b.totalQuantity - a.totalQuantity);
        setSummary(sortedArray);
    };

    const handlePrint = () => window.print();
    
    const handleBatchUpdate = async (fromStatus, toStatus, successMsg) => {
        const targetOrders = orders.filter(o => o.orderStatus === fromStatus);
        if (targetOrders.length === 0) return toast.error(`No orders in ${fromStatus} state.`);
        
        if (!window.confirm(`Transition ${targetOrders.length} orders to ${toStatus}?`)) return;

        try {
            const token = localStorage.getItem('token');
            await Promise.all(targetOrders.map(order => 
                axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${order._id}/status`, 
                    { orderStatus: toStatus }, 
                    { headers: { Authorization: `Bearer ${token}` } }
                )
            ));
            toast.success(successMsg);
            fetchOrders();
        } catch (error) {
            toast.error("Batch state transition failed");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/30 p-4 md:p-8 space-y-8">
            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    @page { margin: 1cm; size: portrait; }
                    body { background: white !important; -webkit-print-color-adjust: exact; }
                    .print\\:hidden { display: none !important; }
                    .bg-white { border: 1px solid #e2e8f0 !important; box-shadow: none !important; }
                    .bg-slate-900 { background: #0f172a !important; color: white !important; }
                }
            `}} />

            <div className="max-w-[1400px] mx-auto space-y-8">
                {/* Modern Control Header */}
                <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 print:hidden">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => navigate('/orders')}
                            className="p-2.5 bg-white border border-slate-200 rounded-xl hover:border-primary hover:text-primary transition-all shadow-sm"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                                Production <span className="text-slate-400 italic font-medium">Sheet</span>
                            </h1>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-3 flex items-center gap-2">
                                <ChefHat size={12} className="text-primary" /> 
                                Operational Fulfillment Manifest
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                        {/* Quick Hour Filter */}
                        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl p-1.5 shadow-sm">
                            <div className="flex items-center gap-2 px-3">
                                <Clock size={14} className="text-slate-400" />
                                <input 
                                    type="number" value={rangeHours} onChange={(e) => setRangeHours(parseInt(e.target.value) || 0)}
                                    className="w-10 text-center font-black text-xs text-primary bg-transparent outline-none"
                                />
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Hrs</span>
                            </div>
                            <button 
                                onClick={() => handleQuickHourFilter(rangeHours)}
                                className="bg-slate-900 text-gold px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
                            >
                                Apply
                            </button>
                        </div>

                        {/* Date/Time Picker */}
                        <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-2 shadow-sm">
                            <div className="flex items-center gap-2 border-r border-slate-100 pr-3">
                                <Calendar size={14} className="text-slate-300" />
                                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-transparent text-[10px] font-black uppercase outline-none w-24" />
                                <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="bg-transparent text-[10px] font-black text-primary outline-none w-14" />
                            </div>
                            <div className="flex items-center gap-2 pl-1">
                                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-transparent text-[10px] font-black uppercase outline-none w-24" />
                                <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="bg-transparent text-[10px] font-black text-primary outline-none w-14" />
                            </div>
                        </div>

                        <div className="flex gap-2 w-full md:w-auto">
                            <button 
                                onClick={() => handleBatchUpdate('Confirmed', 'Preparing', 'Batch production started')}
                                className="flex-1 md:flex-none px-6 py-3 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10"
                            >
                                <Play size={14} /> Start Batch
                            </button>
                            <button 
                                onClick={() => handleBatchUpdate('Preparing', 'Ready', 'Batch marked as ready')}
                                className="flex-1 md:flex-none px-6 py-3 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                            >
                                <Check size={14} /> Finish Batch
                            </button>
                            <button 
                                onClick={handlePrint}
                                className="p-3 bg-slate-900 text-gold rounded-2xl hover:bg-primary hover:text-white transition-all shadow-xl"
                            >
                                <Printer size={18} />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Print Branding */}
                <div className="hidden print:block text-center border-b-2 border-slate-900 pb-8 mb-8">
                    <h1 className="text-4xl font-black tracking-tighter uppercase">Operations Production Sheet</h1>
                    <p className="text-sm font-bold mt-2 uppercase tracking-[0.4em]">Scheduled Fulfillment Manifest</p>
                    <div className="mt-4 flex justify-center gap-8 text-xs font-black uppercase">
                        <span>Range Start: {startDate} {startTime}</span>
                        <span>Range End: {endDate} {endTime}</span>
                    </div>
                </div>

                {loading ? (
                    <div className="py-40 text-center">
                        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-6"></div>
                        <p className="font-black uppercase tracking-[0.4em] text-[10px] text-slate-400">Aggregating Fulfillment Data...</p>
                    </div>
                ) : summary.length === 0 ? (
                    <div className="py-40 bg-white rounded-[32px] border border-dashed border-slate-200 text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-[24px] flex items-center justify-center mx-auto mb-6">
                            <LayoutDashboard size={40} className="text-slate-100" />
                        </div>
                        <h3 className="text-slate-900 font-black uppercase tracking-widest text-xs">No Active Production</h3>
                        <p className="text-slate-400 text-[10px] mt-2 font-bold uppercase tracking-widest">Registry reports no items for this window.</p>
                    </div>
                ) : (
                    <div className="space-y-10">
                        {/* Preparation Aggregate Card */}
                        <div className="bg-slate-900 rounded-[32px] p-8 md:p-10 text-white relative overflow-hidden shadow-2xl shadow-slate-900/20">
                            <div className="absolute top-0 right-0 p-12 opacity-[0.03]">
                                <ChefHat size={160} />
                            </div>
                            
                            <div className="flex items-center gap-3 mb-10 relative z-10">
                                <TrendingUp size={18} className="text-gold" />
                                <h3 className="text-[10px] font-black text-gold uppercase tracking-[0.4em]">Baking & Prep Aggregate</h3>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-y-10 gap-x-8 relative z-10">
                                {summary.map((item, idx) => (
                                    <div key={idx} className="space-y-1.5 border-l-2 border-white/10 pl-5 hover:border-gold transition-colors group">
                                        <div className="flex items-baseline gap-1.5">
                                            <span className="text-3xl font-black tracking-tighter group-hover:text-gold transition-colors">{item.totalQuantity}</span>
                                            <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">{item.unit}</span>
                                        </div>
                                        <p className="text-[9px] font-black text-white/50 uppercase tracking-widest leading-relaxed line-clamp-2">{item.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Detailed Fulfillment Matrix */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 ml-2">
                                <div className="w-1.5 h-4 bg-primary rounded-full"></div>
                                <h3 className="text-slate-900 font-black uppercase tracking-[0.3em] text-[10px]">Fulfillment Matrix</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {summary.map((item, idx) => (
                                    <div key={idx} className="bg-white rounded-[24px] border border-slate-200/60 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-500 overflow-hidden group/card">
                                        <div className="p-6 md:p-8 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center group-hover/card:bg-white transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover/card:text-primary transition-all">
                                                    <Package size={22} />
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-slate-900 uppercase tracking-tight text-sm">{item.name}</h4>
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{item.category}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-black text-slate-900 tracking-tighter">{item.totalQuantity}</p>
                                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{item.unit}</p>
                                            </div>
                                        </div>

                                        <div className="p-6 md:p-8 space-y-3">
                                            {item.orders.map((ord, oIdx) => (
                                                <div key={oIdx} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 group/row hover:bg-white hover:border-primary/20 transition-all">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-2 h-2 rounded-full ${ord.status === 'Preparing' ? 'bg-purple-500 animate-pulse' : 'bg-primary'}`}></div>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <p className="text-xs font-black text-slate-900 uppercase">{ord.customer}</p>
                                                                <span className={`text-[7px] font-black px-2 py-0.5 rounded-full ${
                                                                    ord.status === 'Preparing' ? 'bg-purple-500 text-white' : 'bg-primary text-white'
                                                                }`}>
                                                                    {ord.status.toUpperCase()}
                                                                </span>
                                                            </div>
                                                            {ord.note && <p className="text-[10px] text-slate-500 font-medium italic mt-1 leading-relaxed">"{ord.note}"</p>}
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-6">
                                                        <div className="text-right">
                                                            <p className="text-[11px] font-black text-slate-900">Qty: {ord.quantity} <span className="text-[8px] text-slate-400">{ord.unit}</span></p>
                                                            <div className="flex items-center justify-end gap-1.5 text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">
                                                                <Clock size={10} className="text-primary" /> {ord.time}
                                                            </div>
                                                        </div>
                                                        
                                                        {ord.status !== 'Ready' && (
                                                            <button 
                                                                onClick={async () => {
                                                                    try {
                                                                        const token = localStorage.getItem('token');
                                                                        await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${ord.id}/status`, 
                                                                            { orderStatus: 'Ready' }, 
                                                                            { headers: { Authorization: `Bearer ${token}` } }
                                                                        );
                                                                        toast.success("Ready state synchronized");
                                                                        fetchOrders();
                                                                    } catch (error) {
                                                                        toast.error("Protocol violation");
                                                                    }
                                                                }}
                                                                className="p-2.5 bg-white text-slate-300 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all border border-slate-100 md:opacity-0 group-hover/row:opacity-100"
                                                                title="Mark as Ready"
                                                            >
                                                                <CheckCircle2 size={16} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Print Ledger Footer */}
                <footer className="hidden print:flex justify-between mt-12 pt-8 border-t border-slate-900 font-black text-[10px] uppercase tracking-widest">
                    <p>Generated Transmission: {new Date().toLocaleString()}</p>
                    <p>Nirosha Sweets Operations Core</p>
                </footer>
            </div>
        </div>
    );
};

export default ProductionSummary;
