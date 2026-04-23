import React, { useState } from 'react'

const SearchProduct = ({setSearchParams }) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

//setSearchParams((prev) => ({ ...prev, search: search, category: category }));
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setSearchParams((prev) => ({ ...prev, search: e.target.value }));
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setSearchParams((prev) => ({ ...prev, category: e.target.value }));
  };

  return (
     <div className="bg-white p-4 md:p-5 rounded-2xl md:rounded-[24px] shadow-sm border border-slate-100 max-w-full mx-auto mt-1 mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">

        <div className="flex flex-col w-full">
          <label htmlFor="search" className="text-slate-400 font-black uppercase text-[9px] tracking-widest mb-1.5 ml-1">Search Feed</label>
          <div className="relative">
            <input 
              type="text" 
              id="search" 
              value={search} 
              onChange={handleSearchChange} 
              placeholder="Query catalog..." 
              className="w-full pl-4 pr-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50/50 text-slate-900 font-bold text-xs focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all placeholder:text-slate-200" 
            />
          </div>
        </div>

        <div className="flex flex-col w-full">
          <label htmlFor="Category" className="text-slate-400 font-black uppercase text-[9px] tracking-widest mb-1.5 ml-1">Filter Taxonomy</label>
          <select 
            id="Category" 
            value={category} 
            onChange={handleCategoryChange} 
            className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50/50 text-slate-900 font-black text-[11px] uppercase tracking-tighter focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all appearance-none cursor-pointer"
          >
            <option value="all">All Modules</option>
            <option value="bento_cake">Bento Units</option>
            <option value="Birthday_cake">Birthday Matrix</option>
            <option value="Wedding_cake">Wedding Protocol</option>
            <option value="Cup_cake">Cupcake Batches</option>
          </select>
        </div>
     
      </div>
   </div>
  )
}

export default SearchProduct