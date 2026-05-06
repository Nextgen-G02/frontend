import React, { useState, useEffect } from 'react'

const SearchProduct = ({ setSearchParams }) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/categories/`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
          const data = await response.json();
          setCategories(data.data || data);
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

  return (
    <div className="bg-white p-6 md:p-10 rounded-[24px] md:rounded-[32px] shadow-md border border-slate-100 max-w-full mx-auto mt-2 mb-8 transition-all duration-300">
      <div className="flex flex-col md:flex-row gap-8 items-center justify-between">

        <div className="flex flex-col w-full">
          <label htmlFor="search" className="text-slate-500 font-black uppercase text-[15px] tracking-widest mb-3 ml-2">Search Products</label>
          <div className="relative">
            <input
              type="text"
              id="search"
              value={search}
              onChange={handleSearchChange}
              placeholder="Query catalog..."
              className="w-full pl-6 pr-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 text-slate-900 font-bold text-sm md:text-base focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all placeholder:text-slate-300 shadow-inner"
            />
          </div>
        </div>

        <div className="flex flex-col w-full">
          <label htmlFor="Category" className="text-slate-500 font-black uppercase text-[15px] tracking-widest mb-3 ml-2">Filter Category</label>
          <div className="relative">
            <select
              id="Category"
              value={category}
              onChange={handleCategoryChange}
              className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 text-slate-900 font-black text-sm md:text-base uppercase tracking-tighter focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all appearance-none cursor-pointer shadow-inner"
            >
              <option value="all">All Modules</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default SearchProduct