import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductScroller from '../components/ProductScroller'
import HeroCarousel from '../components/HeroCarousel'
import CustomizeCake from '../components/CustomizeCake'
import BrandStory from '../components/BrandStory'

export default function Home() {
  return (
    <div className="bg-white">
      <Navbar />
      
      {/* HERO SECTION */}
      <div className="pt-20">
        <HeroCarousel />
      </div>

      {/* CUSTOMIZE CAKE SECTION */}
      <CustomizeCake />

      {/* FEATURED PRODUCTS */}
      <ProductScroller
        title="Popular Cakes"
        category="cakes"
        bgColor="#ff149305"
      />

      {/* BRAND STORY */}
      <BrandStory />

      {/* POPULAR ITEMS */}
      <ProductScroller
        title="Popular Sweets"
        category="sweet"
        bgColor="white"
      />

      <ProductScroller
        title="Beverages"
        category="beverages"
        bgColor="#ff149305"
      />

      <Footer />
    </div>
  )
}