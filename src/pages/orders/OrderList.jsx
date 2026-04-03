import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import orderApi from '../../api/orderApi';

const OrderList = () => {
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
            console.error('Failed to get orders');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchOrders();
    }

    const getStatusStyle = (status) => {
        const baseClass = "px-3 py-1 rounded-full text-sm font-semibold";
        switch (status) {
            case 'Pending': return `${baseClass} bg-amber-100 text-amber-800 border border-amber-200`;
            case 'Confirmed': return `${baseClass} bg-blue-100 text-blue-800 border border-blue-200`;
            case 'Preparing': return `${baseClass} bg-purple-100 text-purple-800 border border-purple-200`;
            case 'Delivered': return `${baseClass} bg-emerald-100 text-emerald-800 border border-emerald-200`;
            case 'Cancelled': return `${baseClass} bg-rose-100 text-rose-800 border border-rose-200`;
            default: return `${baseClass} bg-gray-100 text-gray-800 border border-gray-200`;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Order Management</h1>
                        <p className="text-slate-500 mt-1">Manage and track your customer orders.</p>
                    </div>
                    <Link 
                        to="/orders/new" 
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Create New Order
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
                    <form onSubmit={handleSearch} className="p-4 flex flex-wrap gap-4 items-end">
                        <div className="flex-1 min-w-[300px]">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Search Customer</label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Customer name..."
                                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                />
                                <svg className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>

                        <div className="w-48">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Status Filter</label>
                            <select 
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                            >
                                <option value="">All Statuses</option>
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Preparing">Preparing</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>

                        <button 
                            type="submit"
                            className="px-6 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-all shadow-sm"
                        >
                            Filter
                        </button>
                    </form>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 border-y border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">ID</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Customer</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Type</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Total</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-8 h-8 border-4 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin"></div>
                                                <span>Loading orders...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : orders.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-slate-500">No orders found.</td>
                                    </tr>
                                ) : (
                                    orders.map((order) => (
                                        <tr key={order._id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-6 py-4 font-mono text-xs text-slate-500">#{order._id.slice(-6)}</td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-slate-900">{order.customerName}</div>
                                                <div className="text-sm text-slate-500">{order.phone || 'No phone'}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={getStatusStyle(order.orderStatus)}>
                                                    {order.orderStatus}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-xs px-2 py-0.5 rounded border ${order.type === 'DirectSale' ? 'border-purple-200 bg-purple-50 text-purple-700' : 'border-indigo-200 bg-indigo-50 text-indigo-700'}`}>
                                                    {order.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-slate-900">
                                                ${order.totalAmount.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link 
                                                    to={`/orders/${order._id}`}
                                                    className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                                                >
                                                    View Details
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderList;
