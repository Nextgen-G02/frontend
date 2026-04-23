import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { 
  UserPlus, 
  UserX, 
  Shield, 
  Mail, 
  Key, 
  User, 
  MoreVertical,
  Loader2,
  Lock,
  BadgeCheck,
  Settings
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminStaffManagement() {
  const navigate = useNavigate();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "staff"
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
      role: user.role
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({ firstName: "", lastName: "", email: "", password: "", role: "staff" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this staff member from the system?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/auth/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Staff member removed");
      fetchStaff();
    } catch (error) {
      toast.error("Failed to remove staff");
    }
  };

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

        <div className="flex items-center gap-3.5 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
          <div className="p-2.5 bg-white rounded-lg shadow-sm">
            <Shield className="text-primary" size={20} md:size={22} />
          </div>
          <div className="pr-4">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">System Status</p>
            <p className="text-xs font-bold text-slate-900 mt-1">All Staff Online</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 md:gap-10 items-start">
        {/* Create/Edit Staff Form */}
        <div className="xl:col-span-4 glass-card p-8 md:p-10 rounded-[32px] md:rounded-[40px] bg-white relative overflow-hidden group border border-slate-100">
          <div className="absolute top-0 right-0 w-40 h-40 bg-slate-50 rounded-full -mr-20 -mt-20 opacity-50 group-hover:scale-110 transition-transform duration-700" />
          
          <div className="flex items-center gap-4 mb-8 text-slate-900 relative z-10">
            <div className={`p-3.5 ${isEditing ? 'bg-emerald-500' : 'bg-slate-900'} text-white rounded-xl shadow-xl shadow-slate-200`}>
              {isEditing ? <BadgeCheck size={22} /> : <UserPlus size={22} />}
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight uppercase">{isEditing ? 'Update Staff' : 'Add New Staff'}</h2>
              <p className="text-[9px] font-medium text-slate-400 mt-0.5 uppercase tracking-widest leading-none">{isEditing ? 'Modify Credentials' : 'Staff Details'}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 gap-5">
              <div className="space-y-2">
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Staff Name</label>
                <div className="grid grid-cols-2 gap-3">
                   <input 
                    type="text" placeholder="First Name" required
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-slate-900 placeholder:text-slate-300 text-xs shadow-sm"
                  />
                  <input 
                    type="text" placeholder="Last Name" required
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-slate-900 placeholder:text-slate-300 text-xs shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative">
                   <Mail className="absolute left-4.5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                   <input 
                    type="email" placeholder="staff@nirosha.com" required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-slate-900 placeholder:text-slate-300 text-xs shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  {isEditing ? 'New Password (Optional)' : 'Password'}
                </label>
                <div className="relative">
                   <Lock className="absolute left-4.5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                   <input 
                    type="password" 
                    placeholder="••••••••" 
                    required={!isEditing}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-slate-900 placeholder:text-slate-300 text-xs shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Access Role</label>
                <select 
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-slate-900 text-xs shadow-sm appearance-none"
                >
                  <option value="staff">Shop Staff</option>
                  <option value="admin">Owner / Admin</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button className={`flex-1 py-4.5 md:py-5 ${isEditing ? 'bg-emerald-600' : 'bg-slate-900'} text-white rounded-xl md:rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl transition-all duration-500 hover:-translate-y-0.5`}>
                {isEditing ? 'Update Member' : 'Add Staff Member'}
              </button>
              {isEditing && (
                <button 
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-4.5 md:py-5 bg-slate-100 text-slate-400 rounded-xl md:rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Staff List */}
        <div className="xl:col-span-8 glass-card rounded-[32px] md:rounded-[40px] overflow-hidden bg-white/70 backdrop-blur-xl border border-slate-100">
          <div className="p-6 md:p-8 border-b border-slate-50 flex items-center justify-between bg-white/50">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-4 uppercase leading-none">
                Staff List
              </h2>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1 italic">Active Staff Members</p>
            </div>
          </div>
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 md:px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Staff Member</th>
                  <th className="px-8 md:px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Role</th>
                  <th className="px-8 md:px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan="3" className="px-12 py-32 text-center">
                      <Loader2 className="animate-spin text-primary mx-auto mb-6" size={48} />
                      <p className="font-black uppercase tracking-[0.4em] text-[10px] text-slate-400">Loading staff data...</p>
                    </td>
                  </tr>
                ) : (
                  staff.map((user) => (
                    <tr key={user._id} className="hover:bg-white transition-all duration-300 group border-b border-slate-50/50">
                      <td className="px-8 md:px-10 py-5 md:py-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-[18px] flex items-center justify-center font-black text-lg shadow-inner ${user.role === 'admin' ? 'bg-primary text-white' : 'bg-slate-900 text-gold'}`}>
                            {user.firstName[0]}
                          </div>
                          <div>
                            <p className="font-black text-slate-900 uppercase tracking-tight text-base leading-tight">{user.firstName} {user.lastName}</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5 mt-1 px-1.5 py-0.5 bg-slate-50 rounded-md w-fit">
                              <Mail size={10} className="text-primary"/> {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 md:px-10 py-5 md:py-6">
                        <span className={`px-4 py-1.5 border rounded-full flex items-center gap-2 w-fit shadow-sm ${
                          user.role === 'admin' 
                          ? 'bg-primary/5 text-primary border-primary/20' 
                          : 'bg-slate-50 text-slate-600 border-slate-100'
                        }`}>
                          {user.role === 'admin' ? <BadgeCheck size={12} /> : <User size={12} />}
                          <span className="text-[10px] font-black uppercase tracking-widest">{user.role}</span>
                        </span>
                      </td>
                      <td className="px-8 md:px-10 py-5 md:py-6 text-right">
                        <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                          <button 
                            onClick={() => handleEdit(user)}
                            className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 border border-slate-100 transition-all"
                          >
                            <Settings size={18} />
                          </button>
                          {user.role !== 'admin' && (
                            <button 
                              onClick={() => handleDelete(user._id)}
                              className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:text-primary hover:bg-rose-50 border border-slate-100 transition-all"
                            >
                              <UserX size={18} />
                            </button>
                          )}
                        </div>
                        {user.role === 'admin' && (
                           <div className="flex justify-end group-hover:hidden transition-opacity">
                              <div className="px-4 py-2 rounded-lg bg-slate-100 flex items-center gap-2.5">
                                <Lock size={10} className="text-slate-400" />
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Admin Owner</span>
                              </div>
                           </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

