import React, { useState, useEffect } from 'react'

const SearchProduct = ({ setSearchParams }) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [categories, setCategories] = useState([]);

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

  const handleMinPriceChange = (e) => {
    const val = e.target.value;
    setMinPrice(val);
    setSearchParams((prev) => ({ ...prev, minPrice: val }));
  };

  const handleMaxPriceChange = (e) => {
    const val = e.target.value;
    setMaxPrice(val);
    setSearchParams((prev) => ({ ...prev, maxPrice: val }));
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

      {/* Price Range */}
      <div className="flex flex-col">
        <label className="text-slate-700 font-normal uppercase text-xs md:text-sm tracking-wide mb-2.5 ml-1">Price Range (Rs.)</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={minPrice}
            onChange={handleMinPriceChange}
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