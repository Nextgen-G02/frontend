import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Settings,
  Camera,
  CheckCircle2,
  ChevronRight,
  AlertCircle,
  Loader2,
  X,
  Save,
  Image,
  Upload
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
    unit: "pcs",
    status: "Active",
    description: "",
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
    if (form.price === "" || Number(form.price) <= 0) newErrors.price = "Price must be greater than 0";
    if (form.costPrice === "" || Number(form.costPrice) <= 0) newErrors.costPrice = "Cost price must be greater than 0";
    if (form.stock === "" || Number(form.stock) < 0) newErrors.stock = "Stock quantity cannot be negative";
    if (!form.pCategory) newErrors.pCategory = "Category is required";
    if (!form.unit) newErrors.unit = "Unit is required";
    if (['kg', 'g', 'ml', 'l'].includes(form.unit) && (form.weight === "" || Number(form.weight) <= 0)) {
      newErrors.weight = "Weight/Volume is required and must be greater than 0";
    }
    if (!form.description) newErrors.description = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Prevent negative values for specific numeric fields
    if (["price", "costPrice", "stock", "weight"].includes(name) && value < 0) {
      return;
    }

    setForm(prev => {
      let updatedForm = { ...prev, [name]: value };

      // If category changes, update productId with the next sequential ID
      if (name === "pCategory") {
        const selectedCat = categories.find(cat => cat.name === value);
        if (selectedCat) {
          const prefix = (selectedCat.prefix || value.substring(0, 3)).toUpperCase();

          // Find all existing products with this prefix
          const relatedIds = allProducts
            .map(p => p.productId)
            .filter(id => id && id.startsWith(`${prefix}-`));

          let nextNum = 1;
          if (relatedIds.length > 0) {
            // Extract numeric parts and find the maximum
            const nums = relatedIds.map(id => {
              const parts = id.split('-');
              const numStr = parts[parts.length - 1];
              const num = parseInt(numStr);
              return isNaN(num) ? 0 : num;
            });
            nextNum = Math.max(...nums) + 1;
          }

          // Format as PREFIX-00X
          updatedForm.productId = `${prefix}-${nextNum.toString().padStart(3, '0')}`;
        }
      }

      return updatedForm;
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

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || e.dataTransfer?.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, pImg: reader.result }));
      };
      reader.readAsDataURL(file);
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
          weight: Number(form.weight),
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
    <div className="space-y-10 max-w-[900px] mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-10 h-1 bg-primary rounded-full"></span>
          </div>
          <h1 className="heading-premium text-2xl md:text-5xl leading-tight text-slate-900">Add New Product</h1>
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

            <div className="flex flex-col gap-6">
              <div className="space-y-3 md:col-span-2">
                <label className="text-[15px] font-medium text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                  Product Category
                </label>

                <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100 min-h-[60px]">
                  {categories.length === 0 ? (
                    <p className="text-slate-300 text-xs italic">Loading categories...</p>
                  ) : (
                    categories.map((cat) => {
                      const isSelected = form?.pCategory === cat.name;
                      return (
                        <button
                          key={cat._id}
                          type="button"
                          onClick={() => handleChange({ target: { name: 'pCategory', value: cat.name } })}
                          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 border ${isSelected
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
                <label className="text-[15px] font-medium text-slate-500 uppercase tracking-widest ml-1">Product ID</label>
                <input
                  name="productId"
                  value={form.productId}
                  readOnly
                  placeholder="Select category first..."
                  className={`${inputClass("productId")} bg-slate-100 cursor-not-allowed border-slate-200 text-slate-500`}
                />
                {/* <p className="text-[10px] text-slate-400 mt-1 ml-1 italic font-medium">Auto-generated based on selected category</p> */}
                {errors.productId && <p className="text-[9px] font-bold text-primary mt-1.5 ml-1">{errors.productId}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-[15px] font-medium text-slate-500 uppercase tracking-widest ml-1">Product Name</label>
                <input name="pName" value={form.pName} onChange={handleChange}
                  placeholder="e.g. Highland Chocolate Truffle" className={inputClass("pName")} />
                {errors.pName && <p className="text-[9px] font-bold text-primary mt-1.5 ml-1">{errors.pName}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-[15px] font-medium text-slate-500 uppercase tracking-widest ml-1">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe this product..."
                  className={`${inputClass("description")} min-h-[120px] py-4 resize-none`}
                />
                {errors.description && <p className="text-[9px] font-bold text-primary mt-1.5 ml-1">{errors.description}</p>}
              </div>
            </div>
          </div>

          {/* Section: Valuation & Stock */}
          <div className="flex flex-col gap-6">
            <div className="space-y-1.5">
              <label className="text-[15px] font-medium text-slate-500 uppercase tracking-widest ml-1">Price Rs.</label>
              <input type="number" name="price" value={form.price} onChange={handleChange} min="0.01" step="0.01"
                onWheel={(e) => e.target.blur()}
                placeholder="0.00" className={inputClass("price")} />
              {errors.price && <p className="text-[9px] font-bold text-primary mt-1.5 ml-1">{errors.price}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-[15px] font-medium text-slate-500 uppercase tracking-widest ml-1">Cost Price Rs.</label>
              <input type="number" name="costPrice" value={form.costPrice} onChange={handleChange} min="0.01" step="0.01"
                onWheel={(e) => e.target.blur()}
                placeholder="0.00" className={inputClass("costPrice")} />
              {errors.costPrice && <p className="text-[9px] font-bold text-primary mt-1.5 ml-1">{errors.costPrice}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-[15px] font-medium text-slate-500 uppercase tracking-widest ml-1">Measurement Unit</label>
              <select name="unit" value={form.unit} onChange={handleChange} className={inputClass("unit")}>
                <option value="pcs">pcs</option>
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="ml">ml</option>
                <option value="l">l</option>
                <option value="box">box</option>
                <option value="pkt">pkt</option>
              </select>
            </div>

            {['kg', 'g', 'ml', 'l'].includes(form.unit) && (
              <div className="space-y-1.5">
                <label className="text-[15px] font-medium text-slate-500 uppercase tracking-widest ml-1">Weight / Volume ({form.unit})</label>
                <input type="number" name="weight" value={form.weight} onChange={handleChange} min="0" step="0.01"
                  onWheel={(e) => e.target.blur()}
                  placeholder={`Enter weight in ${form.unit}`} className={inputClass("weight")} />
                {errors.weight && <p className="text-[9px] font-bold text-primary mt-1.5 ml-1">{errors.weight}</p>}
              </div>
            )} 

            <div className="space-y-1.5">
              <label className="text-[15px] font-medium text-slate-500 uppercase tracking-widest ml-1">Stock</label>
              <input type="number" name="stock" value={form.stock} onChange={handleChange} min="0"
                onWheel={(e) => e.target.blur()}
                placeholder="0" className={inputClass("stock")}/>
              {errors.stock && <p className="text-[9px] font-bold text-primary mt-1.5 ml-1">{errors.stock}</p>}
            </div>
          </div>

          {/* Section: Thresholds & Units */}
          <div className="flex flex-col gap-6">
            <div className="space-y-1.5">
              <label className="text-[15px] font-medium text-slate-500 uppercase tracking-widest ml-1">Expiry Date</label>
              <input type="date" name="expiryDate" value={form.expiryDate} onChange={handleChange}
                className={inputClass("expiryDate")}/>
            </div>

          </div>

          {/* Section: Product Image */}
          <div className="p-5 md:p-8 bg-slate-50 border border-slate-100 rounded-[24px] md:rounded-[36px]">
            <div className="flex items-center gap-3.5 mb-6">
              <div className="p-2.5 bg-slate-900 text-gold rounded-lg shadow-lg">
                <Image className="w-4.5 h-4.5" />
              </div>
              <h2 className="text-base md:text-lg font-black text-slate-900 tracking-tight uppercase">Product Image </h2>
            </div>

            <div className="space-y-6">
              <div
                onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-primary'); }}
                onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove('border-primary'); }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('border-primary');
                  const file = e.dataTransfer.files[0];
                  if (file) handleFileChange({ target: { files: [file] } });
                }}
                onClick={() => document.getElementById('fileInput').click()}
                className="w-full aspect-video rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center bg-white hover:bg-slate-50 transition-all cursor-pointer group relative overflow-hidden"
              >
                {form.pImg ? (
                  <div className="absolute inset-0 group">
                    <img
                      src={form.pImg}
                      alt="Preview"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-3 bg-white/20 rounded-full text-white"><Upload className="w-6 h-6" /></div>
                        <p className="text-[10px] font-black text-white uppercase tracking-widest">Drop new image to replace</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                      <Upload className="text-slate-400 w-8 h-8" />
                    </div>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Drag & Drop Image Here</p>
                    <p className="text-[9px] text-slate-300 mt-2 font-medium">Or click to browse from device</p>
                  </>
                )}
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-100"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-black">
                  <span className="bg-slate-50 px-4 text-slate-300">Or use URL</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[15px] font-medium text-slate-500 uppercase tracking-widest ml-1">Image URL</label>
                <input
                  type="text"
                  name="pImg"
                  value={form.pImg && !form.pImg.startsWith('data:') ? form.pImg : ""}
                  onChange={handleChange}
                  placeholder="Paste image link here..."
                  className={inputClass("pImg")}
                />
              </div>
            </div>
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

            <div className="flex flex-col sm:flex-row gap-4 md:gap-5 w-full md:w-auto">
              <button
                type="button"
                onClick={() => navigate("/adminproduct")}
                className="w-full md:w-auto px-8 py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-lg md:rounded-xl bg-primary text-black hover:opacity-90 transition-all text-center shadow-lg"
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