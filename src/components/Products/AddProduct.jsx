import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5000/api/products";

const INITIAL_FORM = {
  productId: "",
  pName: "",
  pCategory: "",
  description: "",
  pImg: "",
  weight: "",
  expiryDate: "",
  price: "",
  BuyPrice: "",
  stock: "",
  stockStatus: "In Stock",
};

export default function AddProduct() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const required = ["productId", "pName", "pCategory", "description", "price", "weight", "stock"];
    const newErrors = {};
    required.forEach((key) => {
      if (!form[key]) newErrors[key] = "This field is required";
    });
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        BuyPrice: Number(form.BuyPrice) || 0,
        weight: Number(form.weight),
        stock: Number(form.stock),
        pImg: form.pImg ? [form.pImg] : [],
      };

      const res = await fetch(`${API_BASE}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to add product");

      setSuccess(true);
      setForm(INITIAL_FORM);
      setTimeout(() => navigate("/adminproduct"), 1500);
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (key) =>
    `w-full px-3 py-2 text-sm rounded-lg border outline-none transition-all duration-150
    ${errors[key]
      ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
      : "border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
    } bg-white text-gray-900`;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">

        {/* Card */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">

          {/* Header */}
          <div className="flex items-center gap-3 px-6 py-5" style={{ background: "#ff14c0" }}>
            <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 3H8a2 2 0 00-2 2v2h12V5a2 2 0 00-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-white font-semibold text-base">Add New Product</h1>
              <p className="text-white/75 text-xs mt-0.5">Fill in the details to add a product to your store</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">

            {/* Section: Basic Info */}
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-pink-700 mb-3 pb-2 border-b border-pink-100">
                Basic Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Product ID <span className="text-pink-500">*</span>
                  </label>
                  <input name="productId" value={form.productId} onChange={handleChange}
                    placeholder="e.g. P003" className={inputClass("productId")} />
                  {errors.productId && <p className="text-xs text-red-500 mt-1">{errors.productId}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Product Name <span className="text-pink-500">*</span>
                  </label>
                  <input name="pName" value={form.pName} onChange={handleChange}
                    placeholder="e.g. Chocolate Cake" className={inputClass("pName")} />
                  {errors.pName && <p className="text-xs text-red-500 mt-1">{errors.pName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Category <span className="text-pink-500">*</span>
                  </label>
                  <select name="pCategory" value={form.pCategory} onChange={handleChange} className={inputClass("pCategory")}>
                    <option value="">Select category</option>
                    <option>Cakes</option>
                    <option>Beverages</option>
                    <option>Pastries</option>
                    <option>Snacks</option>
                  </select>
                  {errors.pCategory && <p className="text-xs text-red-500 mt-1">{errors.pCategory}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Expiry Date
                  </label>
                  <input type="date" name="expiryDate" value={form.expiryDate} onChange={handleChange}
                    className={inputClass("expiryDate")} />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Description <span className="text-pink-500">*</span>
                </label>
                <textarea name="description" value={form.description} onChange={handleChange}
                  rows={3} placeholder="Write a short product description..."
                  className={inputClass("description")} />
                {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
              </div>
            </div>

            {/* Section: Pricing & Inventory */}
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-pink-700 mb-3 pb-2 border-b border-pink-100">
                Pricing & Inventory
              </h2>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Price (Rs.) <span className="text-pink-500">*</span>
                  </label>
                  <input type="number" name="price" value={form.price} onChange={handleChange}
                    placeholder="0.00" className={inputClass("price")} />
                  {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Buy Price (Rs.)
                  </label>
                  <input type="number" name="BuyPrice" value={form.BuyPrice} onChange={handleChange}
                    placeholder="0.00" className={inputClass("BuyPrice")} />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Weight (kg) <span className="text-pink-500">*</span>
                  </label>
                  <input type="number" step="0.1" name="weight" value={form.weight} onChange={handleChange}
                    placeholder="0.0" className={inputClass("weight")} />
                  {errors.weight && <p className="text-xs text-red-500 mt-1">{errors.weight}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Stock Qty <span className="text-pink-500">*</span>
                  </label>
                  <input type="number" name="stock" value={form.stock} onChange={handleChange}
                    placeholder="0" className={inputClass("stock")} />
                  {errors.stock && <p className="text-xs text-red-500 mt-1">{errors.stock}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Stock Status
                  </label>
                  <select name="stockStatus" value={form.stockStatus} onChange={handleChange} className={inputClass("stockStatus")}>
                    <option>In Stock</option>
                    <option>Out of Stock</option>
                    <option>Low Stock</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section: Image */}
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-pink-700 mb-3 pb-2 border-b border-pink-100">
                Product Image
              </h2>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Image URL <span className="text-gray-400 font-normal normal-case tracking-normal">optional</span>
              </label>
              <input name="pImg" value={form.pImg} onChange={handleChange}
                placeholder="https://example.com/image.jpg" className={inputClass("pImg")} />
              {form.pImg && (
                <img src={form.pImg} alt="preview"
                  className="mt-3 w-16 h-16 rounded-lg object-cover border border-pink-100"
                  onError={(e) => (e.target.style.display = "none")} />
              )}
            </div>

            {/* Submit error */}
            {errors.submit && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/><path strokeLinecap="round" d="M12 8v4m0 4h.01"/>
                </svg>
                {errors.submit}
              </div>
            )}

            {/* Success message */}
            {success && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
                Product added successfully! Redirecting...
              </div>
            )}

            {/* Footer actions */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <p className="text-xs text-pink-600">
                Fields marked <span className="text-pink-500 font-bold">*</span> are required
              </p>
              <div className="flex gap-3">
                <button type="button" onClick={() => navigate("/adminproduct")}
                  className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 bg-white hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={loading}
                  className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white rounded-lg transition-colors disabled:opacity-60"
                  style={{ background: loading ? "#e879c0" : "#ff14c0" }}>
                  {loading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/>
                        <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                      </svg>
                      Save Product
                    </>
                  )}
                </button>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}