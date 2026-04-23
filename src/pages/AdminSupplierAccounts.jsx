import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { 
  Truck, 
  Plus, 
  Trash2, 
  ArrowLeft,
  Loader2,
  AlertTriangle,
  Search,
  Wallet,
  Receipt,
  Calendar,
  CheckCircle2,
  Clock,
  Edit2
} from "lucide-react";

export default function AdminSupplierAccounts() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState(null);
  const [supplyLogs, setSupplyLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteLogId, setDeleteLogId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [editPaidAmount, setEditPaidAmount] = useState("");

  const [newSupply, setNewSupply] = useState({
    productName: "",
    quantity: "",
    unitPrice: "",
    cost: "0.00",
    paidAmount: "",
    supplyDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const q = parseFloat(newSupply.quantity) || 0;
    const u = parseFloat(newSupply.unitPrice) || 0;
    setNewSupply(prev => ({ ...prev, cost: (q * u).toFixed(2) }));
  }, [newSupply.quantity, newSupply.unitPrice]);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const [suppRes, logsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/suppliers/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/purchases/supplier/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setSupplier(suppRes.data.data);
      setSupplyLogs(logsRes.data.data);
    } catch (error) {
      toast.error("Unable to load supplier account details.");
      navigate("/admin/suppliers");
    } finally {
      setLoading(false);
    }
  };

  const handleSupplySubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/purchases`, {
        ...newSupply,
        supplier: id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("New supply entry recorded successfully.");
      setNewSupply({
        productName: "",
        quantity: "",
        unitPrice: "",
        cost: "0.00",
        paidAmount: "",
        supplyDate: new Date().toISOString().split('T')[0]
      });
      fetchData();
    } catch (error) {
      toast.error("Failed to add supply record. Please verify input data.");
    }
  };

  const confirmDeleteLog = (logId) => {
    setDeleteLogId(logId);
    setIsDeleteModalOpen(true);
  };

  const handleEditOpen = (log) => {
    setEditingLog(log);
    setEditPaidAmount(log.paidAmount);
    setIsEditModalOpen(true);
  };

  const handleUpdatePayment = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/purchases/${editingLog._id}`, {
        paidAmount: editPaidAmount
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Payment details updated successfully.");
      setIsEditModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error("Failed to update payment.");
    }
  };

  const executeDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/purchases/${deleteLogId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Supply record has been deleted.");
      fetchData();
    } catch (error) {
      toast.error("Deletion failed. Please try again.");
    } finally {
      setIsDeleteModalOpen(false);
      setDeleteLogId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-primary mb-4" size={48} />
        <p className="font-black uppercase tracking-[0.4em] text-[10px] text-slate-400">Loading Account Details...</p>
      </div>
    );
  }

  const totalCost = supplyLogs.reduce((acc, log) => acc + log.cost, 0);
  const totalPaid = supplyLogs.reduce((acc, log) => acc + log.paidAmount, 0);
  const totalBalance = supplyLogs.reduce((acc, log) => acc + log.balance, 0);

  return (
    <div className="space-y-10 max-w-[1500px] mx-auto pb-20">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100">
        <div>
          <button 
            onClick={() => navigate("/admin/suppliers")}
            className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors font-black uppercase tracking-widest text-[9px] mb-4"
          >
            <ArrowLeft size={14} /> Back to Suppliers
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-[24px] bg-slate-900 text-gold flex items-center justify-center font-black text-2xl shadow-xl">
              {supplier?.name[0]}
            </div>
            <div>
              <h1 className="text-2xl md:text-5xl font-black text-slate-900 uppercase tracking-tight leading-none">
                {supplier?.name}
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2 italic flex items-center gap-2">
                <Receipt size={12} className="text-primary" /> Supplier Ledger & Payments
              </p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Supplies</p>
            <p className="text-lg font-black text-slate-900">Rs. {totalCost.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl shadow-sm">
            <p className="text-[8px] font-black text-emerald-400 uppercase tracking-widest mb-1">Total Paid</p>
            <p className="text-lg font-black text-emerald-600">Rs. {totalPaid.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl shadow-sm">
            <p className="text-[8px] font-black text-rose-400 uppercase tracking-widest mb-1">Pending Balance</p>
            <p className="text-lg font-black text-rose-600">Rs. {totalBalance.toLocaleString()}</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* Add Record Sidebar */}
        <div className="xl:col-span-1">
          <div className="glass-card p-8 rounded-[32px] bg-white border border-slate-100 shadow-xl sticky top-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-slate-900 text-white rounded-xl shadow-lg">
                <Plus size={20} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Record Supply</h2>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Enter new delivery details</p>
              </div>
            </div>

            <form onSubmit={handleSupplySubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Product Name</label>
                <input 
                  type="text" required
                  value={newSupply.productName}
                  onChange={(e) => setNewSupply({...newSupply, productName: e.target.value})}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-slate-900 text-xs"
                  placeholder="e.g. White Sugar"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Quantity</label>
                  <input 
                    type="number" required
                    value={newSupply.quantity}
                    onChange={(e) => setNewSupply({...newSupply, quantity: e.target.value})}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-slate-900 text-xs"
                    placeholder="0"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Unit Price</label>
                  <input 
                    type="number" required
                    value={newSupply.unitPrice}
                    onChange={(e) => setNewSupply({...newSupply, unitPrice: e.target.value})}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-slate-900 text-xs"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Total Cost (Calculated)</label>
                <input 
                  type="number" readOnly
                  value={newSupply.cost}
                  className="w-full px-5 py-3.5 bg-slate-100 border border-slate-100 rounded-xl font-black text-slate-900 text-xs cursor-not-allowed"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Paid Amount (Rs.)</label>
                <input 
                  type="number" required
                  value={newSupply.paidAmount}
                  onChange={(e) => setNewSupply({...newSupply, paidAmount: e.target.value})}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-slate-900 text-xs"
                  placeholder="0.00"
                />
              </div>
              <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl shadow-slate-200 hover:bg-primary transition-all duration-500 mt-2">
                Save Entry
              </button>
            </form>
          </div>
        </div>

        {/* History Table Area */}
        <div className="xl:col-span-2">
          <div className="glass-card rounded-[32px] overflow-hidden bg-white border border-slate-100 shadow-xl">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar size={18} className="text-primary" />
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Supply History</h3>
              </div>
            </div>
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                    <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Product</th>
                    <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Financials</th>
                    <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {supplyLogs.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-8 py-20 text-center">
                        <Truck className="mx-auto mb-4 opacity-10" size={60} />
                        <p className="text-xs font-black text-slate-300 uppercase tracking-widest italic">No ledger entries found.</p>
                      </td>
                    </tr>
                  ) : (
                    supplyLogs.map((log) => (
                      <tr key={log._id} className="group hover:bg-slate-50/30 transition-colors">
                        <td className="px-8 py-6">
                          <p className="text-[11px] font-black text-slate-900 leading-none">
                            {new Date(log.supplyDate).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                          </p>
                          <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">ID: {log._id.slice(-6)}</p>
                        </td>
                        <td className="px-8 py-6">
                          <p className="text-[12px] font-black text-slate-900 uppercase tracking-tight">{log.productName}</p>
                          <p className="text-[9px] font-bold text-slate-400 mt-0.5">{log.quantity} units @ Rs. {log.unitPrice?.toLocaleString()}</p>
                        </td>
                        <td className="px-8 py-6">
                          <div className="space-y-1">
                            <div className="flex justify-between w-32">
                              <span className="text-[9px] font-bold text-slate-400 uppercase">Total:</span>
                              <span className="text-[10px] font-black text-slate-900">Rs. {log.cost.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between w-32">
                              <span className="text-[9px] font-bold text-emerald-400 uppercase">Paid:</span>
                              <span className="text-[10px] font-black text-emerald-600">Rs. {log.paidAmount.toLocaleString()}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          {log.balance <= 0 ? (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                              <CheckCircle2 size={12} />
                              <span className="text-[9px] font-black uppercase tracking-widest">Fully Settled</span>
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-600 rounded-full border border-amber-100">
                              <Clock size={12} />
                              <span className="text-[9px] font-black uppercase tracking-widest">Pending: Rs. {log.balance.toLocaleString()}</span>
                            </div>
                          )}
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleEditOpen(log)}
                              className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:text-primary hover:bg-primary/5 transition-all"
                              title="Update Payment"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => confirmDeleteLog(log._id)}
                              className="p-3 rounded-xl bg-slate-50 text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all"
                              title="Delete Record"
                            >
                              <Trash2 size={16} />
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
        </div>
      </div>

      {/* Edit Payment Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setIsEditModalOpen(false)}></div>
          <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in duration-300 border border-slate-100">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-primary/10 text-primary rounded-2xl">
                  <Receipt size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Update Payment</h2>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Adjust settled amount for this supply</p>
                </div>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl mb-8 space-y-3">
                <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <span>Product:</span>
                  <span className="text-slate-900">{editingLog?.productName}</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <span>Total Cost:</span>
                  <span className="text-slate-900">Rs. {editingLog?.cost.toLocaleString()}</span>
                </div>
              </div>

              <form onSubmit={handleUpdatePayment} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">New Paid Amount (Rs.)</label>
                  <input 
                    type="number" required
                    value={editPaidAmount}
                    onChange={(e) => setEditPaidAmount(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-black text-slate-900"
                    autoFocus
                  />
                </div>
                <div className="flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="flex-1 py-4 bg-slate-50 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 hover:text-slate-900 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-primary transition-all"
                  >
                    Confirm Change
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setIsDeleteModalOpen(false)}></div>
          
          <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in duration-300 border border-slate-100">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                <AlertTriangle size={40} />
              </div>
              
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Delete Record?</h2>
              <p className="text-sm font-medium text-slate-400 leading-relaxed mb-8">
                Are you sure you want to remove this supply entry? This will permanently delete the transaction data.
              </p>

              <div className="flex gap-3">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-4 bg-slate-50 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 hover:text-slate-900 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={executeDelete}
                  className="flex-1 py-4 bg-rose-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-rose-100 hover:bg-rose-600 transition-all"
                >
                  Delete Permanently
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
