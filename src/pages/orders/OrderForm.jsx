import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import orderApi from '../../api/orderApi';
import productApi from '../../api/productApi';

const OrderForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    
    const [formData, setFormData] = useState({
        customerName: 'Walk-in Customer',
        phone: '',
        address: '',
        type: 'Order',
        items: [],
        scheduleDate: '',
        scheduleTime: ''
    });

    useEffect(() => {
        fetchProducts();
        if (id) {
            fetchOrder();
        }
    }, [id]);

    const fetchProducts = async () => {
        try {
            const data = await productApi.getProducts();
            setProducts(data);
        } catch (error) {
            console.error('Failed to fetch products');
        }
    };

    const fetchOrder = async () => {
        try {
            const order = await orderApi.getOrderById(id);
            setFormData(order);
        } catch (error) {
            console.error('Failed to fetch order details');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const addItem = () => {
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, { pName: '', category: '', quantity: 1, price: 0 }]
        }));
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
            const selectedProd = products.find(p => p.pName === value);
            if (selectedProd) {
                newItems[index] = {
                    ...newItems[index],
                    pName: selectedProd.pName,
                    category: selectedProd.pCategory,
                    price: selectedProd.price
                };
            }
        } else {
            newItems[index] = { ...newItems[index], [field]: value };
        }
        
        setFormData(prev => ({ ...prev, items: newItems }));
    };

    const calculateTotal = () => {
        return formData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (id) {
                await orderApi.updateOrder(id, formData);
            } else {
                await orderApi.createOrder(formData);
            }
            navigate('/orders');
        } catch (error) {
            alert(error.response?.data?.message || 'Error saving order');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <button 
                        onClick={() => navigate(-1)}
                        className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                        <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{id ? 'Edit Order' : 'Create New Order'}</h1>
                        <p className="text-slate-500 text-sm">Fill in the details below to reach out to your customers.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
                        <h2 className="text-lg font-semibold text-slate-800 pb-2 border-b border-slate-100">Customer Details</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Customer Name</label>
                                <input 
                                    type="text" name="customerName" value={formData.customerName} onChange={handleChange}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 active:bg-white outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                                <input 
                                    type="text" name="phone" value={formData.phone} onChange={handleChange}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 active:bg-white outline-none"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                                <textarea 
                                    name="address" value={formData.address} onChange={handleChange} rows="2"
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 active:bg-white outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                            <h2 className="text-lg font-semibold text-slate-800">Order Items</h2>
                            <button 
                                type="button" onClick={addItem}
                                className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Add Item
                            </button>
                        </div>

                        {formData.items.map((item, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end bg-slate-50 p-4 rounded-lg relative group">
                                <div className="md:col-span-4">
                                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Product</label>
                                    <select 
                                        value={item.pName} 
                                        onChange={(e) => handleItemChange(index, 'pName', e.target.value)}
                                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none"
                                        required
                                    >
                                        <option value="">Select Product</option>
                                        {products.map(p => (
                                            <option key={p.productId} value={p.pName}>{p.pName} (${p.price})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="md:col-span-3">
                                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Category</label>
                                    <input type="text" value={item.category} readOnly className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-500" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Price</label>
                                    <input type="number" value={item.price} readOnly className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-500" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Qty</label>
                                    <input 
                                        type="number" min="1" value={item.quantity} 
                                        onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none"
                                        required
                                    />
                                </div>
                                <div className="md:col-span-1 text-right">
                                    <button 
                                        type="button" onClick={() => removeItem(index)}
                                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}

                        {formData.items.length === 0 && (
                            <div className="text-center py-8 text-slate-400 border-2 border-dashed border-slate-100 rounded-xl">
                                No items added yet. Click "Add Item" to start.
                            </div>
                        )}

                        <div className="flex justify-end pt-4 border-t border-slate-100">
                            <div className="text-right">
                                <span className="text-slate-500 text-sm">Total Amount:</span>
                                <div className="text-3xl font-bold text-slate-900">${calculateTotal().toFixed(2)}</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
                        <h2 className="text-lg font-semibold text-slate-800 pb-2 border-b border-slate-100">Order Settings</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Order Type</label>
                                <select 
                                    name="type" value={formData.type} onChange={handleChange}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 active:bg-white outline-none"
                                >
                                    <option value="Order">Standard Order</option>
                                    <option value="DirectSale">Direct Sale (POS)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Schedule Date</label>
                                <input 
                                    type="date" name="scheduleDate" value={formData.scheduleDate} onChange={handleChange}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 active:bg-white outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Schedule Time</label>
                                <input 
                                    type="time" name="scheduleTime" value={formData.scheduleTime} onChange={handleChange}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 active:bg-white outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button 
                            type="button" onClick={() => navigate('/orders')}
                            className="px-6 py-2.5 border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" disabled={loading}
                            className="px-8 py-2.5 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-md active:scale-95 disabled:bg-indigo-400"
                        >
                            {loading ? 'Processing...' : (id ? 'Update Order' : 'Complete Order')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OrderForm;
