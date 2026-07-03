import React, { useState } from 'react'
import SearchProduct from '../components/Products/SearchProduct';
import ItemProduct from '../components/Products/ItemProduct';

const Products= () => {
    const [searchParams, setSearchParams] = useState({
        search: '',
        category: 'all'
    });

  return (
    
    <div className="bg-primary p-6 rounded-1xl shadow-md max-w-8xl mx-auto mt-5">
      <div>
        <h1 className="text-center text-[40px] font-bold text-accent p-[20px]">All Products</h1>
      </div>
      <SearchProduct /><br></br>
      <ItemProduct/>
    </div>
    
  )
}

export default Products
