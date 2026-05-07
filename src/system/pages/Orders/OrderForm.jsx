import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  ShoppingCart, 
  User, 
  Calendar, 
  Clock, 
  CheckCircle2,
  Package,
  FileText,
  Star,
  Settings,
  Activity,
  Loader2,
  X,
  Search,
  Cake as CakeIcon,
  Minus,
  ChefHat
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const OrderForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [productSearch, setProductSearch] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [expandedItems, setExpandedItems] = useState({});
    
    const [formData, setFormData] = useState({
        customerName: 'Walk-in Customer',
        clientId: 'WALK-IN',
        phone: '',
        address: '',
        type: 'Order',
        items: [],
        scheduleDate: new Date().toISOString().split('T')[0],
        scheduleTime: '12:00',
        advanceAmount: 0
    });

    useEffect(() => {
        fetchProducts();
        fetchCategories();
        if (id) {
            fetchOrder();
        }
    }, [id]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/categories`);
            setCategories(response.data.data);
        } catch (error) {
            console.error("Failed to load categories");
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products`);
            setProducts(response.data.data);
        } catch (error) {
            toast.error("Failed to load catalog");
        }
    };

    const fetchOrder = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFormData(response.data);
        } catch (error) {
            toast.error("Failed to retrieve order sequence");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const updated = { ...prev, [name]: value };
            if (name === 'type' && value === 'DirectSale') {
                updated.customerName = 'Walk-in Customer';
                updated.clientId = 'WALK-IN';
            }
            return updated;
        });
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
        toast.success(`${product.pName} added`);
    };

    const addCustomCake = () => {
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
        toast.success("Custom Cake row added");
    };

    useEffect(() => {
        if (productSearch.trim()) {
            const filtered = products.filter(p => 
                (p.pName || "").toLowerCase().includes(productSearch.toLowerCase()) || 
                (p.productId || "").toLowerCase().includes(productSearch.toLowerCase())
            );
            setFilteredProducts(filtered);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    }, [productSearch]);

    const calculateTotal = () => {
        return formData.items.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);
    };

    const removeItem = (index) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }));
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.items.length === 0) return toast.error("Transaction requires at least one item.");

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (id) {
                await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success("Order sequence synchronized");
            } else {
                await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/orders`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success("Transaction successfully committed");
            }
            navigate('/orders');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Transaction error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
            <div className="max-w-[1400px] mx-auto space-y-8">
                {/* Compact Modern Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Order Provisioning</p>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter">
                            {id ? 'Synchronize' : 'Authorize'} <span className="text-slate-500 italic font-medium">Order</span>
                        </h1>
                    </div>
                    
                    <button 
                       onClick={() => navigate(-1)}
                       className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-900 hover:text-primary hover:border-primary transition-all shadow-md"
                    >
                       <ArrowLeft size={14} className="text-primary" /> Return to Ledger
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Specifications */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Customer Profile Card */}
                        <div className="bg-white rounded-[24px] border border-slate-200/60 shadow-xl shadow-slate-200/20 p-6 md:p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                                <User size={120} />
                            </div>
                            
                            <div className="flex items-center gap-3 mb-8 relative z-10">
                                <div className="p-2.5 bg-slate-900 text-gold rounded-xl shadow-lg shadow-slate-900/10">
                                    <User size={18} />
                                </div>
                                <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Customer Profile</h2>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest block ml-1">Profile Category</label>
                                    <input 
                                        type="text" name="customerName" value={formData.customerName} onChange={handleChange}
                                        placeholder="Full Name / Type"
                                        disabled={formData.customerName === 'Walk-in Customer'}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-xs text-slate-900 disabled:opacity-50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest block ml-1">Registry Handle (ID)</label>
                                    <input 
                                        type="text" name="clientId" value={formData.clientId || ''} onChange={handleChange}
                                        placeholder="WALK-IN"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-xs text-slate-900"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest block ml-1">Contact Link (Phone)</label>
                                    <input 
                                        type="text" name="phone" value={formData.phone} onChange={handleChange}
                                        placeholder="+94 XX XXX XXXX"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-xs text-slate-900"
                                    />
                                </div>
                                <div className="md:col-span-3 space-y-2">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block ml-1">Deployment Location (Address)</label>
                                    <textarea 
                                        name="address" value={formData.address} onChange={handleChange} rows="2"
                                        placeholder="Street Address, City, Region..."
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium text-xs text-slate-900 resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Product Manifest Card */}
                        <div className="bg-white rounded-[24px] border border-slate-200/60 shadow-xl shadow-slate-200/20 overflow-hidden">
                            <div className="p-6 md:p-8 bg-slate-50/50 border-b border-slate-100 flex flex-col xl:flex-row justify-between items-center gap-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-slate-900 text-gold rounded-xl shadow-lg shadow-slate-900/10">
                                        <ShoppingCart size={18} />
                                    </div>
                                    <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Product Manifest</h2>
                                </div>

                                <div className="flex flex-col md:flex-row items-center gap-3 w-full xl:w-auto">
                                    {/* Search */}
                                    <div className="relative w-full md:w-80 group">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={14} />
                                        <input 
                                            type="text"
                                            value={productSearch}
                                            onChange={(e) => setProductSearch(e.target.value)}
                                            placeholder="Quick Search Product..."
                                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-xs text-slate-900"
                                        />
                                        {showSuggestions && filteredProducts.length > 0 && (
                                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-100 z-50 max-h-60 overflow-y-auto py-2">
                                                {filteredProducts.map(p => (
                                                    <button
                                                        key={p.productId}
                                                        type="button"
                                                        onClick={() => addProductFromSearch(p)}
                                                        className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
                                                    >
                                                        <div>
                                                            <p className="text-[10px] font-black text-slate-900 uppercase">{p.pName}</p>
                                                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{p.productId}</p>
                                                        </div>
                                                        <span className="text-[10px] font-black text-primary">Rs.{p.price}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <button 
                                        type="button" onClick={addCustomCake}
                                        className="w-full md:w-auto px-6 py-2.5 bg-slate-900 text-gold rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 shadow-lg"
                                    >
                                        <CakeIcon size={14} /> Custom Asset
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 md:p-8 space-y-4">
                                {formData.items.map((item, index) => (
                                    <div key={index} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-primary/20 hover:shadow-xl transition-all duration-300 group/row">
                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                                            <div className="md:col-span-4 space-y-1">
                                                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block ml-1">Asset Selection</label>
                                                {item.isCustom ? (
                                                    <input 
                                                        type="text" 
                                                        value={item.pName}
                                                        onChange={(e) => handleItemChange(index, 'pName', e.target.value)}
                                                        className="w-full px-3 py-2 bg-white border border-primary/20 rounded-lg text-xs font-black outline-none"
                                                    />
                                                ) : (
                                                    <select 
                                                        value={item.pName} 
                                                        onChange={(e) => handleItemChange(index, 'pName', e.target.value)}
                                                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-black outline-none appearance-none cursor-pointer"
                                                    >
                                                        <option value="">Select Product...</option>
                                                        {products.map(p => <option key={p.productId} value={p.pName}>{p.pName}</option>)}
                                                    </select>
                                                )}
                                            </div>
                                            
                                            <div className="md:col-span-2 space-y-1">
                                                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block ml-1">Valuation</label>
                                                <div className="relative group/price">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-400">Rs.</span>
                                                    <input 
                                                        type="number"
                                                        value={item.price}
                                                        onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)}
                                                        className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-black outline-none focus:border-primary"
                                                    />
                                                </div>
                                            </div>

                                            <div className="md:col-span-3 space-y-1">
                                                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block ml-1">Quantity / Unit</label>
                                                <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-2 py-1">
                                                    <button type="button" onClick={() => handleItemChange(index, 'quantity', Math.max(0, (item.quantity || 1) - 1))} className="p-1 text-slate-400 hover:text-rose-500 transition-colors"><Minus size={12} /></button>
                                                    <input 
                                                        type="number" step="0.01" value={item.quantity}
                                                        onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                                                        className="w-10 text-center text-[11px] font-black outline-none"
                                                    />
                                                    <button type="button" onClick={() => handleItemChange(index, 'quantity', (item.quantity || 1) + 1)} className="p-1 text-slate-400 hover:text-emerald-500 transition-colors"><Plus size={12} /></button>
                                                    <div className="w-px h-4 bg-slate-100 mx-1"></div>
                                                    <select 
                                                        value={item.unit || 'pcs'} 
                                                        onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                                                        className="text-[9px] font-black text-primary bg-transparent outline-none uppercase"
                                                    >
                                                        <option value="pcs">pcs</option>
                                                        <option value="kg">kg</option>
                                                        <option value="box">box</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="md:col-span-2 text-right">
                                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Net Value</p>
                                                <p className="text-xs font-black text-slate-900">Rs.{(item.price * item.quantity).toLocaleString()}</p>
                                            </div>

                                            <div className="md:col-span-1 flex justify-end gap-2">
                                                <button 
                                                    type="button" 
                                                    onClick={() => setExpandedItems(prev => ({ ...prev, [index]: !prev[index] }))}
                                                    className={`p-2 rounded-lg transition-all ${expandedItems[index] ? 'bg-primary text-white' : 'bg-white border border-slate-100 text-slate-300 hover:text-primary'}`}
                                                >
                                                    <FileText size={14} />
                                                </button>
                                                <button type="button" onClick={() => removeItem(index)} className="p-2 bg-rose-50 text-rose-400 rounded-lg hover:bg-rose-500 hover:text-white transition-all"><Trash2 size={14} /></button>
                                            </div>
                                        </div>

                                        {expandedItems[index] && (
                                            <div className="mt-4 pt-4 border-t border-slate-200/50 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                                                <div className="space-y-1.5">
                                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Specifications / Notes</p>
                                                    <textarea 
                                                        value={item.description || ''}
                                                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                                        className="w-full px-4 py-2 bg-white border border-slate-100 rounded-xl text-[10px] font-medium outline-none h-16 resize-none"
                                                        placeholder="Add item specific details..."
                                                    />
                                                </div>
                                                {item.category?.toLowerCase()?.includes('cake') && (
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div className="space-y-1.5">
                                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Inscription</p>
                                                            <input 
                                                                type="text" value={item.customization?.message || ''}
                                                                onChange={(e) => handleItemChange(index, 'customization', { ...item.customization, message: e.target.value })}
                                                                className="w-full px-3 py-2 bg-white border border-slate-100 rounded-lg text-[10px] font-bold outline-none"
                                                            />
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Flavor Profile</p>
                                                            <input 
                                                                type="text" value={item.customization?.flavor || ''}
                                                                onChange={(e) => handleItemChange(index, 'customization', { ...item.customization, flavor: e.target.value })}
                                                                className="w-full px-3 py-2 bg-white border border-slate-100 rounded-lg text-[10px] font-bold outline-none"
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {formData.items.length === 0 && (
                                    <div className="text-center py-16 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[24px]">
                                        <ChefHat size={32} className="text-slate-200 mx-auto mb-4" />
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Manifest is currently empty.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Parameters & Financials */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Timeline Card */}
                        <div className="bg-white rounded-[24px] border border-slate-200/60 shadow-xl shadow-slate-200/20 p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2.5 bg-slate-50 text-slate-900 rounded-xl border border-slate-100">
                                    <Calendar size={18} />
                                </div>
                                <div>
                                    <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest">Timeline</h2>
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Fulfillment Windows</p>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block ml-1">Acquisition Vector</label>
                                    <select 
                                        name="type" value={formData.type} onChange={handleChange}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-primary transition-all font-black text-[10px] text-slate-900 uppercase"
                                    >
                                        <option value="Order">Standard Pipeline</option>
                                        <option value="DirectSale">Direct Acquisition (POS)</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block ml-1">Target Date</label>
                                        <input 
                                            type="date" name="scheduleDate" value={formData.scheduleDate} onChange={handleChange}
                                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-primary transition-all font-black text-[10px] text-slate-900"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block ml-1">Target Window</label>
                                        <input 
                                            type="time" name="scheduleTime" value={formData.scheduleTime} onChange={handleChange}
                                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-primary transition-all font-black text-[10px] text-slate-900"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Financial Settlement Card */}
                        <div className="bg-slate-900 rounded-[32px] p-8 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-125 transition-transform duration-1000"></div>
                            
                            <div className="flex items-center gap-3 mb-10 relative z-10">
                                <div className="w-1.5 h-4 bg-primary rounded-full"></div>
                                <h2 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Financial Settlement</h2>
                            </div>

                            <div className="space-y-6 relative z-10">
                                <div className="flex justify-between items-end border-b border-white/5 pb-4">
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Gross Valuation</span>
                                    <span className="text-lg font-black text-white">Rs.{calculateTotal().toLocaleString()}</span>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-primary uppercase tracking-widest block ml-1">Advance Commitment</label>
                                    <div className="relative group/adv">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-500">Rs.</span>
                                        <input 
                                            type="number" name="advanceAmount" value={formData.advanceAmount} 
                                            onChange={(e) => setFormData(prev => ({ ...prev, advanceAmount: parseFloat(e.target.value) || 0 }))}
                                            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all font-black text-white text-xs"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-between items-center py-4 px-5 bg-white/5 rounded-2xl border border-white/5">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Balance Due</span>
                                    <span className="text-xl font-black text-gold italic tracking-tighter">
                                        Rs.{(calculateTotal() - (Number(formData.advanceAmount) || 0)).toLocaleString()}
                                    </span>
                                </div>

                                <button 
                                    type="submit" disabled={loading || formData.items.length === 0}
                                    className="w-full py-4.5 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] shadow-xl shadow-primary/20 hover:bg-white hover:text-slate-900 transition-all duration-500 disabled:opacity-30 flex items-center justify-center gap-3"
                                >
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                        <>Authorize Commitment <Plus size={14} /></>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Security Disclaimer */}
                        <div className="p-6 rounded-[24px] bg-emerald-50 border border-emerald-100 flex items-start gap-4">
                            <CheckCircle2 className="text-emerald-500 mt-1" size={18} />
                            <div>
                                <p className="text-[9px] font-black text-emerald-700 uppercase tracking-widest mb-0.5">Integrity Guard</p>
                                <p className="text-[8px] font-bold text-emerald-600/70 leading-relaxed uppercase tracking-widest italic">Sequence will be encrypted in the master ledger upon authorization.</p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OrderForm;