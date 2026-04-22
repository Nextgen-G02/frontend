import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Trash2, Plus, Layers, Info, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminCategoryManagement() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });

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

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/categories`,
        newCategory,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Category created successfully");
      setNewCategory({ name: "", description: "" });
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create category");
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/categories/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Category removed");
      fetchCategories();
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  return (
    <div className="space-y-10 max-w-[1500px] mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-10 h-1 bg-primary rounded-full"></span>
            <p className="text-primary font-black uppercase tracking-[0.4em] text-[9px]">Product Hierarchy Registry</p>
          </div>
          <h1 className="heading-premium text-2xl md:text-5xl">
            Category <span className="italic font-medium text-slate-400">Definitions</span>
          </h1>
          <p className="text-slate-400 font-medium mt-2 md:mt-3 text-sm md:text-base">Define and organize your catalog's structural taxonomics.</p>
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
        {/* Add Category Form */}
        <div className="xl:col-span-4 glass-card p-8 md:p-10 rounded-[32px] md:rounded-[40px] bg-white relative overflow-hidden group border border-slate-100 shadow-xl">
          <div className="absolute top-0 right-0 w-40 h-40 bg-slate-50 rounded-full -mr-20 -mt-20 opacity-50 group-hover:scale-110 transition-transform duration-700"></div>
          
          <div className="flex items-center gap-4 mb-8 text-slate-900 relative z-10">
            <div className="p-3.5 bg-primary text-white rounded-xl shadow-xl shadow-primary/20">
              <Plus size={20} md:size={22} />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight uppercase">New Definition</h2>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic leading-none">Schema Initialization</p>
            </div>
          </div>

          <form onSubmit={handleCreate} className="space-y-6 relative z-10">
            <div className="space-y-2">
              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Class Designation
              </label>
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className="w-full px-5 py-3 md:py-3.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-slate-900 placeholder:text-slate-300 text-xs md:text-sm"
                placeholder="e.g. Handmade Chocolates"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Contextual scope
              </label>
              <textarea
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                className="w-full px-5 py-3 md:py-3.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-slate-900 placeholder:text-slate-300 h-28 md:h-32 resize-none text-xs md:text-sm"
                placeholder="Describe the scope of this category..."
              />
            </div>
            <button
              type="submit"
              className="w-full py-4.5 md:py-5 bg-slate-900 text-white rounded-xl md:rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl shadow-slate-200 hover:bg-primary transition-all duration-500 hover:-translate-y-0.5"
            >
              Commit to Registry
            </button>
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
                  <th className="px-8 md:px-10 py-5 font-black text-slate-400 uppercase tracking-[0.3em]">Operational Scope</th>
                  <th className="px-8 md:px-10 py-5 font-black text-slate-400 uppercase tracking-[0.3em] text-right">Ops Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan="3" className="px-12 py-32 text-center">
                       <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-6" />
                       <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-[10px]">Accessing Registry Protocols...</p>
                    </td>
                  </tr>
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-12 py-32 text-center">
                      <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Layers size={40} className="text-slate-200" />
                      </div>
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Registry is currently void.</p>
                    </td>
                  </tr>
                ) : (
                  categories.map((cat) => (
                    <tr key={cat._id} className="hover:bg-white transition-all duration-300 group border-b border-slate-50/50">
                      <td className="px-8 md:px-10 py-5 md:py-6">
                        <div className="flex items-center gap-3.5">
                          <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(127,29,29,0.5)]"></div>
                          <span className="font-black text-slate-900 uppercase tracking-tight text-base leading-tight">{cat.name}</span>
                        </div>
                      </td>
                      <td className="px-8 md:px-10 py-5 md:py-6">
                        <p className="text-slate-400 font-medium text-xs italic">"{cat.description || "No scope defined."}"</p>
                      </td>
                      <td className="px-8 md:px-10 py-5 md:py-6 text-right">
                        <button
                          onClick={() => {
                            if (window.confirm("Permanently erase this definition?")) handleDelete(cat._id);
                          }}
                          className="p-3 rounded-xl bg-slate-50 text-slate-300 hover:text-primary hover:bg-primary/5 transition-all opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 duration-300 border border-slate-100 shadow-sm"
                        >
                          <Trash2 size={18} />
                        </button>
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

