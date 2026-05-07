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
        customerName: '',
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
                updated.customerName = '';
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

        const submissionData = {
            ...formData,
            customerName: formData.customerName.trim() || 'Walk-in Customer'
        };

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (id) {
                await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${id}`, submissionData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success("Order sequence synchronized");
            } else {
                await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/orders`, submissionData, {
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
        <div className="min-h-screen bg-slate-50/50 pb-12 overflow-x-hidden">
            {/* Sticky Modern Header */}
            <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200 px-4 md:px-8 py-4 shadow-sm">
                <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-5">
                        <button onClick={() => navigate(-1)} className="p-2.5 bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-600 rounded-xl transition-all shadow-inner"><ArrowLeft size={20} /></button>
                        <div className="flex flex-col">
                            <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-none">
                                {id ? 'Synchronize' : 'Authorize'} <span className="text-primary italic">Sequence</span>
                            </h1>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Registry Provisioning Portal</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <button 
                            type="button" 
                            onClick={() => handleSubmit({ preventDefault: () => {} })}
                            disabled={loading || formData.items.length === 0}
                            className="px-8 py-3 bg-slate-900 text-gold rounded-xl font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center gap-3 shadow-xl shadow-slate-900/10"
                        >
                            {loading ? <Loader2 size={16} className="animate-spin" /> : <><CheckCircle2 size={16} /> {id ? 'Update Registry' : 'Commit Entry'}</>}
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto p-4 md:p-6 space-y-6">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                    {/* Left Column: Specifications */}
                    <div className="xl:col-span-8 space-y-6">
                        {/* Customer Profile Card */}
                        <div className="bg-white p-6 md:p-8 rounded-[32px] border border-slate-200/60 shadow-sm relative overflow-hidden">
                            <h2 className="font-black text-slate-900 uppercase text-[11px] tracking-[0.4em] mb-6 flex items-center gap-3">
                                <div className="w-2 h-4 bg-slate-900 rounded-full"></div> Client Identification
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block ml-1">Entity Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={16} />
                                        <input 
                                            type="text" name="customerName" value={formData.customerName} onChange={handleChange}
                                            placeholder="Walk-in Customer"
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-black text-xs text-slate-900 uppercase tracking-tight"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block ml-1">Registry ID</label>
                                    <input 
                                        type="text" name="clientId" value={formData.clientId || ''} onChange={handleChange}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-black text-xs text-slate-900 uppercase"
                                        placeholder="AUTOGEN_NODE"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block ml-1">Contact Vector</label>
                                    <input 
                                        type="text" name="phone" value={formData.phone} onChange={handleChange}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-black text-xs text-slate-900"
                                        placeholder="+94 XXX XXX XXXX"
                                    />
                                </div>
                                <div className="md:col-span-3 space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block ml-1">Deployment Coordinate (Address)</label>
                                    <textarea 
                                        name="address" value={formData.address} onChange={handleChange} rows="2"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium text-xs text-slate-900 resize-none italic"
                                        placeholder="Enter secure delivery coordinates..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Product Manifest Card */}
                        <div className="bg-white rounded-[32px] border border-slate-200/60 shadow-sm overflow-hidden">
                            <div className="px-6 py-5 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between bg-slate-50/30 gap-4">
                                <h2 className="font-black text-slate-900 uppercase text-[11px] tracking-[0.4em] flex items-center gap-3">
                                    <div className="w-2 h-4 bg-primary rounded-full"></div> Payload Manifest
                                </h2>

                                <div className="flex items-center gap-3 w-full md:w-auto">
                                    <div className="relative group flex-1 md:w-80">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={14} />
                                        <input 
                                            type="text"
                                            value={productSearch}
                                            onChange={(e) => setProductSearch(e.target.value)}
                                            placeholder="Quick Search Product..."
                                            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-black text-[10px] text-slate-900 uppercase tracking-widest"
                                        />
                                        {showSuggestions && filteredProducts.length > 0 && (
                                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 max-h-80 overflow-y-auto p-2">
                                                {filteredProducts.map(p => (
                                                    <button
                                                        key={p.productId}
                                                        type="button"
                                                        onClick={() => addProductFromSearch(p)}
                                                        className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 rounded-lg transition-colors text-left group"
                                                    >
                                                        <div>
                                                            <p className="text-[11px] font-black text-slate-900 uppercase group-hover:text-primary">{p.pName}</p>
                                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{p.productId}</p>
                                                        </div>
                                                        <span className="text-[11px] font-black text-slate-900">Rs.{p.price}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <button 
                                        type="button" onClick={addCustomCake}
                                        className="px-5 py-2.5 bg-slate-900 text-gold rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center gap-2"
                                    >
                                        <Plus size={14} /> Custom Asset
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 md:p-8 space-y-4">
                                {formData.items.map((item, index) => (
                                    <div key={index} className="p-6 rounded-[24px] bg-slate-50/50 border border-slate-100 hover:bg-white hover:border-primary/20 hover:shadow-xl hover:shadow-slate-200/20 transition-all duration-500 group/row">
                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                                            <div className="md:col-span-4 space-y-1.5">
                                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block ml-1">Asset Node</label>
                                                {item.isCustom ? (
                                                    <input 
                                                        type="text" 
                                                        value={item.pName}
                                                        onChange={(e) => handleItemChange(index, 'pName', e.target.value)}
                                                        className="w-full px-4 py-2.5 bg-white border border-primary/20 rounded-xl text-xs font-black outline-none uppercase"
                                                        placeholder="Enter Custom Asset Name..."
                                                    />
                                                ) : (
                                                    <div className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-900 uppercase truncate">
                                                        {item.pName}
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <div className="md:col-span-2 space-y-1.5">
                                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block ml-1">Valuation</label>
                                                <div className="relative">
                                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400">Rs.</span>
                                                    <input 
                                                        type="number"
                                                        value={item.price}
                                                        onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)}
                                                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-black outline-none focus:border-primary transition-colors"
                                                    />
                                                </div>
                                            </div>

                                            <div className="md:col-span-3 space-y-1.5">
                                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block ml-1">Quantity / Unit</label>
                                                <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl px-2 py-1.5 shadow-sm">
                                                    <button type="button" onClick={() => handleItemChange(index, 'quantity', Math.max(0, (item.quantity || 1) - 1))} className="p-1.5 text-slate-300 hover:text-rose-500 transition-colors"><Minus size={14} /></button>
                                                    <input 
                                                        type="number" step="0.1" value={item.quantity}
                                                        onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                                                        className="w-12 text-center text-xs font-black outline-none bg-transparent"
                                                    />
                                                    <button type="button" onClick={() => handleItemChange(index, 'quantity', (item.quantity || 1) + 1)} className="p-1.5 text-slate-300 hover:text-emerald-500 transition-colors"><Plus size={14} /></button>
                                                    <div className="w-px h-5 bg-slate-100 mx-2"></div>
                                                    <select 
                                                        value={item.unit || 'pcs'} 
                                                        onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                                                        className="text-[10px] font-black text-primary bg-transparent outline-none uppercase cursor-pointer"
                                                    >
                                                        <option value="pcs">pcs</option>
                                                        <option value="kg">kg</option>
                                                        <option value="box">box</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="md:col-span-2 text-right">
                                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Net val</p>
                                                <p className="text-sm font-black text-slate-900 tracking-tighter">Rs.{(item.price * item.quantity).toLocaleString()}</p>
                                            </div>

                                            <div className="md:col-span-1 flex justify-end gap-2">
                                                <button 
                                                    type="button" 
                                                    onClick={() => setExpandedItems(prev => ({ ...prev, [index]: !prev[index] }))}
                                                    className={`p-2.5 rounded-xl transition-all shadow-sm ${expandedItems[index] ? 'bg-primary text-white' : 'bg-white border border-slate-200 text-slate-300 hover:text-primary hover:border-primary'}`}
                                                >
                                                    <FileText size={16} />
                                                </button>
                                                <button type="button" onClick={() => removeItem(index)} className="p-2.5 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all border border-rose-100 shadow-sm"><Trash2 size={16} /></button>
                                            </div>
                                        </div>

                                        {expandedItems[index] && (
                                            <div className="mt-6 pt-6 border-t border-slate-200/60 grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
                                                <div className="space-y-2">
                                                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Asset Specifications</p>
                                                    <textarea 
                                                        value={item.description || ''}
                                                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                                        className="w-full px-5 py-3 bg-white border border-slate-200 rounded-2xl text-[11px] font-medium outline-none h-24 resize-none focus:border-primary transition-all shadow-inner"
                                                        placeholder="Specify custom requirements or notes..."
                                                    />
                                                </div>
                                                <div className="space-y-4">
                                                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Design Parameters</p>
                                                    <div className="grid grid-cols-1 gap-4">
                                                        <div className="space-y-1.5">
                                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Inscription</label>
                                                            <input 
                                                                type="text" value={item.customization?.message || ''}
                                                                onChange={(e) => handleItemChange(index, 'customization', { ...item.customization, message: e.target.value })}
                                                                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[11px] font-black outline-none focus:border-primary transition-all uppercase"
                                                                placeholder="Greeting Message..."
                                                            />
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Flavor Vector</label>
                                                            <input 
                                                                type="text" value={item.customization?.flavor || ''}
                                                                onChange={(e) => handleItemChange(index, 'customization', { ...item.customization, flavor: e.target.value })}
                                                                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[11px] font-black outline-none focus:border-primary transition-all uppercase"
                                                                placeholder="Flavor Profile..."
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {formData.items.length === 0 && (
                                    <div className="text-center py-20 bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-[40px] flex flex-col items-center gap-4">
                                        <div className="w-16 h-16 bg-white rounded-2xl shadow-inner flex items-center justify-center text-slate-200">
                                            <ChefHat size={32} />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">Payload manifest is empty</p>
                                            <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-1 italic">Initiate sequence by selecting assets above</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Parameters & Financials */}
                    <div className="xl:col-span-4 space-y-6">
                        {/* Timeline Card */}
                        <div className="bg-white rounded-[32px] border border-slate-200/60 shadow-sm p-6 md:p-8">
                            <h2 className="font-black text-slate-900 uppercase text-[11px] tracking-[0.4em] mb-6 flex items-center gap-3">
                                <div className="w-2 h-4 bg-slate-900 rounded-full"></div> Lifecycle Parameters
                            </h2>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block ml-1">Acquisition Pipeline</label>
                                    <select 
                                        name="type" value={formData.type} onChange={handleChange}
                                        className="w-full px-5 py-3.5 bg-slate-900 text-gold rounded-2xl outline-none shadow-lg font-black text-[11px] uppercase tracking-widest cursor-pointer hover:bg-primary hover:text-white transition-all"
                                    >
                                        <option value="Order">Standard Pipeline (Scheduled)</option>
                                        <option value="DirectSale">Direct Acquisition (POS)</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-1 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block ml-1">Fulfillment Date</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                            <input 
                                                type="date" name="scheduleDate" value={formData.scheduleDate} onChange={handleChange}
                                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-primary transition-all font-black text-[11px] text-slate-900 uppercase"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block ml-1">Window Lock</label>
                                        <div className="relative">
                                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                            <input 
                                                type="time" name="scheduleTime" value={formData.scheduleTime} onChange={handleChange}
                                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-primary transition-all font-black text-[11px] text-slate-900"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Financial Settlement Card */}
                        <div className="bg-slate-900 rounded-[40px] p-8 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-[80px] -mr-24 -mt-24 group-hover:scale-150 transition-transform duration-1000"></div>
                            
                            <h2 className="font-black text-white uppercase text-[11px] tracking-[0.4em] mb-10 flex items-center gap-3">
                                <div className="w-2 h-4 bg-primary rounded-full animate-pulse"></div> Financial Settlement
                            </h2>

                            <div className="space-y-8 relative z-10">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-slate-500 font-black uppercase text-[11px] tracking-widest border-b border-white/5 pb-3">
                                        <span>Gross Valuation</span>
                                        <span className="text-white text-base font-black tracking-tighter">Rs.{calculateTotal().toLocaleString()}</span>
                                    </div>

                                    <div className="space-y-2.5">
                                        <label className="text-[11px] font-black text-primary uppercase tracking-widest block ml-1">Advance Commitment</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[11px] font-black text-slate-500 italic">Rs.</span>
                                            <input 
                                                type="number" name="advanceAmount" value={formData.advanceAmount} 
                                                onChange={(e) => setFormData(prev => ({ ...prev, advanceAmount: parseFloat(e.target.value) || 0 }))}
                                                className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-black text-white text-base tracking-tighter"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 bg-white/5 rounded-3xl border border-white/5 flex justify-between items-center shadow-inner group-hover:bg-white/10 transition-all duration-500">
                                    <div className="space-y-1">
                                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest block leading-none">Net Liability</span>
                                        <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">Residual Balance</span>
                                    </div>
                                    <span className="text-3xl font-black text-gold italic tracking-tighter drop-shadow-lg animate-in zoom-in-50">
                                        Rs.{(calculateTotal() - (Number(formData.advanceAmount) || 0)).toLocaleString()}
                                    </span>
                                </div>

                                <button 
                                    type="submit" disabled={loading || formData.items.length === 0}
                                    className="w-full py-5 bg-primary text-white rounded-2xl font-black text-[12px] uppercase tracking-[0.3em] shadow-2xl shadow-primary/30 hover:bg-white hover:text-slate-900 transition-all duration-500 disabled:opacity-30 flex items-center justify-center gap-4 active:scale-95"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                        <>{id ? 'Authorize Update' : 'Authorize Commitment'} <Plus size={20} /></>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Integrity Seal */}
                        <div className="p-6 rounded-[32px] bg-emerald-50/50 border border-emerald-100 flex items-center gap-5">
                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-emerald-500 border border-emerald-50">
                                <CheckCircle2 size={20} />
                            </div>
                            <div className="flex-1">
                                <p className="text-[11px] font-black text-emerald-700 uppercase tracking-widest leading-none mb-1.5">Integrity Seal</p>
                                <p className="text-[9px] font-black text-emerald-600/60 uppercase tracking-widest italic leading-relaxed">Registry entry will be encrypted upon commitment.</p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OrderForm;