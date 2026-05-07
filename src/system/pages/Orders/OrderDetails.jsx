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
  Cake as CakeIcon, 
  FileText, 
  User, 
  Calendar, 
  Clock, 
  Activity,
  Star,
  Settings
} from 'lucide-react';
import Receipt from '../POS/Receipt';

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // Core Data States
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);

    // Edit Mode States
    const [formData, setFormData] = useState(null);
    const [products, setProducts] = useState([]);
    const [productSearch, setProductSearch] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [expandedItems, setExpandedItems] = useState({});

    useEffect(() => {
        fetchOrder();
        fetchProducts();
        
        // Check if we arrived via an /edit route
        if (window.location.pathname.includes('/edit')) {
            setIsEditing(true);
        }
    }, [id]);

    const fetchOrder = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrder(response.data);
            setFormData(response.data); // Pre-fill edit form
        } catch (error) {
            toast.error('Failed to fetch order specifications');
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products`);
            setProducts(response.data.data);
        } catch (error) {
            console.error("Failed to load catalog");
        }
    };

    // --- VIEW MODE HANDLERS ---
    const handleStatusUpdate = async (newStatus) => {
        setUpdating(true);
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${id}/status`, { orderStatus: newStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(`Status transitioned to ${newStatus}`);
            fetchOrder();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Protocol transition failed');
        } finally {
            setUpdating(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to purge this order from the registry?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Order sequence purged');
                navigate('/orders');
            } catch (error) {
                toast.error('Failed to purge order');
            }
        }
    };

    // --- EDIT MODE HANDLERS ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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

    const addProductFromSearch = (product) => {
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, { 
                pName: product.pName, 
                category: product.pCategory, 
                quantity: 1, 
                unit: product.unit || 'pcs',
                price: product.price, 
                isCustom: false,
                customization: { message: '', flavor: '', specialInstructions: '' } 
            }]
        }));
        setProductSearch('');
        setShowSuggestions(false);
    };

    const addCustomRow = () => {
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, { 
                pName: '', 
                category: 'Cake', 
                quantity: 1, 
                unit: 'pcs',
                price: 0, 
                isCustom: true,
                customization: { message: '', flavor: '', specialInstructions: '' } 
            }]
        }));
    };

    const removeItem = (index) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }));
    };

    const calculateTotal = () => {
        return formData?.items?.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0) || 0;
    };

    const handleSaveChanges = async () => {
        if (formData.items.length === 0) return toast.error("Manifest requires at least one item.");
        setUpdating(true);
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${id}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Registry sequence synchronized");
            setIsEditing(false);
            fetchOrder();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Synchronization error');
        } finally {
            setUpdating(false);
        }
    };

    useEffect(() => {
        if (productSearch.trim()) {
            const filtered = products.filter(p => 
                (p.pName || "").toLowerCase().includes(productSearch.toLowerCase())
            );
            setFilteredProducts(filtered);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    }, [productSearch]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="w-12 h-12 border-4 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
    );

    if (!order) return <div className="p-8 text-center text-slate-500">Registry entry not found.</div>;

    const statusOptions = ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Delivered', 'Cancelled'];

    return (
        <div className="min-h-screen bg-slate-50/50 p-4 md:p-6 pb-32">
            <div className="max-w-[1400px] mx-auto">
                {/* Unified Header */}
                <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-6">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => navigate('/orders')}
                            className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                        >
                            <ChevronLeft size={20} className="text-slate-600" />
                        </button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Order Command Center</h1>
                                <span className="text-slate-400 font-mono text-[10px] bg-slate-100 px-2 py-1 rounded leading-none border border-slate-200">#{order._id.slice(-8)}</span>
                            </div>
                            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mt-1.5 flex items-center gap-2">
                                <Activity size={12} />
                                Registry Entry: {new Date(order.createdAt).toLocaleString()}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {!isEditing ? (
                            <>
                                <button 
                                    onClick={() => setShowReceipt(true)}
                                    className="px-5 py-2.5 bg-slate-900 text-gold rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center gap-2.5 shadow-lg shadow-slate-900/10"
                                >
                                    <Printer size={14} /> Reprint Bill
                                </button>
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:border-primary hover:text-primary transition-all flex items-center gap-2.5 shadow-sm"
                                >
                                    <Edit3 size={14} /> Modify Specifications
                                </button>
                                <button 
                                    onClick={handleDelete}
                                    className="px-5 py-2.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all flex items-center gap-2.5"
                                >
                                    <Trash2 size={14} /> Purge Entry
                                </button>
                            </>
                        ) : (
                            <>
                                <button 
                                    onClick={handleSaveChanges}
                                    disabled={updating}
                                    className="px-8 py-2.5 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all flex items-center gap-2.5 shadow-xl shadow-primary/20"
                                >
                                    <Save size={14} /> {updating ? 'Synchronizing...' : 'Save Changes'}
                                </button>
                                <button 
                                    onClick={() => { setIsEditing(false); setFormData(order); }}
                                    className="px-5 py-2.5 bg-white border border-slate-200 text-slate-400 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2.5"
                                >
                                    <X size={14} /> Cancel
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Items Section */}
                        <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                            <div className="p-6 md:p-8 border-b border-slate-50 flex items-center justify-between bg-white/50">
                                <h2 className="font-black text-slate-900 uppercase text-[11px] tracking-[0.2em] flex items-center gap-3">
                                    <div className="w-1.5 h-4 bg-primary rounded-full"></div>
                                    Payload Specifications
                                </h2>
                                
                                {isEditing && (
                                    <div className="flex items-center gap-3">
                                        <div className="relative group">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={12} />
                                            <input 
                                                type="text"
                                                placeholder="Quick Add Product..."
                                                value={productSearch}
                                                onChange={(e) => setProductSearch(e.target.value)}
                                                className="pl-8 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 text-[10px] font-bold w-48"
                                            />
                                            {showSuggestions && filteredProducts.length > 0 && (
                                                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-100 z-50 py-1 overflow-hidden">
                                                    {filteredProducts.map(p => (
                                                        <button 
                                                            key={p._id}
                                                            onClick={() => addProductFromSearch(p)}
                                                            className="w-full px-4 py-2 text-left hover:bg-slate-50 text-[10px] font-black text-slate-600 uppercase"
                                                        >
                                                            {p.pName} - Rs.{p.price}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <button 
                                            onClick={addCustomRow}
                                            className="p-2 bg-slate-900 text-gold rounded-lg hover:bg-primary hover:text-white transition-all shadow-md"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="p-0">
                                {!isEditing ? (
                                    <table className="w-full">
                                        <thead className="bg-slate-50/50">
                                            <tr className="text-left border-b border-slate-100">
                                                <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Asset Handle</th>
                                                <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Unit Val</th>
                                                <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Batch</th>
                                                <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Net val</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {order.items.map((item, idx) => (
                                                <React.Fragment key={idx}>
                                                    <tr className="hover:bg-slate-50/30 transition-colors">
                                                        <td className="px-8 py-5">
                                                            <p className="font-black text-slate-900 uppercase tracking-tight text-sm">{item.pName}</p>
                                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.category}</span>
                                                        </td>
                                                        <td className="px-8 py-5 text-right">
                                                            <p className="text-xs font-bold text-slate-600">Rs.{item.price.toLocaleString()}</p>
                                                        </td>
                                                        <td className="px-8 py-5 text-center">
                                                            <p className="text-xs font-black text-slate-900 bg-slate-100 w-fit mx-auto px-3 py-1.5 rounded-lg shadow-sm">
                                                                {item.quantity} <span className="text-[10px] text-slate-400 lowercase font-bold">{item.unit || 'pcs'}</span>
                                                            </p>
                                                        </td>
                                                        <td className="px-8 py-5 text-right font-black text-slate-900 text-sm">
                                                            Rs.{(item.price * item.quantity).toLocaleString()}
                                                        </td>
                                                    </tr>
                                                    {(item.customization?.message || item.customization?.flavor || item.description) && (
                                                        <tr className="bg-amber-50/10">
                                                            <td colSpan="4" className="px-8 py-3 border-none">
                                                                <div className="flex flex-wrap gap-5 text-[9px]">
                                                                    {item.customization?.message && (
                                                                        <div className="border-l-2 border-amber-200 pl-3">
                                                                            <span className="text-amber-600 font-black uppercase tracking-widest block mb-0.5">Inscription</span>
                                                                            <span className="text-slate-800 italic">"{item.customization.message}"</span>
                                                                        </div>
                                                                    )}
                                                                    {item.customization?.flavor && (
                                                                        <div className="border-l-2 border-amber-200 pl-3">
                                                                            <span className="text-amber-600 font-black uppercase tracking-widest block mb-0.5">Flavor</span>
                                                                            <span className="text-slate-900 font-black uppercase">{item.customization.flavor}</span>
                                                                        </div>
                                                                    )}
                                                                    {item.description && (
                                                                        <div className="border-l-2 border-slate-200 pl-3">
                                                                            <span className="text-slate-400 font-black uppercase tracking-widest block mb-0.5">Special Directives</span>
                                                                            <span className="text-slate-600 font-medium">{item.description}</span>
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
                                                <td colSpan="3" className="px-8 py-6 font-black text-slate-400 uppercase tracking-[0.3em] text-right">Net Aggregate Val</td>
                                                <td className="px-8 py-6 text-right">
                                                    <p className="text-3xl font-black text-primary tracking-tighter">Rs.{order.totalAmount.toLocaleString()}</p>
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                ) : (
                                    <div className="p-8 space-y-6">
                                        {formData.items.map((item, idx) => (
                                            <div key={idx} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 relative group/row">
                                                <div className="grid grid-cols-12 gap-6 items-center">
                                                    <div className="col-span-4 space-y-1.5">
                                                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Asset Name</label>
                                                        {item.isCustom ? (
                                                            <input 
                                                                type="text"
                                                                value={item.pName}
                                                                onChange={(e) => handleItemChange(idx, 'pName', e.target.value)}
                                                                className="w-full px-3 py-2 bg-white border border-primary/20 rounded-lg text-[11px] font-black outline-none"
                                                            />
                                                        ) : (
                                                            <select 
                                                                value={item.pName}
                                                                onChange={(e) => handleItemChange(idx, 'pName', e.target.value)}
                                                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-[11px] font-black outline-none appearance-none"
                                                            >
                                                                {products.map(p => <option key={p._id} value={p.pName}>{p.pName}</option>)}
                                                            </select>
                                                        )}
                                                    </div>
                                                    <div className="col-span-2 space-y-1.5">
                                                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Price</label>
                                                        <input 
                                                            type="number"
                                                            value={item.price}
                                                            onChange={(e) => handleItemChange(idx, 'price', parseFloat(e.target.value) || 0)}
                                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-[11px] font-black outline-none"
                                                        />
                                                    </div>
                                                    <div className="col-span-3 space-y-1.5">
                                                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Qty / Unit</label>
                                                        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-2">
                                                            <button onClick={() => handleItemChange(idx, 'quantity', Math.max(0, item.quantity - 1))} className="text-slate-400"><Minus size={12} /></button>
                                                            <input 
                                                                type="number"
                                                                value={item.quantity}
                                                                onChange={(e) => handleItemChange(idx, 'quantity', parseFloat(e.target.value) || 0)}
                                                                className="w-10 text-center text-[11px] font-black outline-none"
                                                            />
                                                            <button onClick={() => handleItemChange(idx, 'quantity', item.quantity + 1)} className="text-slate-400"><Plus size={12} /></button>
                                                            <select 
                                                                value={item.unit || 'pcs'}
                                                                onChange={(e) => handleItemChange(idx, 'unit', e.target.value)}
                                                                className="bg-transparent text-[10px] font-black text-primary outline-none"
                                                            >
                                                                <option value="pcs">pcs</option>
                                                                <option value="kg">kg</option>
                                                                <option value="box">box</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="col-span-2 text-right pt-4">
                                                        <p className="text-[10px] font-black text-slate-900">Rs.{(item.price * item.quantity).toLocaleString()}</p>
                                                    </div>
                                                    <div className="col-span-1 flex justify-end pt-4">
                                                        <button 
                                                            onClick={() => removeItem(idx)}
                                                            className="p-2 bg-rose-50 text-rose-500 rounded-lg hover:bg-rose-500 hover:text-white transition-all"
                                                        >
                                                            <Trash2 size={12} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">New Manifest Total</span>
                                            <span className="text-2xl font-black text-primary">Rs.{calculateTotal().toLocaleString()}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Customer & Address Section */}
                        <div className="bg-white p-8 rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100">
                            <h2 className="font-black text-slate-900 uppercase text-[10px] tracking-[0.3em] mb-8 flex items-center gap-3">
                                <div className="w-1.5 h-3 bg-slate-900 rounded-full"></div>
                                Client Profile Specifications
                            </h2>
                            <div className="grid grid-cols-2 gap-x-10 gap-y-8">
                                <div className="space-y-1.5">
                                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block ml-1">Authorized Principal</label>
                                    {!isEditing ? (
                                        <span className="font-black text-slate-900 uppercase tracking-tight text-sm block">{order.customerName}</span>
                                    ) : (
                                        <input 
                                            type="text" name="customerName" value={formData.customerName} onChange={handleChange}
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-primary/5"
                                        />
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block ml-1">Communications Vector</label>
                                    {!isEditing ? (
                                        <span className="font-black text-slate-900 uppercase tracking-tight text-sm block">{order.phone || 'DECRYPT_FAILURE'}</span>
                                    ) : (
                                        <input 
                                            type="text" name="phone" value={formData.phone} onChange={handleChange}
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-primary/5"
                                        />
                                    )}
                                </div>
                                <div className="col-span-2 space-y-1.5">
                                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block ml-1">Deployment Hub (Address)</label>
                                    {!isEditing ? (
                                        <span className="font-medium text-slate-600 italic text-sm block">"{order.address || 'LOC_REDACTED'}"</span>
                                    ) : (
                                        <textarea 
                                            name="address" value={formData.address} onChange={handleChange} rows="2"
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium outline-none focus:ring-4 focus:ring-primary/5 resize-none"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Status, Timeline, Financials */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* State Controller */}
                        <div className="bg-white p-7 rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100">
                            <h2 className="font-black text-slate-900 uppercase text-[10px] tracking-[0.3em] mb-8 flex items-center gap-3">
                                <div className="w-1.5 h-4 bg-primary rounded-full"></div>
                                State Controller
                            </h2>
                            <div className="space-y-3">
                                {statusOptions.map(status => (
                                    <button 
                                        key={status}
                                        disabled={updating || order.orderStatus === status || isEditing}
                                        onClick={() => handleStatusUpdate(status)}
                                        className={`w-full text-left px-5 py-4 rounded-2xl border transition-all flex items-center justify-between group/status ${
                                            order.orderStatus === status 
                                            ? 'bg-slate-900 border-slate-900 text-gold shadow-xl shadow-slate-900/10' 
                                            : 'bg-white border-slate-100 text-slate-400 hover:border-primary/30 hover:text-slate-900'
                                        } disabled:opacity-50`}
                                    >
                                        <span className={`text-[11px] font-black uppercase tracking-[0.2em] ${order.orderStatus === status ? '' : 'group-hover/status:translate-x-1 transition-transform'}`}>{status}</span>
                                        {order.orderStatus === status && (
                                            <div className="w-2 h-2 bg-gold rounded-full shadow-[0_0_12px_gold]"></div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Financial Registry */}
                        <div className="bg-slate-900 p-8 rounded-[32px] shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                            <h2 className="font-black text-white uppercase text-[10px] tracking-[0.4em] mb-8 relative z-10 flex items-center gap-3">
                                <div className="w-1.5 h-3 bg-primary rounded-full"></div>
                                Economic Manifest
                            </h2>
                            <div className="space-y-5 relative z-10">
                                <div className="flex justify-between items-center bg-white/5 px-4 py-3 rounded-xl border border-white/5">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Asset Gross Val</span>
                                    <span className="text-xs font-black text-white">Rs.{order.totalAmount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center bg-white/5 px-4 py-3 rounded-xl border border-white/5">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Advance Held</span>
                                    <span className="text-xs font-black text-emerald-400">Rs.{order.advanceAmount?.toLocaleString() || 0}</span>
                                </div>
                                <div className="flex justify-between items-center bg-white/10 px-4 py-4 rounded-xl border border-primary/20">
                                    <span className="text-[9px] font-black text-primary uppercase tracking-widest">Balance Outstanding</span>
                                    <span className="text-lg font-black text-gold italic tracking-tighter">Rs.{(order.totalAmount - (order.advanceAmount || 0)).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${order.paymentStatus === 'Paid' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>
                                        {order.paymentStatus}
                                    </span>
                                </div>

                                {order.paymentStatus !== 'Paid' && !isEditing && (
                                    <button 
                                        onClick={async () => {
                                            if (window.confirm('Commit final settlement to the registry?')) {
                                                try {
                                                    const token = localStorage.getItem('token');
                                                    await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${order._id}`, { 
                                                        advanceAmount: order.totalAmount,
                                                        paymentStatus: 'Paid' 
                                                    }, {
                                                        headers: { Authorization: `Bearer ${token}` }
                                                    });
                                                    toast.success('Full settlement committed');
                                                    fetchOrder();
                                                } catch (error) {
                                                    toast.error('Financial authorization failed');
                                                }
                                            }
                                        }}
                                        className="w-full py-4 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] hover:bg-white hover:text-slate-900 transition-all shadow-xl shadow-primary/20 mt-4"
                                    >
                                        Authorize Settlement
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Logistics Timeline */}
                        <div className="bg-white p-8 rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100">
                            <h2 className="font-black text-slate-900 uppercase text-[10px] tracking-[0.3em] mb-8 flex items-center gap-3">
                                <div className="w-1.5 h-3 bg-slate-200 rounded-full"></div>
                                Logistics Parameters
                            </h2>
                            <div className="space-y-6">
                                <div className="flex items-center gap-5">
                                    <div className="p-3 bg-slate-50 text-slate-400 rounded-xl border border-slate-100"><Calendar size={18} /></div>
                                    <div className="flex-1">
                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Target Delivery Date</span>
                                        {!isEditing ? (
                                            <p className="font-black text-slate-900 uppercase text-xs">{order.scheduleDate || 'IMMEDIATE'}</p>
                                        ) : (
                                            <input 
                                                type="date" name="scheduleDate" value={formData.scheduleDate} onChange={handleChange}
                                                className="w-full bg-slate-50 border border-slate-100 rounded-lg p-2 text-xs font-black outline-none"
                                            />
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-5">
                                    <div className="p-3 bg-slate-50 text-slate-400 rounded-xl border border-slate-100"><Clock size={18} /></div>
                                    <div className="flex-1">
                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Fulfillment Window</span>
                                        {!isEditing ? (
                                            <p className="font-black text-slate-900 uppercase text-xs">{order.scheduleTime || 'ANYTIME'}</p>
                                        ) : (
                                            <input 
                                                type="time" name="scheduleTime" value={formData.scheduleTime} onChange={handleChange}
                                                className="w-full bg-slate-50 border border-slate-100 rounded-lg p-2 text-xs font-black outline-none"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Receipt Modal */}
            {showReceipt && <Receipt order={order} onClose={() => setShowReceipt(false)} />}
        </div>
    );
};

export default OrderDetails;