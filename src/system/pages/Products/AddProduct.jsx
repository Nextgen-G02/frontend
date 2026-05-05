import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Package, 
  DollarSign, 
  Settings, 
  Camera, 
  CheckCircle2, 
  ChevronRight, 
  AlertCircle,
  Loader2,
  X,
  Save
} from "lucide-react";
import { toast } from "react-hot-toast";

const API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api/products`;

export default function AddProduct() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [form, setForm] = useState({
    productId: "",
    pName: "",
    pCategory: "",
    price: "",
    costPrice: "",
    stock: "",
    expiryDate: "",
    unit: "Unit (Pcs)",
    status: "Active",
    description: "New product entry",
    weight: 0,
    pImg: "",
    isIngredient: false,
    recipe: []
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/categories`);
        const data = await res.json();
        setCategories(data.data || []);
      } catch (error) {
        toast.error("Failed to fetch categories");
      }
    };
    const fetchAllProducts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products`);
        const data = await res.json();
        setAllProducts(data.data || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategories();
    fetchAllProducts();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!form.productId) newErrors.productId = "Product ID is required";
    if (!form.pName) newErrors.pName = "Product name is required";
    if (!form.price || form.price <= 0) newErrors.price = "Valid price is required";
    if (!form.costPrice || form.costPrice <= 0) newErrors.costPrice = "Valid cost price is required";
    if (!form.stock || form.stock < 0) newErrors.stock = "Stock quantity is required";
    if (!form.pCategory) newErrors.pCategory = "Category is required";
    if (!form.unit) newErrors.unit = "Unit is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setForm(prev => {
      const updatedForm = { ...prev, [name]: value };
      
    // If category changes, update productId with the prefix
    if (name === "pCategory") {
      const selectedCat = categories.find(cat => cat.name === value);
      if (selectedCat && (!form.productId || form.productId.endsWith('-'))) {
        setForm(prev => ({ ...prev, productId: `${selectedCat.prefix}-`, pCategory: value }));
        return;
      }
      setForm(prev => ({ ...prev, pCategory: value }));
      return;
    }
    });

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/add`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          costPrice: Number(form.costPrice),
          stock: Number(form.stock),
          images: form.pImg ? [form.pImg] : []
        })
      });

      if (response.ok) {
        setSuccess(true);
        toast.success("Product added successfully");
        setTimeout(() => navigate("/adminproduct"), 2000);
      } else {
        const errData = await response.json();
        setErrors({ submit: errData.message || "Failed to add product" });
        toast.error(errData.message || "Failed to add product");
      }
    } catch (error) {
      setErrors({ submit: "Connection error" });
      toast.error("Server connection lost");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (key) =>
    `w-full px-5 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-4 transition-all font-bold text-slate-900 placeholder:text-slate-300 text-sm
    ${errors[key]
      ? "border-primary focus:ring-primary/5 shadow-[0_0_15px_rgba(127,29,29,0.1)]"
      : "border-slate-100 focus:border-primary focus:ring-primary/5"
    }`;

  return (
    <div className="space-y-10 max-w-[900px] mx-auto animate-in fade-in duration-1000">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-10 h-1 bg-primary rounded-full"></span>
          </div>
          <h1 className="heading-premium text-2xl md:text-5xl leading-tight">Add New <span className="italic font-medium text-slate-400">Product</span></h1>
        </div>
      </header>

      <div className="glass-card bg-white rounded-[32px] md:rounded-[56px] border-none shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-slate-900"></div>
        
        <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8 md:space-y-10">
          {/* Section: Basic Info */}
          <div>
            <div className="flex items-center gap-3.5 mb-5 md:mb-6">
               <div className="p-2.5 bg-slate-900 text-gold rounded-lg shadow-lg"><Package className="w-4.5 h-4.5" /></div>
               <h2 className="text-base md:text-lg font-black text-slate-900 tracking-tight uppercase">Product Details</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3 md:col-span-2">
                <label className="text-[15px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  Product Category
                  <span className="text-primary">*</span>
                </label>
                
                <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100 min-h-[60px]">
                  {categories.length === 0 ? (
                    <p className="text-slate-300 text-xs italic">Loading categories...</p>
                  ) : (
                    categories.map((cat) => {
                      const isSelected = form.pCategory === cat.name;
                      return (
                        <button
                          key={cat._id}
                          type="button"
                          onClick={() => handleChange({ target: { name: 'pCategory', value: cat.name } })}
                          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 border ${
                            isSelected
                            ? "bg-slate-900 text-gold border-slate-900 shadow-md -translate-y-0.5"
                            : "bg-white text-slate-400 border-slate-100 hover:border-slate-200"
                          }`}
                        >
                          {cat.name}
                        </button>
                      );
                    })
                  )}
                </div>
                {errors.pCategory && <p className="text-[9px] font-bold text-primary mt-1.5 ml-1">{errors.pCategory}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-[15px] font-black text-slate-400 uppercase tracking-widest ml-1">Product ID<span className="text-primary">*</span></label>
                <input name="productId" value={form.productId} onChange={handleChange}
                  placeholder="Select category first..." className={inputClass("productId")} />
                {errors.productId && <p className="text-[9px] font-bold text-primary mt-1.5 ml-1">{errors.productId}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-[15px] font-black text-slate-400 uppercase tracking-widest ml-1">Product Name<span className="text-primary">*</span></label>
                <input name="pName" value={form.pName} onChange={handleChange}
                  placeholder="e.g. Highland Chocolate Truffle" className={inputClass("pName")} />
                {errors.pName && <p className="text-[9px] font-bold text-primary mt-1.5 ml-1">{errors.pName}</p>}
              </div>
            </div>
          </div>

          {/* Section: Valuation & Stock */}
          <div className="p-5 md:p-8 bg-slate-50/50 rounded-[24px] md:rounded-[36px] border border-slate-100">
            <div className="flex items-center gap-3.5 mb-5 md:mb-6">
               <div className="p-2.5 bg-white text-primary rounded-lg shadow-sm border border-slate-100"><DollarSign className="w-4.5 h-4.5" /></div>
               <h2 className="text-base md:text-lg font-black text-slate-900 tracking-tight uppercase">Valuation & Inventory</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1.5">
                <label className="text-[15px] font-black text-slate-400 uppercase tracking-widest ml-1">Price Rs.<span className="text-primary">*</span></label>
                <input type="number" name="price" value={form.price} onChange={handleChange}
                  placeholder="0.00" className={inputClass("price")} />
                {errors.price && <p className="text-[9px] font-bold text-primary mt-1.5 ml-1">{errors.price}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-[15px] font-black text-slate-400 uppercase tracking-widest ml-1">Procurement Cost Rs.<span className="text-primary">*</span></label>
                <input type="number" name="costPrice" value={form.costPrice} onChange={handleChange}
                  placeholder="0.00" className={inputClass("costPrice")} />
                {errors.costPrice && <p className="text-[9px] font-bold text-primary mt-1.5 ml-1">{errors.costPrice}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-[15px] font-black text-slate-400 uppercase tracking-widest ml-1">Stock <span className="text-primary">*</span></label>
                <input type="number" name="stock" value={form.stock} onChange={handleChange}
                  placeholder="0" className={inputClass("stock")} />
                {errors.stock && <p className="text-[9px] font-bold text-primary mt-1.5 ml-1">{errors.stock}</p>}
              </div>
            </div>
          </div>

          {/* Section: Thresholds & Units */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <label className="text-[15px] font-black text-slate-400 uppercase tracking-widest ml-1">Expiry Date</label>
              <input type="date" name="expiryDate" value={form.expiryDate} onChange={handleChange}
                className={inputClass("expiryDate")} />
            </div>

            <div className="space-y-1.5">
              <label className="text-[15px] font-black text-slate-400 uppercase tracking-widest ml-1">Measurement Unit <span className="text-primary">*</span></label>
              <select name="unit" value={form.unit} onChange={handleChange} className={inputClass("unit")}>
                <option>Unit (Pcs)</option>
                <option>kg</option>
                <option>g</option>
                <option>ml</option>
                <option>l</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[15px] font-black text-slate-400 uppercase tracking-widest ml-1">Operational Status</label>
              <select name="status" value={form.status} onChange={handleChange} className={inputClass("status")}>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>

          {/* Section: Ingredient & Recipe Configuration */}
          <div className="p-5 md:p-8 bg-slate-900 rounded-[24px] md:rounded-[36px] text-white">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-3.5">
                  <div className="p-2.5 bg-white/10 text-gold rounded-lg border border-white/10"><Settings className="w-4.5 h-4.5" /></div>
                  <h2 className="text-base md:text-lg font-black text-white tracking-tight uppercase">Supply Configuration</h2>
               </div>
               <label className="flex items-center gap-3 cursor-pointer group">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-gold transition-colors">Mark as Raw Ingredient</span>
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={form.isIngredient}
                      onChange={(e) => setForm({...form, isIngredient: e.target.checked})}
                    />
                    <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
                  </div>
               </label>
            </div>

            {!form.isIngredient && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Recipe / BOM (Bill of Materials)</p>
                  <button 
                    type="button"
                    onClick={() => setForm(prev => ({
                      ...prev,
                      recipe: [...(prev.recipe || []), { ingredientId: "", quantity: 1 }]
                    }))}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                  >
                    + Add Ingredient
                  </button>
                </div>

                <div className="space-y-4">
                  {(form.recipe || []).map((item, index) => (
                    <div key={index} className="flex items-end gap-4 animate-in slide-in-from-left duration-300">
                      <div className="flex-1 space-y-2">
                        <label className="text-[9px] font-black text-white/30 uppercase tracking-widest ml-1">Select Ingredient</label>
                        <select 
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-gold transition-all font-bold text-white text-sm appearance-none"
                          value={item.ingredientId}
                          onChange={(e) => {
                            const newRecipe = [...form.recipe];
                            newRecipe[index].ingredientId = e.target.value;
                            setForm({...form, recipe: newRecipe});
                          }}
                        >
                          <option value="" className="bg-slate-900">Choose...</option>
                          {allProducts.filter(p => p.isIngredient).map(p => (
                            <option key={p._id} value={p._id} className="bg-slate-900">{p.pName} ({p.unit})</option>
                          ))}
                        </select>
                      </div>
                      <div className="w-32 space-y-2">
                        <label className="text-[9px] font-black text-white/30 uppercase tracking-widest ml-1">Quantity</label>
                        <input 
                          type="number"
                          step="0.01"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-gold transition-all font-bold text-white text-sm"
                          value={item.quantity}
                          onChange={(e) => {
                            const newRecipe = [...form.recipe];
                            newRecipe[index].quantity = Number(e.target.value);
                            setForm({...form, recipe: newRecipe});
                          }}
                        />
                      </div>
                      <button 
                        type="button"
                        onClick={() => {
                          const newRecipe = form.recipe.filter((_, i) => i !== index);
                          setForm({...form, recipe: newRecipe});
                        }}
                        className="p-3 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  {(!form.recipe || form.recipe.length === 0) && (
                    <div className="py-8 text-center border-2 border-dashed border-white/5 rounded-[32px]">
                      <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">No ingredients assigned to this product</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Messages */}
          {errors.submit && (
            <div className="flex items-center gap-4 p-6 bg-rose-50 border border-rose-100 rounded-3xl text-primary font-bold text-sm">
              <AlertCircle className="w-6 h-6 shrink-0" />
              {errors.submit}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-4 p-6 bg-emerald-50 border border-emerald-100 rounded-3xl text-emerald-600 font-bold text-sm">
              <CheckCircle2 className="w-6 h-6 shrink-0" />
              Product added successful. Redirecting...
            </div>
          )}

          {/* Footer actions */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 pt-8 border-t border-slate-100">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic md:leading-none text-center md:text-left">
              <span className="text-primary">*</span> Compulsory Product Fields
            </p>
            <div className="flex flex-col sm:flex-row gap-4 md:gap-5 w-full md:w-auto">
              <button 
                type="button" 
                onClick={() => navigate("/adminproduct")}
                className="w-full md:w-auto px-8 py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-lg md:rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-all text-center"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full md:w-auto flex items-center justify-center gap-3 px-8 md:px-10 py-4 bg-slate-900 text-gold rounded-lg md:rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-[0.3em] shadow-2xl shadow-slate-200 hover:bg-primary hover:text-white transition-all duration-500 disabled:opacity-50"
              >
                {loading ? (
                   <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Add Product
                    <Save className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}