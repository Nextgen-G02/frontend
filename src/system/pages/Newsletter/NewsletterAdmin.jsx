import { useState, useEffect } from "react";
import { Mail, Search, Plus, Trash2, Loader2, CheckCircle2, Send, AlertTriangle, X, Clock, Eye } from "lucide-react";
import toast from "react-hot-toast";

const API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api/newsletter`;

export default function NewsletterAdmin() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  
  const [history, setHistory] = useState([]);
  const [viewHistoryModal, setViewHistoryModal] = useState({ isOpen: false, subject: "", message: "" });

  // Custom Modal State
  const [modalConfig, setModalConfig] = useState({ 
    isOpen: false, 
    title: "", 
    message: "", 
    onConfirm: null, 
    confirmText: "", 
    type: "danger" 
  });

  const confirm = (title, message, onConfirm, confirmText = "Confirm", type = "danger") => {
    setModalConfig({ isOpen: true, title, message, onConfirm, confirmText, type });
  };

  const closeModal = () => {
    setModalConfig(prev => ({ ...prev, isOpen: false }));
  };

  useEffect(() => {
    fetchSubscribers();
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setHistory(data.data);
    } catch (err) {
      toast.error("Failed to load history");
    }
  };

  const fetchSubscribers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(API_BASE, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setSubscribers(data.data);
    } catch (err) {
      toast.error("Failed to load subscribers");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubscriber = async (e) => {
    e.preventDefault();
    if (!newEmail) return toast.error("Please enter an email");
    
    setIsAdding(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/add`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ email: newEmail })
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success(data.message);
        setNewEmail("");
        fetchSubscribers();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteClick = (id) => {
    confirm(
      "Delete Subscriber",
      "Are you sure you want to delete this subscriber? This action cannot be undone.",
      () => executeDelete(id),
      "Delete Subscriber",
      "danger"
    );
  };

  const executeDelete = async (id) => {
    closeModal();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success("Subscriber deleted");
        setSubscribers(prev => prev.filter(s => s._id !== id));
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Network error");
    }
  };

  const handleSendNewsletter = (e) => {
    e.preventDefault();
    if (!subject || !message) return toast.error("Please provide both subject and message.");
    
    confirm(
      "Broadcast Newsletter",
      "Are you sure you want to send this email to ALL active subscribers? This action cannot be undone.",
      () => executeSendNewsletter(),
      "Send to All",
      "primary"
    );
  };

  const executeSendNewsletter = async () => {
    closeModal();
    setIsSending(true);
    const toastId = toast.loading("Sending newsletter to all active subscribers...");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/broadcast`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ subject, message })
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success(data.message, { id: toastId });
        setSubject("");
        setMessage("");
        
        // Instantly add the new history item to the top of the list
        if (data.newHistory) {
          setHistory(prev => [data.newHistory, ...prev]);
        }
      } else {
        toast.error(data.message, { id: toastId });
      }
    } catch (err) {
      toast.error("Network error. Could not send.", { id: toastId });
    } finally {
      setIsSending(false);
    }
  };

  const filteredSubscribers = subscribers.filter(s => 
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8 max-w-[1400px] mx-auto min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <Mail size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Communication</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Newsletter Subscribers
          </h1>
        </div>
      </div>

      {/* Compose Newsletter Widget - Moved to Top */}
      <div className="bg-white p-6 md:p-8 rounded-[24px] md:rounded-[32px] shadow-sm border border-slate-100 mb-8">
        <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight mb-2">Compose Newsletter</h3>
        <p className="text-slate-500 text-sm font-medium mb-6">
          Write an email to send to all active subscribers.
        </p>
        
        <form onSubmit={handleSendNewsletter} className="space-y-4">
          <div>
            <input
              type="text"
              required
              placeholder="Email Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-gold/10 focus:border-gold transition-all font-medium text-base text-slate-900"
            />
          </div>
          <div>
            <textarea
              required
              placeholder="Write your email message here... (It will automatically be styled with the shop's premium theme!)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-gold/10 focus:border-gold transition-all font-medium text-base text-slate-900 resize-y"
            ></textarea>
          </div>
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSending || subscribers.filter(s => s.status === 'Active').length === 0}
              className="bg-[#C29D59] hover:bg-[#b08e50] text-white font-black px-8 py-4 rounded-xl text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed min-w-[200px]"
            >
              {isSending ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
              {isSending ? 'Sending...' : 'Send to All Active'}
            </button>
          </div>
        </form>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* Left Column: List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-4 md:p-6 rounded-[24px] md:rounded-[32px] shadow-sm border border-slate-100">
            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search emails..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-gold/10 focus:border-gold transition-all text-sm font-medium"
              />
            </div>

            {/* List */}
            {loading ? (
              <div className="flex items-center justify-center p-12">
                <Loader2 className="animate-spin text-gold" size={32} />
              </div>
            ) : filteredSubscribers.length === 0 ? (
              <div className="text-center p-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <Mail className="mx-auto text-slate-300 mb-3" size={32} />
                <p className="text-slate-500 font-medium">No subscribers found.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredSubscribers.map((sub) => (
                  <div key={sub._id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-gold/30 hover:bg-gold/5 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-black">
                        {sub.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{sub.email}</p>
                        <p className="text-xs font-medium text-slate-500">
                          Subscribed: {new Date(sub.subscribedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg ${
                        sub.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                      }`}>
                        {sub.status}
                      </span>
                      <button
                        onClick={() => handleDeleteClick(sub._id)}
                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Actions */}
        <div className="space-y-6">
          <div className="bg-slate-900 p-6 rounded-[24px] md:rounded-[32px] text-white">
            <h3 className="text-lg font-black tracking-tight mb-2">Manually Add Subscriber</h3>
            <p className="text-slate-400 text-xs font-medium mb-6">
              Collected an email offline? Add them to your list here.
            </p>
            
            <form onSubmit={handleAddSubscriber} className="space-y-4">
              <div>
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-gold/50 text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={isAdding}
                className="w-full bg-[#C29D59] hover:bg-[#b08e50] text-slate-950 font-black px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isAdding ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
                Add Email
              </button>
            </form>
          </div>

          {/* Stats Widget */}
          <div className="bg-white p-6 rounded-[24px] md:rounded-[32px] shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Active</p>
              <h4 className="text-2xl font-black text-slate-900">
                {subscribers.filter(s => s.status === 'Active').length}
              </h4>
            </div>
          </div>
        </div>

      </div>

      {/* Broadcast History */}
      <div className="bg-white p-6 md:p-8 rounded-[24px] md:rounded-[32px] shadow-sm border border-slate-100 mt-8">
        <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight mb-2 flex items-center gap-3">
          <Clock size={24} className="text-[#C29D59]" />
          Broadcast History
        </h3>
        <p className="text-slate-500 text-sm font-medium mb-6">
          Review past newsletters you have sent to your subscribers.
        </p>

        {history.length === 0 ? (
          <div className="text-center p-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <Clock className="mx-auto text-slate-300 mb-3" size={32} />
            <p className="text-slate-500 font-medium">No past broadcasts found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {history.map((item) => (
              <div key={item._id} className="p-5 rounded-2xl border border-slate-100 hover:border-gold/30 hover:shadow-md transition-all group flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 line-clamp-2 mb-2">{item.subject}</h4>
                  <p className="text-xs text-slate-500 mb-4">
                    {new Date(item.sentAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-slate-50 pt-4 mt-auto">
                  <div className="flex gap-4">
                    <div className="text-center">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Sent</p>
                      <p className="text-sm font-black text-emerald-600">{item.sentCount}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Failed</p>
                      <p className="text-sm font-black text-rose-600">{item.failedCount}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setViewHistoryModal({ isOpen: true, subject: item.subject, message: item.message })}
                    className="p-2 text-slate-400 hover:text-gold hover:bg-gold/10 rounded-xl transition-colors"
                    title="View Content"
                  >
                    <Eye size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* History Viewer Modal */}
      {viewHistoryModal.isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-[24px] shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-[#C29D59] uppercase tracking-wider mb-1">Newsletter Copy</p>
                <h3 className="text-xl font-black text-slate-900">{viewHistoryModal.subject}</h3>
              </div>
              <button 
                onClick={() => setViewHistoryModal({ isOpen: false, subject: "", message: "" })} 
                className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors shrink-0 ml-4"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto bg-slate-50 text-slate-800 flex-1 relative">
              <div dangerouslySetInnerHTML={{ __html: viewHistoryModal.message }} />
            </div>
          </div>
        </div>
      )}

      {/* Custom Confirmation Modal */}
      {modalConfig.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-[24px] shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${modalConfig.type === 'danger' ? 'bg-rose-50 text-rose-500' : 'bg-gold/10 text-gold'}`}>
                  {modalConfig.type === 'danger' ? <AlertTriangle size={24} /> : <Mail size={24} />}
                </div>
                <button onClick={closeModal} className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors">
                  <X size={20} />
                </button>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">{modalConfig.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                {modalConfig.message}
              </p>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3 justify-end">
              <button 
                onClick={closeModal}
                className="px-6 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={modalConfig.onConfirm}
                className={`px-6 py-2.5 rounded-xl font-black text-white transition-all shadow-sm ${
                  modalConfig.type === 'danger' ? 'bg-rose-500 hover:bg-rose-600' : 'bg-[#C29D59] hover:bg-[#b08e50]'
                }`}
              >
                {modalConfig.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
