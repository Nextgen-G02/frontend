import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Heart, Trash2, ArrowRight, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../../shared/components/SEO';
import ProductCard from '../components/Products/ProductCard';

export default function Wishlist() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistIds, setWishlistIds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Load wishlist from localStorage
    const ids = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishlistIds(ids);

    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products`);
        // Filter products that are in the wishlist
        const allProducts = response.data.data || response.data;
        const wishlisted = allProducts.filter(p => ids.includes(p._id));
        setProducts(wishlisted);
      } catch (err) {
        console.error("Failed to fetch products for wishlist:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleRemoveFromWishlist = (id, e) => {
    e.stopPropagation();
    const updatedIds = wishlistIds.filter(item => item !== id);
    setWishlistIds(updatedIds);
    localStorage.setItem('wishlist', JSON.stringify(updatedIds));
    setProducts(prev => prev.filter(p => p._id !== id));
    window.dispatchEvent(new Event('wishlistUpdate'));
  };

  return (
    <div className="bg-[#FDFBF8] min-h-screen flex flex-col font-sans selection:bg-[#C29D59] selection:text-white">
      <SEO 
        title="My Wishlist"
        description="View and manage your favorite custom cakes, sweets, and treats in your wishlist."
      />
      <Navbar />

      <main className="flex-grow pt-24 pb-20 px-4 md:px-8">
        <div className="bg-[#fbf9f4] p-6 md:p-10 rounded-[32px] md:rounded-[48px] shadow-xl shadow-black/5 max-w-[1600px] mx-auto border border-[#EADFC9]/30 animate-in fade-in duration-1000">
          
          <header className="flex flex-col items-center mb-8 md:mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-1 bg-[#C29D59] rounded-full"></div>
            </div>
            <h1 className="text-3xl md:text-5xl font-serif text-slate-900 tracking-tighter uppercase text-center flex items-center gap-3 font-bold">
              My <span className="italic font-light text-[#C29D59]">Wishlist</span>
            </h1>
            <p className="text-slate-400 font-medium text-xs uppercase tracking-widest mt-2">Your saved masterpieces</p>
          </header>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 md:py-32 gap-4">
              <Loader2 className="w-10 h-10 text-[#C29D59] animate-spin" />
              <p className="text-slate-400 font-black uppercase tracking-widest text-[9px] italic">Loading your wishlist...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 space-y-6">
              <div className="w-22 h-22 bg-white/80 rounded-full flex items-center justify-center mx-auto shadow-sm border border-slate-100">
                <Heart size={36} className="text-slate-300" />
              </div>
              <p className="text-slate-400 font-black uppercase tracking-widest text-xs italic">Your wishlist is currently empty.</p>
              <Link
                to="/products"
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-slate-900 text-gold hover:text-white hover:bg-slate-800 transition-all font-bold text-[10px] uppercase tracking-[0.2em] rounded-full shadow-lg"
              >
                Browse Collection <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 px-0 mt-2">
              {products.map((product) => (
                <div key={product._id} className="relative group">
                  <ProductCard product={product} hideDescription={true} />
                  
                  {/* Remove Button Overlay */}
                  <button
                    onClick={(e) => handleRemoveFromWishlist(product._id, e)}
                    className="absolute top-4 left-4 z-10 p-2.5 bg-white/90 hover:bg-rose-500 hover:text-white rounded-full text-rose-500 shadow-md border border-slate-100 transition-all duration-300 hover:scale-110 cursor-pointer"
                    title="Remove from Wishlist"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
