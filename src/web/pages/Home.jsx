import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductScroller from '../components/ProductScroller'
import HeroCarousel from '../components/HeroCarousel'
export default function Home() {


  return (
    <div >
        <Navbar />
        
      <div className="pt-20">

        <HeroCarousel />

        <ProductScroller
        title="Popular Items"
        category="cake"
        bgColor="#ff149305"
      />

      <ProductScroller
        title="Pastries"
        category="cake"
        bgColor="#f5f5f5"
      />

      <ProductScroller
        title="Cupcakes"
        category="cupcake"
        bgColor="#ff149305"
        // bgColor="#d6cfc7"
      />
    </div>  


        <Footer />
    </div>
    
  )
}

