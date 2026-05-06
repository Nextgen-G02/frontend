import React, { useState } from 'react'
import SearchProduct from '../components/Products/SearchProduct';
import ItemProduct from '../components/Products/ItemProduct';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Products = () => {
  const [searchParams, setSearchParams] = useState({
    search: '',
    category: 'all'
  });

  return (
    <div className="bg-slate-50/30 min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-20 px-4 md:px-8">
        <div className="bg-white p-6 md:p-10 rounded-[32px] md:rounded-[48px] shadow-xl shadow-black/5 max-w-[1600px] mx-auto border border-slate-50 animate-in fade-in duration-1000">
          <header className="flex flex-col items-center mb-10 md:mb-14">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-1 bg-primary rounded-full"></div>
              {/* <p className="text-[15px] font-black uppercase tracking-[0.4em] text-primary">Nirosha sweet house</p> */}
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase text-center">
              Our Collections
            </h1>
          </header>

          <SearchProduct setSearchParams={setSearchParams} />
          <div className="mt-8 md:mt-10">
            <ItemProduct searchParams={searchParams} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Products