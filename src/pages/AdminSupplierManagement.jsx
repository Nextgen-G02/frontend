import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { 
  Truck, 
  Plus, 
  Mail, 
  Phone, 
  MapPin, 
  Trash2, 
  Edit3, 
  Loader2, 
  Search,
  ShieldCheck,
  AlertTriangle
} from "lucide-react";

export default function AdminSupplierManagement() {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    productsSupplied: "",
    phone: "",
    email: "",
    address: "",
    status: "Active"
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/suppliers`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setSuppliers(response.data.data);
    } catch (error) {
      toast.error("Unable to fetch suppliers. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/suppliers/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Supplier has been removed from the system.");
      fetchSuppliers();
    } catch (error) {
      toast.error("Failed to remove supplier profile. Please try again.");
    } finally {
      setIsDeleteModalOpen(false);
      setDeleteId(null);
    }
  };

  const openSupplierAccount = (id) => {
    navigate(`/admin/suppliers/${id}/accounts`);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (editingId) {
        await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/suppliers/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Supplier profile updated successfully.");
      } else {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/suppliers`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("New supplier successfully added to registry.");
      }
      resetForm();
      fetchSuppliers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save supplier details.");
    }
  };

  const handleEdit = (supplier) => {
    setFormData({
      name: supplier.name,
      productsSupplied: supplier.productsSupplied || "",
      phone: supplier.phone,
      email: supplier.email || "",
      address: supplier.address || "",
      status: supplier.status
    });
    setEditingId(supplier._id);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      productsSupplied: "",
      phone: "",
      email: "",
      address: "",
      status: "Active"
    });
    setEditingId(null);
    setIsFormOpen(false);
  };

  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.productsSupplied && s.productsSupplied.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-10 max-w-[1500px] mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-10 h-1 bg-primary rounded-full"></span>
            <p className="text-primary font-black uppercase tracking-[0.4em] text-[9px]">Supplier Management</p>
          </div>
          <h1 className="heading-premium text-2xl md:text-5xl leading-tight">
            Our <span className="italic font-medium text-slate-400">Suppliers</span>
          </h1>
          <p className="text-slate-400 font-medium mt-2 md:mt-3 text-sm md:text-base">Manage the companies and people who supply your items.</p>
        </div>

        <div className="flex items-center gap-3.5">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={16} md:size={18} />
            <input 
              type="text" 
              placeholder="Search suppliers..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 pr-5 py-3 md:py-3.5 bg-white border border-slate-200 rounded-xl md:rounded-2xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-slate-900 w-full md:w-60 text-xs shadow-sm"
            />
          </div>
          <button 
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="py-3.5 md:py-4 px-6 md:px-7 bg-slate-900 text-white rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-primary transition-all flex items-center gap-2.5"
          >
            <Plus size={18} md:size={20} />
            <span className="hidden sm:inline">{isFormOpen ? "Close Form" : "Add New Supplier"}</span>
          </button>
        </div>
      </header>

      {isFormOpen && (
        <div className="animate-in fade-in zoom-in duration-500">
          <div className="glass-card p-8 md:p-10 rounded-[32px] md:rounded-[48px] bg-white relative overflow-hidden group border-none shadow-2xl">
            <div className="absolute top-0 right-0 w-40 h-40 bg-slate-50 rounded-full -mr-20 -mt-20 opacity-50 group-hover:scale-110 transition-transform duration-700"></div>
            
            <div className="flex items-center gap-4 mb-8 relative z-10">
              <div className="p-3.5 bg-primary text-white rounded-xl shadow-lg shadow-primary/20">
                <Truck size={20} md:size={24} />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">
                  {editingId ? "Edit Supplier Details" : "Supplier Details"}
                </h2>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">Supplier Information Form</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 relative z-10">
              <div className="space-y-1.5 md:space-y-2">
                <label className="block text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Supplier Name</label>
                <input 
                  name="name" value={formData.name} onChange={handleChange} required
                  className="w-full px-5 md:px-6 py-3.5 md:py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-slate-900 text-xs md:text-sm placeholder:text-slate-300"
                  placeholder="e.g. PureSugar Ltd."
                />
              </div>
              <div className="space-y-1.5 md:space-y-2 lg:col-span-2">
                <label className="block text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Product(s) Supplied</label>
                <input 
                  name="productsSupplied" value={formData.productsSupplied} onChange={handleChange} required
                  className="w-full px-5 md:px-6 py-3.5 md:py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-slate-900 text-xs md:text-sm placeholder:text-slate-300"
                  placeholder="e.g. Sugar, Flour, Milk Powder"
                />
              </div>
              <div className="space-y-1.5 md:space-y-2">
                <label className="block text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Number</label>
                <input 
                  name="phone" value={formData.phone} onChange={handleChange} required
                  className="w-full px-5 md:px-6 py-3.5 md:py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-slate-900 text-xs md:text-sm placeholder:text-slate-300"
                  placeholder="+(123) 456-7890"
                />
              </div>
              <div className="space-y-1.5 md:space-y-2">
                <label className="block text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <input 
                  name="email" type="email" value={formData.email} onChange={handleChange}
                  className="w-full px-5 md:px-6 py-3.5 md:py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-slate-900 text-xs md:text-sm placeholder:text-slate-300"
                  placeholder="vendor@puresugar.com"
                />
              </div>
              <div className="space-y-1.5 md:space-y-2">
                <label className="block text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Status</label>
                <select 
                  name="status" value={formData.status} onChange={handleChange}
                  className="w-full px-5 md:px-6 py-3.5 md:py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-slate-900 text-xs md:text-sm appearance-none cursor-pointer uppercase tracking-widest"
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
              <div className="space-y-1.5 md:space-y-2 lg:col-span-3">
                <label className="block text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Address</label>
                <input 
                  name="address" value={formData.address} onChange={handleChange}
                  className="w-full px-5 md:px-6 py-3.5 md:py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-slate-900 text-xs md:text-sm placeholder:text-slate-300"
                  placeholder="123 Industrial Way, Sector 7"
                />
              </div>

              <div className="lg:col-span-3 flex justify-end gap-5 pt-4 border-t border-slate-50 mt-2">
                <button type="button" onClick={resetForm} className="px-6 py-3 font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest text-[9px]">
                  Cancel
                </button>
                <button type="submit" className="py-4 md:py-4.5 px-10 md:px-12 bg-slate-900 text-white rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.3em] shadow-2xl shadow-slate-200 hover:bg-primary transition-all duration-500 hover:-translate-y-0.5">
                  {editingId ? "Update Supplier" : "Add Supplier"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="glass-card rounded-[32px] md:rounded-[40px] overflow-hidden bg-white/70 backdrop-blur-xl border border-slate-100 shadow-xl">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 md:px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Supplier</th>
                <th className="px-8 md:px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Products Supplied</th>
                <th className="px-8 md:px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Contact Details</th>
                <th className="px-8 md:px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Status</th>
                <th className="px-8 md:px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-12 py-32 text-center">
                    <Loader2 className="animate-spin mx-auto mb-6 text-primary" size={48} />
                    <p className="font-black uppercase tracking-[0.4em] text-[10px] text-slate-400">Loading suppliers...</p>
                  </td>
                </tr>
              ) : filteredSuppliers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-12 py-32 text-center text-slate-300">
                    <Truck className="mx-auto mb-6 opacity-10" size={80} />
                    <p className="font-black uppercase tracking-widest text-xs tracking-[0.2em]">No suppliers found.</p>
                  </td>
                </tr>
              ) : (
                filteredSuppliers.map((s) => (
                  <tr key={s._id} className="group hover:bg-white transition-all duration-300 border-b border-slate-50/50">
                    <td className="px-8 md:px-10 py-5 md:py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-[18px] bg-slate-900 text-gold flex items-center justify-center font-black text-xl shadow-inner">
                          {s.name[0]}
                        </div>
                        <div className="max-w-[200px]">
                          <p className="font-black text-slate-900 uppercase tracking-tight text-base leading-tight">{s.name}</p>
                          <p className="text-[9px] font-bold text-slate-400 flex items-center gap-1.5 mt-1 px-1.5 py-0.5 bg-slate-50 rounded-md w-fit break-all">
                            <MapPin size={10} className="text-primary flex-shrink-0"/> {s.address || "No address"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 md:px-10 py-5 md:py-6">
                      <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                        {s.productsSupplied?.split(',').map((tag, i) => (
                          <span key={i} className="px-3 py-1 bg-slate-50 text-slate-600 border border-slate-100 rounded-full text-[9px] font-black uppercase tracking-widest leading-none">
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-8 md:px-10 py-5 md:py-6">
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-black text-slate-900 flex items-center gap-1.5 uppercase tracking-tight">
                          <Phone size={10} className="text-primary" /> {s.phone}
                        </p>
                        {s.email && (
                          <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 break-all">
                            <Mail size={10} className="text-primary flex-shrink-0" /> {s.email}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-8 md:px-10 py-5 md:py-6">
                      <div className={`px-4 py-1.5 border rounded-full flex items-center gap-2 w-fit shadow-sm ${
                        s.status === 'Active' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                        : 'bg-rose-50 text-rose-600 border-rose-100'
                      }`}>
                        {s.status === 'Active' ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />}
                        <span className="text-[10px] font-black uppercase tracking-widest">{s.status}</span>
                      </div>
                    </td>
                    <td className="px-8 md:px-10 py-5 md:py-6 text-right">
                      <div className="flex justify-end gap-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                        <button 
                          onClick={() => openSupplierAccount(s._id)}
                          className="p-3 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-emerald-500 hover:shadow-xl transition-all group"
                          title="View Accounts & Payments"
                        >
                          <Truck size={18} className="group-hover:scale-110 transition-transform" />
                        </button>
                        <button 
                          onClick={() => handleEdit(s)}
                          className="p-3 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-primary hover:shadow-xl transition-all"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(s._id)}
                          className="p-3 rounded-xl bg-white border border-rose-100 text-rose-300 hover:text-rose-500 hover:shadow-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setIsDeleteModalOpen(false)}></div>
          
          <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in duration-300 border border-slate-100">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                <AlertTriangle size={40} />
              </div>
              
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Are you sure?</h2>
              <p className="text-sm font-medium text-slate-400 leading-relaxed mb-8">
                This action cannot be undone. This supplier profile will be permanently removed from your registry.
              </p>

              <div className="flex gap-3">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-4 bg-slate-50 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 hover:text-slate-900 transition-all"
                >
                  No, Keep it
                </button>
                <button 
                  onClick={executeDelete}
                  className="flex-1 py-4 bg-rose-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-rose-100 hover:bg-rose-600 transition-all"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
