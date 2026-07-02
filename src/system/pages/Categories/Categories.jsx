import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Trash2, Plus, Layers, Info, Loader2, Edit3, X, Save, Tag, Hash, FileText, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminCategoryManagement() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);   //stores all category data from backend
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState({ name: "", prefix: "", description: "", status: "Active" }); // store form input values
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", prefix: "", description: "", status: "Active" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null); // store selected category id before deletion
  const [isFormOpen, setIsFormOpen] = useState(false);

  //runs first component load
  useEffect(() => {
    fetchCategories();
  }, []);


  //get categories from backend
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/categories`);
      setCategories(response.data.data);  // store response
    } catch (error) {
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  // create category
  const handleCreate = async (e) => {
    e.preventDefault();   // stop form refresh
    if (!newCategory.name) return toast.error("Category name is required"); // check required feild
    if (!newCategory.prefix) return toast.error("Prefix is required");

    try {
      const token = localStorage.getItem("token");  // get saved login token
      // send category data to backend
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/categories`,
        newCategory,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Category created successfully");
      setNewCategory({ name: "", prefix: "", description: "", status: "Active" });
      setIsFormOpen(false);
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create category");
    }
  };

  // update existing category
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
      setIsFormOpen(false);
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update category");
    }
  };

  const handleDeleteClick = (id) => {
    setIdToDelete(id);
    setShowDeleteModal(true);
  };

  // prevent the accidental deletion
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
    setEditForm({ name: cat.name, prefix: cat.prefix, description: cat.description, status: cat.status || "Active" });  //df: cat.df || ""
    setIsFormOpen(true);
  };

  const activeCount = categories.filter(cat => cat.status !== 'Inactive').length;
  const inactiveCount = categories.filter(cat => cat.status === 'Inactive').length;

  return (
    <div className="space-y-10 max-w-[1500px] mx-auto animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-8 md:w-12 h-[1px] md:h-[2px] bg-gold"></div>
          </div>
          <h1 className="heading-premium text-3xl md:text-5xl lg:text-6xl">
            Categories <span className="italic font-normal text-slate-400">Details</span>
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => {
              if (editingId) {
                setEditingId(null);
                setNewCategory({ name: "", prefix: "", description: "", status: "Active" });
              } else {
                setIsFormOpen(!isFormOpen);
              }
            }}
            className={`flex items-center gap-2.5 px-6 py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all duration-500 shadow-xl ${isFormOpen && !editingId
              ? 'bg-white border border-slate-200 text-slate-400 hover:bg-slate-50'
              : 'bg-gold text-white hover:bg-gold/90 shadow-gold/10 hover:shadow-gold/20'
              }`}
          >
            {isFormOpen && !editingId ? <X size={18} /> : <Plus size={18} />}
            {isFormOpen && !editingId ? 'Close Panel' : 'New Category'}
          </button>

          <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2.5 px-3 py-1.5 bg-emerald-50/50 rounded-xl border border-emerald-100/50">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <div>
                <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest leading-none">Active</p>
                <p className="text-sm font-black text-slate-900 mt-1">{activeCount} Classes</p>
              </div>
            </div>
            <div className="w-px h-8 bg-slate-200"></div>
            <div className="flex items-center gap-2.5 px-3 py-1.5 bg-rose-50/50 rounded-xl border border-rose-100/50">
              <span className="w-2 h-2 rounded-full bg-rose-400"></span>
              <div>
                <p className="text-[8px] font-black text-rose-600 uppercase tracking-widest leading-none">Inactive</p>
                <p className="text-sm font-black text-slate-900 mt-1">{inactiveCount} Classes</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 md:gap-10 items-start">
        {/* Categories List */}
        <div className="xl:col-span-12 glass-card rounded-[32px] md:rounded-[40px] overflow-hidden bg-white/70 backdrop-blur-xl border border-slate-100 shadow-xl transition-all duration-500">
          {/* <div className="p-6 md:p-8 border-b border-slate-50 bg-white/50">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-4 uppercase leading-none">
              All Categories
            </h2>
          </div> */}
          <div className="overflow-x-auto no-scrollbar">


            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-xs md:text-sm border-b border-slate-200">
                  <th className="px-8 md:px-10 py-4.5 font-bold text-slate-700 uppercase tracking-wider">Category name</th>
                  <th className="px-8 md:px-10 py-4.5 font-bold text-slate-700 uppercase tracking-wider">Unique ID</th>
                  <th className="px-8 md:px-10 py-4.5 font-bold text-slate-700 uppercase tracking-wider">Category description</th>
                  <th className="px-8 md:px-10 py-4.5 font-bold text-slate-700 uppercase tracking-wider">Status</th>
                  <th className="px-8 md:px-10 py-4.5 font-bold text-slate-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-12 py-32 text-center">
                      <Loader2 className="w-12 h-12 text-gold animate-spin mx-auto mb-6" />
                      <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-[10px]">Accessing Registry Protocols...</p>
                    </td>
                  </tr>
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-12 py-32 text-center">
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
                          <span className="font-bold text-slate-900 text-base md:text-lg tracking-tight leading-tight">{cat.name}</span>
                        </div>
                      </td>
                      <td className="px-8 md:px-10 py-5 md:py-6">
                        <span className="px-3 py-1.5 bg-[#F3EAD3] text-[#84632A] border border-[#DFCE9F] text-[10px] font-black rounded-lg uppercase tracking-widest shadow-sm">{cat.prefix}</span>
                      </td>
                      <td className="px-8 md:px-10 py-5 md:py-6">
                        <p className="text-slate-600 font-medium text-sm">{cat.description || "No scope defined."}</p>
                      </td>
                      <td className="px-8 md:px-10 py-5 md:py-6">
                        <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border shadow-sm ${cat.status === "Inactive"
                          ? "bg-[#FCE8E6] text-[#C5221F] border-[#F5C2C1]"
                          : "bg-[#E6F4EA] text-[#137333] border-[#A8DAB5]"
                          }`}>
                          {cat.status || "Active"}
                        </span>
                      </td>
                      <td className="px-8 md:px-10 py-5 md:py-6">
                        <div className="flex justify-start gap-2 transition-all duration-300">
                          <button
                            onClick={() => startEdit(cat)}
                            className="p-3 rounded-xl bg-white text-slate-600 hover:text-gold hover:shadow-xl transition-all duration-300 border border-slate-100 shadow-sm"
                          >
                            <Edit3 size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(cat._id)}
                            className="p-3 rounded-xl transition-all border bg-white border-rose-100 text-rose-500 hover:text-rose-600 hover:shadow-xl"
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
            <div className="h-2 w-full bg-gold"></div>

            <div className="p-8 md:p-12 text-center">
              <div className="w-20 h-20 bg-amber-50/50 rounded-[28px] flex items-center justify-center mx-auto mb-8 shadow-inner">
                <Trash2 size={36} className="text-gold animate-pulse" />
              </div>

              <h2 className="text-2xl md:text-3xl font-serif text-slate-800 tracking-tight uppercase leading-tight mb-4 font-bold">
                Confirm <span className="text-gold italic font-normal">Deletion</span>
              </h2>

              <p className="text-sm font-medium text-slate-400 mb-10 leading-relaxed px-4">
                Are you sure you want to permanently delete this Category? This action cannot be undone and may affect related catalog items.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-4.5 bg-slate-100 text-slate-600 rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-slate-200 hover:text-slate-900 transition-all border border-slate-200/50 shadow-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-4.5 bg-gold text-white rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] shadow-lg hover:bg-gold/90 transition-all duration-300"
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
      {/* Add/Edit Category Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-6 md:p-0">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => {
              setEditingId(null);
              setNewCategory({ name: "", prefix: "", description: "", status: "Active" });
              setIsFormOpen(false);
            }}
          ></div>

          {/* Modal Card */}
          <div className="relative w-full max-w-[500px] bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 fade-in duration-300 z-10">
            {/* Top Accent line */}
            <div className="h-2 w-full bg-gold"></div>

            <div className="p-8 md:p-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3.5 text-slate-900">
                  <div className="p-3.5 bg-gold/10 text-gold rounded-xl shadow-sm">
                    {editingId ? <Edit3 size={20} /> : <Plus size={20} />}
                  </div>
                  <div>
                    <h2 className="text-xl font-serif text-slate-800 tracking-tight font-bold">
                      {editingId ? 'Update Category' : 'New Category'}
                    </h2>

                  </div>
                </div>
                <button
                  onClick={() => {
                    setEditingId(null);
                    setNewCategory({ name: "", prefix: "", description: "", status: "Active" });
                    setIsFormOpen(false);
                  }}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={editingId ? handleUpdate : handleCreate} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={editingId ? editForm.name : newCategory.name}
                    onChange={(e) => editingId ? setEditForm({ ...editForm, name: e.target.value }) : setNewCategory({ ...newCategory, name: e.target.value })}
                    className="w-full px-5 py-3 md:py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-gold/15 focus:border-gold transition-all font-semibold text-slate-800 placeholder:text-slate-400/60 text-xs md:text-sm"
                    placeholder="e.g. Handmade Chocolates"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">
                    Category Prefix (e.g. CAKE)
                  </label>
                  <input
                    type="text"
                    value={editingId ? editForm.prefix : newCategory.prefix}
                    onChange={(e) => {
                      const val = e.target.value.toUpperCase();
                      editingId ? setEditForm({ ...editForm, prefix: val }) : setNewCategory({ ...newCategory, prefix: val });
                    }}
                    className="w-full px-5 py-3 md:py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-gold/15 focus:border-gold transition-all font-semibold text-slate-800 placeholder:text-slate-400/60 text-xs md:text-sm uppercase"
                    placeholder="e.g. CHOCO"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">
                    Description
                  </label>
                  <textarea
                    value={editingId ? editForm.description : newCategory.description}
                    onChange={(e) => editingId ? setEditForm({ ...editForm, description: e.target.value }) : setNewCategory({ ...newCategory, description: e.target.value })}
                    className="w-full px-5 py-3 md:py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-gold/15 focus:border-gold transition-all font-semibold text-slate-800 placeholder:text-slate-400/60 h-28 md:h-32 resize-none text-xs md:text-sm"
                    placeholder="Describe the scope of this category..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">
                    Status
                  </label>
                  <div className="relative">
                    <select
                      value={editingId ? editForm.status : newCategory.status}
                      onChange={(e) => editingId ? setEditForm({ ...editForm, status: e.target.value }) : setNewCategory({ ...newCategory, status: e.target.value })}
                      className="w-full px-5 pr-10 py-3 md:py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-gold/15 focus:border-gold transition-all font-semibold text-slate-800 text-xs md:text-sm appearance-none"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setNewCategory({ name: "", prefix: "", description: "", status: "Active" });
                      setIsFormOpen(false);
                    }}
                    className="flex-1 py-3.5 bg-[#FCE8E6] text-[#C5221F] rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#FAD2CF] transition-all border border-[#F5C2C1] flex items-center justify-center gap-2 shadow-sm"
                  >
                    <X size={14} /> Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] py-3.5 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-gold transition-all duration-500 flex items-center justify-center gap-2"
                  >
                    {editingId ? <Save size={14} /> : <Plus size={14} />}
                    {editingId ? 'Update Category' : 'Create Category'}
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