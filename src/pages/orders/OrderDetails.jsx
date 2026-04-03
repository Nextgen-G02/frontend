import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import orderApi from '../../api/orderApi';

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            const data = await orderApi.getOrderById(id);
            setOrder(data);
        } catch (error) {
            console.error('Failed to fetch order');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (newStatus) => {
        setUpdating(true);
        try {
            await orderApi.updateStatus(id, newStatus);
            fetchOrder(); // Refresh data
        } catch (error) {
            alert('Failed to update status');
        } finally {
            setUpdating(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            try {
                await orderApi.deleteOrder(id);
                navigate('/orders');
            } catch (error) {
                alert('Failed to delete order');
            }
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="w-12 h-12 border-4 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
    );

    if (!order) return <div className="p-8 text-center text-slate-500">Order not found.</div>;

    const statusOptions = ['Pending', 'Confirmed', 'Preparing', 'Delivered', 'Cancelled'];

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => navigate('/orders')}
                            className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </button>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-bold text-slate-900">Order Details</h1>
                                <span className="text-slate-400 font-mono text-sm">#{order._id}</span>
                            </div>
                            <p className="text-slate-500 text-sm">Placed on {new Date(order.createdAt).toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Link 
                            to={`/orders/edit/${order._id}`}
                            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-all flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                        </Link>
                        <button 
                            onClick={handleDelete}
                            className="px-4 py-2 bg-rose-50 border border-rose-100 text-rose-600 rounded-lg font-medium hover:bg-rose-100 transition-all flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-6 border-b border-slate-100">
                                <h2 className="font-bold text-slate-800 uppercase text-xs tracking-wider">Order Items</h2>
                            </div>
                            <div className="p-0">
                                <table className="w-full">
                                    <thead className="bg-slate-50">
                                        <tr className="text-left">
                                            <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Product</th>
                                            <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Category</th>
                                            <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Price</th>
                                            <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-center">Qty</th>
                                            <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {order.items.map((item, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50/50">
                                                <td className="px-6 py-4 font-medium text-slate-900">{item.pName}</td>
                                                <td className="px-6 py-4 text-slate-500 text-sm">{item.category}</td>
                                                <td className="px-6 py-4 text-right">${item.price.toFixed(2)}</td>
                                                <td className="px-6 py-4 text-center">{item.quantity}</td>
                                                <td className="px-6 py-4 text-right font-bold text-slate-900">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="bg-slate-50 border-t border-slate-200">
                                        <tr>
                                            <td colSpan="4" className="px-6 py-4 font-bold text-slate-800 text-right">Grand Total</td>
                                            <td className="px-6 py-4 text-right text-xl font-black text-indigo-600">
                                                ${order.totalAmount.toFixed(2)}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <h2 className="font-bold text-slate-800 uppercase text-xs tracking-wider mb-4">Customer info</h2>
                            <div className="grid grid-cols-2 gap-y-4 text-sm">
                                <div>
                                    <span className="text-slate-400 block mb-1">Customer Name</span>
                                    <span className="font-medium text-slate-900">{order.customerName}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400 block mb-1">Phone Number</span>
                                    <span className="font-medium text-slate-900">{order.phone || 'N/A'}</span>
                                </div>
                                <div className="col-span-2">
                                    <span className="text-slate-400 block mb-1">Address</span>
                                    <span className="font-medium text-slate-900">{order.address || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <h2 className="font-bold text-slate-800 uppercase text-xs tracking-wider mb-4">Status control</h2>
                            <div className="space-y-3">
                                {statusOptions.map(status => (
                                    <button 
                                        key={status}
                                        disabled={updating || order.orderStatus === status}
                                        onClick={() => handleStatusUpdate(status)}
                                        className={`w-full text-left px-4 py-3 rounded-lg border transition-all flex items-center justify-between ${
                                            order.orderStatus === status 
                                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                                            : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'
                                        }`}
                                    >
                                        <span className="font-medium">{status}</span>
                                        {order.orderStatus === status && (
                                            <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <h2 className="font-bold text-slate-800 uppercase text-xs tracking-wider mb-4">Meta details</h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Order ID:</span>
                                    <span className="font-medium text-slate-700">#{order._id.slice(-6)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Order type:</span>
                                    <span className="font-medium text-slate-700 capitalize">{order.type}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Payment:</span>
                                    <span className={`font-medium ${order.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {order.paymentStatus}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Schedule:</span>
                                    <span className="font-medium text-slate-700">
                                        {order.scheduleDate || 'No date'} {order.scheduleTime || ''}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
