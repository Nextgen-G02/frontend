import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import orderApi from '../../../shared/api/orderApi';

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
        <div className="min-h-screen bg-slate-50/50 p-4 md:p-6">
            <div className="max-w-[1400px] mx-auto">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => navigate('/orders')}
                            className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
                        >
                            <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </button>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">Order Details</h1>
                                <span className="text-slate-400 font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded leading-none">#{order._id.slice(-8)}</span>
                            </div>
                            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mt-1">Registry Entry: {new Date(order.createdAt).toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="flex gap-2.5">
                        <Link 
                            to={`/orders/edit/${order._id}`}
                            className="px-3.5 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit Entry
                        </Link>
                        <button 
                            onClick={handleDelete}
                            className="px-3.5 py-2 bg-rose-50 border border-rose-100 text-rose-600 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-rose-100 transition-all flex items-center gap-2"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Purge
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
                    <div className="lg:col-span-8 space-y-6 md:space-y-8">
                        <div className="bg-white rounded-[24px] md:rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                            <div className="p-5 md:p-6 border-b border-slate-50 bg-white/50">
                                <h2 className="font-black text-slate-900 uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
                                    <div className="w-1.5 h-4 bg-primary rounded-full"></div>
                                    Payload Specifications
                                </h2>
                            </div>
                            <div className="p-0">
                                <table className="w-full">
                                    <thead className="bg-slate-50/50">
                                        <tr className="text-left border-b border-slate-100">
                                            <th className="px-5 md:px-7 py-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Asset Handle</th>
                                            <th className="px-5 md:px-7 py-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Phylum</th>
                                            <th className="px-5 md:px-7 py-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Unit Val</th>
                                            <th className="px-5 md:px-7 py-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Batch</th>
                                            <th className="px-5 md:px-7 py-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Net val</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {order.items.map((item, idx) => (
                                            <React.Fragment key={idx}>
                                                <tr className="hover:bg-slate-50/30 border-none transition-colors">
                                                    <td className="px-5 md:px-7 py-4">
                                                        <p className="font-black text-slate-900 uppercase tracking-tight text-sm leading-tight">{item.pName}</p>
                                                    </td>
                                                    <td className="px-5 md:px-7 py-4">
                                                        <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded leading-none uppercase tracking-widest">{item.category}</span>
                                                    </td>
                                                    <td className="px-5 md:px-7 py-4 text-right">
                                                        <p className="text-xs font-bold text-slate-600 leading-none">Rs.{item.price.toLocaleString()}</p>
                                                    </td>
                                                    <td className="px-5 md:px-7 py-4 text-center">
                                                        <p className="text-xs font-black text-slate-900 leading-none bg-slate-100 w-fit mx-auto px-2 py-1 rounded-md">{item.quantity}</p>
                                                    </td>
                                                    <td className="px-5 md:px-7 py-4 text-right">
                                                        <p className="text-sm font-black text-slate-900 leading-none">
                                                            Rs.{(item.price * item.quantity).toLocaleString()}
                                                        </p>
                                                    </td>
                                                </tr>
                                                {(item.customization?.message || item.customization?.flavor || item.customization?.specialInstructions) && (
                                                    <tr className="bg-amber-50/10 border-none">
                                                        <td colSpan="5" className="px-5 md:px-7 py-2.5">
                                                            <div className="flex flex-wrap gap-4 text-[9px]">
                                                                {item.customization.message && (
                                                                    <div className="flex flex-col border-l-2 border-amber-200 pl-3">
                                                                        <span className="text-amber-600 font-black uppercase tracking-[0.2em] mb-0.5">Inscription Protocol</span>
                                                                        <span className="text-slate-800 font-medium italic">"{item.customization.message}"</span>
                                                                    </div>
                                                                )}
                                                                {item.customization.flavor && (
                                                                    <div className="flex flex-col border-l-2 border-amber-200 pl-3">
                                                                        <span className="text-amber-600 font-black uppercase tracking-[0.2em] mb-0.5">Flavor Profile</span>
                                                                        <span className="text-slate-900 font-black uppercase tracking-tight">{item.customization.flavor}</span>
                                                                    </div>
                                                                )}
                                                                {item.customization.specialInstructions && (
                                                                    <div className="flex flex-col border-l-2 border-amber-200 pl-3">
                                                                        <span className="text-amber-600 font-black uppercase tracking-[0.2em] mb-0.5">Logistics Directives</span>
                                                                        <span className="text-slate-600 font-medium leading-relaxed">{item.customization.specialInstructions}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        ))}

                                    </tbody>
                                    <tfoot className="bg-slate-50/50 border-t border-slate-100">
                                        <tr>
                                            <td colSpan="4" className="px-5 md:px-7 py-5 font-black text-slate-400 uppercase tracking-[0.3em] text-right">Net Aggregate Val</td>
                                            <td className="px-5 md:px-7 py-5 text-right">
                                                <p className="text-2xl md:text-3xl font-black text-primary tracking-tighter leading-none">
                                                    Rs.{order.totalAmount.toLocaleString()}
                                                </p>
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>

                        <div className="bg-white p-5 md:p-7 rounded-[24px] md:rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100">
                            <h2 className="font-black text-slate-900 uppercase text-[9px] tracking-[0.3em] mb-6 flex items-center gap-2">
                                <div className="w-1.5 h-3 bg-slate-900 rounded-full"></div>
                                Registry Entity Data
                            </h2>
                            <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                                <div>
                                    <span className="text-slate-400 font-black uppercase text-[8px] tracking-widest block mb-1.5">Authorized Principal</span>
                                    <span className="font-black text-slate-900 uppercase tracking-tight text-sm leading-none block">{order.customerName}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400 font-black uppercase text-[8px] tracking-widest block mb-1.5">Communications Vector</span>
                                    <span className="font-black text-slate-900 uppercase tracking-tight text-sm leading-none block">{order.phone || 'DECRYPT_FAILURE'}</span>
                                </div>
                                <div className="col-span-2">
                                    <span className="text-slate-400 font-black uppercase text-[8px] tracking-widest block mb-1.5">Deployment Hub (Address)</span>
                                    <span className="font-medium text-slate-600 italic text-[13px] leading-relaxed block">"{order.address || 'LOC_REDACTED'}"</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white p-5 md:p-7 rounded-[24px] md:rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100">
                            <h2 className="font-black text-slate-900 uppercase text-[9px] tracking-[0.3em] mb-6 flex items-center gap-2">
                                <div className="w-1.5 h-3 bg-primary rounded-full"></div>
                                State Controller
                            </h2>
                            <div className="space-y-2.5">
                                {statusOptions.map(status => (
                                    <button 
                                        key={status}
                                        disabled={updating || order.orderStatus === status}
                                        onClick={() => handleStatusUpdate(status)}
                                        className={`w-full text-left px-5 py-3.5 rounded-xl border transition-all flex items-center justify-between group/status ${
                                            order.orderStatus === status 
                                            ? 'bg-slate-900 border-slate-900 text-gold shadow-lg shadow-slate-900/10' 
                                            : 'bg-white border-slate-100 text-slate-400 hover:border-primary/30 hover:text-slate-900'
                                        }`}
                                    >
                                        <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${order.orderStatus === status ? '' : 'group-hover/status:translate-x-1 transition-transform'}`}>{status}</span>
                                        {order.orderStatus === status && (
                                            <div className="w-1.5 h-1.5 bg-gold rounded-full shadow-[0_0_8px_gold]"></div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white p-5 md:p-7 rounded-[24px] md:rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100">
                            <h2 className="font-black text-slate-900 uppercase text-[9px] tracking-[0.3em] mb-6">Manifest Meta</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100/50">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Entry UID</span>
                                    <span className="text-[11px] font-mono font-black text-slate-900">#{order._id.slice(-8)}</span>
                                </div>
                                <div className="flex justify-between items-center bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100/50">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Transmission</span>
                                    <span className="text-[11px] font-black text-primary uppercase tracking-tight">{order.type}</span>
                                </div>
                                <div className="flex justify-between items-center bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100/50">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Settlement</span>
                                    <span className={`text-[11px] font-black uppercase tracking-tight ${order.paymentStatus === 'Paid' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                        {order.paymentStatus}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100/50">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Logistics Window</span>
                                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-tighter text-right">
                                        {order.scheduleDate || 'IMM_DEPLYMT'} <br/>
                                        <span className="text-[9px] text-slate-400">{order.scheduleTime || ''}</span>
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

