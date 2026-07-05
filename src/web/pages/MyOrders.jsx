import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../shared/context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Clock, CheckCircle2, Package, Truck, XCircle, CreditCard, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MyOrders() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchOrders();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            // Fetch standard orders
            const stdRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders/customer`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const stdOrders = stdRes.data.map(order => ({ isCustom: false, data: order, createdAt: new Date(order.createdAt) }));

            // Fetch custom cakes (passing both identifier and email for backward compatibility)
            const customRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/custom-cakes/customer?identifier=${user.id || user._id}&email=${encodeURIComponent(user.email)}`);
            const customOrders = customRes.data.map(order => ({ isCustom: true, data: order, createdAt: new Date(order.createdAt) }));

            // Combine and sort
            const combined = [...stdOrders, ...customOrders].sort((a, b) => b.createdAt - a.createdAt);

            setOrders(combined);
        } catch (error) {
            console.error("Error fetching orders:", error);
            toast.error("Could not load your orders.");
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = (request) => {
        const amountToPay = request.estimatedPrice;

        const orderId = `CUST-CAKE-${request._id.substring(0, 8)}-${Math.random().toString(36).substring(2, 6)}`;

        // Extract first and last name from customerName
        const nameParts = request.customerName ? request.customerName.split(' ') : ['Customer'];
        const firstName = nameParts[0];
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : ' ';

        const payhereConfig = {
            sandbox: import.meta.env.VITE_PAYHERE_ENV === 'sandbox',
            merchant_id: import.meta.env.VITE_PAYHERE_MERCHANT_ID,
            return_url: `${window.location.origin}/my-orders`,
            cancel_url: `${window.location.origin}/my-orders`,
            notify_url: `${import.meta.env.VITE_BACKEND_URL}/api/payment/notify`,
            order_id: orderId,
            items: `Custom Cake Request`,
            amount: parseFloat(amountToPay).toFixed(2),
            currency: 'LKR',
            first_name: firstName,
            last_name: lastName,
            email: request.email,
            phone: request.phone || '000000000',
            address: request.address || user.address || 'Colombo',
            city: 'Colombo',
            country: 'Sri Lanka'
        };

        payhere.onCompleted = function onCompleted(orderId) {
            toast.success("Payment successful!");

            // Tell backend payment is complete
            axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/custom-cakes/${request._id}/pay`, {
                amountPaid: amountToPay,
                isHalfPayment: false
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            }).then(() => {
                fetchOrders();
            }).catch(err => {
                console.error(err);
                toast.error("Payment was successful but status update failed. Please contact support.");
            });
        };

        payhere.onDismissed = function onDismissed() {
            toast.error("Payment dismissed");
        };

        payhere.onError = function onError(error) {
            toast.error("Payment error: " + error);
        };

        axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/payment/hash`, {
            order_id: payhereConfig.order_id,
            amount: payhereConfig.amount,
            currency: payhereConfig.currency
        }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }).then(response => {
            payhereConfig.hash = response.data.hash;
            payhere.startPayment(payhereConfig);
        }).catch(err => {
            console.error('Hash error:', err);
            toast.error('Could not initialize payment. Try again.');
        });
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Pending': return 'bg-slate-50 text-slate-600 border-slate-200';
            case 'Confirmed': return 'bg-blue-50 text-blue-600 border-blue-200';
            case 'Preparing': return 'bg-amber-50 text-amber-600 border-amber-200';
            case 'Ready': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
            case 'Delivered': return 'bg-primary/10 text-primary border-primary/20';
            case 'Cancelled': return 'bg-rose-50 text-rose-600 border-rose-200';
            default: return 'bg-slate-50 text-slate-600 border-slate-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Pending': return <Clock size={16} />;
            case 'Confirmed': return <CheckCircle2 size={16} />;
            case 'Preparing': return <Package size={16} />;
            case 'Ready': return <CheckCircle2 size={16} />;
            case 'Delivered': return <Truck size={16} />;
            case 'Cancelled': return <XCircle size={16} />;
            default: return <Clock size={16} />;
        }
    };

    const getPaymentStyles = (status) => {
        switch (status) {
            case 'Paid': return 'text-emerald-600 bg-emerald-50';
            case 'Partially Paid': return 'text-amber-600 bg-amber-50';
            case 'Unpaid': return 'text-rose-600 bg-rose-50';
            default: return 'text-slate-600 bg-slate-50';
        }
    };

    if (!user) {
        return (
            <div className="bg-[#fbf9f4] min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-grow flex items-center justify-center p-4">
                    <div className="text-center">
                        <h2 className="text-2xl font-black text-slate-900 mb-4">Please login to view your orders</h2>
                        <Link to="/login" className="bg-primary text-white px-6 py-3 rounded-xl font-bold">Login</Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="bg-[#fbf9f4] min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow pt-24 pb-20 px-4 md:px-8">
                <div className="max-w-5xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-[2px] bg-primary"></div>
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Your History</span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight uppercase">My Orders</h1>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="bg-white rounded-[32px] p-12 text-center shadow-xl shadow-black/5 border border-slate-50">
                            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ShoppingBag size={40} className="text-slate-300" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-2">No Orders Yet</h3>
                            <p className="text-slate-500 mb-8 max-w-md mx-auto">You haven't placed any standard orders yet. Time to treat yourself!</p>
                            <Link to="/products" className="inline-block bg-primary text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-slate-900 transition-colors">
                                Browse Products
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {orders.map((wrapper) => {
                                const { isCustom, data: order } = wrapper;

                                if (isCustom) {
                                    return (
                                        <div key={`custom-${order._id}`} className="bg-white rounded-[32px] p-6 md:p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-black/5 transition-all flex flex-col lg:flex-row gap-8 relative overflow-hidden">
                                            {/* Badge */}
                                            <div className="absolute top-0 right-0 bg-[#C29D59] text-white text-[9px] font-black uppercase tracking-widest px-4 py-1 rounded-bl-xl">Custom Design</div>

                                            {/* Image Reference */}
                                            <div className="w-full lg:w-48 shrink-0">
                                                <div className="aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
                                                    {order.referenceImage ? (
                                                        <img src={order.referenceImage} alt="Reference" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                            <ShoppingBag size={48} />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1 space-y-4 pt-4 lg:pt-0">
                                                <div className="flex flex-wrap justify-between items-start gap-4">
                                                    <div>
                                                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-1">Custom Cake Request</h3>
                                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ordered: {new Date(order.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                    <div className={`px-4 py-2 rounded-full border flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${order.status === 'Approved' ? 'bg-blue-50 text-blue-600 border-blue-200' : order.status === 'Rejected' ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                                                        {order.status}
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-slate-50">
                                                    <div>
                                                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">Needed By</p>
                                                        <p className="text-sm font-bold text-slate-900">{new Date(order.scheduleDate).toLocaleDateString()}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">Quantity</p>
                                                        <p className="text-sm font-bold text-slate-900">{order.quantity || 1}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">Payment Status</p>
                                                        <p className={`text-sm font-bold ${order.paymentStatus === 'Paid' ? 'text-emerald-500' : order.paymentStatus === 'Partially Paid' ? 'text-blue-500' : 'text-rose-500'}`}>{order.paymentStatus}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">Estimated Price</p>
                                                        <p className="text-sm font-bold text-slate-900">{order.estimatedPrice > 0 ? `Rs. ${order.estimatedPrice.toLocaleString()}` : 'TBD'}</p>
                                                    </div>
                                                </div>

                                                <div className="bg-slate-50 p-4 rounded-2xl">
                                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Your Description</p>
                                                    <p className="text-sm text-slate-700 italic">"{order.description}"</p>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            {order.status === 'Approved' && (
                                                <div className="w-full lg:w-64 shrink-0 flex flex-col justify-center items-center bg-[#F9F6F2] p-6 rounded-2xl border border-[#C29D59]/20">
                                                    <p className="text-[10px] uppercase font-bold text-[#C29D59] tracking-widest mb-2 text-center">Action Required</p>
                                                    <h4 className="text-lg font-black text-slate-900 mb-1">Pay to Confirm</h4>
                                                    <p className="text-xs font-medium text-slate-500 text-center mb-6">
                                                        {order.paymentRequired === 'Half' ? '50% deposit required to confirm your order.' : 'Full payment required to confirm your order.'}
                                                    </p>

                                                    <div className="text-2xl font-black text-slate-900 mb-6">
                                                        Rs. {order.paymentRequired === 'Half' ? (order.estimatedPrice / 2).toLocaleString() : order.estimatedPrice.toLocaleString()}
                                                    </div>

                                                    <button
                                                        onClick={() => handlePayment(order)}
                                                        className="w-full bg-[#C29D59] text-white py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-slate-900 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#C29D59]/20">
                                                        <CreditCard size={16} /> Pay Now
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                }

                                // STANDARD ORDER RENDER
                                return (
                                    <div key={`std-${order._id}`} className="bg-white rounded-[32px] p-6 md:p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-black/5 transition-all relative overflow-hidden">
                                        {/* Badge */}
                                        <div className="absolute top-0 right-0 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest px-4 py-1 rounded-bl-xl">Standard Order</div>

                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-50 pt-4 md:pt-0">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="text-xs font-bold text-slate-400">Order #{order._id.substring(order._id.length - 6).toUpperCase()}</span>
                                                    <span className="text-xs text-slate-300">•</span>
                                                    <span className="text-xs font-medium text-slate-500">
                                                        {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyles(order.orderStatus)}`}>
                                                        {getStatusIcon(order.orderStatus)}
                                                        {order.orderStatus}
                                                    </span>
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getPaymentStyles(order.paymentStatus)}`}>
                                                        {order.paymentStatus}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-left md:text-right">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Amount</p>
                                                <p className="text-2xl font-black text-slate-900">Rs. {order.totalAmount?.toLocaleString()}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex items-center justify-between bg-slate-50/50 p-4 rounded-2xl">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center">
                                                            <ShoppingBag size={20} className="text-primary/50" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-slate-900 text-sm md:text-base">{item.pName}</h4>
                                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Qty: {item.quantity}</p>
                                                        </div>
                                                    </div>
                                                    <p className="font-bold text-slate-900">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                                                </div>
                                            ))}
                                        </div>

                                        {(order.scheduleDate || order.scheduleTime) && (
                                            <div className="mt-6 pt-6 border-t border-slate-50 flex items-center gap-2 text-sm font-medium text-slate-500">
                                                <Clock size={16} className="text-primary" />
                                                <span>Requested Delivery: <strong className="text-slate-900">{order.scheduleDate || 'Any Date'}</strong> at <strong className="text-slate-900">{order.scheduleTime || 'Any Time'}</strong></span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
