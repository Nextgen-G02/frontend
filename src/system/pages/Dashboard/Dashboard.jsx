import React, { useState, useEffect } from "react";
import { 
  Users, 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  Clock, 
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Loader2,
  ChevronRight,
  Monitor,
  PlusCircle,
  FileText
} from "lucide-react";
import { useAuth } from "../../../shared/context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
    activities: [
      { text: "System Boot Initialized", time: "08:00 AM", type: "system" },
      { text: "Inventory Sync Completed", time: "08:15 AM", type: "inventory" },
      { text: "New Order #1042 Received", time: "09:30 AM", type: "order" },
      { text: "Customer 'John Doe' Registered", time: "10:05 AM", type: "customer" }
    ],
    health: {
      integrity: 95,
      capacity: 65
    }
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        const backendUrl = import.meta.env.VITE_BACKEND_URL;

        const results = await Promise.allSettled([
          axios.get(`${backendUrl}/api/products`, { headers }),
          axios.get(`${backendUrl}/api/orders`, { headers }),
          axios.get(`${backendUrl}/api/customers`, { headers }),
          axios.get(`${backendUrl}/api/financials/summary`, { headers })
        ]);

        let totalProducts = 0;
        let liveOrders = 0;
        let totalCustomers = 0;
        let grossYield = 0;

        if (results[0].status === 'fulfilled') {
          const products = Array.isArray(results[0].value.data.data) ? results[0].value.data.data : (Array.isArray(results[0].value.data) ? results[0].value.data : []);
          totalProducts = products.length;
        } else {
          console.error('Failed to fetch products', results[0].reason);
        }

        if (results[1].status === 'fulfilled') {
          const rawOrders = results[1].value.data;
          const orders = Array.isArray(rawOrders.data) ? rawOrders.data : (Array.isArray(rawOrders) ? rawOrders : []);
          liveOrders = orders.filter(o => !['Completed', 'Delivered', 'Cancelled'].includes(o.orderStatus)).length;
        } else {
          console.error('Failed to fetch orders', results[1].reason);
        }

        if (results[2].status === 'fulfilled') {
          const rawCust = results[2].value.data;
          const customers = Array.isArray(rawCust.data) ? rawCust.data : (Array.isArray(rawCust) ? rawCust : []);
          totalCustomers = customers.length;
        } else {
          console.error('Failed to fetch customers', results[2].reason);
        }

        if (results[3].status === 'fulfilled') {
          grossYield = results[3].value.data?.data?.grossYield || 0;
        } else {
          console.error('Failed to fetch financials', results[3].reason);
        }

        setData(prev => ({
          ...prev,
          stats: {
            registryAssets: totalProducts,
            activeTransmissions: liveOrders,
            customerBase: totalCustomers,
            grossYield: grossYield
          }
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
    <div className="space-y-8 max-w-7xl mx-auto p-4 md:p-6 lg:p-8 font-sans">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            Welcome back, {user?.firstName || 'Admin'}!
          </h1>
          <p className="text-slate-500 mt-1 text-sm md:text-base">
            Here's what's happening in your shop today.
          </p>
        </div>
      </header>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={Package} 
          label="Total Products" 
          value={data.stats.registryAssets} 
          trend="12%" 
          trendType="up" 
          isLoading={loading}
        />
        <StatCard 
          icon={ShoppingBag} 
          label="Live Orders" 
          value={data.stats.activeTransmissions} 
          trend="5%" 
          trendType="up" 
          isLoading={loading}
        />
        <StatCard 
          icon={Users} 
          label="Total Customers" 
          value={data.stats.customerBase >= 1000 ? `${(data.stats.customerBase / 1000).toFixed(1)}k` : data.stats.customerBase} 
          trend="8%" 
          trendType="up" 
          isLoading={loading}
        />
        <StatCard 
          icon={TrendingUp} 
          label="Total Revenue" 
          value={`Rs.${data.stats.grossYield >= 1000 ? `${(data.stats.grossYield / 1000).toFixed(1)}k` : data.stats.grossYield}`} 
          trend="2%" 
          trendType="down" 
          isLoading={loading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Feed */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
            <button className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
              View All <ChevronRight size={16} />
            </button>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin text-slate-400" size={32} />
              </div>
            ) : (
              <div className="space-y-6">
                {data.activities.map((act, idx) => (
                  <div key={idx} className="flex gap-4 items-start group">
                    <div className="mt-1 w-2 h-2 rounded-full bg-primary/20 border-2 border-primary ring-4 ring-primary/5 shrink-0"></div>
                    <div className="flex-1 -mt-1.5 pb-6 border-b border-slate-50 last:border-0 last:pb-0">
                      <p className="text-slate-700 font-medium text-sm md:text-base">{act.text}</p>
                      <div className="flex items-center gap-1.5 mt-1.5 text-slate-400">
                        <Clock size={12} />
                        <span className="text-xs font-medium">{act.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h2>
            
            <div className="space-y-3">
              <button 
                onClick={() => navigate('/pos')}
                className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-primary hover:bg-primary/5 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 text-primary rounded-lg">
                    <Monitor size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-slate-900 group-hover:text-primary transition-colors">POS Terminal</p>
                    <p className="text-xs text-slate-500">Open cash register</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-slate-300 group-hover:text-primary transition-colors" />
              </button>

              <button 
                onClick={() => navigate('/addproduct')}
                className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-primary hover:bg-primary/5 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                    <PlusCircle size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">Add Product</p>
                    <p className="text-xs text-slate-500">Create new item</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-slate-300 group-hover:text-emerald-600 transition-colors" />
              </button>

              <button 
                onClick={() => navigate('/orders')}
                className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-primary hover:bg-primary/5 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <FileText size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">View Orders</p>
                    <p className="text-xs text-slate-500">Manage online orders</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
