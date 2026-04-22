import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ProductScroller({
  title = "Design Cakes",
  category = "cakes",
  bgColor = "#d6cfc7",
}) {
  const [products, setProducts] = useState([]);
  const [startIndex, setStartIndex] = useState(0);

  const itemsPerPage = 4;

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/products/category/${category}`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  }, [category]);

  const next = () => {
    if (startIndex + itemsPerPage < products.length) {
      setStartIndex(startIndex + itemsPerPage);
    }
  };

  const prev = () => {
    if (startIndex - itemsPerPage >= 0) {
      setStartIndex(startIndex - itemsPerPage);
    }
  };

  const visibleProducts = products.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <section className="py-14" style={{ backgroundColor: bgColor }}>
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-10 relative">
          <h2 className="text-3xl font-semibold mx-auto">
            {title}
          </h2>

          <span className="absolute right-0 text-sm text-orange-500 cursor-pointer">
            View All →
          </span>
        </div>

        {/* Carousel Wrapper */}
        <div className="relative">

          {/* LEFT BUTTON */}
          <button
            onClick={prev}
            disabled={startIndex === 0}
            className="absolute -left-5 top-1/2 -translate-y-1/2 bg-white shadow-md w-10 h-10 rounded-full z-10 hover:bg-gray-100 disabled:opacity-30"
          >
            ‹
          </button>

          {/* PRODUCTS GRID */}
          <div className="grid grid-cols-4 gap-10  ">
            {visibleProducts.map((p) => (
              <div key={p._id} className="text-center group">

                {/* Image */}
                <div className="overflow-hidden rounded-md">
                  <img
                    src={p.pImg[0]}
                    alt={p.pName}
                    className="w-full h-[260px] object-cover transition-transform duration-500 group-hover:scale-105 "
                  />
                </div>

                {/* Title */}
                <h3 className="text-sm mt-4 text-gray-800">
                  {p.pName}
                </h3>

                {/* Price */}
                <p className="text-sm font-semibold mt-1">
                  Rs. {p.price}
                </p>

                {/* Button */}
                <button className="mt-3 bg-[#c89b6d] text-white text-xs px-4 py-2 rounded-md hover:opacity-90 transition">
                  Select options
                </button>

              </div>
            ))}
          </div>

          {/* RIGHT BUTTON */}
          <button
            onClick={next}
            disabled={startIndex + itemsPerPage >= products.length}
            className="absolute -right-5 top-1/2 -translate-y-1/2 bg-white shadow-md w-10 h-10 rounded-full z-10 hover:bg-gray-100 disabled:opacity-30"
          >
            ›
          </button>

        </div>

      </div>
    </section>
  );
}