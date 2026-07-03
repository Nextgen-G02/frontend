import React, { useState, useEffect } from 'react'

const SearchProduct = ({ setSearchParams }) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [categories, setCategories] = useState([]);
  const maxLimit = 50000;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/categories`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
          const data = await response.json();
          const allCategories = data.data || data;
          const activeCategories = allCategories.filter(cat => cat.status !== 'Inactive');
          setCategories(activeCategories);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setSearchParams((prev) => ({ ...prev, search: e.target.value }));
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setSearchParams((prev) => ({ ...prev, category: e.target.value }));
  };

  const handleKeyDown = (e) => {
    if (e.key === '-' || e.key === 'e' || e.key === '+') {
      e.preventDefault();
    }
  };

  const handleMinPriceChange = (e) => {
    let val = e.target.value;
    if (val !== "") {
      const num = Number(val);
      if (num < 0) val = "0";
    }
    setMinPrice(val);
    setSearchParams((prev) => ({ ...prev, minPrice: val }));
  };

  const handleMaxPriceChange = (e) => {
    let val = e.target.value;
    if (val !== "") {
      const num = Number(val);
      if (num < 0) val = "0";
    }
    setMaxPrice(val);
    setSearchParams((prev) => ({ ...prev, maxPrice: val }));
  };

  // Piecewise mapping for price range slider to optimize 0 - 5000 range.
  // 0% - 50% maps to Rs. 0 - Rs. 5,000 (Rs. 100 per 1% step)
  // 50% - 100% maps to Rs. 5,000 - Rs. 50,000 (Rs. 900 per 1% step)
  const priceToPosition = (price) => {
    const p = Math.max(0, Math.min(Number(price || 0), maxLimit));
    if (p <= 5000) {
      return (p / 5000) * 50;
    } else {
      return 50 + ((p - 5000) / 45000) * 50;
    }
  };

  const positionToPrice = (position) => {
    const pos = Number(position);
    if (pos <= 50) {
      return Math.round((pos / 50) * 5000);
    } else {
      return Math.round(5000 + ((pos - 50) / 50) * 45000);
    }
  };

  const sliderMin = minPrice === "" ? 0 : Number(minPrice);
  const sliderMax = maxPrice === "" ? maxLimit : Number(maxPrice);

  const handleSliderMinChange = (e) => {
    const pos = Number(e.target.value);
    const val = positionToPrice(pos);
    const currentMaxVal = maxPrice === "" ? maxLimit : Number(maxPrice);
    if (val >= currentMaxVal) return;
    
    setMinPrice(val.toString());
    setSearchParams((prev) => ({ ...prev, minPrice: val.toString() }));
  };

  const handleSliderMaxChange = (e) => {
    const pos = Number(e.target.value);
    const val = positionToPrice(pos);
    const currentMinVal = minPrice === "" ? 0 : Number(minPrice);
    if (val <= currentMinVal) return;
    
    setMaxPrice(val.toString());
    setSearchParams((prev) => ({ ...prev, maxPrice: val.toString() }));
  };

  return (
    <div className="bg-slate-50/70 backdrop-blur-sm p-6 md:p-8 pt-8 pb-10 md:pt-10 md:pb-14 rounded-[24px] md:rounded-[32px] shadow-lg border-2 border-gold/15 border-t-gold border-t-[6px] transition-all duration-300 min-h-[480px] md:min-h-[580px] flex flex-col gap-8 md:gap-10">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gold"><path d="M4 21v-7" /><path d="M4 10V3" /><path d="M12 21v-9" /><path d="M12 8V3" /><path d="M20 21v-5" /><path d="M20 12V3" /><path d="M2 14h4" /><path d="M10 8h4" /><path d="M18 16h4" /></svg>
          <h2 className="text-slate-800 font-extrabold uppercase text-sm md:text-base tracking-wider">Filters</h2>
        </div>
        {(search || category !== 'all' || minPrice || maxPrice) && (
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setCategory('all');
              setMinPrice('');
              setMaxPrice('');
              setSearchParams({
                search: '',
                category: 'all',
                minPrice: '',
                maxPrice: ''
              });
            }}
            className="text-xs md:text-sm font-bold uppercase tracking-wider text-gold/80 hover:text-gold transition-all duration-300 hover:underline underline-offset-4 cursor-pointer"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Search */}
      <div className="flex flex-col">
        <label htmlFor="search" className="text-slate-700 font-normal uppercase text-xs md:text-sm tracking-wide mb-2.5 ml-1">Search Products</label>
        <div className="relative">
          <input
            type="text"
            id="search"
            value={search}
            onChange={handleSearchChange}
            placeholder="Query catalog..."
            className="w-full pl-5 pr-5 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-800 font-semibold text-sm md:text-base focus:outline-none focus:ring-4 focus:ring-gold/15 focus:border-gold transition-all placeholder:text-slate-400 shadow-sm"
          />
        </div>
      </div>

      {/* Category */}
      <div className="flex flex-col">
        <label htmlFor="Category" className="text-slate-700 font-normal uppercase text-xs md:text-sm tracking-wide mb-2.5 ml-1">Filter Category</label>
        <div className="relative">
          <select
            id="Category"
            value={category}
            onChange={handleCategoryChange}
            className="w-full pl-5 pr-10 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-800 font-semibold text-sm md:text-base focus:outline-none focus:ring-4 focus:ring-gold/15 focus:border-gold transition-all appearance-none cursor-pointer shadow-sm"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
          <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
          </div>
        </div>
      </div>

      {/* Price Filter Slider & Inputs */}
      <div className="flex flex-col gap-2">
        <label className="text-slate-700 font-normal uppercase text-xs md:text-sm tracking-wide mb-1 ml-1">Price Filter</label>
        
        {/* Double Range Slider Track */}
        <div className="relative w-full px-1.5 my-4">
          <div className="relative w-full h-1.5 bg-slate-100 rounded-full border border-slate-200">
            {/* Highlighted Selected Range */}
            <div
              className="absolute h-full bg-gold rounded-full transition-all"
              style={{
                left: `${priceToPosition(sliderMin)}%`,
                right: `${100 - priceToPosition(sliderMax)}%`
              }}
            ></div>
            
            {/* Min Input range */}
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={priceToPosition(sliderMin)}
              onChange={handleSliderMinChange}
              className="absolute inset-0 pointer-events-none appearance-none z-20 w-full h-full bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-gold [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-gold [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:shadow-md [&::-webkit-slider-runnable-track]:bg-transparent [&::-moz-range-track]:bg-transparent"
            />

            {/* Max Input range */}
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={priceToPosition(sliderMax)}
              onChange={handleSliderMaxChange}
              className="absolute inset-0 pointer-events-none appearance-none z-20 w-full h-full bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-gold [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-gold [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:shadow-md [&::-webkit-slider-runnable-track]:bg-transparent [&::-moz-range-track]:bg-transparent"
            />
          </div>
        </div>

        {/* Min/Max Manual Input Row */}
        <div className="flex items-center gap-2 mt-1">
          <input
            type="number"
            value={minPrice}
            onChange={handleMinPriceChange}
            onKeyDown={handleKeyDown}
            onWheel={(e) => e.target.blur()}
            placeholder="Min"
            min="0"
            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-800 font-semibold text-sm md:text-base focus:outline-none focus:ring-4 focus:ring-gold/15 focus:border-gold transition-all placeholder:text-slate-400 shadow-sm"
          />
          <span className="text-slate-400 font-bold text-sm">-</span>
          <input
            type="number"
            value={maxPrice}
            onChange={handleMaxPriceChange}
            onKeyDown={handleKeyDown}
            onWheel={(e) => e.target.blur()}
            placeholder="Max"
            min="0"
            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-800 font-semibold text-sm md:text-base focus:outline-none focus:ring-4 focus:ring-gold/15 focus:border-gold transition-all placeholder:text-slate-400 shadow-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchProduct;