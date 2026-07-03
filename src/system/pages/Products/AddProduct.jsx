import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Settings, Camera, CheckCircle2, ChevronRight, AlertCircle, Loader2, X, Save, Image, Upload } from "lucide-react";
import { toast } from "react-hot-toast";

const API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api/products`;


export default function AddProduct() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [imageFile, setImageFile] = useState(null);
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
    discountPercentage: "",
    description: "",
    // weight: 0,
    pImg: "",
    isIngredient: false,
    homepageSection: "None",
    recipe: []
  });

  const [errors, setErrors] = useState({});

  //load the category data
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/categories`);
        const data = await res.json();
        setCategories(data.data || []);
      } catch {
        toast.error("Failed to fetch categories");
      }
    };
    //load product data  
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

    if (form.discountPercentage !== "" && (Number(form.discountPercentage) < 0 || Number(form.discountPercentage) > 100)) {
      newErrors.discountPercentage = "Discount percentage must be between 0 and 100";
    }

    const priceVal = Number(form.price);
    const costPriceVal = Number(form.costPrice);
    const discountPercentVal = Number(form.discountPercentage) || 0;
    const discountAmt = priceVal * (discountPercentVal / 100);

    if (priceVal > 0 && costPriceVal > 0 && (priceVal - discountAmt) <= costPriceVal) {
      newErrors.discountPercentage = "Price after discount must be greater than cost price to ensure profit";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Prevent negative values for specific numeric fields
    if (["price", "costPrice", "stock"].includes(name) && value < 0) {
      return;
    }

    setForm(prev => {
      let updatedForm = { ...prev, [name]: value };

      // If category changes, update productId automatically
      if (name === "pCategory") {
        const selectedCat = categories.find(cat => cat.name === value);
        if (selectedCat) {
          const prefix = (selectedCat.prefix || value.substring(0, 3)).toUpperCase();

          // Filter product its category prifix
          const relatedIds = allProducts
            .map(p => p.productId)
            .filter(id => id && id.startsWith(`${prefix}-`));

          let nextNum = 1;
          if (relatedIds.length > 0) {
            //find the maximum
            const nums = relatedIds.map(id => {
              const parts = id.split('-');
              const numStr = parts[parts.length - 1];
              const num = parseInt(numStr);
              return isNaN(num) ? 0 : num;
            });
            nextNum = Math.max(...nums) + 1;
          }

          //PREFIX-00X
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

  // image upload
  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || e.dataTransfer?.files?.[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) {
        toast.error("Image must be less than 1MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, pImg: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Sync validation
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

    if (form.discountPercentage !== "" && (Number(form.discountPercentage) < 0 || Number(form.discountPercentage) > 100)) {
      newErrors.discountPercentage = "Discount percentage must be between 0 and 100";
    }

    const priceVal = Number(form.price);
    const costPriceVal = Number(form.costPrice);
    const discountPercentVal = Number(form.discountPercentage) || 0;
    const discountAmt = priceVal * (discountPercentVal / 100);

    if (priceVal > 0 && costPriceVal > 0 && (priceVal - discountAmt) <= costPriceVal) {
      newErrors.discountPercentage = "Price after discount must be greater than cost price to ensure profit";
    }

    setErrors(newErrors);

    const isValid = Object.keys(newErrors).length === 0;
    if (!isValid) {
      Object.values(newErrors).forEach((errMsg) => {
        toast.error(errMsg);
      });

      const firstErrorKey = Object.keys(newErrors)[0];
      const errorElement = document.getElementById(firstErrorKey) || document.getElementsByName(firstErrorKey)[0];
      if (errorElement) {
        errorElement.focus?.();
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        if (key !== 'pImg' && key !== 'recipe' && key !== 'price' && key !== 'costPrice' && key !== 'stock' && key !== 'discountPercentage') {
          formData.append(key, form[key]);
        }
      });
      formData.append('price', Number(form.price));
      formData.append('costPrice', Number(form.costPrice));
      formData.append('stock', Number(form.stock));
      formData.append('discountPercentage', Number(form.discountPercentage) || 0);

      if (imageFile) {
        formData.append('image', imageFile);
      } else if (form.pImg) {
        formData.append('images', JSON.stringify([form.pImg]));
      }

      const response = await fetch(`${API_BASE}/add`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: formData
      });

      if (response.ok) {
        setSuccess(true);
        toast.success("Product added successfully");
        setTimeout(() => navigate("/adminproduct"), 2000);
      } else {
        const errData = await response.json();
        const errorMessage = errData.error || errData.message || "Failed to add product";
        setErrors({ submit: errorMessage });
        toast.error(errorMessage);
      }
    } catch {
      setErrors({ submit: "Connection error" });
      toast.error("Server connection lost");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (key) =>
    `w-full px-5 py-3.5 bg-slate-50/50 border rounded-xl outline-none focus:ring-4 transition-all font-semibold text-slate-800 placeholder:text-slate-400/60 text-sm
    ${errors[key]
      ? "border-[#C5221F] focus:ring-[#C5221F]/15 shadow-sm"
      : "border-slate-200 focus:border-gold focus:ring-gold/15"
    }`;

  return (
    <div className="space-y-10 max-w-[900px] mx-auto animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-8 md:w-12 h-[1px] md:h-[2px] bg-gold"></div>
          </div>
          <h1 className="heading-premium text-3xl md:text-5xl lg:text-6xl leading-none">
            Add New <span className="italic font-normal text-slate-400">Product</span>
          </h1>
        </div>
      </header>

      <div className="glass-card bg-white rounded-[32px] md:rounded-[40px] border border-slate-100 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gold"></div>

        <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8 md:space-y-10">
          {/* Section: Basic Info */}
          <div>
            <div className="flex items-center gap-3.5 mb-5 md:mb-6">
              <div className="p-2.5 bg-gold/10 text-gold rounded-lg shadow-sm"><Package className="w-4.5 h-4.5" /></div>
              <h2 className="text-base md:text-lg font-black text-slate-900 tracking-tight uppercase">Product Details</h2>
            </div>

            <div className="flex flex-col gap-6">
              <div className="space-y-3 md:col-span-2">
                <label className="text-[15px] font-medium text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                  Product Category
                </label>

                <div id="pCategory" className="flex flex-wrap gap-2.5 p-4 bg-[#FAF6F0]/50 rounded-2xl border border-[#EADFC9]/60 min-h-[60px]">
                  {categories.length === 0 ? (
                    <p className="text-slate-300 text-xs italic">Loading categories...</p>
                  ) : (
                    categories
                      .filter(cat => cat.status !== "Inactive")
                      .map((cat) => {
                        const isSelected = form?.pCategory === cat.name;
                        return (
                          <button
                            key={cat._id}
                            type="button"
                            onClick={() => handleChange({ target: { name: 'pCategory', value: cat.name } })}
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
                {errors.pCategory && <p className="text-[9px] font-bold text-[#C5221F] mt-1.5 ml-1">{errors.pCategory}</p>}
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
                {errors.productId && <p className="text-[9px] font-bold text-[#C5221F] mt-1.5 ml-1">{errors.productId}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-[15px] font-medium text-slate-500 uppercase tracking-widest ml-1">Product Name</label>
                <input name="pName" value={form.pName} onChange={handleChange}
                  placeholder="e.g. Highland Chocolate Truffle" className={inputClass("pName")} />
                {errors.pName && <p className="text-[9px] font-bold text-[#C5221F] mt-1.5 ml-1">{errors.pName}</p>}
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
                {errors.description && <p className="text-[9px] font-bold text-[#C5221F] mt-1.5 ml-1">{errors.description}</p>}
              </div>
            </div>
          </div>


          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[15px] font-medium text-slate-500 uppercase tracking-widest ml-1">Price Rs.</label>
                <input type="number" name="price" value={form.price} onChange={handleChange} min="0.01" step="0.01"
                  onWheel={(e) => e.target.blur()}
                  placeholder="0.00" className={inputClass("price")} />
                {errors.price && <p className="text-[9px] font-bold text-[#C5221F] mt-1.5 ml-1">{errors.price}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-[15px] font-medium text-slate-500 uppercase tracking-widest ml-1">Cost Price Rs.</label>
                <input type="number" name="costPrice" value={form.costPrice} onChange={handleChange} min="0.01" step="0.01"
                  onWheel={(e) => e.target.blur()}
                  placeholder="0.00" className={inputClass("costPrice")} />
                {errors.costPrice && <p className="text-[9px] font-bold text-[#C5221F] mt-1.5 ml-1">{errors.costPrice}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[15px] font-medium text-slate-500 uppercase tracking-widest ml-1">Discount % (Optional)</label>
              <input type="number" name="discountPercentage" value={form.discountPercentage} onChange={handleChange} min="0" max="100" step="0.1"
                onWheel={(e) => e.target.blur()}
                placeholder="0" className={inputClass("discountPercentage")} />
              {errors.discountPercentage && <p className="text-[9px] font-bold text-[#C5221F] mt-1.5 ml-1">{errors.discountPercentage}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-[15px] font-medium text-slate-500 uppercase tracking-widest ml-1">Stock</label>
              <input type="number" name="stock" value={form.stock} onChange={handleChange} min="0"
                onWheel={(e) => e.target.blur()}
                placeholder="0" className={inputClass("stock")} />
              {errors.stock && <p className="text-[9px] font-bold text-[#C5221F] mt-1.5 ml-1">{errors.stock}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`space-y-1.5 ${!['kg', 'g', 'ml', 'l'].includes(form.unit) ? 'md:col-span-2' : ''}`}>
                <label className="text-[15px] font-medium text-slate-500 uppercase tracking-widest ml-1">Measurement Unit</label>
                <select name="unit" value={form.unit} onChange={handleChange} className={inputClass("unit")}>
                  <option value="pcs">pcs</option>
                  <option value="box">box</option>
                  <option value="kg">kg</option>
                  <option value="g">g</option>
                  <option value="ml">ml</option>
                  <option value="l">l</option>
                </select>
              </div>

              {
                ['kg', 'g', 'ml', 'l'].includes(form.unit) && (
                  <div className="space-y-1.5">
                    <label className="text-[15px] font-medium text-slate-500 uppercase tracking-widest ml-1">weight(kg/g) / volume (l/ml)</label>
                    <input type="number" name="weight" value={form.weight} onChange={handleChange} min="0" step="0.01"
                      onWheel={(e) => e.target.blur()}
                      placeholder={`Enter weight in ${form.unit}`} className={inputClass("weight")} />
                    {errors.weight && <p className="text-[9px] font-bold text-[#C5221F] mt-1.5 ml-1">{errors.weight}</p>}
                  </div>
                )
              }
            </div>
          </div>

          {/* Section: Thresholds & Units */}
          <div className="flex flex-col gap-6">
            <div className="space-y-1.5">
              <label className="text-[15px] font-medium text-slate-500 uppercase tracking-widest ml-1">Expiry Date</label>
              <input type="date" name="expiryDate" value={form.expiryDate} onChange={handleChange}
                className={inputClass("expiryDate")} />
            </div>

            <div className="space-y-1.5 flex flex-col">
              <label className="text-[15px] font-medium text-slate-500 uppercase tracking-widest ml-1">Homepage Section</label>
              <select 
                name="homepageSection" 
                value={form.homepageSection} 
                onChange={handleChange} 
                className={`w-full px-5 py-3.5 border rounded-xl outline-none focus:ring-4 transition-all font-semibold text-sm appearance-none cursor-pointer ${
                  form.homepageSection === 'Popular Cakes' ? 'bg-[#FDF4FF] text-[#C026D3] border-[#F0ABFC] focus:ring-[#F0ABFC]/30' :
                  form.homepageSection === 'Popular Sweets' ? 'bg-[#ECFEFF] text-[#0891B2] border-[#67E8F9] focus:ring-[#67E8F9]/30' :
                  form.homepageSection === 'Gift Hampers' ? 'bg-[#FEFCE8] text-[#CA8A04] border-[#FDE047] focus:ring-[#FDE047]/30' :
                  'bg-slate-50/50 text-slate-800 border-slate-200 focus:border-gold focus:ring-gold/15'
                }`}
              >
                <option value="None" className="bg-white text-slate-700">None</option>
                <option value="Popular Cakes" className="bg-white text-slate-700">Popular Cakes</option>
                <option value="Popular Sweets" className="bg-white text-slate-700">Popular Sweets</option>
                <option value="Gift Hampers" className="bg-white text-slate-700">Gift Hampers</option>
              </select>
            </div>
          </div>

          {/*Product Image */}
          <div className="p-5 md:p-8 bg-slate-50 border border-slate-100 rounded-[24px] md:rounded-[36px]">
            <div className="flex items-center gap-3.5 mb-6">
              <div className="p-2.5 bg-gold/10 text-gold rounded-lg shadow-sm">
                <Image className="w-4.5 h-4.5" />
              </div>
              <h2 className="text-base md:text-lg font-black text-slate-900 tracking-tight uppercase">Product Image </h2>
            </div>

            <div className="space-y-6">
              <div
                onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-gold'); }}
                onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove('border-gold'); }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('border-gold');
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
            </div>
          </div>

          {/* Messages */}
          {errors.submit && (
            <div className="flex items-center gap-4 p-6 bg-[#FCE8E6] border border-[#F5C2C1] rounded-3xl text-[#C5221F] font-bold text-sm">
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
                className="w-full md:w-auto px-8 py-4 text-[10px] font-bold uppercase tracking-widest rounded-lg md:rounded-xl bg-[#FCE8E6] text-[#C5221F] border border-[#F5C2C1] hover:bg-[#FAD2CF] transition-all text-center shadow-sm flex items-center justify-center gap-2"
              >
                <X size={14} /> Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto flex items-center justify-center gap-3 px-8 md:px-10 py-4 bg-slate-900 text-white rounded-lg md:rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-gold transition-all duration-500 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Add Product
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