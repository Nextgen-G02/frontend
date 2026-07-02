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
    <div className="bg-white p-6 md:p-8 rounded-[24px] md:rounded-[32px] shadow-lg border border-slate-50 transition-all duration-300 h-fit">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary"><path d="M4 21v-7"/><path d="M4 10V3"/><path d="M12 21v-9"/><path d="M12 8V3"/><path d="M20 21v-5"/><path d="M20 12V3"/><path d="M2 14h4"/><path d="M10 8h4"/><path d="M18 16h4"/></svg>
            <h2 className="text-slate-900 font-black uppercase text-xs tracking-widest">Filters</h2>
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
              className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors cursor-pointer"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Search */}
        <div className="flex flex-col">
          <label htmlFor="search" className="text-slate-500 font-black uppercase text-[11px] tracking-widest mb-2.5 ml-1">Search Products</label>
          <div className="relative">
            <input
              type="text"
              id="search"
              value={search}
              onChange={handleSearchChange}
              placeholder="Query catalog..."
              className="w-full pl-5 pr-5 py-3.5 rounded-xl border border-slate-100 bg-slate-50/50 text-slate-900 font-bold text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all placeholder:text-slate-300 shadow-inner"
            />
          </div>
        </div>

        {/* Category */}
        <div className="flex flex-col">
          <label htmlFor="Category" className="text-slate-500 font-black uppercase text-[11px] tracking-widest mb-2.5 ml-1">Filter Category</label>
          <div className="relative">
            <select
              id="Category"
              value={category}
              onChange={handleCategoryChange}
              className="w-full px-5 py-3.5 rounded-xl border border-slate-100 bg-slate-50/50 text-slate-900 font-black text-[11px] uppercase tracking-wider focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all appearance-none cursor-pointer shadow-inner"
            >
              <option value="all">All Modules</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
        </div>

        {/* Price Range */}
        <div className="flex flex-col">
          <label className="text-slate-500 font-black uppercase text-[11px] tracking-widest mb-2.5 ml-1">Price Range (Rs.)</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={minPrice}
              onChange={handleMinPriceChange}
              onWheel={(e) => e.target.blur()}
              placeholder="Min"
              min="0"
              className="w-full px-4 py-3.5 rounded-xl border border-slate-100 bg-slate-50/50 text-slate-900 font-bold text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all placeholder:text-slate-300 shadow-inner"
            />
            <span className="text-slate-300 font-bold text-sm">-</span>
            <input
              type="number"
              value={maxPrice}
              onChange={handleMaxPriceChange}
              onWheel={(e) => e.target.blur()}
              placeholder="Max"
              min="0"
              className="w-full px-4 py-3.5 rounded-xl border border-slate-100 bg-slate-50/50 text-slate-900 font-bold text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all placeholder:text-slate-300 shadow-inner"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default SearchProduct;