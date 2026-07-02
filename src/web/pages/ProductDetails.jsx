import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { 
  Star, ChevronRight, Heart, Share2, ShieldCheck, 
  Truck, Clock, Calendar, CheckCircle2, ArrowRight,
  ShoppingCart, Minus, Plus, MessageSquare, Award
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../../shared/components/SEO';
import { useCart } from '../../shared/context/CartContext';

export default function ProductDetails() {
  const { id: slug } = useParams();
  const id = slug.length >= 24 ? slug.slice(-24) : slug;
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const generateSlug = (name, id) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + id;
  };

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState(null);
  const [selectedFlavor, setSelectedFlavor] = useState('');
  const [cakeMessage, setCakeMessage] = useState('');
  const [isWishlist, setIsWishlist] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`);
        
        // Initialize defaults based on product data
        if (data.weightOptions && data.weightOptions.length > 0) {
          setSelectedWeight(data.weightOptions[0]);
        }
        if (data.flavors && data.flavors.length > 0) {
          setSelectedFlavor(data.flavors[0]);
        }
        
        // Set main product and immediately stop loading screen
        setProduct(data);
        setLoading(false);

        // Fetch related products from same category in the background without blocking render
        if (data.pCategory) {
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/category/${data.pCategory}`)
            .then(relatedRes => {
              setRelatedProducts(relatedRes.data.filter(p => p._id !== id).slice(0, 6));
            })
            .catch(err => console.error("Error fetching related products:", err));
        }

      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Could not load product details.");
        setLoading(false);
      }
    };

    fetchProduct();
    // Reset state on ID change
    setQuantity(1);
    setCakeMessage('');
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF8] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C29D59]"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FDFBF8] flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <h2 className="text-3xl font-serif text-slate-900 mb-4">Product Not Found</h2>
          <p className="text-slate-500 mb-8">The cake you are looking for does not exist or has been removed.</p>
          <Link to="/products" className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-[#C29D59] transition-colors">
            Back to Shop
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Fallbacks
  const images = (product.images && product.images.length > 0) 
    ? product.images 
    : ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=1000'];

  const basePrice = product.price || 0;
  const weightMultiplier = selectedWeight ? (selectedWeight.priceMultiplier || 1) : 1;
  const totalPrice = basePrice * weightMultiplier * quantity;

  // Add to cart handler
  const handleAddToCart = () => {
<<<<<<< HEAD
    const cartItem = {
      ...product,
      price: basePrice * weightMultiplier,
      quantity,
      images,
      customization: {
        weight: selectedWeight ? selectedWeight.weight : null,
        flavor: selectedFlavor,
        message: cakeMessage
      }
    };
    
    addToCart(cartItem);
=======
    const customProps = {
      price: basePrice * weightMultiplier,
      selectedFlavor: selectedFlavor || null,
      cakeMessage: cakeMessage || null,
      selectedWeight: selectedWeight || null
    };

    addToCart(product, quantity, customProps);
>>>>>>> 8b2c7745873dc8609006c939a6c4f709ff45b814
    toast.success(`${product.pName} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF8] font-sans selection:bg-[#C29D59] selection:text-white flex flex-col overflow-x-hidden">
      <SEO 
        title={product.pName}
        description={product.description?.substring(0, 160)}
        image={images[0]}
        url={`/product/${product._id}`}
        type="product"
        productData={{
          name: product.pName,
          id: product._id,
          price: totalPrice,
          stock: product.stock
        }}
      />
      <Navbar />

      <main className="flex-1 pt-20 pb-16 md:pt-24 md:pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumbs */}
          <nav className="flex text-xs sm:text-sm text-slate-500 mb-6 md:mb-8 pt-2 md:pt-4">
            <ol className="flex items-center space-x-2">
              <li><Link to="/" className="hover:text-[#C29D59] transition-colors">Home</Link></li>
              <li><ChevronRight size={14} /></li>
              <li><Link to="/products" className="hover:text-[#C29D59] transition-colors">Shop</Link></li>
              <li><ChevronRight size={14} /></li>
              <li className="text-slate-900 font-medium truncate">{product.pName}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-14">
            
            {/* Left Column: Image Gallery */}
            <div className="space-y-4 md:sticky md:top-24 lg:top-28 lg:col-span-5 self-start">
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                <span className="bg-[#C29D59] text-white text-[10px] uppercase font-bold tracking-widest py-1.5 px-3 rounded-full shadow-lg">
                  {product.pCategory}
                </span>
                {product.isCustomizable && (
                  <span className="bg-slate-900 text-white text-[10px] uppercase font-bold tracking-widest py-1.5 px-3 rounded-full shadow-lg">
                    Customizable
                  </span>
                )}
              </div>

              {/* Main Image Slider */}
              <div className="bg-white p-2 rounded-3xl shadow-sm border border-slate-100 overflow-hidden group">
                <Swiper
                  spaceBetween={10}
                  navigation={true}
                  thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                  modules={[FreeMode, Navigation, Thumbs]}
                  className="rounded-2xl aspect-square bg-[#F9F6F2]"
                >
                  {images.map((img, idx) => (
                    <SwiperSlide key={idx} className="overflow-hidden flex items-center justify-center">
                      <img 
                        src={img} 
                        alt={`${product.pName} - View ${idx + 1}`}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-110 cursor-zoom-in"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              {/* Thumbnail Slider */}
              {images.length > 1 && (
                <Swiper
                  onSwiper={setThumbsSwiper}
                  spaceBetween={12}
                  slidesPerView={4}
                  freeMode={true}
                  watchSlidesProgress={true}
                  modules={[FreeMode, Navigation, Thumbs]}
                  className="thumbs-slider h-24"
                >
                  {images.map((img, idx) => (
                    <SwiperSlide key={idx} className="rounded-xl overflow-hidden cursor-pointer border-2 border-transparent [&.swiper-slide-thumb-active]:border-[#C29D59] transition-all bg-[#F9F6F2]">
                      <img src={img} className="w-full h-full object-cover" alt={`Thumb ${idx}`} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </div>

            {/* Right Column: Product Details & Customization */}
            <div className="flex flex-col lg:col-span-7">
              <div>
                
                {/* Header Info */}
                <div className="mb-6">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-[#C29D59] text-xs font-bold tracking-widest uppercase mb-2">{product.pCategory}</p>
                    <div className="flex gap-2">
                      <button onClick={() => setIsWishlist(!isWishlist)} className="p-2.5 rounded-full bg-white shadow-sm border border-slate-100 hover:border-[#C29D59] hover:text-[#C29D59] transition-colors group">
                        <Heart size={18} className={isWishlist ? 'fill-rose-500 text-rose-500' : 'text-slate-400 group-hover:text-rose-500'} />
                      </button>
                      <button className="p-2.5 rounded-full bg-white shadow-sm border border-slate-100 hover:border-[#C29D59] text-slate-400 hover:text-[#C29D59] transition-colors">
                        <Share2 size={18} />
                      </button>
                    </div>
                  </div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-3 md:mb-4 leading-tight">
                    {product.pName}
                  </h1>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-1 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                      <Star size={14} className="fill-[#C29D59] text-[#C29D59]" />
                      <span className="text-sm font-bold text-slate-900">4.8</span>
                      <span className="text-xs text-slate-500 font-medium ml-1">(124)</span>
                    </div>
                    <div className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${product.stock > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      <CheckCircle2 size={14} />
                      {product.stockStatus || (product.stock > 0 ? 'In Stock' : 'Out of Stock')}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-end gap-3 mb-4">
                    <span className="text-3xl font-bold text-slate-900">Rs. {totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                {/* Customization Panel */}
                {(product.isCustomizable || (product.weightOptions && product.weightOptions.length > 0)) && (
                  <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-100 mb-6 md:mb-8 space-y-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Award size={18} className="text-[#C29D59]" />
                      <h3 className="font-serif text-xl font-bold text-slate-900">Customize Your Order</h3>
                    </div>

                    {/* Weight Selection */}
                    {product.weightOptions && product.weightOptions.length > 0 && (
                      <div className="space-y-3">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-900">Select Weight</label>
                        <div className="flex flex-wrap gap-3">
                          {product.weightOptions.map((w, idx) => (
                            <button
                              key={idx}
                              onClick={() => setSelectedWeight(w)}
                              className={`py-2 px-4 rounded-xl text-sm font-bold border transition-all ${selectedWeight?.weight === w.weight ? 'border-[#C29D59] bg-[#C29D59]/5 text-[#C29D59]' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                            >
                              {w.weight} {product.unit || 'kg'}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Flavor Selection */}
                    {product.flavors && product.flavors.length > 0 && (
                      <div className="space-y-3">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-900">Cake Flavor</label>
                        <div className="flex flex-wrap gap-3">
                          {product.flavors.map((f, i) => (
                            <button
                              key={i}
                              onClick={() => setSelectedFlavor(f)}
                              className={`py-2 px-4 rounded-xl text-xs font-bold border transition-all text-left ${selectedFlavor === f ? 'border-[#C29D59] bg-[#C29D59]/5 text-[#C29D59]' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                            >
                              {f}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Custom Message */}
                    {product.isCustomizable && (
                      <div className="space-y-3 pt-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-900 flex items-center gap-2">
                          <MessageSquare size={14} /> Message on Cake
                        </label>
                        <input 
                          type="text" 
                          placeholder="E.g. Happy Birthday Sarah!" 
                          maxLength={30}
                          value={cakeMessage}
                          onChange={(e) => setCakeMessage(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#C29D59] transition-all text-sm text-slate-900"
                        />
                        <p className="text-[10px] text-slate-400 text-right">{cakeMessage.length}/30 characters</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  {/* Quantity */}
                  <div className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl p-2 w-full sm:w-32 h-14">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all">
                      <Minus size={16} />
                    </button>
                    <span className="font-bold text-slate-900 w-8 text-center">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all">
                      <Plus size={16} />
                    </button>
                  </div>
                  
                  {/* Add to Cart */}
                  <button 
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    className="flex-1 h-14 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-[#C29D59] transition-all duration-300 shadow-xl shadow-slate-200 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart size={18} className="group-hover:scale-110 transition-transform" />
                    {product.stock > 0 ? `Add to Cart • Rs. ${totalPrice.toLocaleString()}` : 'Out of Stock'}
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-6">
                  <div className="flex flex-col items-center justify-center text-center space-y-2">
                    <ShieldCheck size={24} className="text-slate-300" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">100% Secure<br/>Payment</span>
                  </div>
                  <div className="flex flex-col items-center justify-center text-center space-y-2">
                    <Clock size={24} className="text-slate-300" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Freshly Baked<br/>To Order</span>
                  </div>
                  <div className="flex flex-col items-center justify-center text-center space-y-2">
                    <Calendar size={24} className="text-slate-300" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Schedule<br/>Delivery</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Product Tabs Info */}
          <div className="mt-12 md:mt-20 pt-12 md:pt-16 border-t border-slate-200">
            <div className="flex flex-wrap gap-8 border-b border-slate-200 mb-8 px-4 justify-center">
              {['description', 'delivery'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-[#C29D59]' : 'text-slate-400 hover:text-slate-900'}`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div layoutId="tabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C29D59]" />
                  )}
                </button>
              ))}
            </div>

            <div className="max-w-3xl mx-auto px-4 min-h-[150px]">
              <AnimatePresence mode="wait">
                {activeTab === 'description' && (
                  <motion.div key="desc" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-slate-500 space-y-4 leading-relaxed">
                    <p>{product.description}</p>
                  </motion.div>
                )}
                {activeTab === 'delivery' && (
                  <motion.div key="del" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-slate-500 grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-bold text-slate-900 mb-3 uppercase text-xs tracking-widest">Delivery Policies</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex gap-2 items-start"><CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" /> Same day delivery available for orders placed before 2 PM.</li>
                        <li className="flex gap-2 items-start"><CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" /> Temperature-controlled delivery vehicles ensure cake arrives perfectly intact.</li>
                        <li className="flex gap-2 items-start"><CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" /> Free delivery within 5km radius.</li>
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-24 pt-16 border-t border-slate-200">
              <div className="flex justify-between items-end mb-10 px-4">
                <div>
                  <p className="text-[#C29D59] text-[10px] font-bold tracking-[0.3em] uppercase mb-2">Curated For You</p>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900">You May Also Like</h2>
                </div>
                <Link to={`/products?category=${product.pCategory}`} className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors group">
                  View All <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <Swiper
                slidesPerView={1.2}
                spaceBetween={20}
                breakpoints={{
                  640: { slidesPerView: 2.5 },
                  1024: { slidesPerView: 4 }
                }}
                className="px-4 pb-12"
              >
                {relatedProducts.map((prod) => (
                  <SwiperSlide key={prod._id}>
                    <div className="group cursor-pointer" onClick={() => navigate(`/product/${generateSlug(prod.pName, prod._id)}`)}>
                      <div className="relative aspect-[4/5] bg-[#F9F6F2] rounded-3xl overflow-hidden mb-4 border border-slate-100">
                        <img 
                          src={(prod.images && prod.images[0]) || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=1000'} 
                          alt={prod.pName} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <button className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 bg-white text-slate-900 font-bold text-[10px] uppercase tracking-widest py-3 px-6 rounded-full shadow-xl w-[80%] hover:bg-slate-900 hover:text-white">
                          View Details
                        </button>
                      </div>
                      <div className="px-2">
                        <h3 className="font-bold text-slate-900 truncate mb-1 text-sm">{prod.pName}</h3>
                        <p className="text-[#C29D59] font-bold text-sm">Rs. {prod.price?.toLocaleString()}</p>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}

        </div>
      </main>

      {/* Mobile Sticky Add to Cart */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-xl border-t border-slate-100 md:hidden z-50 flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Price</p>
          <p className="font-bold text-slate-900 text-lg">Rs. {totalPrice.toLocaleString()}</p>
        </div>
        <button 
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className="flex-1 h-12 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg disabled:opacity-50"
        >
          {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>

      <Footer />
    </div>
  );
}
