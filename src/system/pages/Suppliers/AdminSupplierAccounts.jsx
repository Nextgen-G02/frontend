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
  
  const formatCurrency = (num) => {
    return new Number(num).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const [supplier, setSupplier] = useState(null);
  const [supplyLogs, setSupplyLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteLogId, setDeleteLogId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [editPaidAmount, setEditPaidAmount] = useState("");

  const [isRecordEditModalOpen, setIsRecordEditModalOpen] = useState(false);
  const [recordFormData, setRecordFormData] = useState({
    _id: "",
    productName: "",
    quantity: "",
    unitPrice: ""
  });

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
      const sortedLogs = logsRes.data.data.sort((a, b) => {
        // Priority 1: Status (Pending/Unsettled first)
        if (a.balance > 0 && b.balance === 0) return -1;
        if (a.balance === 0 && b.balance > 0) return 1;
        
        // Priority 2: Date (Newest first)
        return new Date(b.supplyDate) - new Date(a.supplyDate);
      });
      setSupplyLogs(sortedLogs);
    } catch (error) {
      toast.error("Unable to load supplier account details.");
      navigate("/admin/suppliers");
    } finally {
      setLoading(false);
    }
  };

  const handleSupplySubmit = async (e) => {
    e.preventDefault();  // Prevent page refresh when form submits
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
    setEditPaidAmount(log.balance || ""); // Pre-fill with remaining balance
    setIsEditModalOpen(true);
  };

  const handleAddPayment = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/purchases/${editingLog._id}/payments`, {
        amount: editPaidAmount
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Installment payment recorded successfully.");
      setIsEditModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error("Failed to add payment installment.");
    }
  };

  const handleRecordEditOpen = (log) => {
    setRecordFormData({
      _id: log._id,
      productName: log.productName,
      quantity: log.quantity,
      unitPrice: log.unitPrice
    });
    setIsRecordEditModalOpen(true);
  };

  const handleRecordUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/purchases/${recordFormData._id}`, recordFormData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Supply record updated successfully.");
      setIsRecordEditModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error("Failed to update record details.");
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

  const renderLogRow = (log) => {
    // Check if payment is fully completed
    const isCompleted = log.balance === 0;
    return (
      <tr key={log._id} className="group hover:bg-white transition-all duration-300 border-b border-slate-50/50">
        <td className="px-8 md:px-10 py-6">
          <div className="flex flex-col">
            <p className="font-black text-slate-900 text-sm md:text-base leading-none mb-1">
              {new Date(log.supplyDate).toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' })}
            </p>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">ID: {log._id.slice(-6).toUpperCase()}</p>
          </div>
        </td>
        <td className="px-8 md:px-10 py-6">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <p className="font-black text-slate-900 uppercase tracking-tight text-base leading-tight flex items-center gap-2">
                {log.productName}
                {isCompleted && <CheckCircle2 size={14} className="text-emerald-500" />}
              </p>
              <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
                {log.quantity} units @ Rs. {formatCurrency(log.unitPrice)}
              </p>
            </div>
          </div>
        </td>
        <td className="px-8 md:px-10 py-6">
          <div className="space-y-3 min-w-[200px]">
            <div className="space-y-1.5 pb-3 border-b border-dashed border-slate-100">
              <div className="flex justify-between w-48">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total:</span>
                <span className="text-xs font-black text-slate-900">Rs. {formatCurrency(log.cost)}</span>
              </div>
              <div className="flex justify-between w-48">
                <span className="text-xs font-bold text-emerald-400 uppercase">{isCompleted ? 'Total Paid:' : 'Total Paid:'}</span>
                <span className="text-sm font-black text-emerald-600">Rs. {formatCurrency(log.paidAmount)}</span>
              </div>
              {log.paymentHistory?.length > 0 && (log.paymentHistory.length > 1 || log.balance > 0) && (
                <div className="pt-3 mt-3 border-t border-slate-100 space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Detailed Payment Ledger</p>
                  {log.paymentHistory.map((pmt, pidx) => (
                    <div key={pidx} className="flex justify-between items-center bg-slate-50/50 p-2 rounded-lg border border-slate-50">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-900 uppercase">
                          {pidx === 0 ? "Initial Payment" : `Installment #${pidx}`}
                        </span>
                        <span className="text-[8px] font-medium text-slate-400">
                          {new Date(pmt.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })} • {new Date(pmt.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <span className="text-xs font-black text-emerald-600">Rs. {formatCurrency(pmt.amount)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </td>
        <td className="px-8 md:px-10 py-6">
          {isCompleted ? (
            <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-100/50">
              <CheckCircle2 size={14} />
              <span className="text-xs font-black uppercase tracking-[0.2em]">Settled</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-600 rounded-full border border-amber-100">
              <Clock size={14} />
              <span className="text-xs font-black uppercase tracking-widest">Pending: Rs. {formatCurrency(log.balance)}</span>
            </div>
          )}
        </td>
        <td className="px-8 md:px-10 py-6 text-right">
          <div className="flex items-center justify-end gap-2">
            {!isCompleted && (
              <button 
                onClick={() => {
                  handleEditOpen(log);
                  setEditPaidAmount(log.balance);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-all text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-100"
              >
                Pay Balance
              </button>
            )}
            <button 
              onClick={() => handleRecordEditOpen(log)}
              className="p-3 rounded-xl bg-slate-50 text-slate-300 hover:text-primary hover:bg-primary/5 transition-all"
              title="Edit Record Details"
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
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-primary mb-4" size={48} />
        <p className="font-black uppercase tracking-[0.4em] text-[10px] text-slate-400">Loading Account Details...</p>
      </div>
    );
  }

  // Calculate total cost of all purchases
  const totalCost = supplyLogs.reduce((acc, log) => acc + log.cost, 0);
  // Calculate total paid amount
  const totalPaid = supplyLogs.reduce((acc, log) => acc + log.paidAmount, 0);
  // Calculate total pending balance
  const totalBalance = supplyLogs.reduce((acc, log) => acc + log.balance, 0);

  return (
    <div className="space-y-10 max-w-[1500px] mx-auto pb-20 px-4 md:px-8 lg:px-10">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100">
        <div>
          <button 
            onClick={() => navigate("/admin/suppliers")}
            className="flex items-center gap-2.5 bg-slate-900 text-gold px-5 py-2.5 rounded-xl font-black uppercase tracking-widest text-[9px] hover:bg-primary hover:text-white transition-all duration-300 shadow-lg shadow-slate-100 mb-6 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
            Back to Suppliers
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Supplies</p>
            <p className="text-xl font-black text-slate-900">Rs. {totalCost.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl shadow-sm">
            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Total Paid</p>
            <p className="text-xl font-black text-emerald-600">Rs. {totalPaid.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl shadow-sm">
            <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1">Pending Balance</p>
            <p className="text-xl font-black text-rose-600">Rs. {totalBalance.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl shadow-sm">
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Available Credit</p>
            <p className="text-xl font-black text-indigo-600">Rs. {supplier?.creditBalance?.toLocaleString() || "0"}</p>
          </div>
        </div>
      </header>

      <div className="flex flex-col gap-10">
        {/* Add Record Sidebar */}
        <div className="w-full">
          <div className="glass-card p-5 md:p-8 rounded-[24px] md:rounded-[32px] bg-white border border-slate-100 shadow-xl lg:sticky lg:top-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-slate-900 text-white rounded-xl shadow-lg">
                <Plus size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Add Product</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Enter product details</p>
              </div>
            </div>

            <form onSubmit={handleSupplySubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Product Name</label>
                <input 
                  type="text" required
                  value={newSupply.productName}
                  onChange={(e) => setNewSupply({...newSupply, productName: e.target.value})}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-slate-900 text-xs"
                  placeholder="e.g. Chocolate Biscuit"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Quantity</label>
                  <input 
                    type="number" required min="0"
                    value={newSupply.quantity}
                    onChange={(e) => setNewSupply({...newSupply, quantity: e.target.value})}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-slate-900 text-xs"
                    placeholder="0"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Unit Price</label>
                  <input 
                    type="number" required min="0" step="0.01"
                    value={newSupply.unitPrice}
                    onChange={(e) => setNewSupply({...newSupply, unitPrice: e.target.value})}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-slate-900 text-xs"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Total Cost (Calculated)</label>
                <input 
                  type="number" readOnly
                  value={newSupply.cost}
                  className="w-full px-5 py-3.5 bg-slate-100 border border-slate-100 rounded-xl font-black text-slate-900 text-xs cursor-not-allowed"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                  Paid Amount (Rs.) 
                  {supplier?.creditBalance > 0 && (
                    <span className="text-indigo-500 ml-2"> (Credit Rs. {supplier.creditBalance} will be applied)</span>
                  )}
                </label>
                <input 
                  type="number" min="0" step="0.01"
                  value={newSupply.paidAmount}
                  onChange={(e) => setNewSupply({...newSupply, paidAmount: e.target.value})}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-slate-900 text-xs"
                  placeholder="0.00"
                />
                {newSupply.cost > 0 && (
                  <p className="text-[9px] font-bold text-slate-400 mt-1 italic">
                    Net Payable: Rs. {formatCurrency(Math.max(0, parseFloat(newSupply.cost) - (supplier?.creditBalance || 0)))}
                  </p>
                )}
              </div>
              <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl shadow-slate-200 hover:bg-primary transition-all duration-500 mt-2">
                Save Entry
              </button>
            </form>
          </div>
        </div>

        {/* History Table Area */}
        <div className="w-full space-y-12">
          {/* Pending Section */}
          {supplyLogs.filter(l => l.balance > 0).length > 0 && (
            <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3 px-2">
                <div className="w-1.5 h-6 bg-amber-500 rounded-full shadow-lg shadow-amber-200"></div>
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.3em]">Pending Settlements</h2>
                <span className="px-2.5 py-0.5 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-black border border-amber-100">
                  {supplyLogs.filter(l => l.balance > 0).length} Records
                </span>
              </div>
              
              <div className="glass-card rounded-[32px] md:rounded-[40px] overflow-hidden bg-white/70 backdrop-blur-xl border border-slate-100 shadow-xl">
                <div className="overflow-x-auto no-scrollbar">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100/50">
                        <th className="px-8 md:px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Date & ID</th>
                        <th className="px-8 md:px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Product Details</th>
                        <th className="px-8 md:px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Financials & Ledger</th>
                        <th className="px-8 md:px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Status</th>
                        <th className="px-8 md:px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {supplyLogs.filter(l => l.balance > 0).map((log) => renderLogRow(log))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* Settled Section */}
          <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-3 px-2">
              <div className="w-1.5 h-6 bg-emerald-500 rounded-full shadow-lg shadow-emerald-200"></div>
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.3em]">Settled History</h2>
              <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black border border-emerald-100">
                {supplyLogs.filter(l => l.balance === 0).length} Completed
              </span>
            </div>

            <div className="glass-card rounded-[32px] md:rounded-[40px] overflow-hidden bg-white/70 backdrop-blur-xl border border-slate-100 shadow-xl opacity-90 hover:opacity-100 transition-all duration-500">
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100/50">
                      <th className="px-8 md:px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Date & ID</th>
                      <th className="px-8 md:px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Product Details</th>
                      <th className="px-8 md:px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Financials & Ledger</th>
                      <th className="px-8 md:px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Status</th>
                      <th className="px-8 md:px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {supplyLogs.filter(l => l.balance === 0).length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-12 py-24 text-center text-slate-300">
                          <Truck className="mx-auto mb-4 opacity-10" size={60} />
                          <p className="font-black uppercase tracking-[0.4em] text-[10px]">No settled records in the archive.</p>
                        </td>
                      </tr>
                    ) : (
                      supplyLogs.filter(l => l.balance === 0).map((log) => renderLogRow(log))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
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
                <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <span>Currently Paid:</span>
                  <span className="text-emerald-600">Rs. {editingLog?.paidAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold text-rose-500 uppercase tracking-widest pt-2 border-t border-slate-100">
                  <span>Remaining Balance:</span>
                  <span>Rs. {editingLog?.balance.toLocaleString()}</span>
                </div>
                {editingLog?.appliedCredit > 0 && (
                  <div className="flex justify-between text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
                    <span>Credit Used:</span>
                    <span>Rs. {formatCurrency(editingLog?.appliedCredit)}</span>
                  </div>
                )}
              </div>

              <form onSubmit={handleAddPayment} className="space-y-6">
                <div className="space-y-2">

                  <input 
                    type="number" required
                    value={editPaidAmount}
                    onChange={(e) => setEditPaidAmount(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-black text-slate-900"
                    placeholder="Enter amount to pay"
                    autoFocus
                  />
                  {editPaidAmount !== "" && (
                    <div className="mt-2 ml-1">
                      {parseFloat(editPaidAmount) > editingLog?.balance ? (
                        <p className="text-[10px] font-bold text-indigo-500 italic">
                          Overpayment: Rs. {formatCurrency(parseFloat(editPaidAmount) - editingLog?.balance)} will be added to credit.
                        </p>
                      ) : (
                        <p className="text-[10px] font-bold text-slate-500 italic">
                          Remaining after payment: Rs. {formatCurrency(Math.max(0, editingLog?.balance - parseFloat(editPaidAmount)))}
                        </p>
                      )}
                    </div>
                  )}
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
                    Record Installment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Record Details Modal */}
      {isRecordEditModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setIsRecordEditModalOpen(false)}></div>
          <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in duration-300 border border-slate-100">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-primary/10 text-primary rounded-2xl">
                  <Edit2 size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Edit Record</h2>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Update product, quantity or price</p>
                </div>
              </div>

              <form onSubmit={handleRecordUpdate} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Product Name</label>
                  <input 
                    type="text" required
                    value={recordFormData.productName}
                    onChange={(e) => setRecordFormData({...recordFormData, productName: e.target.value})}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-slate-900 text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Quantity</label>
                    <input 
                      type="number" required min="0"
                      value={recordFormData.quantity}
                      onChange={(e) => setRecordFormData({...recordFormData, quantity: e.target.value})}
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-slate-900 text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Unit Price</label>
                    <input 
                      type="number" required min="0" step="0.01"
                      value={recordFormData.unitPrice}
                      onChange={(e) => setRecordFormData({...recordFormData, unitPrice: e.target.value})}
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-slate-900 text-xs"
                    />
                  </div>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase">New Total:</span>
                    <span className="text-sm font-black text-slate-900">
                      Rs. {formatCurrency((parseFloat(recordFormData.quantity) || 0) * (parseFloat(recordFormData.unitPrice) || 0))}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    type="button"
                    onClick={() => setIsRecordEditModalOpen(false)}
                    className="flex-1 py-4 bg-slate-50 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-primary transition-all"
                  >
                    Save Changes
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