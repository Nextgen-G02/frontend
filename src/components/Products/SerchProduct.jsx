import React from 'react'

const SearchProduct = () => {
  return (
    <div className="bg-pink-50 p-6 rounded-2xl shadow-md max-w-3xl mx-auto mt-6">

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">

        {/* Search Input */}
        <div className="flex flex-col w-full">
          <label htmlFor="search" className="text-pink-600 font-semibold mb-1">
            Search
          </label>
          <input
            type="text"
            id="search"
            placeholder="Search cakes..."
            className="p-2 rounded-lg border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white"
          />
        </div>

        {/* Category Select */}
        <div className="flex flex-col w-full">
          <label htmlFor="Category" className="text-pink-600 font-semibold mb-1">
            Category
          </label>
          <select
            id="Category"
            className="p-2 rounded-lg border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white"
          >
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