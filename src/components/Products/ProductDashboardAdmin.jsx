import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5000/api/products";

export default function ProductDashboardAdmin() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [search, setSearch] = useState("");
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/get`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_BASE}/delete/${id}`, { method: "DELETE" });
      setProducts((prev) => prev.filter((p) => p._id !== id));
      setDeleteId(null);
    } catch {
      alert("Delete failed");
    }
  };

  const handleEditOpen = (product) => {
    setEditProduct(product);
    setEditForm({ ...product });
  };

  const handleEditSave = async () => {
    try {
      const res = await fetch(`${API_BASE}/update/${editProduct._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const updated = await res.json();
      setProducts((prev) =>
        prev.map((p) => (p._id === updated._id ? updated : p))
      );
      setEditProduct(null);
    } catch {
      alert("Update failed");
    }
  };

  const filtered = products.filter(
    (p) =>
      p.pName?.toLowerCase().includes(search.toLowerCase()) ||
      p.productId?.toLowerCase().includes(search.toLowerCase()) ||
      p.pCategory?.toLowerCase().includes(search.toLowerCase())
  );

  const stockColor = (stock) => {
    if (stock <= 3) return "text-red-500";
    if (stock <= 6) return "text-amber-500";
    return "text-emerald-500";
  };

  return (
    <div className="min-h-screen p-6 font-sans" style={{ background: "#fdf2f9" }}>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#2d0020" }}>Product Dashboard</h1>
          <p className="text-sm mt-1" style={{ color: "#b07090" }}>{products.length} products in database</p>
        </div>
        <input
          type="text"
          placeholder="Search by name, ID, category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-72 px-4 py-2 rounded-lg text-sm outline-none"
          style={{
            background: "#ffffff",
            border: "1.5px solid #f0c0e0",
            color: "#2d0020",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#ff14c0";
            e.target.style.boxShadow = "0 0 0 3px #ff14c020";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#f0c0e0";
            e.target.style.boxShadow = "none";
          }}
        />
      </div>

      {/* Table Card */}
      <div
        className="rounded-xl overflow-x-auto"
        style={{ background: "#ffffff", border: "1px solid #f0c0e0" }}
      >
        {loading ? (
          <div className="text-center py-16 text-sm" style={{ color: "#b07090" }}>Loading products...</div>
        ) : error ? (
          <div className="text-center py-16 text-sm text-red-500">{error}</div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead>
              <tr style={{ background: "#ff14c0" }}>
                {["Image","Product ID","Name","Price","Category","Stock","Availability","Action"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-4 font-semibold whitespace-nowrap text-xs uppercase tracking-wide"
                    style={{ color: "#ffffff" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={11} className="text-center py-12" style={{ color: "#b07090" }}>
                    No products found
                  </td>
                </tr>
              ) : (
                filtered.map((p, i) => (
                  <tr
                    key={p._id}
                    style={{
                      borderBottom: "1px solid #fde8f7",
                      background: i % 2 === 0 ? "#ffffff" : "#fdf0fb",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#ffe0f7")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 0 ? "#ffffff" : "#fdf0fb")}
                  >
                    {/* Image */}
                    <td className="px-4 py-3">
                      {p.pImg && p.pImg[0] ? (
                        <img
                          src={p.pImg[0]}
                          alt={p.pName}
                          className="w-12 h-12 rounded-lg object-cover"
                          style={{ border: "1.5px solid #f0c0e0" }}
                          onError={(e) => {
                             e.target.style.display = "none";           // ✅ hide broken image
                             e.target.nextSibling.style.display = "flex"; // ✅ show fallback div
                            }}
                        />
                      ) :  null}
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center"
                          style={{ 
                            background: "#ffe0f7", 
                            color: "#b07090",
                            display: p.pImg && p.pImg[0] ? "none" : "flex", 
                          }}
                        >
                          <svg width="20" height="20" fill="none" stroke="#b07090" strokeWidth={1.5} viewBox="0 0 24 24">
                             <rect x="3" y="3" width="18" height="18" rx="3"/>
                             <circle cx="8.5" cy="8.5" r="1.5"/>
                             <path strokeLinecap="round" strokeLinejoin="round" d="M21 15l-5-5L5 21"/>
                          </svg>
                        </div>
                    </td>

                    {/* Product ID */}
                    <td className="px-4 py-3 font-mono text-xs whitespace-nowrap" style={{ color: "#b07090" }}>
                      {p.productId}
                    </td>

                    {/* Name */}
                    <td className="px-4 py-3 font-semibold whitespace-nowrap" style={{ color: "#2d0020" }}>
                      {p.pName}
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3 font-bold whitespace-nowrap" style={{ color: "#ff1493" }}>
                      Rs.{p.price?.toLocaleString()}
                    </td>


                    {/* Category */}
                    <td className="px-4 py-3">
                      <span
                        className="text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap"
                        style={{ background: "#ffe0f7", color: "#cc0099" }}
                      >
                        {p.pCategory}
                      </span>
                    </td>


                    {/* Stock */}
                    <td className={`px-4 py-3 font-bold whitespace-nowrap ${stockColor(p.stock)}`}>
                      {p.stock}
                    </td>

                    {/* Availability */}
                    <td className="px-4 py-3">
                      <span
                        className="text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap"
                        style={
                          p.stockStatus === "In Stock"
                            ? { background: "#e6f9f0", color: "#0d7a4e" }
                            : { background: "#fdecea", color: "#c0392b" }
                        }
                      >
                        {p.stockStatus}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setDeleteId(p._id)}
                          className="p-2 rounded-lg transition-colors"
                          style={{ color: "#e00055", background: "transparent" }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "#ffe0f0")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                          title="Delete"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleEditOpen(p)}
                          className="p-2 rounded-lg transition-colors"
                          style={{ color: "#7c3aed", background: "transparent" }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "#f3e8ff")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                          title="Edit"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Floating Add Button */}
      <button onClick={() => navigate("/addproduct")}
      className="fixed bottom-8 right-8 w-14 h-14 text-white text-3xl rounded-full flex items-center justify-center active:scale-95 transition-all"
      style={{
        background: "#ff14c0",
        boxShadow: "0 4px 20px #ff14c055",
      }}
  onMouseEnter={(e) => (e.currentTarget.style.background = "#cc0099")}
  onMouseLeave={(e) => (e.currentTarget.style.background = "#ff14c0")}
  title="Add Product"
>
  +
</button>
      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: "rgba(0,0,0,0.45)" }}>
          <div className="rounded-2xl p-7 w-full max-w-sm" style={{ background: "#ffffff", boxShadow: "0 8px 40px #ff14c020" }}>
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "#ffe0f7" }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#e00055" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
              </div>
              <h3 className="text-base font-bold" style={{ color: "#2d0020" }}>Delete Product</h3>
            </div>
            <p className="text-sm mb-6 ml-13" style={{ color: "#b07090" }}>
              Are you sure? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-lg text-sm transition-colors"
                style={{ border: "1.5px solid #f0c0e0", color: "#7a3a6a", background: "transparent" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#fdf2f9")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 rounded-lg text-white text-sm font-semibold transition-colors"
                style={{ background: "#e00055" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#b0003a")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#e00055")}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editProduct && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: "rgba(0,0,0,0.45)" }}>
          <div className="rounded-2xl p-7 w-full max-w-md" style={{ background: "#ffffff", boxShadow: "0 8px 40px #ff14c020" }}>
            <h3 className="text-base font-bold mb-5" style={{ color: "#2d0020" }}>Edit Product</h3>
            <div className="space-y-4">
              {[
                { label: "Product Name", key: "pName" },
                { label: "Category", key: "pCategory" },
                { label: "Price", key: "price", type: "number" },
                { label: "Stock", key: "stock", type: "number" },
                { label: "Description", key: "description" },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "#7a3a6a" }}>{label}</label>
                  <input
                    type={type || "text"}
                    value={editForm[key] || ""}
                    onChange={(e) =>
                      setEditForm((f) => ({
                        ...f,
                        [key]: type === "number" ? Number(e.target.value) : e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none transition"
                    style={{
                      border: "1.5px solid #f0c0e0",
                      color: "#2d0020",
                      background: "#ffffff",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#ff14c0";
                      e.target.style.boxShadow = "0 0 0 3px #ff14c015";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#f0c0e0";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: "#7a3a6a" }}>Stock Status</label>
                <select
                  value={editForm.stockStatus || "In Stock"}
                  onChange={(e) => setEditForm((f) => ({ ...f, stockStatus: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none transition"
                  style={{
                    border: "1.5px solid #f0c0e0",
                    color: "#2d0020",
                    background: "#ffffff",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#ff14c0";
                    e.target.style.boxShadow = "0 0 0 3px #ff14c015";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#f0c0e0";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  <option>In Stock</option>
                  <option>Out of Stock</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => setEditProduct(null)}
                className="px-4 py-2 rounded-lg text-sm transition-colors"
                style={{ border: "1.5px solid #f0c0e0", color: "#7a3a6a", background: "transparent" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#fdf2f9")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="px-4 py-2 rounded-lg text-white text-sm font-semibold transition-colors"
                style={{ background: "#ff14c0" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#cc0099")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#ff14c0")}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}