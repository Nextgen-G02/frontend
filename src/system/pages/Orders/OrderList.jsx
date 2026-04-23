import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ClipboardList, 
  Search, 
  Filter, 
  Plus, 
  ArrowRight,
  MoreVertical,
  Calendar,
  Phone,
  Store,
  Clock,
  Loader2
} from 'lucide-react';
import orderApi from '../../../shared/api/orderApi';
import { toast } from 'react-hot-toast';

const OrderList = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        fetchOrders();
    }, [statusFilter]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const data = await orderApi.getAllOrders({ 
                customerName: search,
                status: statusFilter
            });
            setOrders(data);
        } catch (error) {
            toast.error("Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchOrders();
    }

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Pending': return "bg-amber-50 text-amber-600 border-amber-100";
            case 'Confirmed': return "bg-blue-50 text-blue-600 border-blue-100";
            case 'Preparing': return "bg-purple-50 text-purple-600 border-purple-100";
            case 'Delivered': return "bg-emerald-50 text-emerald-600 border-emerald-100";
            case 'Cancelled': return "bg-rose-50 text-primary border-rose-100 uppercase";
            default: return "bg-slate-50 text-slate-600 border-slate-100";
        }
    };

    return (
        <div className="space-y-12 max-w-[1600px] mx-auto animate-in fade-in duration-1000">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100">
            <div>
                <div className="flex items-center gap-2.5 mb-3">
                    <span className="w-10 h-1 bg-primary rounded-full"></span>
                    <p className="text-primary font-black uppercase tracking-[0.4em] text-[9px]">Commercial Operations Ledger</p>
                </div>
                <h1 className="heading-premium text-2xl md:text-5xl leading-tight">Sales & <span className="italic font-medium text-slate-400">Orders</span></h1>
                <p className="text-slate-400 font-medium mt-2 md:mt-3 text-sm md:text-base">Track requests, transmissions, and settlement states.</p>
            </div>
            <Link 
                to="/orders/new" 
                className="py-3.5 md:py-4 px-6 md:px-10 bg-slate-900 text-gold rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.3em] shadow-2xl shadow-slate-200 hover:bg-primary hover:text-white transition-all duration-500 flex items-center justify-center gap-3 border border-white/10"
            >
                <Plus size={18} md:size={20} /> Initiate New Order
            </Link>
        </div>

        <div className="glass-card rounded-[24px] md:rounded-[40px] overflow-hidden bg-white/70 backdrop-blur-xl border-none shadow-xl">
            <form onSubmit={handleSearch} className="p-5 md:p-8 border-b border-slate-50 bg-white/50 flex flex-col md:flex-row md:items-end gap-4 md:gap-6">
                <div className="flex-1 relative group">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2.5 md:mb-3 ml-1">Identity Query (Customer)</p>
                    <Search className="absolute left-5 bottom-3.5 text-slate-300 group-focus-within:text-primary transition-colors" size={16} md:size={18} />
                    <input 
                        type="text" 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Identify customer..."
                        className="w-full pl-12 md:pl-14 pr-5 md:pr-6 py-3.5 bg-white border border-slate-100 rounded-lg md:rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-slate-900 placeholder:text-slate-200 text-xs md:text-sm"
                    />
                </div>

                <div className="w-full md:w-64 relative group">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2.5 md:mb-3 ml-1">Operational Filter (Status)</p>
                    <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-5 md:px-6 py-3.5 bg-white border border-slate-100 rounded-lg md:rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-black text-primary appearance-none cursor-pointer uppercase text-[9px] md:text-[10px] tracking-widest shadow-sm"
                    >
                        <option value="">Global States</option>
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                    <Filter className="absolute right-5 bottom-3.5 text-slate-300 pointer-events-none group-focus-within:text-primary transition-colors" size={14} md:size={16} />
                </div>

                <button 
                    type="submit"
                    className="w-full md:w-auto px-8 py-3.5 bg-slate-900 text-gold rounded-lg md:rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all shadow-xl active:scale-95 border border-white/5"
                >
                    Apply Filters
                </button>
            </form>

                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
            <tr className="bg-slate-50/50">
                <th className="px-6 md:px-10 py-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Transmission Type</th>
                <th className="px-6 md:px-10 py-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Client Profile</th>
                <th className="px-6 md:px-10 py-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Lifecycle state</th>
                <th className="px-6 md:px-10 py-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Settlement Value</th>
                <th className="px-6 md:px-10 py-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] text-right">Registry Link</th>
            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-12 py-40 text-center">
                                        <Loader2 className="animate-spin text-primary mx-auto mb-6" size={56} />
                                        <p className="font-black uppercase tracking-[0.4em] text-[10px] text-slate-400">Accessing Master Ledger Transmissions...</p>
                                    </td>
                                </tr>
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-12 py-40 text-center">
                                        <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center mx-auto mb-6 shadow-inner">
                                            <ClipboardList size={48} className="text-slate-200" />
                                        </div>
                                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No order transmissions found in registry.</p>
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-white transition-all duration-300 group">
                                        <td className="px-6 md:px-10 py-4 md:py-6">
                                            <div className="flex items-center gap-3 md:gap-5">
                                                <div className={`p-2.5 md:p-3 rounded-lg md:rounded-xl shadow-sm ${order.type === 'DirectSale' ? 'bg-slate-900 text-gold' : 'bg-primary text-white shadow-primary/20'}`}>
                                                    {order.type === 'DirectSale' ? <Store size={16} md:size={18} /> : <Calendar size={16} md:size={18} />}
                                                </div>
                                                <div>
                                                    <p className="font-mono text-[8px] font-black text-slate-300 uppercase leading-none mb-1 tracking-widest">SEQ: {order._id.slice(-6).toUpperCase()}</p>
                                                    <p className="font-black text-slate-900 group-hover:text-primary transition-colors uppercase tracking-tight text-sm md:text-base">{order.type === 'DirectSale' ? 'In-Store' : 'Scheduled'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 md:px-10 py-4 md:py-6">
                                            <div className="space-y-0.5 md:space-y-1">
                                                <p className="font-black text-slate-900 text-sm md:text-base uppercase tracking-tight">
                                                    {order.customerName}
                                                </p>
                                                <div className="flex items-center gap-2 text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                                    <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
                                                    {order.phone || 'GUEST'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 md:px-10 py-4 md:py-6">
                                            <span className={`inline-flex items-center px-3.5 md:px-4 py-1.5 rounded-full text-[8px] md:text-[9px] font-black tracking-[0.2em] border ${getStatusStyle(order.orderStatus)}`}>
                                                {order.orderStatus.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 md:px-10 py-4 md:py-6">
                                            <div className="flex flex-col">
                                                <span className="font-black text-slate-900 text-lg md:text-xl tracking-tighter">Rs.{order.totalAmount.toLocaleString()}</span>
                                                <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest mt-0.5">Settled</span>
                                            </div>
                                        </td>
                                        <td className="px-6 md:px-10 py-4 md:py-6 text-right">
                                            <button 
                                                onClick={() => navigate(`/orders/edit/${order._id}`)}
                                                className="inline-flex items-center gap-2 md:gap-2.5 px-3.5 md:px-5 py-2.5 rounded-lg md:rounded-xl bg-white border border-slate-100 text-[8px] md:text-[9px] font-black text-slate-400 hover:bg-slate-900 hover:text-gold hover:border-slate-900 hover:shadow-2xl transition-all uppercase tracking-widest group/btn"
                                            >
                                                Query
                                                <ArrowRight size={12} md:size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OrderList;


