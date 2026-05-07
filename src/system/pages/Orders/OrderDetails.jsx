import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  Printer, 
  ChevronLeft, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  X, 
  Save, 
  Plus, 
  Minus, 
  Search, 
  Package, 
  FileText, 
  User, 
  Calendar, 
  Clock, 
  Activity,
  CreditCard,
  MapPin,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Zap,
  MoreVertical,
  Download,
  AlertCircle,
  TrendingUp,
  Cpu,
  Layers
} from 'lucide-react';
import Receipt from '../POS/Receipt';

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);
    const [formData, setFormData] = useState(null);
    const [products, setProducts] = useState([]);
    
    useEffect(() => {
        fetchOrder();
        fetchProducts();
        if (window.location.pathname.includes('/edit')) setIsEditing(true);
    }, [id]);

    const fetchOrder = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrder(response.data);
            setFormData(response.data);
        } catch (error) {
            toast.error('Registry link severed');
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products`);
            setProducts(response.data.data);
        } catch (error) {
            console.error("Catalog link failure");
        }
    };

    const handleStatusUpdate = async (newStatus) => {
        setUpdating(true);
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${id}/status`, { orderStatus: newStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(`Protocol: ${newStatus}`);
            fetchOrder();
        } catch (error) {
            toast.error('Transition rejected');
        } finally {
            setUpdating(false);
        }
    };

    const handlePaymentUpdate = async (newPaymentStatus) => {
        setUpdating(true);
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${id}/payment`, { paymentStatus: newPaymentStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(`Audit: ${newPaymentStatus}`);
            fetchOrder();
        } catch (error) {
            toast.error('Audit update failed');
        } finally {
            setUpdating(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('IRREVERSIBLE: Purge from master ledger?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Sequence purged');
                navigate('/orders');
            } catch (error) {
                toast.error('Purge failure');
            }
        }
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...formData.items];
        if (field === 'pName' && !newItems[index].isCustom) {
            const selectedProd = products.find(p => p.pName === value);
            if (selectedProd) {
                newItems[index] = {
                    ...newItems[index],
                    pName: selectedProd.pName,
                    category: selectedProd.pCategory,
                    unit: selectedProd.unit || 'pcs',
                    price: selectedProd.price,
                };
            }
        } else {
            newItems[index] = { ...newItems[index], [field]: value };
        }
        setFormData(prev => ({ ...prev, items: newItems }));
    };

    const handleSaveChanges = async () => {
        if (formData.items.length === 0) return toast.error("Empty payload rejected");
        setUpdating(true);
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${id}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Synchronized");
            setIsEditing(false);
            fetchOrder();
        } catch (error) {
            toast.error('Sync failure');
        } finally {
            setUpdating(false);
        }
    };

    const calculateCurrentTotal = () => {
        const items = isEditing ? formData?.items : order?.items;
        return items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Pending': return "bg-amber-500 text-white shadow-amber-200";
            case 'Confirmed': return "bg-blue-600 text-white shadow-blue-200";
            case 'Preparing': return "bg-purple-600 text-white shadow-purple-200";
            case 'Ready': return "bg-primary text-white shadow-primary/20";
            case 'Delivered': return "bg-emerald-600 text-white shadow-emerald-200";
            case 'Cancelled': return "bg-slate-400 text-white shadow-slate-200";
            default: return "bg-slate-500 text-white";
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
    );

    if (!order) return <div className="p-20 text-center font-black uppercase text-slate-400 tracking-widest">Entry Redacted</div>;

    return (
        <div className="min-h-screen bg-slate-50/50 pb-10 overflow-x-hidden">
            {/* Compact Control Bar */}
            <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200 px-4 md:px-8 py-4 shadow-sm">
                <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-5">
                        <button onClick={() => navigate('/orders')} className="p-2.5 bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-600 rounded-xl transition-all shadow-inner"><ChevronLeft size={20} /></button>
                        <div className="flex items-center gap-4">
                            <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Order Command</h1>
                            <span className="bg-slate-900 text-gold px-3 py-1 rounded-lg text-xs font-mono font-black">#{order._id.slice(-6).toUpperCase()}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {!isEditing ? (
                            <>
                                <button onClick={() => setShowReceipt(true)} className="px-5 py-2.5 bg-slate-900 text-gold rounded-xl font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center gap-2 shadow-lg shadow-slate-900/10"><Printer size={16} /> Reprint Bill</button>
                                <button onClick={() => setIsEditing(true)} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest hover:border-primary hover:text-primary transition-all flex items-center gap-2"><Edit3 size={16} /> Modify</button>
                                <button onClick={handleDelete} className="p-2.5 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all border border-rose-100"><Trash2 size={20} /></button>
                            </>
                        ) : (
                            <>
                                <button onClick={handleSaveChanges} disabled={updating} className="px-8 py-3 bg-primary text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 transition-all flex items-center gap-2 shadow-xl shadow-primary/20"><Save size={16} /> {updating ? 'Syncing...' : 'Sync Registry'}</button>
                                <button onClick={() => { setIsEditing(false); setFormData(order); }} className="px-5 py-3 bg-white border border-slate-200 text-slate-400 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">Abort</button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto p-4 md:p-6 space-y-5">
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                    {/* Primary Column */}
                    <div className="xl:col-span-8 space-y-6">
                        {/* Status Bar */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-between gap-4">
                            <div className="flex items-center gap-8">
                                <div className="flex flex-col">
                                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Lifecycle Protocol</span>
                                    <div className={`px-4 py-1.5 rounded-lg font-black text-xs uppercase tracking-tight ${getStatusStyle(order.orderStatus)} shadow-sm`}>{order.orderStatus}</div>
                                </div>
                                <div className="flex flex-col border-l border-slate-100 pl-8">
                                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Financial Vector</span>
                                    <div className={`px-4 py-1.5 rounded-lg font-black text-xs uppercase tracking-tight shadow-sm ${order.paymentStatus === 'Paid' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}>{order.paymentStatus}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-1">Registry Timestamp</span>
                                    <p className="text-sm font-black text-slate-900 uppercase">{new Date(order.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</p>
                                </div>
                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-primary border border-slate-100"><Calendar size={20} /></div>
                            </div>
                        </div>

                        {/* Client Identity Grid */}
                        <div className="bg-white p-6 rounded-[32px] border border-slate-200/60 shadow-sm">
                            <h2 className="font-black text-slate-900 uppercase text-[11px] tracking-[0.4em] mb-6 flex items-center gap-3">
                                <div className="w-2 h-4 bg-slate-900 rounded-full"></div> Client Identification
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-1 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4 transition-all hover:bg-white hover:shadow-lg hover:shadow-slate-100">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm"><User size={20} /></div>
                                    <div>
                                        <span className="font-black text-slate-900 text-base uppercase tracking-tighter block truncate max-w-[150px]">{order.customerName}</span>
                                        <span className="text-[10px] font-black text-slate-400 uppercase">Authorized Guest</span>
                                    </div>
                                </div>
                                <div className="md:col-span-1 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4 transition-all hover:bg-white hover:shadow-lg hover:shadow-slate-100">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm"><CreditCard size={20} /></div>
                                    <div>
                                        <span className="font-black text-slate-900 text-base tracking-tighter block">{order.phone || 'GUEST_NODE'}</span>
                                        <span className="text-[10px] font-black text-slate-400 uppercase">Contact Link</span>
                                    </div>
                                </div>
                                <div className="md:col-span-1 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4 transition-all hover:bg-white hover:shadow-lg hover:shadow-slate-100">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm shrink-0"><MapPin size={20} /></div>
                                    <div className="truncate">
                                        <p className="font-medium text-slate-600 italic text-[13px] truncate">"{order.address || 'Default Hub'}"</p>
                                        <span className="text-[10px] font-black text-slate-400 uppercase">Deployment Coord</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Manifest Table */}
                        <div className="bg-white rounded-[32px] border border-slate-200/60 shadow-sm overflow-hidden">
                            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                                <h2 className="font-black text-slate-900 uppercase text-[11px] tracking-[0.4em] flex items-center gap-3">
                                    <div className="w-2 h-4 bg-primary rounded-full"></div> Payload Manifest
                                </h2>
                                {isEditing && (
                                    <button onClick={() => setFormData(prev => ({ ...prev, items: [...prev.items, { pName: '', category: 'General', quantity: 1, unit: 'pcs', price: 0, isCustom: true }] }))} className="px-4 py-2 bg-slate-900 text-gold rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all flex items-center gap-2"><Plus size={14} /> Add Entry</button>
                                )}
                            </div>
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50/20">
                                    <tr className="border-b border-slate-100">
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Asset Details</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-center">Batch Size</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-right">Net val</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {(isEditing ? formData : order).items.map((item, idx) => (
                                        <tr key={idx} className="group/row hover:bg-slate-50/50 transition-all">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover/row:text-primary transition-all"><Package size={18} /></div>
                                                    <div>
                                                        <p className="font-black text-slate-900 text-sm uppercase tracking-tight mb-0.5">{item.pName}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.category}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <span className="text-lg font-black text-slate-900 tracking-tighter">{item.quantity}</span>
                                                <span className="text-[11px] font-black text-slate-400 uppercase ml-1.5">{item.unit || 'pcs'}</span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <p className="text-base font-black text-slate-900 tracking-tighter">Rs.{((item.price * item.quantity).toLocaleString())}</p>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-slate-900">
                                    <tr>
                                        <td colSpan="2" className="px-6 py-6 text-right font-black text-slate-400 uppercase tracking-[0.4em] text-[10px]">Registry Aggregate Val</td>
                                        <td className="px-6 py-6 text-right">
                                            <p className="text-3xl font-black text-white tracking-tighter leading-none mb-1.5">Rs.{calculateCurrentTotal().toLocaleString()}</p>
                                            <span className="text-[9px] font-black text-gold uppercase tracking-[0.2em] border border-gold/40 px-3 py-1 rounded-full bg-gold/5 shadow-[0_0_10px_rgba(212,175,55,0.1)]">Master Settlement Lock</span>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    {/* Sidebar Column */}
                    <div className="xl:col-span-4 space-y-6">
                        {/* State Controller Grid */}
                        <div className="bg-white p-6 rounded-[32px] border border-slate-200/60 shadow-sm">
                            <h2 className="font-black text-slate-900 uppercase text-[11px] tracking-[0.4em] mb-5 flex items-center gap-3"><div className="w-2 h-4 bg-primary rounded-full"></div> Lifecycle Protocol</h2>
                            <div className="grid grid-cols-2 gap-3">
                                {['Pending', 'Confirmed', 'Preparing', 'Ready', 'Delivered', 'Cancelled'].map(status => (
                                    <button key={status} disabled={updating || order.orderStatus === status || isEditing} onClick={() => handleStatusUpdate(status)} className={`text-left p-4 rounded-2xl border-2 transition-all flex flex-col justify-between h-20 relative overflow-hidden active:scale-95 ${order.orderStatus === status ? `${getStatusStyle(status)} border-transparent shadow-lg shadow-primary/10` : 'bg-slate-50/50 border-slate-100 text-slate-600 hover:border-primary/40'}`}>
                                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] relative z-10 ${order.orderStatus === status ? 'text-white/80' : 'text-slate-400'}`}>{status}</span>
                                        <div className="flex justify-between items-end relative z-10">
                                            <span className={`font-black text-base tracking-tighter ${order.orderStatus === status ? 'text-white' : 'text-slate-900'}`}>{status.slice(0, 4)}</span>
                                            {order.orderStatus === status && <CheckCircle2 size={16} />}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Financial & Logistics Matrix */}
                        <div className="bg-slate-900 rounded-[32px] shadow-xl relative overflow-hidden flex flex-col">
                            <div className="p-8 space-y-6 relative z-10">
                                <h2 className="font-black text-white uppercase text-[11px] tracking-[0.4em] flex items-center gap-3"><div className="w-2 h-3 bg-primary rounded-full animate-pulse"></div> Economic Manifest</h2>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center bg-white/5 px-6 py-4 rounded-xl border border-white/5 group hover:bg-white/10 transition-all"><span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Gross Inventory</span><span className="text-sm font-black text-white">Rs.{order.totalAmount.toLocaleString()}</span></div>
                                    <div className="flex justify-between items-center bg-white/5 px-6 py-4 rounded-xl border border-white/5 group hover:bg-white/10 transition-all"><span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Registry Deposit</span><span className="text-sm font-black text-emerald-400">Rs.{order.advanceAmount?.toLocaleString() || 0}</span></div>
                                    <div className="bg-white/10 px-6 py-6 rounded-2xl border border-primary/50 mt-6 flex justify-between items-center shadow-2xl shadow-primary/20 transition-all group hover:bg-white/15">
                                        <span className="text-xs font-black text-primary uppercase tracking-[0.2em]">Net Liability</span>
                                        <span className="text-2xl font-black text-gold italic tracking-tighter drop-shadow-md">Rs.{(order.totalAmount - (order.advanceAmount || 0)).toLocaleString()}</span>
                                    </div>
                                    {order.paymentStatus !== 'Paid' && !isEditing && (
                                        <button onClick={async () => { if (window.confirm('Execute Lock?')) { try { const token = localStorage.getItem('token'); await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${order._id}`, { advanceAmount: order.totalAmount, paymentStatus: 'Paid' }, { headers: { Authorization: `Bearer ${token}` } }); toast.success('Locked'); fetchOrder(); } catch (error) { toast.error('Fail'); } } }} className="w-full py-4 bg-primary text-white rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all shadow-lg mt-4 active:scale-95">Lock Master Registry</button>
                                    )}
                                </div>
                            </div>
                            <div className="bg-white/5 p-8 border-t border-white/10 grid grid-cols-2 gap-6 relative z-10">
                                <div className="space-y-2"><div className="flex items-center gap-3 text-primary"><Calendar size={16} /><span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Date Locked</span></div><p className="font-black text-white text-[13px] uppercase tracking-tighter">{order.scheduleDate || 'ONDEMAND'}</p></div>
                                <div className="space-y-2"><div className="flex items-center gap-3 text-primary"><Clock size={16} /><span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Window lock</span></div><p className="font-black text-white text-[13px] uppercase tracking-tighter">{order.scheduleTime || 'ASAP_VECTOR'}</p></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showReceipt && <Receipt order={order} onClose={() => setShowReceipt(false)} />}
        </div>
    );
};

export default OrderDetails;