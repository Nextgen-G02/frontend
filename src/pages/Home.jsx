import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductScroller from '../components/ProductScroller'
export default function Home() {


  return (
    <div >
        <Navbar />
        
      <div >
        <ProductScroller
        title="Popular Items"
        category="pastry"
        bgColor="#d6cfc7"
      />

      <ProductScroller
        title="Pastries"
        category="cake"
        bgColor="#f5f5f5"
      />

      <ProductScroller
        title="Pastries"
        category="pastry"
        bgColor="#d6cfc7"
      />
    </div>  


        <Footer />
    </div>
    
  )
}
