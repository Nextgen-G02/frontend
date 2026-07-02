import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    ClipboardList,
    Search,
    Filter,
    Plus,
    ArrowRight,
    Calendar,
    Phone,
    Store,
    Clock,
    Activity,
    ChefHat,
    ShoppingBag,
    ChevronRight,
    TrendingUp,
    Package
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import AdminCustomCakes from '../CustomCakes/AdminCustomCakes';

const OrderList = () => {
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [activeTab, setActiveTab] = useState('Standard');

    useEffect(() => {
        fetchOrders();
    }, [statusFilter]);

    const fetchOrders = async () => {
        setLoading(true);

        try {
            const token = localStorage.getItem('token');

            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/orders`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    params: {
                        customerName: search,
                        status: statusFilter,
                        type: 'Order'
                    }
                }
            );

            setOrders(response.data);
        } catch (error) {
            console.error("Order Fetch Error:", error);

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

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const token = localStorage.getItem('token');

            await axios.patch(
                `${import.meta.env.VITE_BACKEND_URL}/api/orders/${id}/status`,
                { orderStatus: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            toast.success("State transition committed");
            fetchOrders();
        } catch (error) {
            toast.error(error.response?.data?.message || "Protocol violation");
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchOrders();
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Pending':
                return "bg-amber-500 text-white shadow-lg shadow-amber-500/20 border-transparent";

            case 'Confirmed':
                return "bg-blue-500 text-white shadow-lg shadow-blue-500/20 border-transparent";

            case 'Preparing':
                return "bg-purple-500 text-white shadow-lg shadow-purple-500/20 border-transparent";

            case 'Ready':
                return "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 border-transparent";

            case 'Delivered':
                return "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 border-transparent";

            case 'Cancelled':
                return "bg-slate-300 text-white border-transparent grayscale";

            default:
                return "bg-slate-500 text-white border-transparent";
        }
    };

    const metrics = {
        total: orders.length,
        pending: orders.filter((o) => o.orderStatus === 'Pending').length,
        ready: orders.filter((o) => o.orderStatus === 'Ready').length,
        revenue: orders.reduce((sum, o) => sum + o.totalAmount, 0)
    };

    return (
        <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 space-y-8">
            <div className="max-w-[1500px] mx-auto space-y-8">

                {/* Header */}
                <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                            Master <span className="text-slate-400 italic font-medium">Orders</span>
                        </h1>

                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-3 flex items-center gap-2">
                            <Activity size={12} className="text-primary" />
                            Operational Transmission Registry
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4 w-full lg:w-auto">
                        <Link
                            to="/orders/summary"
                            className="flex-1 lg:flex-none px-6 py-3.5 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-3 shadow-sm"
                        >
                            <ChefHat size={16} />
                            Production Summary
                        </Link>

                        <Link
                            to="/orders/new"
                            className="flex-1 lg:flex-none px-8 py-3.5 bg-slate-900 text-gold rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3"
                        >
                            <Plus size={16} />
                            Initiate New Order
                        </Link>
                    </div>
                </header>

                {/* Tabs */}
                <div className="flex gap-4 border-b border-slate-200">
                    <button 
                        onClick={() => setActiveTab('Standard')}
                        className={`pb-3 px-2 text-sm font-bold uppercase tracking-widest transition-all ${
                            activeTab === 'Standard' 
                            ? 'border-b-2 border-primary text-primary' 
                            : 'border-b-2 border-transparent text-slate-400 hover:text-slate-600'
                        }`}
                    >
                        Standard Orders
                    </button>
                    <button 
                        onClick={() => setActiveTab('Custom')}
                        className={`pb-3 px-2 text-sm font-bold uppercase tracking-widest transition-all ${
                            activeTab === 'Custom' 
                            ? 'border-b-2 border-primary text-primary' 
                            : 'border-b-2 border-transparent text-slate-400 hover:text-slate-600'
                        }`}
                    >
                        Custom Requests
                    </button>
                </div>

                {activeTab === 'Custom' && (
                    <div className="-mx-4 md:-mx-8">
                        <AdminCustomCakes />
                    </div>
                )}

                {activeTab === 'Standard' && (
                    <>
                        {/* Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {[
                        {
                            label: 'Registry Load',
                            val: metrics.total,
                            sub: 'Active Transmissions',
                            icon: ShoppingBag
                        },
                        {
                            label: 'Awaiting Action',
                            val: metrics.pending,
                            sub: 'Pending Review',
                            icon: Clock
                        },
                        {
                            label: 'Ready for Fulfillment',
                            val: metrics.ready,
                            sub: 'Awaiting Delivery',
                            icon: Package
                        },
                        {
                            label: 'Gross Liquidity',
                            val: `Rs.${metrics.revenue.toLocaleString()}`,
                            sub: 'Transmission Val',
                            icon: TrendingUp
                        }
                    ].map((m, i) => (
                        <div
                            key={i}
                            className="bg-white p-5 rounded-[24px] border border-slate-200/60 shadow-sm relative overflow-hidden group hover:shadow-xl hover:border-primary/20 transition-all duration-500"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:scale-125 transition-transform duration-700">
                                <m.icon size={64} />
                            </div>

                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
                                {m.label}
                            </p>

                            <h3 className="text-xl font-black text-slate-900 tracking-tight">
                                {m.val}
                            </h3>

                            <p className="text-[7px] font-bold text-slate-400 uppercase mt-1">
                                {m.sub}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-[32px] border border-slate-200/60 shadow-2xl shadow-slate-200/50 overflow-hidden">

                    {/* Search */}
                    <form
                        onSubmit={handleSearch}
                        className="p-6 md:p-8 bg-slate-50/50 border-b border-slate-100 flex flex-col md:flex-row items-end gap-6"
                    >
                        <div className="flex-1 relative group w-full">
                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 block ml-1">
                                Identity Query (Customer)
                            </label>

                            <div className="relative">
                                <Search
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    size={16}
                                />

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Identify customer profile..."
                                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-xs"
                                />
                            </div>
                        </div>

                        <div className="w-full md:w-64 relative">
                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 block ml-1">
                                Operational Filter
                            </label>

                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-5 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-black text-[9px] uppercase tracking-widest appearance-none"
                            >
                                <option value="">Global Registry Status</option>

                                {[
                                    'Pending',
                                    'Confirmed',
                                    'Preparing',
                                    'Ready',
                                    'Delivered',
                                    'Cancelled'
                                ].map((s) => (
                                    <option key={s} value={s}>
                                        {s.toUpperCase()}
                                    </option>
                                ))}
                            </select>

                            <Filter
                                className="absolute right-5 bottom-3 text-slate-400 pointer-events-none"
                                size={14}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full md:w-auto px-10 py-3 bg-slate-900 text-gold rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all"
                        >
                            Sync Filters
                        </button>
                    </form>

                    {/* Table */}
                    <div className="overflow-x-auto no-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/80">
                                    <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                        Asset Origin
                                    </th>

                                    <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                        Personnel Handle
                                    </th>

                                    <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                        Lifecycle State
                                    </th>

                                    <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                        Economic Val
                                    </th>

                                    <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="py-32 text-center">
                                            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>

                                            <p className="font-black uppercase tracking-[0.3em] text-[9px] text-slate-400">
                                                Synchronizing Master Ledger...
                                            </p>
                                        </td>
                                    </tr>
                                ) : orders.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="py-32 text-center">
                                            <ClipboardList
                                                size={40}
                                                className="text-slate-100 mx-auto mb-4"
                                            />

                                            <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">
                                                Registry sequence is empty.
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    orders.map((order) => (
                                        <tr
                                            key={order._id}
                                            className="hover:bg-slate-50/50 transition-all duration-300 group"
                                        >
                                            <td className="px-8 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div
                                                        className={`p-2.5 rounded-xl ${
                                                            order.type === 'DirectSale'
                                                                ? 'bg-slate-900 text-gold'
                                                                : 'bg-primary/10 text-primary'
                                                        }`}
                                                    >
                                                        {order.type === 'DirectSale' ? (
                                                            <Store size={14} />
                                                        ) : (
                                                            <Calendar size={14} />
                                                        )}
                                                    </div>

                                                    <div>
                                                        <p className="font-mono text-[7px] font-black text-slate-700 uppercase tracking-widest mb-0.5 leading-none">
                                                            SEQ: {order._id.slice(-6).toUpperCase()}
                                                        </p>

                                                        <p className="font-black text-slate-900 uppercase tracking-tight text-xs">
                                                            {order.type === 'DirectSale'
                                                                ? 'In-Store POS'
                                                                : 'Scheduled'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-8 py-4">
                                                <div className="space-y-0.5">
                                                    <p className="font-black text-slate-900 text-xs uppercase tracking-tight">
                                                        {order.customerName}
                                                    </p>

                                                    <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                                                        <Phone size={8} className="text-slate-300" />
                                                        {order.phone || 'GUEST_PROFILE'}
                                                    </p>
                                                </div>
                                            </td>

                                            <td className="px-8 py-4">
                                                <select
                                                    value={order.orderStatus}
                                                    onChange={(e) =>
                                                        handleStatusUpdate(order._id, e.target.value)
                                                    }
                                                    className={`px-4 py-2 rounded-xl text-[8px] font-black tracking-widest border-none cursor-pointer outline-none transition-all appearance-none text-center shadow-sm hover:scale-105 ${getStatusStyle(
                                                        order.orderStatus
                                                    )}`}
                                                >
                                                    <option value="Pending">PENDING</option>
                                                    <option value="Confirmed">CONFIRMED</option>
                                                    <option value="Preparing">PREPARING</option>
                                                    <option value="Ready">READY</option>
                                                    <option value="Delivered">DELIVERED</option>
                                                    <option value="Cancelled">CANCELLED</option>
                                                </select>
                                            </td>

                                            <td className="px-8 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-black text-slate-900 text-sm tracking-tight leading-none mb-1">
                                                        Rs.{order.totalAmount.toLocaleString()}
                                                    </span>

                                                    <span className="text-[7px] font-black text-emerald-500 uppercase tracking-widest px-1.5 py-0.5 bg-emerald-50 rounded-md w-fit">
                                                        Authorized
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-8 py-4 text-right">
                                                <button
                                                    onClick={() =>
                                                        navigate(`/orders/${order._id}`)
                                                    }
                                                    className="p-2.5 rounded-xl bg-white border border-slate-100 text-slate-400 hover:bg-slate-900 hover:text-gold hover:border-slate-900 transition-all shadow-sm"
                                                >
                                                    <ChevronRight size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default OrderList;