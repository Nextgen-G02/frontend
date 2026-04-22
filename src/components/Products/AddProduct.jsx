import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Package, 
  DollarSign, 
  Settings, 
  Camera, 
  CheckCircle2, 
  ChevronRight, 
  AlertCircle,
  Loader2
} from "lucide-react";
import { toast } from "react-hot-toast";

const API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api/products`;

export default function AddProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    productId: "",
    pName: "",
    pCategory: "",
    description: "",
    price: "",
    BuyPrice: "",
    stock: "",
    weight: "",
    pImg: "",
    stockStatus: "In Stock",
    isCustomizable: false,
    flavors: "",
    expiryDate: ""
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.productId) newErrors.productId = "SKU Identification required";
    if (!form.pName) newErrors.pName = "Asset name mandatory";
    if (!form.pCategory) newErrors.pCategory = "Taxonomy classification required";
    if (!form.price || form.price <= 0) newErrors.price = "Valid valuation required";
    if (!form.stock || form.stock < 0) newErrors.stock = "Inventory volume required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
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
      toast.error("Form validation requirements not met");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          BuyPrice: Number(form.BuyPrice),
          stock: Number(form.stock),
          weight: Number(form.weight),
          pImg: form.pImg ? [form.pImg] : []
        })
      });

      if (response.ok) {
        setSuccess(true);
        toast.success("Asset Committed to Catalog");
        setTimeout(() => navigate("/adminproduct"), 2000);
      } else {
        const errData = await response.json();
        setErrors({ submit: errData.message || "Registry entry failed" });
        toast.error("Failed to commit asset");
      }
    } catch (error) {
      setErrors({ submit: "Communication protocol error with master server" });
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
            <p className="text-primary font-black uppercase tracking-[0.4em] text-[10px]">Catalog Inventory protocols</p>
          </div>
          <h1 className="heading-premium text-2xl md:text-5xl leading-tight">Add New <span className="italic font-medium text-slate-400">Asset</span></h1>
          <p className="text-slate-400 font-medium mt-2 md:mt-3 text-sm md:text-base max-w-2xl">Define and register a new premium sweet into the master catalog.</p>
        </div>
      </header>

      <div className="glass-card bg-white rounded-[32px] md:rounded-[56px] border-none shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-slate-900"></div>
        
        <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8 md:space-y-10">
          {/* Section: Basic Info */}
          <div>
            <div className="flex items-center gap-3.5 mb-5 md:mb-6">
               <div className="p-2.5 bg-slate-900 text-gold rounded-lg shadow-lg"><Package className="w-4.5 h-4.5" /></div>
               <h2 className="text-base md:text-lg font-black text-slate-900 tracking-tight uppercase">Registry Definition</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Asset Identity (ID)</label>
                <input name="productId" value={form.productId} onChange={handleChange}
                  placeholder="e.g. SKU-100" className={inputClass("productId")} />
                {errors.productId && <p className="text-[9px] font-bold text-primary mt-1.5 ml-1">{errors.productId}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Asset Label (Name)</label>
                <input name="pName" value={form.pName} onChange={handleChange}
                  placeholder="e.g. Highland Chocolate Truffle" className={inputClass("pName")} />
                {errors.pName && <p className="text-[9px] font-bold text-primary mt-1.5 ml-1">{errors.pName}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Taxonomy (Category)</label>
                <select name="pCategory" value={form.pCategory} onChange={handleChange} className={inputClass("pCategory")}>
                  <option value="">Select Class</option>
                  <option>Cakes</option>
                  <option>Beverages</option>
                  <option>Pastries</option>
                  <option>Snacks</option>
                </select>
                {errors.pCategory && <p className="text-[9px] font-bold text-primary mt-1.5 ml-1">{errors.pCategory}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Degradation Threshold (Expiry)</label>
                <input type="date" name="expiryDate" value={form.expiryDate} onChange={handleChange}
                  className={inputClass("expiryDate")} />
              </div>
            </div>

            <div className="mt-6 space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Asset Scope (Description)</label>
              <textarea name="description" value={form.description} onChange={handleChange}
                rows={3} placeholder="Describe the characteristics of this asset..."
                className={`${inputClass("description")} resize-none`} />
              {errors.description && <p className="text-[9px] font-bold text-primary mt-1.5 ml-1">{errors.description}</p>}
            </div>
          </div>

          {/* Section: Valuation & Stock */}
          <div className="p-5 md:p-8 bg-slate-50/50 rounded-[24px] md:rounded-[36px] border border-slate-100">
            <div className="flex items-center gap-3.5 mb-5 md:mb-6">
               <div className="p-2.5 bg-white text-primary rounded-lg shadow-sm border border-slate-100"><DollarSign className="w-4.5 h-4.5" /></div>
               <h2 className="text-base md:text-lg font-black text-slate-900 tracking-tight uppercase">Valuation & Liquidity</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Yield Value (Rs.)</label>
                <input type="number" name="price" value={form.price} onChange={handleChange}
                  placeholder="0.00" className={inputClass("price")} />
                {errors.price && <p className="text-[9px] font-bold text-primary mt-1.5 ml-1">{errors.price}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Procurement Cost (Rs.)</label>
                <input type="number" name="BuyPrice" value={form.BuyPrice} onChange={handleChange}
                  placeholder="0.00" className={inputClass("BuyPrice")} />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Physical Mass (kg)</label>
                <input type="number" step="0.1" name="weight" value={form.weight} onChange={handleChange}
                  placeholder="0.0" className={inputClass("weight")} />
                {errors.weight && <p className="text-[9px] font-bold text-primary mt-1.5 ml-1">{errors.weight}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Inventory Volume (Units)</label>
                <input type="number" name="stock" value={form.stock} onChange={handleChange}
                  placeholder="0" className={inputClass("stock")} />
                {errors.stock && <p className="text-[9px] font-bold text-primary mt-1.5 ml-1">{errors.stock}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Availability State</label>
                <select name="stockStatus" value={form.stockStatus} onChange={handleChange} className={inputClass("stockStatus")}>
                  <option>In Stock</option>
                  <option>Out of Stock</option>
                  <option>Low Stock</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Section: Customization */}
          <div>
            <div className="flex items-center gap-3.5 mb-6">
               <div className="p-2.5 bg-slate-900 text-gold rounded-lg shadow-lg"><Settings className="w-4.5 h-4.5" /></div>
               <h2 className="text-base md:text-lg font-black text-slate-900 tracking-tight uppercase">Customization Protocols</h2>
            </div>
            
            <div className="space-y-6">
              <label className="flex items-center gap-4 p-6 bg-slate-50 border border-slate-100 rounded-3xl cursor-pointer hover:bg-white hover:shadow-xl transition-all group">
                <div className="relative flex items-center justify-center">
                  <input 
                    type="checkbox" 
                    name="isCustomizable" 
                    checked={form.isCustomizable} 
                    onChange={(e) => setForm({...form, isCustomizable: e.target.checked})}
                    className="w-8 h-8 rounded-xl border-2 border-slate-200 text-primary focus:ring-primary focus:ring-offset-0 transition-all checked:bg-primary appearance-none cursor-pointer" 
                  />
                  {form.isCustomizable && <CheckCircle2 className="absolute text-white w-5 h-5 pointer-events-none" />}
                </div>
                <div>
                   <p className="text-sm font-black text-slate-900 uppercase tracking-tight">Enable Modification Vectors</p>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Allow client-side attribute changes (e.g. messaging)</p>
                </div>
              </label>

              {form.isCustomizable && (
                <div className="space-y-2 animate-in slide-in-from-top-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Available Profiles (Comma-Separated Flavors)</label>
                  <input 
                    name="flavors" value={form.flavors} onChange={handleChange}
                    placeholder="Chocolate, Vanilla, Red Velvet..." className={inputClass("flavors")} />
                </div>
              )}
            </div>
          </div>

          {/* Section: Image */}
          <div>
            <div className="flex items-center gap-3.5 mb-6">
               <div className="p-2.5 bg-slate-900 text-gold rounded-lg shadow-lg"><Camera className="w-4.5 h-4.5" /></div>
               <h2 className="text-base md:text-lg font-black text-slate-900 tracking-tight uppercase">Visual Manifestation</h2>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8 items-start">
               <div className="flex-1 space-y-2 w-full">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Asset Asset Resource (URL)</label>
                 <input name="pImg" value={form.pImg} onChange={handleChange}
                   placeholder="https://resource-hub.com/image.jpg" className={inputClass("pImg")} />
               </div>
               
               {form.pImg && (
                 <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-white shadow-2xl shadow-slate-200 shrink-0 animate-in zoom-in">
                   <img src={form.pImg} alt="preview"
                     className="w-full h-full object-cover"
                     onError={(e) => (e.target.style.display = "none")} />
                 </div>
               )}
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
              Asset registration protocols successful. Redirecting...
            </div>
          )}

          {/* Footer actions */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 pt-8 border-t border-slate-100">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic md:leading-none text-center md:text-left">
              <span className="text-primary">*</span> Compulsory Registry Fields
            </p>
            <div className="flex flex-col sm:flex-row gap-4 md:gap-5 w-full md:w-auto">
              <button 
                type="button" 
                onClick={() => navigate("/adminproduct")}
                className="w-full md:w-auto px-8 py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-lg md:rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-all text-center"
              >
                Abort
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
                    Authorize Asset
                    <ChevronRight className="w-4 h-4" />
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