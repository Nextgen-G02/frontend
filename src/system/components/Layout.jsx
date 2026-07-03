import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Layers, 
  ClipboardList, 
  Box, 
  Truck,
  Users, 
  BarChart3, 
  UserCog, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  Menu,
  Receipt,
  Vault,
  Cake
} from "lucide-react";
import { useAuth } from "../../shared/context/AuthContext";

const SidebarItem = ({ icon: Icon, label, path, active, collapsed }) => (
  <Link
    to={path}
    className={`nav-link ${active ? 'nav-link-active' : ''} ${collapsed ? 'justify-center' : ''}`}
  >
    <div className="nav-icon-container">
      <Icon size={20} />
    </div>
    {!collapsed && <span className="whitespace-nowrap font-semibold">{label}</span>}
  </Link>
);

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // System alerts / notifications states
  const [alerts, setAlerts] = useState([]);
  const [alertMenuOpen, setAlertMenuOpen] = useState(false);
  const [authError, setAuthError] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const fetchAlerts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setAuthError(true);
        return;
      }
      
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/alerts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAlerts(response.data.data || []);
      setAuthError(false);
    } catch (error) {
      console.error("Failed to fetch system alerts:", error);
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        setAuthError(true);
      }
    }
  };

  useEffect(() => {
    fetchAlerts();
    // Poll every 30 seconds for real-time dashboard notifications
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/alerts/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAlerts(prev => prev.filter(alert => alert._id !== id));
    } catch (error) {
      console.error("Failed to dismiss alert:", error);
    }
  };

  const handleAlertClick = async (alert) => {
    try {
      await handleMarkAsRead(alert._id);
      setAlertMenuOpen(false);
      navigate(`/inventory?search=${encodeURIComponent(alert.productName)}`);
    } catch (error) {
      console.error("Failed to handle alert click:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/alerts/read-all`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAlerts([]);
    } catch (error) {
      console.error("Failed to clear all alerts:", error);
    }
  };

  const menuItems = [
    { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { label: "POS Terminal", path: "/pos", icon: ShoppingCart },
    { label: "Inventory", path: "/inventory", icon: Box },
    { label: "Orders", path: "/orders", icon: ClipboardList },
    { label: "Products", path: "/adminproduct", icon: Package },
    { label: "Categories", path: "/admin/categories", icon: Layers },
    // Admin Only
    ...(user?.role === 'admin' ? [
      { label: "Suppliers", path: "/admin/suppliers", icon: Truck },
      { label: "Customers", path: "/admin/customers", icon: Users },
      { label: "Financials", path: "/admin/financials", icon: BarChart3 },
      { label: "Expenses", path: "/admin/expenses", icon: Receipt },
      { label: "Cash Drawer", path: "/admin/cash-drawer", icon: Vault },
      { label: "Staff", path: "/staff", icon: UserCog },
    ] : []),
  ];

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      {/* Sidebar - Desktop */}
      <aside 
        className={`sidebar-premium hidden md:flex flex-col sticky top-0 h-screen shrink-0 transition-all duration-500 ease-in-out z-50 ${collapsed ? 'w-20' : 'w-72'}`}
      >
        <div className="p-6 md:p-8 flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <h2 className="text-white text-xl md:text-2xl font-black tracking-tighter">
                NIROSHA <span className="text-gold italic font-medium">Sweets</span>
              </h2>
            </div>
          )}
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-xl text-white/40 hover:text-white transition-colors"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto no-scrollbar border-t border-white/5">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.path}
              {...item}
              active={location.pathname === item.path}
              collapsed={collapsed}
            />
          ))}
          
          <div className="pt-6 mt-6 border-t border-white/5">
            <button
              onClick={handleLogout}
              className={`nav-link w-full text-white/40 hover:text-white hover:bg-white/5 ${collapsed ? 'justify-center' : ''}`}
            >
              <div className="nav-icon-container">
                <LogOut size={20} />
              </div>
              {!collapsed && <span className="font-semibold uppercase text-xs tracking-widest">Logout</span>}
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 transition-all duration-500">
        {/* Top Header - Hidden on POS and Orders */}
        {!(location.pathname === '/pos' || location.pathname.startsWith('/orders')) && (
          <header className="h-16 md:h-20 bg-white sticky top-0 z-40 px-6 md:px-10 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-6">
              <button 
                className="md:hidden p-2 rounded-xl bg-slate-100 text-slate-600"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                <Menu size={22} />
              </button>
              
              <div className="flex flex-col">
                <h1 className="text-base md:text-xl font-bold text-slate-900 heading-premium leading-tight">
                  Shop <span className="italic font-medium text-primary">Manager</span>
                </h1>
                <p className="hidden xs:block text-[9px] md:text-[10px] text-slate-400 font-medium">Store Dashboard</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <button 
                    onClick={() => setAlertMenuOpen(!alertMenuOpen)}
                    className="relative p-2 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100/80 text-slate-500 hover:text-slate-900 transition-all active:scale-95"
                  >
                    <Bell size={18} />
                    {alerts.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border border-white animate-pulse">
                        {alerts.length}
                      </span>
                    )}
                  </button>
                  
                  {/* Notification Dropdown Menu */}
                  {alertMenuOpen && (
                    <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white rounded-[24px] border border-slate-100 shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                        <div>
                          <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">System Notifications</h4>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Critical Inventory Diagnostics</p>
                        </div>
                        {alerts.length > 0 && (
                          <button 
                            onClick={handleMarkAllAsRead}
                            className="text-[9px] font-black text-primary hover:text-slate-900 uppercase tracking-widest transition-colors"
                          >
                            Clear All
                          </button>
                        )}
                      </div>
                      
                      <div className="max-h-[300px] overflow-y-auto divide-y divide-slate-50 no-scrollbar">
                        {authError ? (
                          <div className="p-8 text-center">
                            <p className="text-xs font-bold text-rose-500 uppercase tracking-wider">Session Expired</p>
                            <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest mt-1">Please log out and log in again to sync alerts</p>
                          </div>
                        ) : alerts.length === 0 ? (
                          <div className="p-8 text-center">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">System status nominal.</p>
                            <p className="text-[9px] font-semibold text-slate-300 uppercase tracking-widest mt-1">No low-stock alerts reported</p>
                          </div>
                        ) : (
                          alerts.map((alert) => (
                            <div 
                              key={alert._id}
                              className="p-4 hover:bg-slate-50/50 transition-all flex items-start justify-between gap-3 group/item cursor-pointer"
                              onClick={() => handleAlertClick(alert)}
                            >
                              <div className="space-y-1 text-left flex-1">
                                <div className="flex items-center gap-1.5">
                                  <span className={`w-1.5 h-1.5 rounded-full ${
                                    alert.type === "Out of Stock" ? "bg-rose-500 animate-ping" : "bg-amber-500 animate-pulse"
                                  }`}></span>
                                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                    {alert.type}
                                  </span>
                                </div>
                                <p className="text-xs font-bold text-slate-800 leading-normal">
                                  {alert.message}
                                </p>
                                <p className="text-[9px] text-slate-400 font-semibold uppercase">
                                  {new Date(alert.createdAt).toLocaleTimeString()}
                                </p>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkAsRead(alert._id);
                                }}
                                className="text-[10px] font-black text-slate-300 hover:text-rose-500 transition-colors uppercase tracking-wider opacity-0 group-hover/item:opacity-100 shrink-0"
                              >
                                Dismiss
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
                  <div className="text-right hidden lg:block">
                    <p className="text-[11px] md:text-xs font-bold text-slate-900 leading-tight">{user?.firstName}</p>
                    <p className="text-[8px] md:text-[9px] font-black text-primary uppercase tracking-widest mt-0.5">{user?.role === 'admin' ? 'Owner / Admin' : 'Shop Staff'}</p>
                  </div>
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold shadow-lg text-xs">
                    {user?.firstName?.[0] || 'A'}
                  </div>
                </div>
              </div>
            </div>
          </header>
        )}

        {/* Page Content */}
        <div className={`${(location.pathname === '/pos' || location.pathname.startsWith('/orders') || location.pathname === '/inventory') ? 'p-0' : 'px-6 md:px-10 py-6 md:py-8 lg:px-10'}`}>
          {children}
        </div>
      </main>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] md:hidden"
          onClick={() => setMobileOpen(false)}
        ></div>
      )}

      {/* Mobile Sidebar */}
      <aside 
        className={`fixed top-0 left-0 h-full w-80 sidebar-premium z-[70] transition-transform duration-500 md:hidden ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-10 flex items-center justify-between">
          <h2 className="text-white text-3xl font-black">POS System</h2>
          <button onClick={() => setMobileOpen(false)} className="text-white/40 hover:text-white">
            <ChevronLeft size={24} />
          </button>
        </div>
        <nav className="px-6 py-4 space-y-4">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.path}
              {...item}
              active={location.pathname === item.path}
              collapsed={false}
            />
          ))}
          <button
            onClick={handleLogout}
            className="nav-link w-full text-white/40 mt-10"
          >
            <div className="nav-icon-container">
              <LogOut size={20} />
            </div>
            <span className="font-semibold uppercase text-xs tracking-widest">Logout</span>
          </button>
        </nav>
      </aside>
    </div>
  );

}