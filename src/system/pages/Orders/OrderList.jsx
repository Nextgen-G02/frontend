import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    ClipboardList, Search, Filter, Plus, ArrowRight, Calendar,
    Phone, Store, Clock, Activity, ChefHat, ShoppingBag, ChevronRight,
    TrendingUp, Package, Globe, MapPin, CreditCard, RefreshCw,
    CheckCircle2, XCircle, Truck, Flame, AlertCircle, Inbox,
    LayoutList, BarChart3, SlidersHorizontal
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import AdminCustomCakes from '../CustomCakes/AdminCustomCakes';

const getLocalDateString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/* ─────────────────── helpers ─────────────────── */
const STATUS_CONFIG = {
    Pending:   { color: 'bg-amber-500',  text: 'text-white', glow: 'shadow-amber-400/30',  icon: Clock,         ring: 'ring-amber-200' },
    Confirmed: { color: 'bg-blue-500',   text: 'text-white', glow: 'shadow-blue-400/30',   icon: CheckCircle2,  ring: 'ring-blue-200'  },
    Preparing: { color: 'bg-purple-500', text: 'text-white', glow: 'shadow-purple-400/30', icon: Flame,         ring: 'ring-purple-200'},
    Ready:     { color: 'bg-indigo-600', text: 'text-white', glow: 'shadow-indigo-400/30', icon: Package,       ring: 'ring-indigo-200'},
    Delivered: { color: 'bg-emerald-500',text: 'text-white', glow: 'shadow-emerald-400/30',icon: Truck,         ring: 'ring-emerald-200'},
    Cancelled: { color: 'bg-slate-300',  text: 'text-white', glow: '',                     icon: XCircle,       ring: 'ring-slate-200' },
};

const PAYMENT_CONFIG = {
    Paid:            { bg: 'bg-emerald-50', text: 'text-emerald-600', label: 'PAID' },
    Unpaid:          { bg: 'bg-rose-50',    text: 'text-rose-600',    label: 'UNPAID' },
    'Partially Paid':{ bg: 'bg-amber-50',  text: 'text-amber-600',   label: 'PARTIAL' },
};

const SOURCE_TABS = [
    { key: 'all',     label: 'All Orders',    icon: LayoutList },
    { key: 'Website', label: 'Website',        icon: Globe      },
    { key: 'In-Store',label: 'In-Store',       icon: Store      },
];

const StatusBadge = ({ status }) => {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Pending;
    const Icon = cfg.icon;
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-md ${cfg.glow} ${cfg.color} ${cfg.text}`}>
            <Icon size={9} />
            {status}
        </span>
    );
};

const PaymentBadge = ({ status }) => {
    const cfg = PAYMENT_CONFIG[status] || PAYMENT_CONFIG.Unpaid;
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${cfg.bg} ${cfg.text}`}>
            <CreditCard size={8} />
            {cfg.label}
        </span>
    );
};

