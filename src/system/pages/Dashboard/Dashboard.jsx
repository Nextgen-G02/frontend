import React, { useState, useEffect } from "react";
import { 
  Users, Package, ShoppingBag, TrendingUp, Clock, ArrowUpRight, ArrowDownRight,
  Loader2, ChevronRight, Monitor, PlusCircle, FileText, Calendar, Star, MessageSquare, Award
} from "lucide-react";
import { useAuth } from "../../../shared/context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StatCard = ({ icon: Icon, label, value, trend, trendType, isLoading }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 rounded-xl bg-slate-50 text-slate-700">
        <Icon size={22} />
      </div>
      <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
        trendType === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
      }`}>
        {trendType === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {trend}
      </div>
    </div>
    <h3 className="text-slate-500 text-sm font-medium mb-1">{label}</h3>
    {isLoading ? (
      <div className="h-8 w-24 bg-slate-100 animate-pulse rounded-lg mt-1"></div>
    ) : (
      <p className="text-3xl font-bold text-slate-900">{value}</p>
    )}
  </div>
);

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    stats: {
      registryAssets: 0,
      activeTransmissions: 0,
      customerBase: 0,
      grossYield: 0
    },
    chartData: [],
    recentReviews: [],
    upcomingDeliveries: [],
    topProducts: [],
    recentOrders: []
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        const backendUrl = import.meta.env.VITE_BACKEND_URL;

        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);

        const results = await Promise.allSettled([
          axios.get(`${backendUrl}/api/products`, { headers }),
          axios.get(`${backendUrl}/api/orders`, { headers }),
          axios.get(`${backendUrl}/api/customers`, { headers }),
          axios.get(`${backendUrl}/api/financials/summary`, { headers }),
          axios.get(`${backendUrl}/api/financials/daily-revenue?startDate=${startDate.toISOString().split('T')[0]}&endDate=${endDate.toISOString().split('T')[0]}`, { headers }),
          axios.get(`${backendUrl}/api/reviews/admin`, { headers })
        ]);

        let totalProducts = 0;
        let liveOrders = 0;
        let totalCustomers = 0;
        let grossYield = 0;
        let chartData = [];
        let recentReviews = [];
        let upcomingDeliveries = [];
        let topProducts = [];
        let recentOrders = [];

        if (results[0].status === 'fulfilled') {
          const products = Array.isArray(results[0].value.data.data) ? results[0].value.data.data : (Array.isArray(results[0].value.data) ? results[0].value.data : []);
          totalProducts = products.length;
        }
        
        if (results[1].status === 'fulfilled') {
          const rawOrders = results[1].value.data;
          const orders = Array.isArray(rawOrders.data) ? rawOrders.data : (Array.isArray(rawOrders) ? rawOrders : []);
          
          liveOrders = orders.filter(o => !['Completed', 'Delivered', 'Cancelled'].includes(o.orderStatus)).length;
          
          upcomingDeliveries = orders
            .filter(o => o.type === 'Order' && !['Completed', 'Delivered', 'Cancelled'].includes(o.orderStatus) && o.scheduleDate)
            .sort((a, b) => new Date(a.scheduleDate) - new Date(b.scheduleDate))
            .slice(0, 4);

          const productCounts = {};
          orders.forEach(o => {
            o.items?.forEach(item => {
              productCounts[item.pName] = (productCounts[item.pName] || 0) + item.quantity;
            });
          });
          topProducts = Object.entries(productCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
            
          recentOrders = [...orders]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);
        }

        if (results[2].status === 'fulfilled') {
          const rawCust = results[2].value.data;
          const customers = Array.isArray(rawCust.data) ? rawCust.data : (Array.isArray(rawCust) ? rawCust : []);
          totalCustomers = customers.length;
        }

        if (results[3].status === 'fulfilled') {
          grossYield = results[3].value.data?.data?.grossYield || 0;
        }

        if (results[4].status === 'fulfilled') {
          chartData = results[4].value.data.data.map(item => ({
            name: new Date(item._id).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
            revenue: item.revenue
          }));
        }

        if (results[5].status === 'fulfilled') {
          recentReviews = results[5].value.data.data.slice(0, 3);
        }

        setData(prev => ({
          ...prev,
          stats: {
            registryAssets: totalProducts,
            activeTransmissions: liveOrders,
            customerBase: totalCustomers,
            grossYield: grossYield
          },
          chartData,
          recentReviews,
          upcomingDeliveries,
          topProducts,
          recentOrders
        }));

      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 md:p-6 lg:p-8 font-sans pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            Welcome back, {user?.firstName || 'Admin'}!
          </h1>
          <p className="text-slate-500 mt-1 text-sm md:text-base">
            Here's your bakery's performance at a glance.
          </p>
        </div>
      </header>

      {/* Main Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={Package} 
          label="Total Products" 
          value={data.stats.registryAssets} 
          trend="Stock" 
          trendType="up" 
          isLoading={loading}
        />
        <StatCard 
          icon={ShoppingBag} 
          label="Live Orders" 
          value={data.stats.activeTransmissions} 
          trend="Active" 
          trendType="up" 
          isLoading={loading}
        />
        <StatCard 
          icon={Users} 
          label="Total Customers" 
          value={data.stats.customerBase >= 1000 ? `${(data.stats.customerBase / 1000).toFixed(1)}k` : data.stats.customerBase} 
          trend="Growing" 
          trendType="up" 
          isLoading={loading}
        />
        <StatCard 
          icon={TrendingUp} 
          label="Today's Revenue" 
          value={`Rs.${data.stats.grossYield >= 1000 ? `${(data.stats.grossYield / 1000).toFixed(1)}k` : data.stats.grossYield}`} 
          trend="Today" 
          trendType="up" 
          isLoading={loading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Main Charts & Feed) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Revenue Chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Revenue Trend (Last 7 Days)</h2>
            <div className="h-72 w-full">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <Loader2 className="animate-spin text-slate-400" size={32} />
                </div>
              ) : data.chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} dy={10} />
                    <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(val) => `Rs.${val/1000}k`} dx={-10} />
                    <Tooltip 
                      cursor={{ stroke: '#f1f5f9', strokeWidth: 2 }} 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                      formatter={(value) => [`Rs.${value}`, 'Revenue']}
                    />
                    <Line type="monotone" dataKey="revenue" stroke="#C29D59" strokeWidth={3} dot={{ r: 4, fill: '#C29D59', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                   <TrendingUp size={32} className="opacity-20 mb-3" />
                   <p className="text-sm font-medium">No revenue data for the past week.</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Recent Orders</h2>
              <button onClick={() => navigate('/orders')} className="text-sm font-medium text-[#C29D59] hover:text-[#a68246] flex items-center gap-1 transition-colors">
                View All <ChevronRight size={16} />
              </button>
            </div>
            <div className="p-0 overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr><td colSpan="3" className="px-6 py-12 text-center text-slate-400"><Loader2 className="animate-spin mx-auto" size={24} /></td></tr>
                  ) : data.recentOrders.length === 0 ? (
                    <tr><td colSpan="3" className="px-6 py-12 text-center text-slate-400">No recent orders</td></tr>
                  ) : (
                    data.recentOrders.map(order => (
                      <tr key={order._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-900 text-sm">{order.customerName}</p>
                          <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">{order.source}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${
                            order.orderStatus === 'Pending' ? 'bg-amber-50 text-amber-600' :
                            order.orderStatus === 'Preparing' ? 'bg-blue-50 text-blue-600' :
                            order.orderStatus === 'Ready' ? 'bg-emerald-50 text-emerald-600' :
                            'bg-slate-100 text-slate-500'
                          }`}>
                            {order.orderStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-900 text-sm">
                          Rs.{order.totalAmount}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Column (Widgets) */}
        <div className="space-y-8">
          
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button onClick={() => navigate('/pos')} className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-[#C29D59] hover:bg-[#C29D59]/5 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#C29D59]/10 text-[#C29D59] rounded-lg">
                    <Monitor size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-slate-900 group-hover:text-[#C29D59] transition-colors">POS Terminal</p>
                    <p className="text-xs text-slate-500">Open cash register</p>
                  </div>
                </div>
              </button>
              <button onClick={() => navigate('/addproduct')} className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-emerald-500 hover:bg-emerald-50 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg group-hover:bg-emerald-100 transition-colors">
                    <PlusCircle size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">Add Product</p>
                    <p className="text-xs text-slate-500">Create new item</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Upcoming Deliveries */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">Upcoming Deliveries</h2>
              <Calendar size={18} className="text-slate-400" />
            </div>
            
            <div className="space-y-4">
              {loading ? (
                <div className="flex justify-center py-6"><Loader2 className="animate-spin text-slate-400" size={24} /></div>
              ) : data.upcomingDeliveries.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">No scheduled deliveries soon.</p>
              ) : (
                data.upcomingDeliveries.map(del => (
                  <div key={del._id} className="flex gap-4 items-start group">
                    <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 ring-4 ring-blue-50 shrink-0"></div>
                    <div className="flex-1 -mt-1.5 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                      <p className="text-slate-900 font-bold text-sm">{del.customerName}</p>
                      <p className="text-slate-500 text-xs mt-0.5 line-clamp-1">{del.address}</p>
                      <div className="flex items-center gap-1.5 mt-2 text-blue-600 bg-blue-50 w-fit px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">
                        <Clock size={10} />
                        <span>{new Date(del.scheduleDate).toLocaleDateString()} {del.scheduleTime}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">Top Bestsellers</h2>
              <Award size={18} className="text-slate-400" />
            </div>
            
            <div className="space-y-4">
              {loading ? (
                <div className="flex justify-center py-6"><Loader2 className="animate-spin text-slate-400" size={24} /></div>
              ) : data.topProducts.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">No sales data yet.</p>
              ) : (
                data.topProducts.map((prod, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded bg-slate-50 text-slate-400 font-bold text-xs flex items-center justify-center">
                        {idx + 1}
                      </div>
                      <p className="text-sm font-semibold text-slate-700 line-clamp-1">{prod.name}</p>
                    </div>
                    <p className="text-xs font-bold text-slate-900 bg-slate-50 px-2 py-1 rounded">
                      {prod.count} sold
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Reviews */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">Latest Reviews</h2>
              <MessageSquare size={18} className="text-slate-400" />
            </div>
            
            <div className="space-y-4">
              {loading ? (
                <div className="flex justify-center py-6"><Loader2 className="animate-spin text-slate-400" size={24} /></div>
              ) : data.recentReviews.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">No reviews available.</p>
              ) : (
                data.recentReviews.map(rev => (
                  <div key={rev._id} className="pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-bold text-slate-900">{rev.user?.firstName || 'Customer'}</p>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={10} className={i < rev.rating ? "fill-amber-400 text-amber-400" : "fill-slate-100 text-slate-100"} />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 italic line-clamp-2">"{rev.text}"</p>
                  </div>
                ))
              )}
              
              {!loading && data.recentReviews.length > 0 && (
                <button onClick={() => navigate('/reviews')} className="w-full mt-2 text-xs font-bold uppercase tracking-widest text-[#C29D59] hover:text-[#a68246] transition-colors text-center">
                  See All Reviews
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
