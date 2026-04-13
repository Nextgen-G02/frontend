// components/ProductScroller.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ProductScroller({
  title = "Popular Items",
  category = "cakes",
  bgColor = "#d6cfc7",
}) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_BACKEND_URL + `/api/products/category/${category}`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  }, [category]);

  return (
    <section
      className="py-10"
      style={{ backgroundColor: bgColor }}
    >
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-center w-full">
            {title}
          </h2>
        </div>

        {/* Horizontal Scroll */}
        <div className="overflow-x-auto">
          <div className="flex gap-6 min-w-max">

            {products.map((p) => (
              <div
                key={p._id}
                className="w-[180px] flex-shrink-0 text-center"
              >
                <img
                  src={p.pImg[0]}
                  alt={p.pName}
                  className="w-full h-[150px] object-cover rounded-md"
                />

                <h3 className="text-sm font-medium mt-2">
                  {p.pName}
                </h3>

                <p className="text-sm font-semibold">
                  Rs. {p.price}
                </p>

                <button className="mt-2 bg-[#c89b6d] text-white text-xs px-3 py-1 rounded">
                  Add to cart
                </button>
              </div>
            ))}

          </div>
        </div>

      </div>
    </section>
  );
}