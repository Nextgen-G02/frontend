import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Trash2, Plus, Layers, Info, Loader2, Edit3, X, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminCategoryManagement() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState({ name: "", prefix: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", prefix: "", description: "" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/categories`);
      setCategories(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newCategory.name) return toast.error("Category name is required");
    if (!newCategory.prefix) return toast.error("Prefix is required");

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/categories`,
        newCategory,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Category created successfully");
      setNewCategory({ name: "", prefix: "", description: "" });
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create category");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editForm.name) return toast.error("Category name is required");
    if (!editForm.prefix) return toast.error("Prefix is required");

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/categories/${editingId}`,
        editForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Category updated successfully");
      setEditingId(null);
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update category");
    }
  };

  const handleDeleteClick = (id) => {
    setIdToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/categories/${idToDelete}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Category removed successfully");
      setShowDeleteModal(false);
      setIdToDelete(null);
      fetchCategories();
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  const startEdit = (cat) => {
    setEditingId(cat._id);
    setEditForm({ name: cat.name, prefix: cat.prefix, description: cat.description });
  };

  return (
    <div className="space-y-10 max-w-[1500px] mx-auto animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-10 h-1 bg-primary rounded-full"></span>          </div>
          <h1 className="heading-premium text-2xl md:text-5xl">
            Product <span className="italic font-medium text-slate-400">Categories</span>
          </h1>
        </div>

        <div className="flex items-center gap-3.5 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
          <div className="p-2.5 bg-white rounded-lg shadow-sm">
            <Layers className="text-primary" size={20} md:size={22} />
          </div>
          <div className="pr-4">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Global Schema</p>
            <p className="text-xs font-bold text-slate-900 mt-1">{categories.length} Active Classes</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 md:gap-10 items-start">
        {/* Add/Edit Category Form */}
        <div className="xl:col-span-4 glass-card p-8 md:p-10 rounded-[32px] md:rounded-[40px] bg-white relative overflow-hidden group border border-slate-100 shadow-xl">
          <div className="absolute top-0 right-0 w-40 h-40 bg-slate-50 rounded-full -mr-20 -mt-20 opacity-50 group-hover:scale-110 transition-transform duration-700"></div>
          
          <div className="flex items-center gap-4 mb-8 text-slate-900 relative z-10">
            <div className="p-3.5 bg-slate-900 text-gold rounded-xl shadow-xl shadow-slate-200">
              {editingId ? <Edit3 size={20} /> : <Plus size={20} />}
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight uppercase">{editingId ? 'Update Definition' : 'New Definition'}</h2>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic leading-none">
                {editingId ? 'Modify existing schema' : 'Schema Initialization'}
              </p>
            </div>
          </div>

          <form onSubmit={editingId ? handleUpdate : handleCreate} className="space-y-6 relative z-10">
            <div className="space-y-2">
              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Class Designation (Name)
              </label>
              <input
                type="text"
                value={editingId ? editForm.name : newCategory.name}
                onChange={(e) => editingId ? setEditForm({...editForm, name: e.target.value}) : setNewCategory({ ...newCategory, name: e.target.value })}
                className="w-full px-5 py-3 md:py-3.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-slate-900 placeholder:text-slate-300 text-xs md:text-sm"
                placeholder="e.g. Handmade Chocolates"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                System Prefix (e.g. CAKE)
              </label>
              <input
                type="text"
                value={editingId ? editForm.prefix : newCategory.prefix}
                onChange={(e) => {
                    const val = e.target.value.toUpperCase();
                    editingId ? setEditForm({...editForm, prefix: val}) : setNewCategory({ ...newCategory, prefix: val });
                }}
                className="w-full px-5 py-3 md:py-3.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-slate-900 placeholder:text-slate-300 text-xs md:text-sm uppercase"
                placeholder="e.g. CHOCO"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Contextual scope
              </label>
              <textarea
                value={editingId ? editForm.description : newCategory.description}
                onChange={(e) => editingId ? setEditForm({...editForm, description: e.target.value}) : setNewCategory({ ...newCategory, description: e.target.value })}
                className="w-full px-5 py-3 md:py-3.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-slate-900 placeholder:text-slate-300 h-28 md:h-32 resize-none text-xs md:text-sm"
                placeholder="Describe the scope of this category..."
              />
            </div>
            
            <div className="flex gap-3">
                {editingId && (
                    <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="flex-1 py-4 bg-white border border-slate-200 text-slate-400 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all"
                    >
                        Cancel
                    </button>
                )}
                <button
                type="submit"
                className={`flex-[2] py-4 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl hover:bg-primary transition-all duration-500`}
                >
                {editingId ? 'Update Registry' : 'Commit to Registry'}
                </button>
            </div>
          </form>
        </div>

        {/* Categories List */}
        <div className="xl:col-span-8 glass-card rounded-[32px] md:rounded-[40px] overflow-hidden bg-white/70 backdrop-blur-xl border border-slate-100 shadow-xl">
          <div className="p-6 md:p-8 border-b border-slate-50 bg-white/50">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-4 uppercase leading-none">
              Authorized Structure
            </h2>
          </div>
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-[9px]">
                  <th className="px-8 md:px-10 py-5 font-black text-slate-400 uppercase tracking-[0.3em]">Category Handle</th>
                  <th className="px-8 md:px-10 py-5 font-black text-slate-400 uppercase tracking-[0.3em]">System Prefix</th>
                  <th className="px-8 md:px-10 py-5 font-black text-slate-400 uppercase tracking-[0.3em]">Operational Scope</th>
                  <th className="px-8 md:px-10 py-5 font-black text-slate-400 uppercase tracking-[0.3em] text-right">Ops Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-12 py-32 text-center">
                       <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-6" />
                       <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-[10px]">Accessing Registry Protocols...</p>
                    </td>
                  </tr>
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-12 py-32 text-center">
                      <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Layers size={40} className="text-slate-200" />
                      </div>
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Registry is currently void.</p>
                    </td>
                  </tr>
                ) : (
                  categories.map((cat) => (
                    <tr key={cat._id} className={`hover:bg-white transition-all duration-300 group border-b border-slate-50/50 ${editingId === cat._id ? 'bg-slate-50' : ''}`}>
                      <td className="px-8 md:px-10 py-5 md:py-6">
                        <div className="flex items-center gap-3.5">
                          <div className={`w-2 h-2 rounded-full ${editingId === cat._id ? 'bg-slate-900' : 'bg-primary'} shadow-lg`}></div>
                          <span className="font-black text-slate-900 uppercase tracking-tight text-base leading-tight">{cat.name}</span>
                        </div>
                      </td>
                      <td className="px-8 md:px-10 py-5 md:py-6">
                        <span className="px-3 py-1 bg-slate-900 text-gold text-[10px] font-black rounded-lg uppercase tracking-widest">{cat.prefix}</span>
                      </td>
                      <td className="px-8 md:px-10 py-5 md:py-6">
                        <p className="text-slate-400 font-medium text-xs italic">"{cat.description || "No scope defined."}"</p>
                      </td>
                      <td className="px-8 md:px-10 py-5 md:py-6 text-right">
                        <div className="flex justify-end gap-2">
                            <button
                            onClick={() => startEdit(cat)}
                            className="p-3 rounded-xl bg-slate-50 text-slate-300 hover:text-slate-900 hover:bg-slate-100 transition-all opacity-0 group-hover:opacity-100 duration-300 border border-slate-100 shadow-sm"
                            >
                            <Edit3 size={18} />
                            </button>
                            <button
                            onClick={() => handleDeleteClick(cat._id)}
                            className="p-3 rounded-xl bg-slate-50 text-slate-300 hover:text-primary hover:bg-primary/5 transition-all opacity-0 group-hover:opacity-100 duration-300 border border-slate-100 shadow-sm"
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
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-0">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setShowDeleteModal(false)}
          ></div>
          
          {/* Modal Card */}
          <div className="relative w-full max-w-[440px] bg-white rounded-[32px] md:rounded-[48px] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 fade-in duration-300">
            {/* Top Bar Accent */}
            <div className="h-2 w-full bg-primary"></div>
            
            <div className="p-8 md:p-12 text-center">
              <div className="w-20 h-20 bg-rose-50 rounded-[28px] flex items-center justify-center mx-auto mb-8 shadow-inner">
                <Trash2 size={36} className="text-primary animate-pulse" />
              </div>
              
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight uppercase leading-tight mb-4">
                Confirm <span className="text-primary italic">Deletion</span>
              </h2>
              
              <p className="text-sm font-medium text-slate-400 mb-10 leading-relaxed px-4">
                Permanently erase this definition? This action is irreversible and may impact linked catalog assets.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-4.5 bg-slate-50 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-100 hover:text-slate-600 transition-all border border-slate-100 shadow-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-4.5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-slate-200 hover:bg-primary transition-all duration-500"
                >
                  Delete
                </button>
              </div>
            </div>
            
            {/* Background Decor */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-slate-50 rounded-full opacity-50 -z-10"></div>
          </div>
        </div>
      )}
    </div>
  );
}
