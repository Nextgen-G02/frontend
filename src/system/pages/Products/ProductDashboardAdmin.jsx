import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Package,
  ExternalLink,
  Loader2,
  X,
  Save,
  Settings,
  Image,
  Upload,
  Eye
} from "lucide-react";
import { toast } from "react-hot-toast";

const API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api/products`;

export default function ProductDashboardAdmin() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [editForm, setEditForm] = useState({});
  const [viewProduct, setViewProduct] = useState(null);
  const [editImageFile, setEditImageFile] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/categories`);
      const data = await res.json();
      setCategories(data.data || []);
    } catch {
      toast.error("Failed to load categories");
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      const fetchedProducts = data.data || data;
      // Sort by newest first (assuming MongoDB _id or createdAt)
      const sortedProducts = [...fetchedProducts].sort((a, b) => b._id.localeCompare(a._id));
      setProducts(sortedProducts);
    } catch {
      setError("Failed to fetch products");
      toast.error("Catalog loading failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_BASE}/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      setProducts((prev) => prev.filter((p) => p._id !== id));
      setDeleteId(null);
      toast.success("Product removed");
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleSectionChange = async (productId, newSection) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/update-section/${productId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ homepageSection: newSection })
      });
      if (res.ok) {
        toast.success("Homepage section updated");
        setProducts(prev => prev.map(p => p._id === productId ? { ...p, homepageSection: newSection } : p));
      } else {
        toast.error("Failed to update section");
      }
    } catch {
      toast.error("Update error");
    }
  };

  const handleEditOpen = (product) => {
    setEditProduct(product);
    setEditImageFile(null);
    // Support multiple possible field names for description for legacy data compatibility
    const desc = product.description || product.pDescription || product.pDesc || "";
    setEditForm({
      ...product,
      description: desc
    });
  };

  const handleEditSave = async () => {
    if (!editForm.pName) {
      toast.error("Product name is required");
      return;
    }
    if (!editForm.description) {
      toast.error("Description is required");
      return;
    }
    if (Number(editForm.price) <= 0) {
      toast.error("Price must be greater than 0");
      return;
    }
    if (editForm.stock === "" || editForm.stock === undefined || editForm.stock === null) {
      toast.error("Stock quantity is required");
      return;
    }
    if (Number(editForm.stock) < 0) {
      toast.error("Stock cannot be negative");
      return;
    }

    if (['kg', 'g', 'ml', 'l'].includes(editForm.unit) && (editForm.weight === undefined || editForm.weight === null || editForm.weight === "" || Number(editForm.weight) <= 0)) {
      toast.error("Weight/Volume is required and must be greater than 0");
      return;
    }

    const p = Number(editForm.price);
    const cp = Number(editForm.costPrice);
    if (cp <= 0) {
      toast.error("Cost price must be greater than 0");
      return;
    }
    const dp = Number(editForm.discountPercentage) || 0;
    if (dp < 0 || dp > 100) {
      toast.error("Discount percentage must be between 0 and 100");
      return;
    }
    const da = p * (dp / 100);

    if ((p - da) <= cp) {
      toast.error("Selling price after discount must be greater than cost price to ensure profit");
      return;
    }
    try {
      const formData = new FormData();
      Object.keys(editForm).forEach(key => {
        if (key !== 'images' && key !== 'recipe' && typeof editForm[key] !== 'object') {
          if (key === 'weight') {
            const wVal = ['kg', 'g', 'ml', 'l'].includes(editForm.unit) ? editForm.weight : "";
            formData.append('weight', wVal ?? "");
          } else {
            formData.append(key, editForm[key]);
          }
        }
      });

      if (editImageFile) {
        formData.append('image', editImageFile);
      } else if (editForm.images && editForm.images.length > 0) {
        formData.append('images', JSON.stringify(editForm.images));
      }

      const res = await fetch(`${API_BASE}/update/${editProduct._id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Update failed");
      }

      const updated = data;

      setProducts((prev) =>
        prev.map((p) => (p._id === updated._id ? updated : p))
      );

      setEditProduct(null);
      toast.success("Product updated successfully");
      fetchProducts();
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.message || "Failed to update product");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || e.dataTransfer?.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB");
        return;
      }
      setEditImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm(prev => ({ ...prev, images: [reader.result] }));
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleCategory = (cat) => {
    setSelectedCategory(cat);
    if (cat !== "All") setSearch("");
  };

  const filtered = products.filter(
    (p) => {
      const matchesCat = selectedCategory === "All" ||
        (p.pCategory && (
          Array.isArray(p.pCategory)
            ? p.pCategory.some(pCat => pCat.trim().toLowerCase() === selectedCategory.toLowerCase())
            : p.pCategory.trim().toLowerCase() === selectedCategory.toLowerCase()
        ));

      const matchesSearch = p.pName?.toLowerCase().includes(search.toLowerCase()) ||
        p.productId?.toLowerCase().includes(search.toLowerCase()) ||
        (Array.isArray(p.pCategory)
          ? p.pCategory.some(cat => cat?.toLowerCase().includes(search.toLowerCase()))
          : p.pCategory?.toLowerCase().includes(search.toLowerCase())) ||
        (p.description || p.pDescription || p.pDesc)?.toLowerCase().includes(search.toLowerCase());

      return matchesCat && matchesSearch;
    }
  );

  const stockStatus = (stock) => {
    if (stock <= 3) return { label: "Low Stock", class: "bg-[#FCE8E6] text-[#C5221F] border-[#F5C2C1]" };
    if (stock <= 6) return { label: "Limited", class: "bg-[#FAF3E5] text-[#9E7A3E] border-[#EADFC9]" };
    return { label: "In Stock", class: "bg-[#E6F4EA] text-[#137333] border-[#A8DAB5]" };
  };

  return (
    <div className="space-y-10 max-w-[1500px] mx-auto animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-8 md:w-12 h-[1px] md:h-[2px] bg-gold"></div>
          </div>
          <h1 className="heading-premium text-3xl md:text-5xl lg:text-6xl leading-none">
            Product <span className="italic font-normal text-slate-400">Details</span>
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
          <div className="relative group flex-1 sm:flex-none">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-gold transition-colors" size={16} md:size={18} />
            <input
              type="text"
              placeholder="Search catalog..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                if (e.target.value) setSelectedCategory("All");
              }}
              className="pl-11 pr-5 py-3 rounded-lg md:rounded-xl bg-white border border-slate-200 outline-none focus:ring-4 focus:ring-gold/15 focus:border-gold w-full sm:w-60 md:w-64 transition-all font-bold text-slate-900 placeholder:text-slate-300 shadow-sm text-xs md:text-sm"
            />
          </div>
          <button
            onClick={() => navigate("/addproduct")}
            className="py-3 px-6 md:px-8 bg-slate-900 text-gold rounded-lg md:rounded-xl font-bold text-[9px] md:text-[10px] uppercase tracking-[0.3em] shadow-lg shadow-slate-900/10 hover:bg-primary hover:text-white transition-all duration-500 flex items-center justify-center gap-2.5"
          >
            <Plus size={18} md:size={20} /> Add New Product
          </button>
        </div>
      </header>

      {/* Categories*/}
      <div className="flex items-center gap-4 overflow-x-auto pb-4 no-scrollbar border-b border-slate-100">
        <button
          onClick={() => toggleCategory("All")}
          className={`px-6 py-2.5 rounded-lg whitespace-nowrap font-bold text-[9px] uppercase tracking-widest transition-all duration-500 border ${selectedCategory === "All"
            ? "bg-slate-900 text-gold border-slate-900 shadow-lg -translate-y-0.5 shadow-slate-900/10 hover:bg-primary hover:text-white"
            : "bg-white text-slate-400 hover:bg-slate-50 border-slate-100"
            }`}
        >
          All
        </button>
        {categories
          .filter(cat => cat.status !== "Inactive")
          .map(cat => (
            <button
              key={cat._id}
              onClick={() => toggleCategory(cat.name)}
              className={`px-6 py-2.5 rounded-lg whitespace-nowrap font-bold text-[9px] uppercase tracking-widest transition-all duration-500 border ${selectedCategory === cat.name
                ? "bg-slate-900 text-gold border-slate-900 shadow-lg -translate-y-0.5 shadow-slate-900/10 hover:bg-primary hover:text-white"
                : "bg-white text-slate-400 hover:bg-slate-50 border-slate-100"
                }`}
            >
              {cat.name}
            </button>
          ))}
      </div>

      {/* Table  */}
      <div className="glass-card rounded-[24px] md:rounded-[40px] overflow-hidden bg-white/70 backdrop-blur-xl border-none shadow-xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 md:py-40 gap-6">
            <Loader2 className="w-10 h-10 md:w-14 md:h-14 text-primary animate-spin" />
            <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-[8px] md:text-[10px] italic">Synchronizing Master Catalog...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-40 space-y-6">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Package size={48} className="text-slate-200" />
            </div>
            <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Products search yielded zero results.</p>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-xs md:text-sm border-b border-slate-200">
                  <th className="px-4 md:px-6 py-4.5 font-bold text-slate-700 uppercase tracking-wider">Product Name</th>
                  <th className="px-4 md:px-6 py-4.5 font-bold text-slate-700 uppercase tracking-wider">Category</th>
                  <th className="px-4 md:px-6 py-4.5 font-bold text-slate-700 uppercase tracking-wider">Unit Value</th>
                  <th className="px-4 md:px-6 py-4.5 font-bold text-slate-700 uppercase tracking-wider">Stock Availability</th>
                  <th className="px-4 md:px-6 py-4.5 font-bold text-slate-700 uppercase tracking-wider">Homepage Section</th>
                  <th className="px-4 md:px-6 py-4.5 font-bold text-slate-700 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {filtered.map((p) => {
                  const status = stockStatus(p.stock);
                  return (
                    <tr key={p._id} className="hover:bg-white transition-all duration-300 group">
                      <td className="px-4 md:px-6 py-4 md:py-6">
                        <div className="flex items-center gap-4 md:gap-5">
                          <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl md:rounded-[24px] overflow-hidden shadow-sm group-hover:shadow-2xl transition-all duration-700 bg-slate-100 border border-slate-50 shrink-0">
                            <img
                              src={p.images?.[0] || "https://images.unsplash.com/photo-1621303837174-89787a7d4729"}
                              className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-1000"
                              alt=""
                            />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 group-hover:text-gold transition-colors text-sm md:text-base">{p.pName}</p>
                            <span className="px-2 py-0.5 bg-[#F3EAD3] text-[#84632A] border border-[#DFCE9F] text-[9px] font-bold rounded-md uppercase tracking-wider w-fit mt-1.5 inline-block shadow-sm">
                              {p.productId}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 md:px-6 py-4 md:py-6 text-left">
                        <div className="flex flex-wrap justify-start gap-1.5">
                          {Array.isArray(p.pCategory) ? (
                            p.pCategory.map((cat, idx) => (
                              <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold rounded-lg uppercase tracking-wider whitespace-nowrap shadow-sm">
                                {cat}
                              </span>
                            ))
                          ) : (
                            <span className="px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold rounded-lg uppercase tracking-wider whitespace-nowrap shadow-sm">
                              {p.pCategory}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-4 md:px-6 py-4 md:py-6 font-bold text-slate-900 text-base md:text-lg tracking-tighter">
                        <span className="text-slate-900 text-[10px] mr-1 font-bold">Rs.</span>
                        {p.price.toLocaleString()}
                      </td>

                      <td className="px-4 md:px-6 py-4 md:py-6">
                        <div className="space-y-2 md:space-y-2.5 min-w-[120px] md:min-w-[140px]">
                          <div className="flex items-center justify-between">
                            <div className={`px-2.5 md:px-3 py-1 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest border ${status.class}`}>
                              {status.label}
                            </div>
                            <span className="text-[11px] md:text-xs font-black text-slate-900">{p.stock}</span>
                          </div>
                          <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                            <div
                              className={`h-full transition-all duration-1000 shadow-[0_0_8px_rgba(0,0,0,0.1)] ${p.stock <= 3 ? 'bg-[#C5221F]' : 'bg-[#137333]'}`}
                              style={{ width: `${Math.min(100, (p.stock / 20) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 md:px-6 py-4 md:py-6">
                        <select
                          value={p.homepageSection || 'None'}
                          onChange={(e) => handleSectionChange(p._id, e.target.value)}
                          className={`px-3 py-1.5 text-[10px] font-bold rounded-lg uppercase tracking-wider outline-none border cursor-pointer ${
                            p.homepageSection === 'Popular Cakes' ? 'bg-[#FDF4FF] text-[#C026D3] border-[#F0ABFC]' :
                            p.homepageSection === 'Popular Sweets' ? 'bg-[#ECFEFF] text-[#0891B2] border-[#67E8F9]' :
                            p.homepageSection === 'Gift Hampers' ? 'bg-[#FEFCE8] text-[#CA8A04] border-[#FDE047]' :
                            'bg-slate-50 text-slate-400 border-slate-200'
                          }`}
                        >
                          <option value="None" className="bg-white text-slate-700">None</option>
                          <option value="Popular Cakes" className="bg-white text-slate-700">Popular Cakes</option>
                          <option value="Popular Sweets" className="bg-white text-slate-700">Popular Sweets</option>
                          <option value="Gift Hampers" className="bg-white text-slate-700">Gift Hampers</option>
                        </select>
                      </td>

                      <td className="px-4 md:px-6 py-6 md:py-8 text-right">
                        <div className="flex justify-end gap-2 md:gap-3 transition-all duration-300">
                          <button
                            onClick={() => setViewProduct(p)}
                            className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-white border border-slate-100 text-slate-600 hover:text-emerald-500 hover:shadow-xl transition-all"
                          >
                            <Eye size={18} md:size={20} />
                          </button>
                          <button
                            onClick={() => handleEditOpen(p)}
                            className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-white border border-slate-100 text-slate-600 hover:text-gold hover:shadow-xl transition-all"
                          >
                            <Edit3 size={18} md:size={20} />
                          </button>
                          <button
                            onClick={() => setDeleteId(p._id)}
                            className="p-3 md:p-4 rounded-xl md:rounded-2xl transition-all border bg-white border-rose-100 text-rose-500 hover:text-rose-600 hover:shadow-xl"
                          >
                            <Trash2 size={18} md:size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Product Modal */}
      {viewProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setViewProduct(null)}
          ></div>

          <div className="relative w-full max-w-[950px] bg-white rounded-[32px] md:rounded-[48px] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 md:p-12 max-h-[90vh] overflow-y-auto no-scrollbar">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gold/10 text-gold rounded-2xl">
                    <Package size={24} />
                  </div>
                  <div>
                    <h2 className="heading-premium text-2xl md:text-3xl text-slate-900 leading-tight">
                      Product <span className="italic font-normal text-slate-400">Details</span>
                    </h2>
                  </div>
                </div>
                <button
                  onClick={() => setViewProduct(null)}
                  className="p-3 hover:bg-slate-50 rounded-2xl text-slate-400 hover:text-slate-900 transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                {/* Image Section */}
                <div className="space-y-6 md:col-span-7">
                  <div className="aspect-square rounded-[32px] overflow-hidden border border-slate-100 shadow-inner bg-slate-50">
                    <img
                      src={viewProduct.images?.[0] || "https://images.unsplash.com/photo-1621303837174-89787a7d4729"}
                      className="w-full h-full object-cover"
                      alt={viewProduct.pName}
                    />
                  </div>
                </div>

                {/* Details Section */}
                <div className="space-y-6 md:col-span-5">
                  <div className="space-y-3 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <span className="text-[12px] font-semibold text-slate-400 uppercase tracking-widest">Product Name</span>
                      <span className="px-4.5 py-2 bg-[#F3EAD3] text-[#84632A] border border-[#DFCE9F] rounded-xl text-sm font-bold uppercase tracking-wider shadow-sm">
                        {viewProduct.pName}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500 font-medium">
                      <div>
                        Product ID: <span className="text-slate-700 font-semibold uppercase ml-1">{viewProduct.productId}</span>
                      </div>
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full hidden md:block"></div>
                      <div>
                        Category: <span className="text-slate-700 font-semibold uppercase ml-1">{viewProduct.pCategory}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-500 leading-relaxed italic">{viewProduct.description || "No description available for this product."}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 bg-emerald-50 rounded-[24px] border border-emerald-100">
                      <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-1">Selling Price</p>
                      <p className="text-xl font-black text-emerald-600">Rs. {viewProduct.price?.toLocaleString()}</p>
                    </div>
                    <div className="p-5 bg-slate-50 rounded-[24px] border border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Cost Price</p>
                      <p className="text-xl font-black text-slate-900">Rs. {viewProduct.costPrice?.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border-b border-slate-50">
                      <span className="text-[11px] font-medium text-slate-500 uppercase tracking-widest">Stock Level</span>
                      <div className="flex items-center gap-3">
                        <div className={`px-2.5 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-widest border ${stockStatus(viewProduct.stock).class}`}>
                          {stockStatus(viewProduct.stock).label}
                        </div>
                        <span className="text-sm font-semibold text-slate-600">{viewProduct.stock} Units</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border-b border-slate-50">
                      <span className="text-[11px] font-medium text-slate-500 uppercase tracking-widest">Measurement</span>
                      <span className="text-sm font-semibold text-slate-600 uppercase">
                        {viewProduct.weight ? `${viewProduct.weight} ${viewProduct.unit}` : `1 ${viewProduct.unit}`}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-4">
                      <span className="text-[11px] font-medium text-slate-500 uppercase tracking-widest">Expiry Date</span>
                      <span className="text-sm font-semibold text-slate-600">
                        {viewProduct.expiryDate ? new Date(viewProduct.expiryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col border border-slate-100">
            <div className="py-4 md:py-5 px-8 md:px-10 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gold/10 text-gold rounded-2xl"><Edit3 size={24} /></div>
                <div>
                  <h2 className="heading-premium text-2xl md:text-3xl text-slate-900 leading-tight">
                    Edit <span className="italic font-normal text-slate-400">Product</span>
                  </h2>
                </div>
              </div>
              <button onClick={() => setEditProduct(null)} className="p-4 hover:bg-slate-50 rounded-2xl transition-colors text-slate-400">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-6 md:py-8 px-8 md:px-10 space-y-6 no-scrollbar">
              <div className="flex flex-col gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-slate-500 uppercase tracking-widest ml-1">Product Category</label>
                  <div id="editCategory" className="flex flex-wrap gap-2.5 p-4 bg-[#FAF6F0]/50 rounded-2xl border border-[#EADFC9]/60 min-h-[60px]">
                    {categories.length === 0 ? (
                      <p className="text-slate-300 text-xs italic">Loading categories...</p>
                    ) : (
                      categories
                        .filter(cat => cat.status !== "Inactive" || cat.name === editForm.pCategory)
                        .map((cat) => {
                          const isSelected = editForm.pCategory === cat.name;
                          return (
                            <button
                              key={cat._id}
                              type="button"
                              onClick={() => {
                                if (cat.name === editProduct.pCategory) {
                                  setEditForm({
                                    ...editForm,
                                    pCategory: editProduct.pCategory,
                                    productId: editProduct.productId
                                  });
                                } else {
                                  const selectedCat = categories.find(c => c.name === cat.name);
                                  if (selectedCat) {
                                    const prefix = (selectedCat.prefix || cat.name.substring(0, 3)).toUpperCase();
                                    const relatedIds = products
                                      .map(p => p.productId)
                                      .filter(id => id && id.startsWith(`${prefix}-`));
                                    let nextNum = 1;
                                    if (relatedIds.length > 0) {
                                      const nums = relatedIds.map(id => {
                                        const parts = id.split('-');
                                        const numStr = parts[parts.length - 1];
                                        const num = parseInt(numStr);
                                        return isNaN(num) ? 0 : num;
                                      });
                                      nextNum = Math.max(...nums) + 1;
                                    }
                                    const nextId = `${prefix}-${nextNum.toString().padStart(3, '0')}`;
                                    setEditForm({
                                      ...editForm,
                                      pCategory: cat.name,
                                      productId: nextId
                                    });
                                  } else {
                                    setEditForm({ ...editForm, pCategory: cat.name });
                                  }
                                }
                              }}
                              className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 border ${isSelected
                                ? "bg-[#F3EAD3] text-[#84632A] border-[#DFCE9F] shadow-md -translate-y-0.5"
                                : "bg-white text-slate-500 border-slate-200 hover:border-[#DFCE9F] hover:text-[#84632A]"
                                }`}
                            >
                              {cat.name}
                            </button>
                          );
                        })
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-slate-500 uppercase tracking-widest ml-1">Product ID</label>
                  <input
                    readOnly
                    className="w-full px-5 py-3.5 bg-slate-100 border border-slate-200 rounded-xl outline-none transition-all font-semibold text-slate-500 text-sm cursor-not-allowed"
                    value={editForm.productId || ""}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-slate-500 uppercase tracking-widest ml-1">Product Name</label>
                  <input
                    className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-gold/15 focus:border-gold transition-all font-semibold text-slate-800 text-sm"
                    value={editForm.pName}
                    onChange={(e) => setEditForm({ ...editForm, pName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-slate-500 uppercase tracking-widest ml-1">Description</label>
                  <textarea
                    className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-gold/15 focus:border-gold transition-all font-semibold text-slate-800 text-sm min-h-[100px] resize-none"
                    value={editForm.description || ""}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    placeholder="Describe this product..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-medium text-slate-500 uppercase tracking-widest ml-1">Selling Price Rs.</label>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      onWheel={(e) => e.target.blur()}
                      className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-gold/15 focus:border-gold transition-all font-semibold text-slate-800 text-sm"
                      value={editForm.price}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditForm({ ...editForm, price: val });
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-medium text-slate-500 uppercase tracking-widest ml-1">Cost Price Rs.</label>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      onWheel={(e) => e.target.blur()}
                      className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-gold/15 focus:border-gold transition-all font-semibold text-slate-800 text-sm"
                      value={editForm.costPrice}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditForm({ ...editForm, costPrice: val });
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-slate-500 uppercase tracking-widest ml-1">Discount %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    onWheel={(e) => e.target.blur()}
                    className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-gold/15 focus:border-gold transition-all font-semibold text-slate-800 text-sm"
                    value={editForm.discountPercentage ?? ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEditForm({ ...editForm, discountPercentage: val });
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-slate-500 uppercase tracking-widest ml-1">Stock Quantity</label>
                  <input
                    type="number"
                    min="0"
                    onWheel={(e) => e.target.blur()}
                    className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-gold/15 focus:border-gold transition-all font-semibold text-slate-800 text-sm"
                    value={editForm.stock}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEditForm({ ...editForm, stock: val });
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className={`space-y-2 ${!['kg', 'g', 'ml', 'l'].includes(editForm.unit) ? 'md:col-span-2' : ''}`}>
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Measurement Unit</label>
                    <select
                      className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-gold/15 focus:border-gold transition-all font-semibold text-slate-800 text-sm appearance-none cursor-pointer"
                      value={editForm.unit}
                      onChange={(e) => setEditForm({ ...editForm, unit: e.target.value })}
                    >
                      <option value="pcs">pcs</option>
                      <option value="box">box</option>
                      <option value="packet">packet</option>
                      <option value="kg">kg</option>
                      <option value="g">g</option>
                      <option value="ml">ml</option>
                      <option value="l">l</option>
                    </select>
                  </div>

                  {
                    ['kg', 'g', 'ml', 'l'].includes(editForm.unit) && (
                      <div className="space-y-2">
                        <label className="text-[11px] font-medium text-slate-500 uppercase tracking-widest ml-1">weight(kg/g) / volume (l/ml)</label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          onWheel={(e) => e.target.blur()}
                          className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-gold/15 focus:border-gold transition-all font-semibold text-slate-800 text-sm"
                          value={editForm.weight ?? ""}
                          onChange={(e) => setEditForm({ ...editForm, weight: e.target.value })}
                          placeholder={`Enter weight in ${editForm.unit}`}
                        />
                      </div>
                    )
                  }
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-slate-500 uppercase tracking-widest ml-1">Expiry Date</label>
                  <input
                    type="date"
                    className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-gold/15 focus:border-gold transition-all font-semibold text-slate-800 text-sm"
                    value={editForm.expiryDate ? new Date(editForm.expiryDate).toISOString().split('T')[0] : ""}
                    onChange={(e) => setEditForm({ ...editForm, expiryDate: e.target.value })}
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[11px] font-medium text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Image size={12} />
                    Product Image
                  </label>
                  <div
                    onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-gold'); }}
                    onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove('border-gold'); }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.remove('border-gold');
                      const file = e.dataTransfer.files[0];
                      if (file) handleFileChange({ target: { files: [file] } });
                    }}
                    onClick={() => document.getElementById('editFileInput').click()}
                    className="w-full aspect-video rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center bg-white hover:bg-slate-50 transition-all cursor-pointer group relative overflow-hidden"
                  >
                    {editForm.images?.[0] ? (
                      <div className="absolute inset-0 group">
                        <img
                          src={editForm.images[0]}
                          alt="Preview"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                          <div className="flex flex-col items-center gap-3">
                            <div className="p-3 bg-white/20 rounded-full text-white"><Upload size={20} /></div>
                            <p className="text-[10px] font-black text-white uppercase tracking-widest">Drop image to update</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-500">
                          <Upload className="text-slate-400 w-6 h-6" />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Add Product Image</p>
                      </>
                    )}
                    <input
                      id="editFileInput"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="py-4 md:py-5 px-8 md:px-10 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-4 shrink-0">
              <button
                onClick={() => setEditProduct(null)}
                className="px-8 py-4 bg-[#FCE8E6] text-[#C5221F] rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#FAD2CF] transition-all border border-[#F5C2C1] flex items-center justify-center gap-2 shadow-sm"
              >
                Discard
              </button>
              <button
                onClick={handleEditSave}
                className="px-10 py-4 bg-slate-900 text-gold rounded-xl font-bold text-xs uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-primary hover:text-white transition-all shadow-xl shadow-slate-900/10 hover:shadow-primary/20"
              >
                Save Changes
                <Save size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-0">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setDeleteId(null)}
          ></div>

          <div className="relative w-full max-w-[440px] bg-white rounded-[32px] md:rounded-[48px] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 fade-in duration-300">
            <div className="h-2 w-full bg-gold"></div>

            <div className="p-8 md:p-12 text-center">
              <div className="w-20 h-20 bg-amber-50/50 rounded-[28px] flex items-center justify-center mx-auto mb-8 shadow-inner">
                <Trash2 size={36} className="text-gold animate-pulse" />
              </div>

              <h2 className="text-2xl md:text-3xl font-serif text-slate-800 tracking-tight uppercase leading-tight mb-4 font-bold">
                Confirm <span className="text-gold italic font-normal">Deletion</span>
              </h2>

              <p className="text-sm font-medium text-slate-400 mb-10 leading-relaxed px-4">
                Permanently erase this product from the inventory?
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 py-4.5 bg-slate-100 text-slate-600 rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-slate-200 hover:text-slate-900 transition-all border border-slate-200/50 shadow-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteId)}
                  className="flex-1 py-4.5 bg-slate-900 text-gold rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] shadow-lg hover:bg-primary hover:text-white transition-all duration-300 shadow-slate-900/10 hover:shadow-primary/20"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-slate-50 rounded-full opacity-50 -z-10"></div>
          </div>
        </div>
      )}
    </div>
  );
}
