import React from "react";

const ItemProduct = () => {
  return (
    <div className="w-[260px] rounded-xl shadow-md overflow-hidden bg-secondary font-sans hover:shadow-lg transition ">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-6 mt-6">
        <img
          src="https://images.unsplash.com/photo-1621303837174-89787a7d4729" alt="product" className="w-full h-[180px] object-cover" />

        <div className="p-4">

          <div className="flex justify-between items-center">
            <h3 className="text-[16px] font-semibold">
              stawberry cake
            </h3>

            <span className="text-xs px-2 py-1 rounded bg-primary text-gray-700">
              bento cake
            </span>
          </div>

          <p className="text-sm text-gray-500 mt-2">
            High-quality wireless headphones with noise cancellation and long
            battery life.
          </p>

          <div className="flex justify-between items-center mt-3 mb-3">
            <span className="text-accent font-bold text-lg">
              RS.1200.00
            </span>

            <span className="text-xs text-gray-500">
              Stock: 10
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
    </div>
  );
};

export default ItemProduct;