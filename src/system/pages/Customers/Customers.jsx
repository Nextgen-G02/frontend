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
  CheckCircle2
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminCustomerManagement() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [updateData, setUpdateData] = useState({
    name: "",
    phone: "",
    address: ""
  });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchCustomers();
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
    if (!window.confirm("Purge this customer record from the registry?")) return;

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

      {/* Grid Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {loading ? (
          <div className="col-span-full h-96 flex flex-col items-center justify-center gap-6">
            <Loader2 className="animate-spin text-primary" size={56} />
            <p className="font-black uppercase tracking-[0.4em] text-[10px] text-slate-400 italic">Accessing Personnel Files...</p>
          </div>
        ) : customers.length === 0 ? (
          <div className="col-span-full h-96 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <Users size={48} className="text-slate-200" />
            </div>
            <p className="font-black uppercase tracking-widest text-slate-400">Registry is currently void.</p>
          </div>
        ) : (
          customers.map((customer) => (
            <div key={customer._id} className="glass-card group relative p-7 md:p-8 rounded-[32px] md:rounded-[48px] bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition-all duration-700 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-slate-100 group-hover:bg-primary transition-colors"></div>
              
              <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                <button 
                  onClick={() => openEditModal(customer)}
                  className="p-2.5 rounded-xl bg-slate-50 text-slate-300 hover:text-primary hover:bg-primary/5 transition-all border border-slate-100"
                >
                  <Pencil size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(customer._id)}
                  className="p-2.5 rounded-xl bg-slate-50 text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all border border-slate-100"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-[18px] md:rounded-[24px] bg-slate-900 flex items-center justify-center text-gold font-black text-2xl shadow-inner group-hover:rotate-6 transition-transform duration-500">
                  {customer.name[0]}
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">{customer.name}</h2>
                  <div className="flex items-center gap-1.5 mt-1.5 px-2 py-0.5 bg-slate-50 rounded-md w-fit">
                    <Mail size={10} className="text-primary" />
                    <span className="text-[9px] font-black uppercase tracking-widest leading-none text-slate-400">Authorized Member</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-10">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 group-hover:border-primary/20 transition-all">
                  <div className="p-2 bg-white rounded-lg shadow-sm text-primary"><Phone size={14} /></div>
                  <p className="text-xs font-black text-slate-900 tracking-tight">{customer.phone}</p>
                </div>
                
                {customer.address && (
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 group-hover:border-primary/20 transition-all">
                    <div className="p-2 bg-white rounded-lg shadow-sm text-primary mt-0.5"><MapPin size={14} /></div>
                    <p className="text-[11px] font-medium text-slate-400 leading-relaxed italic line-clamp-2">"{customer.address}"</p>
                  </div>
                )}

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="p-2 bg-slate-800 rounded-lg text-gold"><ShoppingBag size={14} /></div>
                  <p className="text-[9px] font-black text-white uppercase tracking-[0.2em]">{customer.totalOrders} Transmissions</p>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-50 flex justify-between items-end">
                <div className="space-y-0.5">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Total Purchases</p>
                  <p className="text-2xl md:text-3xl font-black text-slate-900 leading-none tracking-tighter mt-1">Rs.{customer.totalSpent?.toLocaleString()}</p>
                </div>
                <button className="p-3.5 rounded-xl bg-slate-50 text-slate-400 hover:text-primary transition-all border border-slate-100">
                  <CreditCard size={18} md:size={20} />
                </button>
              </div>
            </div>
          ))
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
    </div>
  );
}