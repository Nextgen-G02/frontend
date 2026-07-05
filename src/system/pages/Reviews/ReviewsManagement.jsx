import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  MessageSquare,
  CheckCircle,
  XCircle,
  Trash2,
  AlertTriangle,
  Search,
  Star,
  Clock
} from "lucide-react";

export default function ReviewsManagement() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/reviews/admin`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReviews(response.data.data);
    } catch (error) {
      toast.error("Could not load reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/reviews/${id}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Review marked as ${newStatus}`);
      fetchReviews();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/reviews/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Review permanently deleted");
      fetchReviews();
    } catch (error) {
      toast.error("Failed to delete review");
    } finally {
      setIsDeleteModalOpen(false);
      setDeleteId(null);
    }
  };

  // Filter based on search
  const filteredReviews = reviews.filter(rev => 
    rev.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (rev.user && (rev.user.firstName + ' ' + rev.user.lastName).toLowerCase().includes(searchTerm.toLowerCase())) ||
    (rev.user && rev.user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-10 max-w-[1500px] mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-10 h-1 bg-primary rounded-full"></span>
            <p className="text-primary font-black uppercase tracking-[0.4em] text-[9px]">Community Moderation</p>
          </div>
          <h1 className="heading-premium text-2xl md:text-5xl leading-tight">
            Customer <span className="italic font-medium text-slate-400">Reviews</span>
          </h1>
          <p className="text-slate-400 font-medium mt-2 md:mt-3 text-sm md:text-base">Approve or reject customer testimonials before they go live.</p>
        </div>

        <div className="flex items-center gap-3.5">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={16} md:size={18} />
            <input 
              type="text" 
              placeholder="Search reviews..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 pr-5 py-3 md:py-3.5 bg-white border border-slate-200 rounded-xl md:rounded-2xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-slate-900 w-full md:w-60 text-xs shadow-sm"
            />
          </div>
        </div>
      </header>

      {/* Reviews List Table */}
      <div className="glass-card rounded-[32px] md:rounded-[40px] overflow-hidden bg-white/70 backdrop-blur-xl border border-slate-100 shadow-xl">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 md:px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] w-1/4">Customer</th>
                <th className="px-8 md:px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] w-1/2">Review Content</th>
                <th className="px-8 md:px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Status</th>
                <th className="px-8 md:px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-12 py-32 text-center">
                    <MessageSquare className="animate-pulse mx-auto mb-6 text-primary" size={48} />
                    <p className="font-black uppercase tracking-[0.4em] text-[10px] text-slate-400">Loading reviews...</p>
                  </td>
                </tr>
              ) : filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-12 py-32 text-center text-slate-300">
                    <MessageSquare className="mx-auto mb-6 opacity-10" size={80} />
                    <p className="font-black uppercase tracking-widest text-xs tracking-[0.2em]">No reviews found.</p>
                  </td>
                </tr>
              ) : (
                filteredReviews.map((rev) => (
                  <tr key={rev._id} className={`group hover:bg-white transition-all duration-300 border-b border-slate-50/50 ${rev.status === 'pending' ? 'bg-amber-50/30' : ''}`}>
                    <td className="px-8 md:px-10 py-5 md:py-6 align-top">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-[18px] bg-slate-900 text-gold flex items-center justify-center font-black text-lg shadow-inner">
                          {rev.user ? rev.user.firstName[0] : '?'}
                        </div>
                        <div className="max-w-[200px]">
                          <p className="font-black text-slate-900 uppercase tracking-tight text-base leading-tight">
                            {rev.user ? `${rev.user.firstName} ${rev.user.lastName}` : 'Deleted User'}
                          </p>
                          {rev.user && (
                            <p className="text-[10px] text-slate-400 font-bold mt-1 lowercase break-all">
                              {rev.user.email}
                            </p>
                          )}
                          <p className="text-[9px] text-slate-400 font-medium mt-1.5 flex items-center gap-1.5 uppercase tracking-widest">
                            <Clock size={10} /> {new Date(rev.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 md:px-10 py-5 md:py-6 align-top">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} className={i < rev.rating ? "fill-amber-400 text-amber-400" : "fill-slate-100 text-slate-100"} />
                          ))}
                        </div>
                        <p className="text-sm font-medium text-slate-600 leading-relaxed italic">"{rev.text}"</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Location: {rev.location}</p>
                      </div>
                    </td>
                    <td className="px-8 md:px-10 py-5 md:py-6 align-top">
                      <span className={`px-4 py-1.5 border rounded-full flex items-center gap-2 w-fit shadow-sm ${
                          rev.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                          rev.status === 'rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                          'bg-amber-50 text-amber-600 border-amber-100'
                        }`}>
                        {rev.status === 'approved' ? <CheckCircle size={12} /> : 
                         rev.status === 'rejected' ? <XCircle size={12} /> : 
                         <AlertTriangle size={12} />}
                        <span className="text-[10px] font-black uppercase tracking-widest">{rev.status}</span>
                      </span>
                    </td>
                    <td className="px-8 md:px-10 py-5 md:py-6 text-right align-top">
                      <div className="flex justify-end gap-2.5 transition-all duration-300">
                        {rev.status !== 'approved' && (
                          <button 
                            onClick={() => handleUpdateStatus(rev._id, 'approved')}
                            className="p-3 rounded-xl bg-white border border-emerald-100 text-emerald-400 hover:text-white hover:bg-emerald-500 hover:shadow-xl transition-all"
                            title="Approve Review"
                          >
                            <CheckCircle size={18} />
                          </button>
                        )}
                        {rev.status !== 'rejected' && (
                          <button 
                            onClick={() => handleUpdateStatus(rev._id, 'rejected')}
                            className="p-3 rounded-xl bg-white border border-rose-100 text-rose-300 hover:text-white hover:bg-rose-500 hover:shadow-xl transition-all"
                            title="Reject Review"
                          >
                            <XCircle size={18} />
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete(rev._id)}
                          className="p-3 rounded-xl bg-white border border-slate-100 text-slate-300 hover:text-rose-500 hover:border-rose-100 hover:bg-rose-50 hover:shadow-xl transition-all"
                          title="Delete Review"
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
                This action cannot be undone. This review will be permanently deleted from the database.
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
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
