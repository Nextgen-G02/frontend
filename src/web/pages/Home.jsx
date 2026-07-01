import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductScroller from '../components/ProductScroller'
import HeroSection from '../components/HeroSection'
import CustomizeCake from '../components/CustomizeCake'
import CategoryShowcase from '../components/CategoryShowcase'
import BrandStory from '../components/BrandStory'
import AboutSection from '../components/AboutSection'
import PromoBanner from '../components/PromoBanner'
import Testimonials from '../components/Testimonials'
import Newsletter from '../components/Newsletter'
import SEO from '../../shared/components/SEO'

export default function Home() {
  return (
    <div className="bg-[#FDFBF8]">
      <SEO 
        title="Home"
        description="Welcome to Nirosha Sweet House, your premier destination for luxury custom cakes and authentic sweets."
        url="/"
      />
      <Navbar />
      
      {/* 1. HERO SECTION */}
      <HeroSection />

      {/* 2. CATEGORY SHOWCASE */}
      <CategoryShowcase />

      {/* 3. CUSTOMIZE CAKE SECTION */}
      <CustomizeCake />

      {/* 4. POPULAR CAKES */}
      <ProductScroller
        title="Popular Cakes"
        category="cakes"
        bgColor="#fbf9f4"
      />

      {/* 5. BRAND STORY */}
      <BrandStory />

      {/* 6. POPULAR SWEETS */}
      <ProductScroller
        title="Popular Sweets"
        category="sweet"
        bgColor="white"
      />

      {/* 7. PROMO BANNER */}
      <PromoBanner />

      {/* 8. BEVERAGES */}
      <ProductScroller
        title="Beverages"
        category="beverages"
        bgColor="#fbf9f4"
      />

      {/* 9. ABOUT SECTION */}
      <AboutSection />

      {/* 10. CLIENT TESTIMONIALS */}
      <Testimonials />

      {/* 11. NEWSLETTER */}
      <Newsletter />

      <Footer />
    </div>
  )
}