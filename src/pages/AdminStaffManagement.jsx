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
  BadgeCheck
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminStaffManagement() {
  const navigate = useNavigate();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newStaff, setNewStaff] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
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
      toast.error("Security registry access denied");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/create-staff`, newStaff, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Security credentials provisioned");
      setNewStaff({ firstName: "", lastName: "", email: "", password: "" });
      fetchStaff();
    } catch (error) {
      toast.error(error.response?.data?.message || "Credential creation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Terminate this staff member's access privileges?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/auth/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Access privileges revoked");
      fetchStaff();
    } catch (error) {
      toast.error("Decommissioning failed");
    }
  };

  return (
    <div className="space-y-10 max-w-[1500px] mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-10 h-1 bg-primary rounded-full"></span>
            <p className="text-primary font-black uppercase tracking-[0.4em] text-[9px]">Administrative Framework</p>
          </div>
          <h1 className="heading-premium text-2xl md:text-5xl leading-tight">
            Team <span className="italic font-medium text-slate-400">Management</span>
          </h1>
          <p className="text-slate-400 font-medium mt-2 md:mt-3 text-sm md:text-base">Orchestrate access levels and administrative personnel credentials.</p>
        </div>

        <div className="flex items-center gap-3.5 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
          <div className="p-2.5 bg-white rounded-lg shadow-sm">
            <Shield className="text-primary" size={20} md:size={22} />
          </div>
          <div className="pr-4">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Security Status</p>
            <p className="text-xs font-bold text-slate-900 mt-1">Registry Fully Operational</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 md:gap-10 items-start">
        {/* Create Staff Form */}
        <div className="xl:col-span-4 glass-card p-8 md:p-10 rounded-[32px] md:rounded-[40px] bg-white relative overflow-hidden group border border-slate-100">
          <div className="absolute top-0 right-0 w-40 h-40 bg-slate-50 rounded-full -mr-20 -mt-20 opacity-50 group-hover:scale-110 transition-transform duration-700" />
          
          <div className="flex items-center gap-4 mb-8 text-slate-900 relative z-10">
            <div className="p-3.5 bg-primary text-white rounded-xl shadow-xl shadow-primary/20">
              <UserPlus size={20} md:size={22} />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight uppercase">Provision Member</h2>
              <p className="text-[9px] font-medium text-slate-400 mt-0.5 uppercase tracking-widest leading-none">Initialization Protocol</p>
            </div>
          </div>

          <form onSubmit={handleCreate} className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 gap-5">
              <div className="space-y-2">
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Identity</label>
                <div className="grid grid-cols-2 gap-3">
                   <input 
                    type="text" placeholder="First Name" required
                    value={newStaff.firstName}
                    onChange={(e) => setNewStaff({...newStaff, firstName: e.target.value})}
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-slate-900 placeholder:text-slate-300 text-xs shadow-sm"
                  />
                  <input 
                    type="text" placeholder="Last Name" required
                    value={newStaff.lastName}
                    onChange={(e) => setNewStaff({...newStaff, lastName: e.target.value})}
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-slate-900 placeholder:text-slate-300 text-xs shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Comms Vector (Email)</label>
                <div className="relative">
                   <Mail className="absolute left-4.5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                   <input 
                    type="email" placeholder="staff@pos-system.com" required
                    value={newStaff.email}
                    onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
                    className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-slate-900 placeholder:text-slate-300 text-xs shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Access Cipher (Password)</label>
                <div className="relative">
                   <Lock className="absolute left-4.5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                   <input 
                    type="password" placeholder="••••••••" required
                    value={newStaff.password}
                    onChange={(e) => setNewStaff({...newStaff, password: e.target.value})}
                    className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-slate-900 placeholder:text-slate-300 text-xs shadow-sm"
                  />
                </div>
              </div>
            </div>

            <button className="w-full py-4.5 md:py-5 bg-slate-900 text-white rounded-xl md:rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl shadow-slate-200 hover:bg-primary transition-all duration-500 hover:-translate-y-0.5">
              Initialize Access
            </button>
          </form>
        </div>

        {/* Staff List */}
        <div className="xl:col-span-8 glass-card rounded-[32px] md:rounded-[40px] overflow-hidden bg-white/70 backdrop-blur-xl border border-slate-100">
          <div className="p-6 md:p-8 border-b border-slate-50 flex items-center justify-between bg-white/50">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-4 uppercase leading-none">
                Authorized Personnel
              </h2>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1 italic">Vigilance & Integrity Registry</p>
            </div>
            <div className="flex gap-2">
              <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors cursor-pointer border border-slate-100">
                <MoreVertical size={18} />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 md:px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Entity Identity</th>
                  <th className="px-8 md:px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Clearance Tier</th>
                  <th className="px-8 md:px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] text-right">System Access</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan="3" className="px-12 py-32 text-center">
                      <Loader2 className="animate-spin text-primary mx-auto mb-6" size={48} />
                      <p className="font-black uppercase tracking-[0.4em] text-[10px] text-slate-400">Verifying Registry Protocols...</p>
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
                          <span className="text-[10px] font-black uppercase tracking-widest">{user.role} tier</span>
                        </span>
                      </td>
                      <td className="px-8 md:px-10 py-5 md:py-6 text-right">
                        {user.role !== 'admin' ? (
                          <button 
                            onClick={() => handleDelete(user._id)}
                            className="p-3 rounded-xl bg-slate-50 text-slate-300 hover:text-primary hover:bg-primary/5 transition-all opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 border border-slate-100"
                          >
                            <UserX size={18} />
                          </button>
                        ) : (
                          <div className="flex justify-end opacity-20 group-hover:opacity-100 transition-opacity">
                             <div className="px-4 py-2 rounded-lg bg-slate-100 flex items-center gap-2.5">
                               <Lock size={10} className="text-slate-400" />
                               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Root Access</span>
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

