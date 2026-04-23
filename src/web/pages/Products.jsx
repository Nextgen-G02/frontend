import React, { useState } from 'react'
import SearchProduct from '../components/Products/SearchProduct';
import ItemProduct from '../components/Products/ItemProduct';

const Products= () => {
    const [searchParams, setSearchParams] = useState({
        search: '',
        category: 'all'
    });

  return (
    
    <div className="bg-white p-6 md:p-10 rounded-[32px] md:rounded-[48px] shadow-xl shadow-black/5 max-w-[1600px] mx-auto mt-8 md:mt-12 border border-slate-50 animate-in fade-in duration-1000">
      <header className="flex flex-col items-center mb-10 md:mb-14">
        <div className="flex items-center gap-3 mb-4">
           <div className="w-8 h-1 bg-primary rounded-full"></div>
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Nirosha Asset Registry</p>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase text-center">
          Our <span className="italic font-medium text-slate-400">Collections</span>
        </h1>
      </header>
      
      <SearchProduct setSearchParams={setSearchParams} />
      <div className="mt-8 md:mt-10">
        <ItemProduct searchParams={searchParams} />
      </div>
    </div>
    
  )
}

export default Products