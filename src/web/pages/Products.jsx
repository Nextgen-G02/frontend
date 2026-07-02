import React, { useState } from 'react'
import SearchProduct from '../components/Products/SearchProduct';
import ItemProduct from '../components/Products/ItemProduct';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../../shared/components/SEO';

const Products = () => {
  const [searchParams, setSearchParams] = useState({
    search: '',
    category: 'all',
    minPrice: '',
    maxPrice: ''
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  return (
    <div className="bg-slate-50/30 min-h-screen flex flex-col">
      <SEO
        title="Our Collection"
        description="Browse our luxury collection of custom cakes, freshly baked sweets, and premium beverages."
        url="/products"
      />
      <Navbar />

      <main className="flex-grow pt-24 pb-20 px-4 md:px-8">
        <div className="bg-white p-6 md:p-10 rounded-[32px] md:rounded-[48px] shadow-xl shadow-black/5 max-w-[1600px] mx-auto border border-slate-50 animate-in fade-in duration-1000">
          <header className="flex flex-col items-center mb-8 md:mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-1 bg-primary rounded-full"></div>
            </div>
            <h3 className="text-3xl md:text-4xl font-normal text-slate-900 tracking-tighter uppercase text-center">
              Our Collections
            </h3>
          </header>

          {/* Main Layout Grid */}
          <div className="flex flex-col lg:flex-row gap-8 items-start mt-6">

            {/* Mobile Filters Toggle Button */}
            <div className="w-full lg:hidden flex justify-end mb-2">
              <button
                type="button"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-100/50 text-slate-700 hover:text-slate-950 font-black text-xs uppercase tracking-widest transition-all cursor-pointer shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 21v-7" /><path d="M4 10V3" /><path d="M12 21v-9" /><path d="M12 8V3" /><path d="M20 21v-5" /><path d="M20 12V3" /><path d="M2 14h4" /><path d="M10 8h4" /><path d="M18 16h4" /></svg>
                {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>

            {/* Sidebar / Filters Container */}
            <aside className={`w-full lg:w-[320px] lg:sticky lg:top-28 shrink-0 transition-all duration-300 ${showMobileFilters ? 'block' : 'hidden lg:block'
              }`}>
              <SearchProduct setSearchParams={setSearchParams} />
            </aside>

            {/* Products Grid */}
            <div className="flex-grow w-full">
              <ItemProduct searchParams={searchParams} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Products