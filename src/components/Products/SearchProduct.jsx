import React, { useState } from 'react'

const SearchProduct = ({setSearchParams }) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');


  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setSearchParams((prev) => ({ ...prev, search: e.target.value }));
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setSearchParams((prev) => ({ ...prev, category: e.target.value }));
  };

  return (
     <div className="bg-white p-6 rounded-4xl shadow-md max-w-8xl mx-auto mt-1">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">

        <div className="flex flex-col w-full">
          <label htmlFor="search" className="text-accent font-semibold mb-1 text-[17px] ">Search</label>
          <input type="text" id="search" value={search} onChange={handleSearchChange} placeholder="Search cakes..." className="p-2 rounded-lg border border-accent bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-accent" />
        </div>

        <div className="flex flex-col w-full">
          <label htmlFor="Category" className="text-accent font-semibold mb-1 text-[17px]">Category</label>
          <select id="Category" value={category} onChange={handleCategoryChange} className="p-2 rounded-lg border border-accent bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-accent">
            <option value="all">All</option>
            <option value="bento_cake">Bento Cake</option>
            <option value="Birthday_cake">Birthday Cake</option>
            <option value="Wedding_cake">Wedding Cake</option>
            <option value="Cup_cake">Cup Cake</option>
          </select>
        </div>
     
      </div>
   </div>
  )
}

export default SearchProduct