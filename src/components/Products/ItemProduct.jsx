import React, { useState, useEffect } from "react";

const ItemProduct = ({ searchParams }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/products/get", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          // body: JSON.stringify({
          //   search: searchParams?.search || "",
          //   category: searchParams?.category || "all"
          // }),
        });
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-6 px-6">
        Error: {error}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-6 px-6">
        No products found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6 mt-2">
      {products.map((product) => (
        <div
          key={product._id}
          className="w-full max-w-[260px] rounded-2xl shadow-md overflow-hidden bg-secondary font-sans hover:shadow-lg transition"
        >
          <img
            src={
              product.pImg?.[0] ||
              "https://images.unsplash.com/photo-1621303837174-89787a7d4729"
            }
            alt={product.pName}
            className="w-full h-[180px] object-cover"
          />

          <div className="p-4">
            <div className="flex justify-between items-center">
              {/* ✅ pName from schema */}
              <h3 className="text-[18px] font-semibold">{product.pName}</h3>
              {/* ✅ pCategory from schema */}
              <span className="text-xs px-2 py-1 rounded bg-primary text-gray-700">
                {product.pCategory}
              </span>
            </div>

            <p className="text-sm text-gray-500 mt-2">{product.description}</p>

            <div className="flex justify-between items-center mt-3 mb-3">
              {/* ✅ price from schema */}
              <span className="text-black font-bold text-lg">
                Rs.{product.price?.toFixed(2)}
              </span>
              {/* ✅ stock + stockStatus from schema */}
              <span className={`text-xs font-medium ${
                  product.stockStatus === "In Stock"
                    ? "text-green-500"
                    : product.stockStatus === "Low Stock"
                    ? "text-yellow-500"
                    : "text-red-500"
                }`}>
                {product.stockStatus} ({product.stock})
              </span>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 border border-gray-300 rounded-md py-2 text-sm hover:bg-gray-100 transition">
                View Details
              </button>
              <button className="flex-1 bg-accent text-white rounded-md py-2 text-sm hover:opacity-90 transition">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItemProduct;