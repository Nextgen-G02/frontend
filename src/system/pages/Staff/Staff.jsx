import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  UserPlus,
  UserX,
  Shield,
  Mail,
  Lock,
  BadgeCheck,
  Settings,
  AlertTriangle,
  Search,
  User,
  Plus,
  Trash2,
  Edit3
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminStaffManagement() {
  const navigate = useNavigate();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // New layout states
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "staff",
    nic: "",
    address: "",
    permissions: []
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/staff`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStaff(response.data.data);
    } catch (error) {
      toast.error("Could not load staff list");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setIsEditing(true);
    setEditingId(user._id);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: "", // Don't show old password
      role: user.role,
      nic: user.nic || "",
      address: user.address || "",
      permissions: user.permissions || []
    });
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({ firstName: "", lastName: "", email: "", password: "", role: "staff", nic: "", address: "", permissions: [] });
    setIsFormOpen(false);
  };

  const AVAILABLE_PERMISSIONS = [
    { id: 'view_reports', label: 'View Reports & Financials' },
    { id: 'use_pos', label: 'POS Terminal Access' },
    { id: 'manage_inventory', label: 'Manage Inventory' },
    { id: 'manage_suppliers', label: 'Manage Suppliers' },
    { id: 'manage_orders', label: 'Manage Customer Orders' },
    { id: 'manage_products', label: 'Manage Products & Categories' },
    { id: 'manage_customers', label: 'Manage Customer Database' },
    { id: 'manage_expenses', label: 'Manage Expenses & Cash Drawer' },
    { id: 'manage_marketing', label: 'Manage Newsletter & Marketing' }
  ];

  const togglePermission = (permId) => {
    const current = formData.permissions || [];
    if (current.includes(permId)) {
      setFormData({ ...formData, permissions: current.filter(id => id !== permId) });
    } else {
      setFormData({ ...formData, permissions: [...current, permId] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      if (isEditing) {
        await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/auth/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Staff details updated successfully");
      } else {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/create-staff`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("New staff member added");
      }
      handleCancel();
      fetchStaff();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const handleDelete = (id) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/auth/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Staff member removed");
      fetchStaff();
    } catch (error) {
      toast.error("Failed to remove staff");
    } finally {
      setIsDeleteModalOpen(false);
      setDeleteId(null);
    }
  };

  // Filter staff based on search
  const filteredStaff = staff.filter(user => 
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 max-w-[1500px] mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-10 h-1 bg-primary rounded-full"></span>
            <p className="text-primary font-black uppercase tracking-[0.4em] text-[9px]">Team Management</p>
          </div>
          <h1 className="heading-premium text-2xl md:text-5xl leading-tight">
            Staff <span className="italic font-medium text-slate-400">Members</span>
          </h1>
          <p className="text-slate-400 font-medium mt-2 md:mt-3 text-sm md:text-base">Manage your shop staff and their login access.</p>
        </div>

        <div className="flex items-center gap-3.5">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={16} md:size={18} />
            <input 
              type="text" 
              placeholder="Search staff..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 pr-5 py-3 md:py-3.5 bg-white border border-slate-200 rounded-xl md:rounded-2xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-slate-900 w-full md:w-60 text-xs shadow-sm"
            />
          </div>
          <button 
            onClick={() => {
              if (isFormOpen && !isEditing) {
                setIsFormOpen(false);
              } else {
                handleCancel(); // Reset form
                setIsFormOpen(true);
              }
            }}
            className="py-3.5 md:py-4 px-6 md:px-7 bg-slate-900 text-white rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-primary transition-all flex items-center gap-2.5"
          >
            <Plus size={18} md:size={20} />
            <span className="hidden sm:inline">{isFormOpen ? "Close Form" : "Add New Staff"}</span>
          </button>
        </div>
      </header>

      {isFormOpen && (
        <div className="animate-in fade-in zoom-in duration-500">
          <div className="glass-card p-8 md:p-10 rounded-[32px] md:rounded-[48px] bg-white relative overflow-hidden group border-none shadow-2xl">
            <div className="absolute top-0 right-0 w-40 h-40 bg-slate-50 rounded-full -mr-20 -mt-20 opacity-50 group-hover:scale-110 transition-transform duration-700"></div>
            
            <div className="flex items-center gap-4 mb-8 relative z-10">
              <div className={`p-3.5 ${isEditing ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-gold'} rounded-xl shadow-lg`}>
                {isEditing ? <BadgeCheck size={20} md:size={24} /> : <UserPlus size={20} md:size={24} />}
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">
                  {isEditing ? 'Update Staff' : 'Add New Staff'}
                </h2>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">
                  {isEditing ? 'Modify Credentials' : 'Staff Details Form'}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 relative z-10">
              <div className="space-y-1.5 md:space-y-2">
                <label className="block text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                <input
                  type="text" placeholder="e.g. John" required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-5 md:px-6 py-3.5 md:py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-slate-900 text-xs md:text-sm placeholder:text-slate-300"
                />
              </div>
              
              <div className="space-y-1.5 md:space-y-2">
                <label className="block text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                <input
                  type="text" placeholder="e.g. Doe" required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-5 md:px-6 py-3.5 md:py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-slate-900 text-xs md:text-sm placeholder:text-slate-300"
                />
              </div>

              <div className="space-y-1.5 md:space-y-2">
                <label className="block text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">National ID (NIC) *</label>
                <div className="relative">
                  <Shield className="absolute left-4.5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input
                    type="text" placeholder="e.g. 199912345678" required
                    value={formData.nic}
                    onChange={(e) => setFormData({ ...formData, nic: e.target.value })}
                    className="w-full pl-12 pr-5 py-3.5 md:py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-slate-900 text-xs md:text-sm placeholder:text-slate-300"
                  />
                </div>
              </div>

              <div className="space-y-1.5 md:space-y-2">
                <label className="block text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address (Optional)</label>
                <div className="relative">
                  <Mail className="absolute left-4.5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input
                    type="email" placeholder="staff@nirosha.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-12 pr-5 py-3.5 md:py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-slate-900 text-xs md:text-sm placeholder:text-slate-300"
                  />
                </div>
              </div>

              <div className="space-y-1.5 md:space-y-2">
                <label className="block text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  {isEditing ? 'New Password (Optional)' : 'Password *'}
                </label>
                <div className="relative">
                  <Lock className="absolute left-4.5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    required={!isEditing}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-12 pr-5 py-3.5 md:py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-slate-900 text-xs md:text-sm placeholder:text-slate-300"
                  />
                </div>
              </div>

              <div className="space-y-1.5 md:space-y-2 lg:col-span-3">
                <label className="block text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Residential Address</label>
                <input
                  placeholder="Street, City, Province" required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-5 md:px-6 py-3.5 md:py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-slate-900 text-xs md:text-sm placeholder:text-slate-300"
                />
              </div>

              <div className="space-y-1.5 md:space-y-2 lg:col-span-3">
                <label className="block text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Access Role & Permissions</label>
                <div className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-400 text-xs shadow-sm flex items-center gap-2 mb-4">
                  <BadgeCheck size={14} className="text-emerald-500" />
                  Shop Staff (Granular Access)
                </div>
                
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 md:p-6 shadow-sm space-y-4">
                  <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Select Permissions</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {AVAILABLE_PERMISSIONS.map(perm => (
                      <label key={perm.id} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          className="hidden" 
                          checked={formData.permissions?.includes(perm.id) || false} 
                          onChange={() => togglePermission(perm.id)} 
                        />
                        <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${formData.permissions?.includes(perm.id) ? 'bg-primary border-primary text-white' : 'bg-white border-slate-200 text-transparent group-hover:border-primary'}`}>
                          <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/></svg>
                        </div>
                        <span className="text-xs font-bold text-slate-600">{perm.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3 flex justify-end gap-5 pt-4 border-t border-slate-50 mt-2">
                <button type="button" onClick={handleCancel} className="px-6 py-3 font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest text-[9px]">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className={`py-4 md:py-4.5 px-10 md:px-12 ${isEditing ? 'bg-emerald-600' : 'bg-slate-900'} text-white rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.3em] shadow-2xl shadow-slate-200 transition-all duration-500 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5 hover:bg-primary'}`}>
                  {isSubmitting ? 'Saving...' : (isEditing ? 'Update Member' : 'Add Staff Member')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Staff List Table */}
      <div className="glass-card rounded-[32px] md:rounded-[40px] overflow-hidden bg-white/70 backdrop-blur-xl border border-slate-100 shadow-xl">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 md:px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Staff Member</th>
                <th className="px-8 md:px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Role & Access</th>
                <th className="px-8 md:px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="3" className="px-12 py-32 text-center">
                    <AlertTriangle className="animate-pulse mx-auto mb-6 text-primary" size={48} />
                    <p className="font-black uppercase tracking-[0.4em] text-[10px] text-slate-400">Loading staff data...</p>
                  </td>
                </tr>
              ) : filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-12 py-32 text-center text-slate-300">
                    <User className="mx-auto mb-6 opacity-10" size={80} />
                    <p className="font-black uppercase tracking-widest text-xs tracking-[0.2em]">No staff members found.</p>
                  </td>
                </tr>
              ) : (
                filteredStaff.map((user) => (
                  <tr key={user._id} className="group hover:bg-white transition-all duration-300 border-b border-slate-50/50">
                    <td className="px-8 md:px-10 py-5 md:py-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-[18px] flex items-center justify-center font-black text-lg shadow-inner ${user.role === 'admin' ? 'bg-amber-500 text-white' : 'bg-slate-900 text-gold'}`}>
                          {user.role === 'admin' ? <BadgeCheck size={24} /> : user.firstName[0]}
                        </div>
                        <div className="max-w-[250px]">
                          <p className="font-black text-slate-900 uppercase tracking-tight text-base leading-tight">{user.firstName} {user.lastName}</p>
                          <p className="text-[11px] text-slate-400 font-bold flex items-center gap-1.5 mt-1 px-1.5 py-0.5 bg-slate-50 rounded-md w-fit lowercase break-all">
                            <Mail size={10} className="text-primary flex-shrink-0" /> {user.email}
                          </p>
                          {user.nic && (
                            <p className="text-[9px] text-slate-400 font-medium mt-1.5 flex items-center gap-1.5">
                              <Shield size={10} /> {user.nic}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 md:px-10 py-5 md:py-6">
                      <div className="flex flex-col items-start gap-2 max-w-[200px]">
                        <span className={`px-4 py-1.5 border rounded-full flex items-center gap-2 shadow-sm ${user.role === 'admin'
                            ? 'bg-amber-50 text-amber-600 border-amber-100'
                            : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                          }`}>
                          {user.role === 'admin' ? <BadgeCheck size={12} /> : <Shield size={12} />}
                          <span className="text-[10px] font-black uppercase tracking-widest">{user.role}</span>
                        </span>
                        
                        {user.role === 'staff' && user.permissions && user.permissions.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {user.permissions.slice(0, 2).map((perm, i) => (
                              <span key={i} className="px-2 py-0.5 bg-slate-50 text-slate-500 border border-slate-100 rounded text-[8px] font-black uppercase tracking-widest">
                                {perm.replace('manage_', '').replace('_', ' ')}
                              </span>
                            ))}
                            {user.permissions.length > 2 && (
                              <span className="px-2 py-0.5 bg-slate-50 text-slate-400 border border-slate-100 rounded text-[8px] font-black uppercase tracking-widest">
                                +{user.permissions.length - 2} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-8 md:px-10 py-5 md:py-6 text-right">
                      <div className="flex justify-end gap-2.5 transition-all duration-300">
                        <button 
                          onClick={() => handleEdit(user)}
                          className="p-3 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-primary hover:shadow-xl transition-all group"
                          title="Edit Profile"
                        >
                          <Edit3 size={18} className="group-hover:scale-110 transition-transform" />
                        </button>
                        {user.role !== 'admin' && (
                          <button 
                            onClick={() => handleDelete(user._id)}
                            className="p-3 rounded-xl bg-white border border-rose-100 text-rose-300 hover:text-rose-500 hover:shadow-xl transition-all"
                            title="Remove Staff"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                        {user.role === 'admin' && (
                           <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-300 cursor-not-allowed group relative" title="Admins cannot be deleted">
                             <Lock size={18} />
                           </div>
                        )}
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
                This action cannot be undone. This staff member will be permanently removed from your system and lose all access.
              </p>

              <div className="flex gap-3">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-4 bg-slate-50 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 hover:text-slate-900 transition-all"
                >
                  No, Keep them
                </button>
                <button 
                  onClick={executeDelete}
                  className="flex-1 py-4 bg-rose-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-rose-100 hover:bg-rose-600 transition-all"
                >
                  Yes, Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
