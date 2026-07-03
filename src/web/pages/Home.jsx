import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductScroller from '../components/ProductScroller'
import HeroSection from '../components/HeroSection'
import ShopByOccasion from '../components/ShopByOccasion'
import CustomizeCake from '../components/CustomizeCake'
import CategoryShowcase from '../components/CategoryShowcase'
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

      {/* 3. CUSTOMIZE CAKE SECTION */}
      <CustomizeCake />

      {/* 1.5. SHOP BY OCCASION */}
      <ShopByOccasion />

      {/* 4. POPULAR CAKES */}
      <ProductScroller
        title="Popular Cakes"
        category="cakes"
        bgColor="#fbf9f4"
        homepageSection="Popular Cakes"
      />


      {/* 6. ARTISAN SWEETS */}
      <ProductScroller
        title="Artisan Sweets"
        category="sweet"
        bgColor="white"
        homepageSection="Popular Sweets"
      />

      {/* 7. PROMO BANNER */}
      <PromoBanner />

      {/* 8. SHOP BY CATEGORY */}
      <CategoryShowcase />

      {/* 9. THE GIFTING COLLECTION */}
      <ProductScroller
        title="The Gifting Collection"
        category="hampers"
        bgColor="#fbf9f4"
        homepageSection="The Gifting Collection"
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