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
        title="Chef's Special Selection"
        category="cakes"
        bgColor="#ff149305"
      />

      {/* BRAND STORY */}
      <BrandStory />

      {/* POPULAR ITEMS */}
      <ProductScroller
        title="Popular Pastries"
        category="sweet"
        bgColor="white"
      />

      <ProductScroller
        title="Our Cupcake Box"
        category="beverages"
        bgColor="#ff149305"
      />

      <Footer />
    </div>
  )
}