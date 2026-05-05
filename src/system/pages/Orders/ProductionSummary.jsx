import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  Calendar, 
  ChevronLeft, 
  ChefHat, 
  Clock, 
  Package, 
  Printer, 
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProductionSummary = () => {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, [selectedDate]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            // Fetching all orders for the date. We'll filter and aggregate on the client side.
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Filter by date and active status (Pending, Confirmed, Preparing)
            const filtered = response.data.filter(order => {
                const isCorrectDate = order.scheduleDate === selectedDate;
                const isActive = ['Pending', 'Confirmed', 'Preparing'].includes(order.orderStatus);
                return isCorrectDate && isActive;
            });

            setOrders(filtered);
            aggregateProduction(filtered);
        } catch (error) {
            toast.error("Failed to fetch production data");
        } finally {
            setLoading(false);
        }
    };

    const aggregateProduction = (activeOrders) => {
        const prodMap = {};

        activeOrders.forEach(order => {
            order.items.forEach(item => {
                const key = `${item.pName} (${item.category})`;
                if (!prodMap[key]) {
                    prodMap[key] = {
                        name: item.pName,
                        category: item.category,
                        totalQuantity: 0,
                        orders: []
                    };
                }
                prodMap[key].totalQuantity += item.quantity;
                prodMap[key].orders.push({
                    customer: order.customerName,
                    quantity: item.quantity,
                    time: order.scheduleTime || 'Not set',
                    note: item.description || ''
                });
            });
        });

        // Convert map to sorted array
        const sortedArray = Object.values(prodMap).sort((a, b) => b.totalQuantity - a.totalQuantity);
        setSummary(sortedArray);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="space-y-8 max-w-[1200px] mx-auto p-4 md:p-0 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 print:hidden">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/orders')}
                        className="p-2 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-100"
                    >
                        <ChevronLeft className="text-slate-400" />
                    </button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Production <span className="italic font-medium text-slate-400">Sheet</span></h1>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Daily Baking & Preparation Summary</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="date" 
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary font-bold text-sm"
                        />
                    </div>
                    <button 
                        onClick={handlePrint}
                        className="p-2.5 bg-slate-900 text-gold rounded-xl hover:bg-primary hover:text-white transition-all shadow-lg"
                    >
                        <Printer size={18} />
                    </button>
                </div>
            </div>

            {/* Print Header (Visible only when printing) */}
            <div className="hidden print:block text-center border-b-2 border-slate-900 pb-6 mb-8">
                <h1 className="text-3xl font-black uppercase tracking-tighter">NIROSHA Sweets</h1>
                <h2 className="text-xl font-bold mt-2">PRODUCTION SUMMARY SHEET</h2>
                <p className="text-lg mt-1 font-black">DATE: {new Date(selectedDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <ChefHat className="w-12 h-12 text-slate-200 animate-bounce" />
                    <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Assembling production data...</p>
                </div>
            ) : summary.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[40px] border border-dashed border-slate-200">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                        <Filter className="text-slate-200" size={32} />
                    </div>
                    <h3 className="text-slate-900 font-black uppercase tracking-widest">No Active Orders</h3>
                    <p className="text-slate-400 text-xs mt-2 font-medium">No items scheduled for preparation on this date.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {/* Totals Section */}
                    <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <ChefHat size={120} />
                        </div>
                        <h3 className="text-gold font-black uppercase tracking-[0.2em] text-[10px] mb-6">Total Items to Prepare</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {summary.map((item, idx) => (
                                <div key={idx} className="space-y-1 border-l-2 border-gold/20 pl-4">
                                    <p className="text-2xl font-black">{item.totalQuantity}</p>
                                    <p className="text-[10px] font-bold text-white/60 uppercase tracking-wider line-clamp-1">{item.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Detailed Production List */}
                    <div className="space-y-4">
                        <h3 className="text-slate-900 font-black uppercase tracking-widest text-[11px] ml-4">Detailed Breakdown</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {summary.map((item, idx) => (
                                <div key={idx} className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary">
                                                <Package size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-slate-900 uppercase tracking-tight">{item.name}</h4>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.category}</p>
                                            </div>
                                        </div>
                                        <div className="bg-slate-900 text-gold px-4 py-2 rounded-xl text-xl font-black">
                                            {item.totalQuantity}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Linked Orders</p>
                                        <div className="space-y-2">
                                            {item.orders.map((ord, oIdx) => (
                                                <div key={oIdx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                                                        <div>
                                                            <p className="text-[11px] font-black text-slate-900 uppercase">{ord.customer}</p>
                                                            {ord.note && <p className="text-[9px] text-slate-400 italic">"{ord.note}"</p>}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[11px] font-black text-slate-900">Qty: {ord.quantity}</p>
                                                        <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400 mt-0.5">
                                                            <Clock size={10} />
                                                            {ord.time}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Print Footer */}
            <div className="hidden print:flex justify-between mt-12 pt-8 border-t border-slate-200 italic text-slate-400 text-xs">
                <p>Generated on {new Date().toLocaleString()}</p>
                <p>Nirosha Sweets Operations System</p>
            </div>
        </div>
    );
};

export default ProductionSummary;
