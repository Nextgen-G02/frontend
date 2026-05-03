import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { 
  Lock, 
  Unlock, 
  History, 
  DollarSign, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  Calendar,
  ArrowRight,
  Edit2
} from "lucide-react";

export default function CashDrawer() {
  const [drawer, setDrawer] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [closeData, setCloseData] = useState({
    actualBalance: "",
    notes: ""
  });
  const [editData, setEditData] = useState({
    openingBalance: "",
    notes: ""
  });

  useEffect(() => {
    fetchTodayDrawer();
    fetchHistory();
  }, []);

  const fetchTodayDrawer = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/cash-drawer/today`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDrawer(res.data.data);
      setEditData({
        openingBalance: res.data.data.openingBalance,
        notes: res.data.data.notes || ""
      });
    } catch (error) {
      toast.error("Failed to fetch drawer data");
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/cash-drawer/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseDrawer = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/cash-drawer/close`, closeData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Drawer closed and reconciled");
      setShowCloseModal(false);
      fetchTodayDrawer();
      fetchHistory();
    } catch (error) {
      toast.error("Failed to close drawer");
    }
  };

  const handleUpdateDrawer = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/cash-drawer/${drawer._id}`, editData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Drawer details updated");
      setShowEditModal(false);
      fetchTodayDrawer();
      fetchHistory();
    } catch (error) {
      toast.error("Failed to update drawer");
    }
  };

  return (
    <div className="space-y-10 max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-10 h-1 bg-amber-500 rounded-full"></span>
            <p className="text-amber-500 font-black uppercase tracking-[0.4em] text-[10px]">Currency Reconciliation System</p>
          </div>
          <h1 className="heading-premium text-4xl">Cash <span className="italic font-medium text-slate-400">Drawer</span></h1>
        </div>
      </div>

      {loading ? (
        <div className="h-96 flex flex-col items-center justify-center gap-6">
          <Loader2 className="animate-spin text-amber-500" size={56} />
          <p className="font-black uppercase tracking-[0.4em] text-[10px] text-slate-400 italic">Accessing Secure Vault...</p>
        </div>
      ) : drawer ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Status Card */}
          <div className="lg:col-span-2 space-y-10">
            <div className={`glass-card p-10 rounded-[48px] border-none shadow-2xl relative overflow-hidden group ${
              drawer.status === 'Open' ? 'bg-slate-900 text-white' : 'bg-emerald-600 text-white'
            }`}>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:scale-125 transition-transform duration-1000" />
              
              <div className="flex items-center justify-between mb-12 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-xl border border-white/10">
                    {drawer.status === 'Open' ? <Unlock size={24} /> : <Lock size={24} />}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black tracking-tight uppercase leading-none">Vault {drawer.status}</h2>
                    <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mt-1 italic">
                      {new Date(drawer.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setShowEditModal(true)}
                    className="p-4 bg-white/10 text-white rounded-2xl hover:bg-white/20 transition-all border border-white/10"
                  >
                    <Edit2 size={20} />
                  </button>
                  {drawer.status === 'Open' && (
                    <button 
                      onClick={() => setShowCloseModal(true)}
                      className="px-8 py-4 bg-amber-500 text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white transition-all shadow-xl shadow-amber-500/20"
                    >
                      Close Session
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                <div className="space-y-2 p-6 bg-white/5 rounded-3xl border border-white/5">
                  <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em]">Opening Balance</p>
                  <p className="text-2xl font-black">Rs.{drawer.openingBalance.toLocaleString()}</p>
                </div>
                <div className="space-y-2 p-6 bg-white/5 rounded-3xl border border-white/5">
                  <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em]">Total Sales (Cash)</p>
                  <p className="text-2xl font-black text-emerald-400">+ Rs.{drawer.salesCash.toLocaleString()}</p>
                </div>
                <div className="space-y-2 p-6 bg-white/5 rounded-3xl border border-white/5">
                  <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em]">Total Expenses (Cash)</p>
                  <p className="text-2xl font-black text-rose-400">- Rs.{drawer.expensesCash.toLocaleString()}</p>
                </div>
              </div>

              <div className="mt-10 pt-10 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                <div>
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mb-1">Expected Closing Balance</p>
                  <p className="text-5xl font-black tracking-tighter">Rs.{drawer.closingBalance.toLocaleString()}</p>
                </div>
                {drawer.status === 'Closed' && (
                  <div className="text-right">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mb-1">Variance Detected</p>
                    <p className={`text-2xl font-black ${drawer.difference === 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {drawer.difference === 0 ? 'Zero Variance' : `Rs.${drawer.difference.toLocaleString()}`}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Reconciliation History */}
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl overflow-hidden">
               <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-50 text-slate-900 rounded-xl"><History size={20} /></div>
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Audit Logs</h3>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last 30 Sessions</span>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead>
                     <tr className="bg-slate-50/30">
                        <th className="px-10 py-6 text-[9px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                        <th className="px-10 py-6 text-[9px] font-black text-slate-400 uppercase tracking-widest">Expected</th>
                        <th className="px-10 py-6 text-[9px] font-black text-slate-400 uppercase tracking-widest">Actual</th>
                        <th className="px-10 py-6 text-[9px] font-black text-slate-400 uppercase tracking-widest">Variance</th>
                        <th className="px-10 py-6 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                     {history.map((log) => (
                       <tr key={log._id} className="hover:bg-slate-50/50 transition-colors group">
                         <td className="px-10 py-6">
                            <span className="text-sm font-bold text-slate-900">{new Date(log.date).toLocaleDateString()}</span>
                         </td>
                         <td className="px-10 py-6">
                            <span className="text-sm font-medium text-slate-500">Rs.{log.closingBalance.toLocaleString()}</span>
                         </td>
                         <td className="px-10 py-6">
                            <span className="text-sm font-black text-slate-900">Rs.{log.actualBalance.toLocaleString()}</span>
                         </td>
                         <td className="px-10 py-6">
                            <span className={`text-sm font-black ${log.difference === 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                              {log.difference > 0 ? '+' : ''}{log.difference.toLocaleString()}
                            </span>
                         </td>
                         <td className="px-10 py-6 text-right">
                           <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                             log.status === 'Open' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                           }`}>
                             {log.status}
                           </span>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
          </div>

          {/* Right Info Sidebar */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl">
               <div className="flex items-center gap-4 mb-6">
                 <div className="p-3 bg-amber-50 text-amber-500 rounded-xl"><AlertCircle size={20} /></div>
                 <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Protocol Warning</h3>
               </div>
               <p className="text-xs text-slate-500 leading-relaxed font-medium italic">
                 "Reconciliation is mandatory at the end of every business cycle. Ensure all physical currency is counted twice before finalizing the audit entry."
               </p>
            </div>

            <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100 border-dashed">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Security Measures</h4>
               <div className="space-y-6">
                 <div className="flex items-start gap-4">
                   <div className="mt-1"><CheckCircle2 size={14} className="text-emerald-500" /></div>
                   <p className="text-[11px] font-bold text-slate-600 uppercase leading-snug">Automated Sales Syncing</p>
                 </div>
                 <div className="flex items-start gap-4">
                   <div className="mt-1"><CheckCircle2 size={14} className="text-emerald-500" /></div>
                   <p className="text-[11px] font-bold text-slate-600 uppercase leading-snug">Manual Expense Tracking</p>
                 </div>
                 <div className="flex items-start gap-4">
                   <div className="mt-1"><CheckCircle2 size={14} className="text-emerald-500" /></div>
                   <p className="text-[11px] font-bold text-slate-600 uppercase leading-snug">Variance Anomaly Detection</p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Edit Drawer Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-indigo-50 text-indigo-500 rounded-2xl"><Edit2 size={24} /></div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Edit Session</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Manual Correction</p>
                </div>
              </div>

              <form onSubmit={handleUpdateDrawer} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Opening Balance (Rs.)</label>
                  <input 
                    required
                    type="number" 
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold"
                    value={editData.openingBalance}
                    onChange={(e) => setEditData({...editData, openingBalance: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Observations / Notes</label>
                  <textarea 
                    rows="3"
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold resize-none"
                    placeholder="Document any corrections..."
                    value={editData.notes}
                    onChange={(e) => setEditData({...editData, notes: e.target.value})}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 py-4 text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] hover:text-slate-900 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl hover:bg-indigo-600 transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Close Drawer Modal */}
      {showCloseModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-amber-50 text-amber-500 rounded-2xl"><Lock size={24} /></div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Audit Closure</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reconciliation Phase</p>
                </div>
              </div>

              <form onSubmit={handleCloseDrawer} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Actual Physical Cash Count (Rs.)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      required
                      type="number" 
                      className="w-full pl-12 pr-6 py-5 bg-slate-50 border-none rounded-2xl text-lg font-black"
                      placeholder="0.00"
                      value={closeData.actualBalance}
                      onChange={(e) => setCloseData({...closeData, actualBalance: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Observations / Notes</label>
                  <textarea 
                    rows="3"
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold resize-none"
                    placeholder="Document any discrepancies or notes..."
                    value={closeData.notes}
                    onChange={(e) => setCloseData({...closeData, notes: e.target.value})}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowCloseModal(false)}
                    className="flex-1 py-4 text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] hover:text-slate-900 transition-colors"
                  >
                    Abort
                  </button>
                  <button 
                    type="submit"
                    className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl hover:bg-amber-500 hover:text-slate-900 transition-all"
                  >
                    Finalize Audit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
