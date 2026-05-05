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
  Minus
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
    
    const [formData, setFormData] = useState({
        customerName: 'Walk-in Customer',
        clientId: 'WALK-IN',
        phone: '',
        address: '',
        type: 'Order',
        items: [],
        scheduleDate: '',
        scheduleTime: ''
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
            
            // If fulfillment type changes to DirectSale, lock as Walk-in
            if (name === 'type' && value === 'DirectSale') {
                updated.customerName = 'Walk-in Customer';
                updated.clientId = 'WALK-IN';
            }
            
            return updated;
        });
    };

    const addItem = () => {
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, { pName: '', category: '', quantity: 1, price: 0, isCustom: false, customization: { message: '', flavor: '', specialInstructions: '' } }]
        }));
    };

    const addProductFromSearch = (product) => {
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, { 
                pName: product.pName, 
                category: product.pCategory, 
                quantity: 1, 
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
                p.pName.toLowerCase().includes(productSearch.toLowerCase()) || 
                p.productId.toLowerCase().includes(productSearch.toLowerCase())
            );
            setFilteredProducts(filtered);
            setShowSuggestions(true);
        } else {
            setFilteredProducts([]);
            setShowSuggestions(false);
        }
    }, [productSearch, products]);

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
        
        if (field === 'pName') {
            if (value === 'CUSTOM_ITEM') {
                newItems[index] = {
                    ...newItems[index],
                    pName: '',
                    category: 'Cake',
                    price: 0,
                    isCustom: true
                };
            } else if (!newItems[index].isCustom) {
                const selectedProd = products.find(p => p.pName === value);
                if (selectedProd) {
                    newItems[index] = {
                        ...newItems[index],
                        pName: selectedProd.pName,
                        category: selectedProd.pCategory,
                        price: selectedProd.price,
                        isCustom: false
                    };
                }
            } else {
                newItems[index] = { ...newItems[index], pName: value };
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
        <div className="space-y-10 max-w-[1500px] mx-auto">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100">
                <div>
                    <div className="flex items-center gap-2.5 mb-3">
                        <span className="w-10 h-1 bg-primary rounded-full"></span>
                        <p className="text-primary font-black uppercase tracking-[0.4em] text-[9px]">Commercial Provisioning Interface</p>
                    </div>
                    <h1 className="heading-premium text-2xl md:text-5xl leading-tight">{id ? 'Synchronize' : 'Authorize'} <span className="italic font-medium text-slate-400">Order</span></h1>
                    <p className="text-slate-400 font-medium mt-2 md:mt-3 text-sm md:text-base max-w-2xl">Manage detailed specifications and authorize order transmissions.</p>
                </div>
                
                <button 
                   onClick={() => navigate(-1)}
                   className="flex items-center gap-2.5 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-all group"
                >
                   <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
                   Return to Ledger
                </button>
            </header>

            <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left Column: Form Sections */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Customer Details */}
                        <div className="glass-card p-6 md:p-10 rounded-[28px] md:rounded-[40px] bg-white border-none shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 md:w-30 md:h-30 bg-slate-50 rounded-full -mr-12 -mt-12 md:-mr-15 md:-mt-15 opacity-50"></div>
                            <div className="flex items-center gap-3.5 mb-8 md:mb-10 relative z-10">
                                <div className="p-2.5 md:p-3.5 bg-slate-900 text-gold rounded-lg md:rounded-xl shadow-xl"><User size={18} md:size={22} /></div>
                                <div>
                                   <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight uppercase">Customer details</h2>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7 relative z-10">
                                <div className="space-y-1.5 group">
                                    <label className="block text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Customer Type</label>
                                    <input 
                                        type="text" name="customerName" value={formData.customerName} onChange={handleChange}
                                        placeholder="Enter Customer Name"
                                        disabled={formData.customerName === 'Walk-in Customer'}
                                        className={`w-full px-5 py-3 md:py-3.5 border border-slate-100 rounded-lg md:rounded-xl outline-none transition-all font-bold text-xs md:text-sm ${
                                            formData.customerName === 'Walk-in Customer' 
                                            ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                                            : "bg-slate-50 text-slate-900 focus:ring-4 focus:ring-primary/5 focus:border-primary"
                                        }`}
                                    />
                                </div>
                                <div className="space-y-1.5 group">
                                    <label className="block text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Customer Name</label>
                                    <input 
                                        type="text" name="clientId" value={formData.clientId || ''} onChange={handleChange}
                                        placeholder="CUST-XXXX"
                                        className="w-full px-5 py-3 md:py-3.5 bg-slate-50 border border-slate-100 rounded-lg md:rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-slate-900 text-xs md:text-sm"
                                    />
                                </div>
                                <div className="space-y-1.5 group">
                                    <label className="block text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Number</label>
                                    <input 
                                        type="text" name="phone" value={formData.phone} onChange={handleChange}
                                        placeholder="+94 XX XXX XXXX"
                                        className="w-full px-5 py-3 md:py-3.5 bg-slate-50 border border-slate-100 rounded-lg md:rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-slate-900 text-xs md:text-sm"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-1.5 group">
                                    <label className="block text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Address</label>
                                    <textarea 
                                        name="address" value={formData.address} onChange={handleChange} rows="2"
                                        placeholder="Street Address, City, Administrative Region"
                                        className="w-full px-5 py-3 md:py-3.5 bg-slate-50 border border-slate-100 rounded-lg md:rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium text-slate-900 resize-none text-xs md:text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="glass-card rounded-[24px] md:rounded-[40px] bg-white border-none shadow-xl overflow-hidden">
                            <div className="p-5 md:p-8 border-b border-slate-50 flex flex-col xl:flex-row justify-between items-center bg-white/50 backdrop-blur-xl gap-6">
                                <div className="flex items-center gap-3.5 w-full xl:w-auto">
                                    <div className="p-2.5 md:p-3.5 bg-slate-900 text-gold rounded-lg md:rounded-xl shadow-xl"><ShoppingCart size={18} md:size={22} /></div>
                                    <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight uppercase">Product Details</h2>
                                </div>

                                <div className="flex flex-col md:flex-row items-center gap-4 w-full xl:w-auto flex-1 justify-end">
                                    {/* Search Bar */}
                                    <div className="relative w-full md:max-w-xl group flex-1">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={16} />
                                        <input 
                                            type="text"
                                            value={productSearch}
                                            onChange={(e) => setProductSearch(e.target.value)}
                                            placeholder="Quick Search: Type product name or ID..."
                                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-slate-900 placeholder:text-slate-200 text-xs shadow-inner"
                                        />
                                        
                                        {/* Search Suggestions */}
                                        {showSuggestions && filteredProducts.length > 0 && (
                                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 z-50 max-h-64 overflow-y-auto no-scrollbar py-2 animate-in fade-in slide-in-from-top-2">
                                                {filteredProducts.map(p => (
                                                    <button
                                                        key={p.productId}
                                                        type="button"
                                                        onClick={() => addProductFromSearch(p)}
                                                        className="w-full px-5 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors text-left border-b border-slate-50 last:border-0"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                                                                <Package size={14} className="text-slate-300" />
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{p.pName}</p>
                                                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{p.productId}</p>
                                                            </div>
                                                        </div>
                                                        <span className="text-[10px] font-black text-primary">Rs.{p.price}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-2 w-full md:w-auto">
                                        <button 
                                            type="button" onClick={addCustomCake}
                                            className="flex-1 md:flex-none px-8 py-3.5 bg-slate-900 text-gold rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2.5 shadow-xl"
                                        >
                                            <CakeIcon size={14} /> Custom Cake
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 md:p-8 space-y-5 md:space-y-6">
                                {formData.items.map((item, index) => (
                                    <div key={index} className="p-5 md:p-8 rounded-[24px] md:rounded-[32px] bg-slate-50/50 border border-slate-100 relative group/item hover:bg-white hover:shadow-2xl transition-all duration-500 overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-slate-200 group-hover/item:bg-primary transition-colors"></div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-5 md:gap-6 items-center">
                                            <div className={`sm:col-span-2 ${item.isCustom ? 'lg:col-span-8' : 'lg:col-span-4'} space-y-1.5`}>
                                                <label className="block text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Asset Entity selection</label>
                                                {item.isCustom ? (
                                                    <div className="flex gap-2">
                                                        <input 
                                                            type="text" 
                                                            value={item.pName}
                                                            onChange={(e) => handleItemChange(index, 'pName', e.target.value)}
                                                            placeholder="Enter Custom Item Name..."
                                                            className="flex-1 px-4 md:px-5 py-3 md:py-3.5 bg-white border border-primary/20 rounded-lg md:rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-slate-900 text-[10px] md:text-xs shadow-sm"
                                                            required
                                                        />
                                                    </div>
                                                ) : (
                                                    <select 
                                                        value={item.pName} 
                                                        onChange={(e) => handleItemChange(index, 'pName', e.target.value)}
                                                        className="w-full px-4 md:px-5 py-3 md:py-3.5 bg-white border border-slate-100 rounded-lg md:rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-black text-slate-900 appearance-none cursor-pointer uppercase text-[9px] md:text-[10px] tracking-wider shadow-sm"
                                                        required
                                                    >
                                                        <option value="">Select Asset...</option>
                                                        <option value="CUSTOM_ITEM" className="text-primary font-bold">✨ CUSTOM ORDER (MANUAL ENTRY)</option>
                                                        {products.map(p => (
                                                            <option key={p.productId} value={p.pName}>{p.pName} (Rs.{p.price})</option>
                                                        ))}
                                                    </select>
                                                )}
                                            </div>

                                            {!item.isCustom && (
                                                <>
                                                    <div className="lg:col-span-3 space-y-1.5">
                                                        <label className="block text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Taxonomy Class</label>
                                                        <div className="px-4 md:px-5 py-3 md:py-3.5 bg-white border border-slate-100 rounded-lg md:rounded-xl text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] leading-relaxed shadow-sm">
                                                            {item.category || "---"}
                                                        </div>
                                                    </div>
                                                    <div className="lg:col-span-2 space-y-1.5">
                                                        <label className="block text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Valuation</label>
                                                        <div className="px-4 md:px-5 py-3 md:py-3.5 bg-white border border-slate-100 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black text-slate-900 shadow-sm">
                                                            Rs.{item.price.toLocaleString()}
                                                        </div>
                                                    </div>
                                                </>
                                            )}

                                            <div className="lg:col-span-2 space-y-1.5">
                                                <label className="block text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Order Quantity</label>
                                                <div className="flex items-center gap-1 bg-white border border-slate-100 rounded-xl p-1 shadow-sm">
                                                    <button 
                                                        type="button"
                                                        onClick={() => handleItemChange(index, 'quantity', Math.max(1, (item.quantity || 1) - 1))}
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-colors"
                                                    >
                                                        <Minus size={12} />
                                                    </button>
                                                    <div className="flex-1 text-center font-black text-slate-900 text-xs">
                                                        {item.quantity || 1}
                                                    </div>
                                                    <button 
                                                        type="button"
                                                        onClick={() => handleItemChange(index, 'quantity', (item.quantity || 1) + 1)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 text-slate-400 hover:bg-emerald-50 hover:text-emerald-500 transition-colors"
                                                    >
                                                        <Plus size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="lg:col-span-1 flex justify-end pt-4">
                                                <button 
                                                    type="button" onClick={() => removeItem(index)}
                                                    className="p-3 md:p-3.5 bg-rose-50 text-rose-400 hover:text-white hover:bg-rose-500 rounded-lg md:rounded-xl transition-all shadow-sm"
                                                >
                                                    <Trash2 size={16} md:size={18} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Customization Layer */}
                                        {(item.category?.toLowerCase()?.includes('cake') || item.isCustom) && (
                                            <div className="mt-8 pt-8 border-t border-slate-200/50 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top-4">
                                                {/* Description Field - Always shown for Custom, or as Notes for others */}
                                                <div className={`${item.isCustom ? 'md:col-span-2' : 'md:col-span-3'} space-y-2 mb-2`}>
                                                    <div className="flex items-center gap-2.5 mb-0.5">
                                                        <FileText size={12} md:size={14} className={item.isCustom ? "text-primary" : "text-slate-400"} />
                                                        <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">
                                                            {item.isCustom ? "Custom Specifications / Description" : "Operational Notes / Description"}
                                                        </p>
                                                    </div>
                                                    <textarea 
                                                        placeholder={item.isCustom ? "Detail the custom requirements here..." : "Any additional details..."}
                                                        value={item.description || ''}
                                                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                                        className="w-full px-5 py-3 bg-white border border-slate-100 rounded-xl text-[10px] md:text-[11px] font-medium text-slate-900 outline-none focus:ring-4 focus:ring-primary/5 min-h-[80px] resize-none shadow-sm"
                                                    />
                                                </div>

                                                {/* Price Field for Custom Items */}
                                                {item.isCustom && (
                                                    <div className="md:col-span-1 space-y-2 mb-2">
                                                        <div className="flex items-center gap-2.5 mb-0.5">
                                                            <Activity size={12} md:size={14} className="text-emerald-500" />
                                                            <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Settlement Valuation (Price)</p>
                                                        </div>
                                                        <div className="relative group">
                                                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400">Rs.</span>
                                                            <input 
                                                                type="number"
                                                                placeholder="0.00"
                                                                value={item.price}
                                                                onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)}
                                                                className="w-full pl-12 pr-5 py-3 bg-slate-50 border border-slate-100 rounded-xl text-lg font-black text-slate-900 outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all shadow-inner"
                                                            />
                                                        </div>
                                                        <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest mt-2 ml-1 italic">Manual entry required for custom assets</p>
                                                    </div>
                                                )}
                                                
                                                {/* Specialized Cake Fields - Only for Catalog Cakes */}
                                                {item.category?.toLowerCase()?.includes('cake') && !item.isCustom && (
                                                    <>
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-2.5 mb-0.5">
                                                               <FileText size={12} md:size={14} className="text-primary" />
                                                               <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Inscripted Message</p>
                                                            </div>
                                                            <input 
                                                                type="text" 
                                                                placeholder="Happy Anniversary..."
                                                                value={item.customization?.message || ''}
                                                                onChange={(e) => handleItemChange(index, 'customization', { ...item.customization, message: e.target.value })}
                                                                className="w-full px-5 py-2.5 bg-white border border-slate-100 rounded-lg text-[10px] md:text-[11px] font-bold text-slate-900 outline-none focus:ring-4 focus:ring-primary/5"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-2.5 mb-0.5">
                                                               <Star size={12} md:size={14} className="text-gold" />
                                                               <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Flavor Profile</p>
                                                            </div>
                                                            <input 
                                                                type="text" 
                                                                placeholder="Velvet, Truffle..."
                                                                value={item.customization?.flavor || ''}
                                                                onChange={(e) => handleItemChange(index, 'customization', { ...item.customization, flavor: e.target.value })}
                                                                className="w-full px-5 py-2.5 bg-white border border-slate-100 rounded-lg text-[10px] md:text-[11px] font-bold text-slate-900 outline-none focus:ring-4 focus:ring-primary/5"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-2.5 mb-0.5">
                                                               <Settings size={12} md:size={14} className="text-slate-400" />
                                                               <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Operational Notes</p>
                                                            </div>
                                                            <input 
                                                                type="text" 
                                                                placeholder="Special instructions..."
                                                                value={item.customization?.specialInstructions || ''}
                                                                onChange={(e) => handleItemChange(index, 'customization', { ...item.customization, specialInstructions: e.target.value })}
                                                                className="w-full px-5 py-2.5 bg-white border border-slate-100 rounded-lg text-[10px] md:text-[11px] font-bold text-slate-900 outline-none focus:ring-4 focus:ring-primary/5"
                                                            />
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {formData.items.length > 0 && (
                                    <div className="p-6 md:p-8 bg-slate-900 rounded-[24px] md:rounded-[32px] mt-10 border border-gold/10 shadow-2xl relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-gold/10 transition-all duration-700"></div>
                                        <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-gold/10 text-gold rounded-2xl">
                                                    <Activity size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Transmission Valuation</p>
                                                    <h3 className="text-xl md:text-2xl font-black text-white tracking-tighter uppercase">Total Order Amount</h3>
                                                </div>
                                            </div>
                                            <div className="text-center md:text-right">
                                                <p className="text-[10px] font-black text-gold uppercase tracking-[0.2em] mb-1">Final Settlement</p>
                                                <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter italic">
                                                    Rs.{calculateTotal().toLocaleString()}
                                                </h2>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {formData.items.length === 0 && (
                                    <div className="text-center py-20 bg-slate-50 border-4 border-dashed border-slate-100 rounded-[32px]">
                                        <div className="w-16 h-16 bg-white rounded-[24px] flex items-center justify-center mx-auto mb-5 shadow-sm">
                                            <Package size={32} className="text-slate-100" />
                                        </div>
                                        <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[9px]">Purchase Manifest is currently empty.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Totals & Settings */}
                    <div className="space-y-10">
                        {/* Summary Card */}
                        <div className="glass-card p-6 md:p-10 rounded-[32px] md:rounded-[48px] bg-slate-900 border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.4)] relative overflow-hidden group">
                           <div className="absolute bottom-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-primary rounded-full blur-[80px] md:blur-[100px] opacity-20 group-hover:scale-125 transition-transform duration-1000" />
                            
                           <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-500 mb-8 md:mb-10 relative z-10">Economic Settlement</p>
                           <div className="space-y-5 md:space-y-6 mb-8 md:mb-10 relative z-10">
                               <div className="flex justify-between items-center">
                                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Asset Gross Value</span>
                                   <span className="font-bold text-white text-xs md:text-sm">Rs.{calculateTotal().toLocaleString()}</span>
                               </div>
                               <div className="flex justify-between items-center">
                                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Commission Protocol</span>
                                   <span className="px-2.5 py-1 bg-white/10 rounded-lg font-black text-gold text-[8px] uppercase tracking-widest border border-white/5">Waived</span>
                               </div>
                               <div className="h-px bg-white/10" />
                               <div className="flex flex-col gap-1.5">
                                   <span className="text-[9px] font-black uppercase tracking-[0.4em] text-primary">Final Net Settlement</span>
                                   <span className="text-2xl md:text-4xl font-black text-white tracking-tighter">Rs.{calculateTotal().toLocaleString()}</span>
                               </div>
                           </div>

                           <button 
                               type="submit" disabled={loading}
                               className="w-full py-4.5 md:py-5 bg-primary text-white rounded-xl md:rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl shadow-primary/20 hover:bg-white hover:text-slate-900 transition-all duration-500 disabled:opacity-50 relative z-10"
                           >
                               {loading ? (
                                   <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                               ) : (
                                   id ? `Authorize Update (Rs.${calculateTotal().toLocaleString()})` : `Commit Transmission (Rs.${calculateTotal().toLocaleString()})`
                               )}
                           </button>
                        </div>

                        {/* Scheduling Settings */}
                        <div className="glass-card p-6 md:p-10 rounded-[32px] md:rounded-[48px] bg-white border-none shadow-xl relative overflow-hidden">
                            <div className="flex items-center gap-3.5 mb-8 md:mb-10">
                                <div className="p-2.5 md:p-3.5 bg-slate-50 text-slate-900 rounded-lg md:rounded-xl border border-slate-100"><Calendar size={18} md:size={22} /></div>
                                <div>
                                   <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight uppercase">Timeline</h2>
                                   <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Operational Parameters</p>
                                 </div>
                            </div>
                            
                            <div className="space-y-5 md:space-y-6">
                                <div className="space-y-1.5 md:space-y-2">
                                    <label className="block text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Fulfillment Vector</label>
                                    <select 
                                        name="type" value={formData.type} onChange={handleChange}
                                        className="w-full px-5 md:px-6 py-3.5 md:py-4 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-black text-slate-900 appearance-none cursor-pointer uppercase text-[8px] md:text-[9px] tracking-widest shadow-sm"
                                    >
                                        <option value="Order">Standard Pipeline</option>
                                        <option value="DirectSale">Direct Acquisition (POS)</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5 md:space-y-2">
                                    <label className="block text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Fulfillment Date</label>
                                    <div className="relative group">
                                       <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={14} md:size={16} />
                                       <input 
                                            type="date" name="scheduleDate" value={formData.scheduleDate} onChange={handleChange}
                                            className="w-full pl-12 md:pl-14 pr-5 md:pr-6 py-3.5 md:py-4 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-black text-slate-900 text-[11px] md:text-xs shadow-sm"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5 md:space-y-2">
                                    <label className="block text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Operational Window (Time)</label>
                                    <div className="relative group">
                                       <Clock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={14} md:size={16} />
                                       <input 
                                            type="time" name="scheduleTime" value={formData.scheduleTime} onChange={handleChange}
                                            className="w-full pl-12 md:pl-14 pr-5 md:pr-6 py-3.5 md:py-4 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-black text-slate-900 text-[11px] md:text-xs shadow-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Security Verification */}
                        <div className="p-8 rounded-[32px] bg-emerald-50 border border-emerald-100 flex items-start gap-4 shadow-sm">
                            <CheckCircle2 className="text-emerald-500 mt-0.5" size={20} md:size={22} />
                            <div>
                                <p className="text-[9px] font-black text-emerald-700 uppercase tracking-widest mb-1">Integrity Verified</p>
                                <p className="text-[9px] font-bold text-emerald-600 leading-relaxed uppercase tracking-wider">Transmission sequence is logged and encrypted in the master registry.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default OrderForm;