/* ─────────────────── main component ─────────────────── */
const OrderList = () => {
    const navigate = useNavigate();

    const [orders, setOrders]           = useState([]);
    const [loading, setLoading]         = useState(true);
    const [search, setSearch]           = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [sourceTab, setSourceTab]     = useState('all');
    const [activeTab, setActiveTab]     = useState('Standard');

    useEffect(() => { fetchOrders(); }, [statusFilter]);

    /* ── fetch ── */
    const fetchOrders = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/orders`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    params:  { customerName: search, status: statusFilter, type: 'Order' }
                }
            );
            setOrders(response.data);
        } catch (error) {
            if (error.response?.status === 401) {
                toast.error("Session expired. Please log in again.");
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                toast.error("Failed to synchronize with registry");
            }
        } finally {
            setLoading(false);
        }
    };

    /* ── status update ── */
    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(
                `${import.meta.env.VITE_BACKEND_URL}/api/orders/${id}/status`,
                { orderStatus: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Status updated successfully");
            fetchOrders();
        } catch (error) {
            toast.error(error.response?.data?.message || "Update failed");
        }
    };

    /* ── derived data ── */
    const filteredOrders = orders.filter(o => {
        const matchSource = sourceTab === 'all' || o.source === sourceTab ||
            (sourceTab === 'In-Store' && !o.source);
        const matchSearch = !search ||
            o.customerName?.toLowerCase().includes(search.toLowerCase()) ||
            o.phone?.includes(search);
        return matchSource && matchSearch;
    });

    const metrics = {
        total:   orders.length,
        pending: orders.filter(o => o.orderStatus === 'Pending').length,
        ready:   orders.filter(o => o.orderStatus === 'Ready').length,
        revenue: orders.reduce((s, o) => s + (o.totalAmount || 0), 0),
        website: orders.filter(o => o.source === 'Website').length,
    };

    /* ── source counts for tab badges ── */
    const sourceCounts = {
        all:       orders.length,
        Website:   orders.filter(o => o.source === 'Website').length,
        'In-Store':orders.filter(o => o.source !== 'Website').length,
    };

    return (
        <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 space-y-8">
            <div className="max-w-[1500px] mx-auto space-y-8">

                {/* ── Page Header ── */}
                <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                            Manage <span className="text-slate-400 italic font-medium">Orders</span>
                        </h1>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-3 flex items-center gap-2">
                            <Activity size={12} className="text-primary" />
                            Order Management System
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4 w-full lg:w-auto">
                        <Link
                            to="/orders/summary"
                            className="flex-1 lg:flex-none px-6 py-3.5 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-3 shadow-sm"
                        >
                            <ChefHat size={16} /> Production Summary
                        </Link>
                        <Link
                            to="/orders/new"
                            className="flex-1 lg:flex-none px-8 py-3.5 bg-slate-900 text-gold rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3"
                        >
                            <Plus size={16} /> New Order
                        </Link>
                    </div>
                </header>

                {/* ── Page Tabs ── */}
                <div className="flex gap-4 border-b border-slate-200">
                    {['Standard', 'Custom'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-3 px-2 text-sm font-bold uppercase tracking-widest transition-all ${
                                activeTab === tab
                                    ? 'border-b-2 border-primary text-primary'
                                    : 'border-b-2 border-transparent text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            {tab === 'Standard' ? 'Standard Orders' : 'Custom Requests'}
                        </button>
                    ))}
                </div>

                {/* ══════════ CUSTOM REQUESTS TAB ══════════ */}
                {activeTab === 'Custom' && (
                    <div className="-mx-4 md:-mx-8">
                        <AdminCustomCakes />
                    </div>
                )}

                {/* ══════════ STANDARD ORDERS TAB ══════════ */}
                {activeTab === 'Standard' && (
                    <>
                        {/* ── Metrics Strip ── */}
                        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                            {[
                                { label: 'Total Orders',    val: metrics.total,                              sub: 'All orders',         icon: ShoppingBag,  color: 'text-slate-500', bg: 'bg-slate-50' },
                                { label: 'Pending',         val: metrics.pending,                            sub: 'Needs attention',    icon: Clock,        color: 'text-amber-500', bg: 'bg-amber-50' },
                                { label: 'Ready',           val: metrics.ready,                              sub: 'Ready for pickup',   icon: Package,      color: 'text-indigo-500',bg: 'bg-indigo-50'},
                                { label: 'Website Orders',  val: metrics.website,                            sub: 'Online orders',      icon: Globe,        color: 'text-blue-500',  bg: 'bg-blue-50'  },
                                { label: 'Total Revenue',   val: `Rs.${metrics.revenue.toLocaleString()}`,   sub: 'Total sales',        icon: TrendingUp,   color: 'text-emerald-500',bg:'bg-emerald-50'},
                            ].map((m, i) => {
                                const Icon = m.icon;
                                return (
                                    <div key={i} className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-500 group">
                                        <div className={`w-9 h-9 ${m.bg} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                                            <Icon size={16} className={m.color} />
                                        </div>
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{m.label}</p>
                                        <h3 className="text-xl font-black text-slate-900 tracking-tight">{m.val}</h3>
                                        <p className="text-[7px] font-bold text-slate-400 uppercase mt-1">{m.sub}</p>
                                    </div>
                                );
                            })}
                        </div>

                        {/* ── Orders Panel ── */}
                        <div className="bg-white rounded-[32px] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">

                            {/* ── Top Bar: Source Tabs + Search ── */}
                            <div className="border-b border-slate-100">

                                {/* Source filter tabs */}
                                <div className="flex items-center gap-1 px-6 md:px-8 pt-6 pb-0">
                                    {SOURCE_TABS.map(({ key, label, icon: Icon }) => {
                                        const count = sourceCounts[key] ?? 0;
                                        const active = sourceTab === key;
                                        return (
                                            <button
                                                key={key}
                                                onClick={() => setSourceTab(key)}
                                                className={`flex items-center gap-2 px-5 py-2.5 rounded-t-xl text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${
                                                    active
                                                        ? 'bg-slate-900 text-gold border-slate-900 shadow-lg shadow-slate-900/10'
                                                        : 'bg-transparent text-slate-400 border-transparent hover:text-slate-700 hover:bg-slate-50'
                                                }`}
                                            >
                                                <Icon size={12} />
                                                {label}
                                                <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[8px] font-black ${
                                                    active ? 'bg-white/20 text-gold' : 'bg-slate-100 text-slate-500'
                                                }`}>
                                                    {count}
                                                </span>
                                            </button>
                                        );
                                    })}

                                    <div className="ml-auto flex items-center gap-2 pb-0 mb-0">
                                        <button
                                            onClick={fetchOrders}
                                            className="flex items-center gap-1.5 px-3 py-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all text-[9px] font-black uppercase tracking-widest"
                                        >
                                            <RefreshCw size={12} /> Refresh
                                        </button>
                                    </div>
                                </div>

                                {/* Search + Filter row */}
                                <form onSubmit={(e) => { e.preventDefault(); fetchOrders(); }}
                                    className="p-6 md:p-8 pt-4 flex flex-col md:flex-row items-end gap-4"
                                >
                                    {/* Search */}
                                    <div className="flex-1 relative w-full">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                                        <input
                                            type="text"
                                            value={search}
                                            onChange={e => setSearch(e.target.value)}
                                            placeholder="Search by customer name or phone..."
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/8 focus:border-primary/30 transition-all font-semibold text-xs text-slate-800 placeholder:text-slate-300"
                                        />
                                    </div>

                                    {/* Status filter */}
                                    <div className="relative w-full md:w-52">
                                        <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                                        <select
                                            value={statusFilter}
                                            onChange={e => setStatusFilter(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/8 focus:border-primary/30 transition-all font-black text-[9px] uppercase tracking-widest appearance-none text-slate-600 cursor-pointer"
                                        >
                                            <option value="">All Statuses</option>
                                            {Object.keys(STATUS_CONFIG).map(s => (
                                                <option key={s} value={s}>{s.toUpperCase()}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Apply button */}
                                    <button
                                        type="submit"
                                        className="w-full md:w-auto px-8 py-3 bg-slate-900 text-gold rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all shadow-lg shadow-slate-900/10"
                                    >
                                        Apply Filters
                                    </button>
                                </form>
                            </div>

                            {/* ── Orders Table ── */}
                            <div className="overflow-x-auto no-scrollbar">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/80">
                                            {['Order Origin', 'Customer', 'Schedule', 'Items', 'Status', 'Payment', 'Value', ''].map((h, i) => (
                                                <th key={i} className={`px-6 py-4 text-[8px] font-black text-slate-400 uppercase tracking-[0.25em] whitespace-nowrap ${i === 7 ? 'text-right' : ''}`}>
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-slate-50">
                                        {loading ? (
                                            <tr>
                                                <td colSpan="8" className="py-24 text-center">
                                                    <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                                                    <p className="font-black uppercase tracking-[0.3em] text-[9px] text-slate-400">
                                                        Loading orders...
                                                    </p>
                                                </td>
                                            </tr>
                                        ) : filteredOrders.length === 0 ? (
                                            <tr>
                                                <td colSpan="8" className="py-24 text-center">
                                                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                                        <Inbox size={28} className="text-slate-200" />
                                                    </div>
                                                    <p className="text-slate-400 font-black uppercase tracking-widest text-[10px] mb-1">
                                                        No orders found
                                                    </p>
                                                    <p className="text-slate-300 text-[9px] font-medium">
                                                        {search || statusFilter || sourceTab !== 'all'
                                                            ? 'Try adjusting your filters'
                                                            : 'Orders placed from the website or in-store will appear here'}
                                                    </p>
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredOrders.map((order) => {
                                                const isWebsite   = order.source === 'Website';
                                                const isInStore   = !isWebsite;
                                                const hasSchedule = order.scheduleDate || order.scheduleTime;
                                                
                                                const checkIsOverdue = (date, time, status) => {
                                                    if (!date || ['Ready', 'Delivered', 'Cancelled'].includes(status)) return false;
                                                    const todayStr = getLocalDateString();
                                                    const now = new Date();
                                                    const timeStr = now.toTimeString().slice(0, 5);
                                                    return date < todayStr || (date === todayStr && (time || "00:00") < timeStr);
                                                };
                                                const isOverdue = checkIsOverdue(order.scheduleDate, order.scheduleTime, order.orderStatus);

                                                return (
                                                    <tr
                                                        key={order._id}
                                                        className={`transition-all duration-200 group ${isOverdue ? 'bg-rose-50/40 hover:bg-rose-50/70' : 'hover:bg-slate-50/70'}`}
                                                    >
                                                        {/* Order Origin */}
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`p-2.5 rounded-xl flex-shrink-0 ${
                                                                    isWebsite
                                                                        ? 'bg-blue-500/10 text-blue-600'
                                                                        : 'bg-primary/10 text-primary'
                                                                }`}>
                                                                    {isWebsite ? <Globe size={14} /> : <Store size={14} />}
                                                                </div>
                                                                <div>
                                                                    <p className="font-mono text-[7px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">
                                                                        #{order._id.slice(-6).toUpperCase()}
                                                                    </p>
                                                                    <p className={`font-black text-[11px] uppercase tracking-tight ${
                                                                        isWebsite ? 'text-blue-600' : 'text-primary'
                                                                    }`}>
                                                                        {isWebsite ? 'Website Order' : 'In-Store Order'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        {/* Customer */}
                                                        <td className="px-6 py-4">
                                                            <p className="font-black text-slate-900 text-xs uppercase tracking-tight leading-none mb-1">
                                                                {order.customerName || 'Walk-in Customer'}
                                                            </p>
                                                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                                                <Phone size={8} className="text-slate-300" />
                                                                {order.phone || '—'}
                                                            </p>
                                                            {order.address && (
                                                                <p className="text-[8px] font-medium text-slate-300 mt-0.5 flex items-center gap-1 max-w-[160px] truncate">
                                                                    <MapPin size={7} className="flex-shrink-0" />
                                                                    {order.address}
                                                                </p>
                                                            )}
                                                        </td>

                                                        {/* Schedule */}
                                                        <td className="px-6 py-4">
                                                            {hasSchedule ? (
                                                                <div className="space-y-0.5">
                                                                    {order.scheduleDate && (
                                                                        <p className={`font-black text-[10px] flex items-center gap-1.5 ${isOverdue ? 'text-rose-600' : 'text-slate-800'}`}>
                                                                            <Calendar size={9} className={isOverdue ? 'text-rose-500' : 'text-primary'} />
                                                                            {new Date(order.scheduleDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
                                                                        </p>
                                                                    )}
                                                                    {order.scheduleTime && (
                                                                        <p className={`font-bold text-[9px] flex items-center gap-1.5 ${isOverdue ? 'text-rose-500' : 'text-slate-400'}`}>
                                                                            <Clock size={9} />
                                                                            {order.scheduleTime}
                                                                        </p>
                                                                    )}
                                                                    {isOverdue && (
                                                                        <span className="inline-flex items-center gap-1 mt-1 text-[8px] font-black px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-600 border border-rose-200 animate-pulse">
                                                                            <AlertCircle size={8}/> OVERDUE
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">—</span>
                                                            )}
                                                        </td>

                                                        {/* Items count */}
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-7 h-7 bg-slate-50 rounded-lg flex items-center justify-center">
                                                                    <ShoppingBag size={12} className="text-slate-400" />
                                                                </div>
                                                                <div>
                                                                    <p className="font-black text-slate-900 text-xs">{order.items?.length || 0}</p>
                                                                    <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">items</p>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        {/* Status dropdown */}
                                                        <td className="px-6 py-4">
                                                            <select
                                                                value={order.orderStatus}
                                                                onChange={e => handleStatusUpdate(order._id, e.target.value)}
                                                                className={`px-3 py-2 rounded-xl text-[8px] font-black tracking-widest border-none cursor-pointer outline-none transition-all appearance-none text-center shadow-md hover:opacity-90 ${
                                                                    STATUS_CONFIG[order.orderStatus]
                                                                        ? `${STATUS_CONFIG[order.orderStatus].color} ${STATUS_CONFIG[order.orderStatus].text} ${STATUS_CONFIG[order.orderStatus].glow}`
                                                                        : 'bg-slate-400 text-white'
                                                                }`}
                                                            >
                                                                {Object.keys(STATUS_CONFIG).map(s => (
                                                                    <option key={s} value={s}>{s.toUpperCase()}</option>
                                                                ))}
                                                            </select>
                                                        </td>

                                                        {/* Payment */}
                                                        <td className="px-6 py-4">
                                                            <PaymentBadge status={order.paymentStatus} />
                                                            {order.advanceAmount > 0 && order.paymentStatus !== 'Paid' && (
                                                                <p className="text-[7px] font-bold text-slate-400 mt-1">
                                                                    Advance: Rs.{order.advanceAmount.toLocaleString()}
                                                                </p>
                                                            )}
                                                        </td>

                                                        {/* Value */}
                                                        <td className="px-6 py-4">
                                                            <p className="font-black text-slate-900 text-sm tracking-tight leading-none">
                                                                Rs.{(order.totalAmount || 0).toLocaleString()}
                                                            </p>
                                                            <p className="text-[7px] text-slate-400 font-bold uppercase mt-0.5">
                                                                {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                            </p>
                                                        </td>

                                                        {/* Action */}
                                                        <td className="px-6 py-4 text-right">
                                                            <button
                                                                onClick={() => navigate(`/orders/${order._id}`)}
                                                                className="p-2.5 rounded-xl bg-white border border-slate-100 text-slate-400 hover:bg-slate-900 hover:text-gold hover:border-slate-900 transition-all shadow-sm group-hover:shadow-md"
                                                                title="View Order Details"
                                                            >
                                                                <ChevronRight size={15} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* ── Footer row ── */}
                            {!loading && filteredOrders.length > 0 && (
                                <div className="px-8 py-4 border-t border-slate-50 bg-slate-50/40 flex items-center justify-between">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                        Showing {filteredOrders.length} of {orders.length} records
                                    </p>
                                    <div className="flex items-center gap-3">
                                        {sourceTab !== 'all' && (
                                            <button
                                                onClick={() => setSourceTab('all')}
                                                className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline"
                                            >
                                                Show All
                                            </button>
                                        )}
                                        {statusFilter && (
                                            <button
                                                onClick={() => setStatusFilter('')}
                                                className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-rose-500 flex items-center gap-1"
                                            >
                                                <XCircle size={10} /> Clear Status Filter
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default OrderList;