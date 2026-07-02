import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { 
  Users, 
  Phone, 
  MapPin, 
  ShoppingBag, 
  Trash2, 
  CreditCard,
  UserPlus,
  Loader2,
  Mail,
  Pencil,
  X,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Search,
  ArrowUp
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminCustomerManagement() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCustomerId, setExpandedCustomerId] = useState(null);
  
  // Search & Scroll to Top states
  const [searchQuery, setSearchQuery] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [updateData, setUpdateData] = useState({
    name: "",
    phone: "",
    address: ""
  });
  const [updating, setUpdating] = useState(false);

  const toggleExpand = (id) => {
    setExpandedCustomerId(prev => prev === id ? null : id);
  };

  useEffect(() => {
    fetchCustomers();
    
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
//get to the customer list
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/customers`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCustomers(response.data.data);
    } catch (error) {
      toast.error("Registry access failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this customer record from the registry?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/customers/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Record purged");
      fetchCustomers();
    } catch (error) {
      toast.error("Cleanup failed");
    }
  };

  const openEditModal = (customer) => {
    setEditingCustomer(customer);
    setUpdateData({
      name: customer.name,
      phone: customer.phone,
      address: customer.address || ""
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      const token = localStorage.getItem("token");
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/customers/${editingCustomer._id}`, updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Identity profile updated");
      setIsEditModalOpen(false);
      fetchCustomers();
    } catch (error) {
      toast.error("Protocol update failed");
    } finally {
      setUpdating(false);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-10 max-w-[1500px] mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-10 h-1 bg-primary rounded-full"></span>
            <p className="text-primary font-black uppercase tracking-[0.4em] text-[9px]">Client Relations Infrastructure</p>
          </div>
          <h1 className="heading-premium text-2xl md:text-5xl leading-tight">
            Customer <span className="italic font-medium text-slate-400">Registry</span>
          </h1>
          <p className="text-slate-400 font-medium mt-2 md:mt-3 text-sm md:text-base">Manage your high-value client ecosystem and purchase histories.</p>
        </div>
      </header>

      {/* Search bar & statistics info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-6xl mx-auto">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-450" size={18} />
          <input
            type="text"
            placeholder="Search customer by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-10 py-3.5 bg-white border border-slate-100 rounded-2xl text-slate-800 placeholder-slate-400 font-bold text-sm outline-none focus:border-slate-200 shadow-sm focus:shadow-md transition-all duration-300"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
        {!loading && (
          <p className="text-[10px] font-black text-slate-450 uppercase tracking-widest sm:text-right">
            Showing {filteredCustomers.length} of {customers.length} registered accounts
          </p>
        )}
      </div>

      {/* Expandable Name List */}
      <div className="space-y-5 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center gap-6">
            <Loader2 className="animate-spin text-primary" size={56} />
            <p className="font-black uppercase tracking-[0.4em] text-[10px] text-slate-400 italic">Accessing Personnel Files...</p>
          </div>
        ) : customers.length === 0 ? (
          <div className="h-96 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <Users size={48} className="text-slate-200" />
            </div>
            <p className="font-black uppercase tracking-widest text-slate-400">Registry is currently void.</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="h-96 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <Search size={48} className="text-slate-200" />
            </div>
            <p className="font-black uppercase tracking-widest text-slate-450">No customer matches search query.</p>
          </div>
        ) : (
          filteredCustomers.map((customer) => {
            const isExpanded = expandedCustomerId === customer._id;
            const isTopCustomer = customers.length > 0 && customers[0]._id === customer._id && customer.totalSpent > 0;
            return (
              <div 
                key={customer._id} 
                className={`group rounded-[32px] border transition-all duration-500 overflow-hidden ${
                  isExpanded 
                    ? 'bg-white border-slate-200 shadow-xl shadow-slate-100' 
                    : 'bg-white border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200/80'
                }`}
              >
                {/* Main Name Row */}
                <div 
                  onClick={() => toggleExpand(customer._id)}
                  className="flex items-center justify-between p-8 cursor-pointer hover:bg-slate-50/30 transition-all duration-350 select-none"
                >
                  <div className="flex items-center gap-5">
                    {/* Premium initials avatar matching screenshot */}
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-500 via-slate-400 to-slate-600 flex items-center justify-center text-[#E5C158] font-black text-xl uppercase shadow-md shrink-0">
                      {customer.name[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-extrabold text-slate-900 tracking-tight text-lg uppercase leading-none">{customer.name}</span>
                        {customer.isRegistered && (
                          <span className="w-3 h-3 rounded-full bg-[#52D3A2] shrink-0"></span>
                        )}
                        {isTopCustomer && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-[#C19A27] border border-amber-200/60 text-[9px] font-black uppercase tracking-wider rounded-lg shadow-sm">
                            👑 Top Customer
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] font-extrabold text-[#7E8B9B] uppercase tracking-wider mt-2 leading-none">
                        {customer.isRegistered ? 'REGISTERED MEMBER' : 'WALK-IN GUEST'}
                      </p>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-full hover:bg-slate-100 text-[#8E9AAB] transition-all border border-slate-100/50">
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>

                {/* Expanded Details Panel */}
                {isExpanded && (
                  <div className="px-8 pb-8 pt-6 border-t border-slate-50 bg-gradient-to-b from-white to-slate-50/30 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                      
                      {/* Phone */}
                      <div className="p-6 bg-white rounded-[24px] border border-slate-100 hover:border-primary/20 hover:shadow-sm transition-all duration-300">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Phone Number</p>
                        <div className="flex items-center gap-2.5 text-slate-850 font-bold text-base">
                          <Phone size={16} className="text-primary" />
                          <span>{customer.phone}</span>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="p-6 bg-white rounded-[24px] border border-slate-100 hover:border-primary/20 hover:shadow-sm transition-all duration-300">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Registration Status</p>
                        <div className="pt-1">
                          {customer.isRegistered ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider rounded-md border border-emerald-100">
                              <CheckCircle2 size={10} className="text-emerald-600" /> Registered
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-wider rounded-md border border-slate-200/50">
                              Walk-in
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Total Spent */}
                      <div className="p-6 bg-white rounded-[24px] border border-slate-100 hover:border-primary/20 hover:shadow-sm transition-all duration-300">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Total Purchases</p>
                        <div className="text-slate-900 font-black text-lg">
                          Rs.{customer.totalSpent?.toLocaleString()}
                        </div>
                      </div>

                      {/* Email */}
                      <div className="p-6 bg-white rounded-[24px] border border-slate-100 hover:border-primary/20 hover:shadow-sm transition-all duration-300">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Email Address</p>
                        <div className="flex items-center gap-2.5 text-slate-850 font-bold text-base">
                          <Mail size={16} className="text-primary" />
                          <span className="select-all truncate max-w-[240px]" title={customer.email}>{customer.email || 'N/A'}</span>
                        </div>
                      </div>

                      {/* Address */}
                      <div className="p-6 bg-white rounded-[24px] border border-slate-100 hover:border-primary/20 hover:shadow-sm transition-all duration-300">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Delivery Address</p>
                        <div className="flex items-center gap-2.5 text-slate-850 font-bold text-base">
                          <MapPin size={16} className="text-primary" />
                          <span className="truncate max-w-[240px]" title={customer.address}>{customer.address ? `"${customer.address}"` : 'N/A'}</span>
                        </div>
                      </div>

                      {/* Orders Count & Last Order */}
                      <div className="p-6 bg-white rounded-[24px] border border-slate-100 hover:border-primary/20 hover:shadow-sm transition-all duration-300">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Purchase History</p>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 text-slate-850 font-bold text-base">
                            <ShoppingBag size={16} className="text-primary" />
                            <span>{customer.totalOrders} Orders</span>
                          </div>
                          {customer.lastOrderDate && (
                            <span className="text-[10px] font-bold text-slate-400 uppercase">
                              ({new Date(customer.lastOrderDate).toLocaleDateString()})
                            </span>
                          )}
                        </div>
                      </div>

                    </div>

                    {/* Actions bar inside expansion */}
                    <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
                      <button 
                        onClick={() => openEditModal(customer)}
                        className="px-5 py-3 rounded-xl bg-slate-50 text-slate-600 hover:text-primary hover:bg-primary/5 transition-all border border-slate-100 flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider"
                      >
                        <Pencil size={14} /> Update Profile
                      </button>
                      <button 
                        onClick={() => handleDelete(customer._id)}
                        className="px-5 py-3 rounded-xl bg-slate-50 text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-all border border-slate-100 flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider"
                      >
                        <Trash2 size={14} /> Delete Record
                      </button>
                    </div>

                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 md:p-10 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-900 text-gold rounded-2xl"><Pencil size={24} /></div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Update Profile</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Client Identity Modification</p>
                </div>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="p-3 hover:bg-slate-50 rounded-xl transition-colors text-slate-400">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdate}>
              <div className="p-8 md:p-10 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Entity Name</label>
                  <input 
                    type="text"
                    required
                    value={updateData.name}
                    onChange={(e) => setUpdateData({...updateData, name: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Communication Channel (Phone)</label>
                  <input 
                    type="text"
                    required
                    value={updateData.phone}
                    onChange={(e) => setUpdateData({...updateData, phone: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Primary Deployment (Address)</label>
                  <textarea 
                    rows="3"
                    value={updateData.address}
                    onChange={(e) => setUpdateData({...updateData, address: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all resize-none"
                  />
                </div>
              </div>

              <div className="p-8 md:p-10 bg-slate-50 border-t border-slate-100 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
                >
                  Discard
                </button>
                <button 
                  type="submit"
                  disabled={updating}
                  className="flex-[2] py-4 bg-slate-900 text-gold rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-primary hover:text-white transition-all shadow-xl shadow-slate-200 disabled:opacity-50"
                >
                  {updating ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                  Confirm Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-4 bg-slate-900 hover:bg-slate-800 text-gold hover:text-white rounded-full shadow-2xl transition-all duration-300 hover:-translate-y-1 z-50 flex items-center justify-center animate-in fade-in zoom-in duration-300"
          title="Scroll to Top"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
}