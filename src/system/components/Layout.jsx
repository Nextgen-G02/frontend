import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  Vault
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

  const handleLogout = () => {
    logout();
    navigate("/login");
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
        className={`sidebar-premium hidden md:flex flex-col fixed h-screen transition-all duration-500 ease-in-out z-50 ${collapsed ? 'w-20' : 'w-72'}`}
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
      <main className={`flex-1 flex flex-col transition-all duration-500 ${collapsed ? 'md:ml-20' : 'md:ml-72'}`}>
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
                <button className="relative p-1.5 text-slate-400 hover:text-slate-900 transition-colors">
                  <Bell size={18} md:size={20} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 border-2 border-white rounded-full"></span>
                </button>
                
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