import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductScroller from '../components/ProductScroller'
import HeroSection from '../components/HeroSection'
import CustomizeCake from '../components/CustomizeCake'
import AboutSection from '../components/AboutSection'

export default function Home() {
  return (
    <div className="bg-[#FDFBF8]">
      <Navbar />
      
      {/* HERO SECTION */}
      <HeroSection />


      {/* CUSTOMIZE CAKE SECTION */}
      <CustomizeCake />

      {/* FEATURED PRODUCTS */}
      <ProductScroller
        title="Popular Cakes"
        category="cakes"
        bgColor="#fbf9f4"
      />

      {/* ABOUT SECTION */}
      {/* <AboutSection /> */}

      {/* POPULAR ITEMS */}
      <ProductScroller
        title="Popular Sweets"
        category="sweet"
        bgColor="white"
      />

      <ProductScroller
        title="Beverages"
        category="beverages"
        bgColor="#fbf9f4"
      />

      <Footer />
    </div>
  )
}