import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Star, Quote, ChevronLeft, ChevronRight, MessageSquare, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function Testimonials() {
  const [testimonialsList, setTestimonialsList] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/reviews`);
      if (res.data.success) {
        // Map backend data to frontend format
        const mapped = res.data.data.map(r => ({
          _id: r._id,
          name: r.user ? `${r.user.firstName} ${r.user.lastName}` : 'Customer',
          location: r.location || 'Sri Lanka',
          text: r.text,
          rating: r.rating,
          initials: r.user ? r.user.firstName[0].toUpperCase() : 'C'
        }));
        setTestimonialsList(mapped);
      }
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    } finally {
      setLoading(false);
    }
  };

  const next = () => {
    if (testimonialsList.length === 0) return;
    setActiveIndex((prev) => (prev === testimonialsList.length - 1 ? 0 : prev + 1));
  };

  const prev = () => {
    if (testimonialsList.length === 0) return;
    setActiveIndex((prev) => (prev === 0 ? testimonialsList.length - 1 : prev - 1));
  };

  const active = testimonialsList.length > 0 ? testimonialsList[activeIndex] : null;

  return (
    <section className="py-16 md:py-24 bg-[#fbf9f4] relative overflow-hidden">
      {/* Decorative vector background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.015] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#B38B59 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>
      
      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 space-y-4 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-3">
            <span className="h-[1px] w-10 bg-amber-200"></span>
            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-amber-600">Client Reviews</p>
            <span className="h-[1px] w-10 bg-amber-200"></span>
          </div>
          <h2 className="font-serif text-3xl md:text-5xl text-slate-900 leading-tight">
            Loved By Our <span className="italic font-light text-[#C29D59]">Community</span>
          </h2>
          
        </div>

        {/* Carousel Container */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C29D59] mx-auto"></div>
          </div>
        ) : testimonialsList.length === 0 ? (
          <div className="text-center py-20 text-slate-400 font-medium">
            <MessageSquare size={48} className="mx-auto mb-4 opacity-30" />
            No reviews yet. Be the first to leave one!
          </div>
        ) : (
          <div className="relative max-w-4xl mx-auto">
            {/* Main Card */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_15px_50px_rgba(179,139,89,0.05)] p-8 md:p-16 text-center space-y-6 md:space-y-8 relative overflow-hidden transition-all duration-500 min-h-[350px] flex flex-col justify-center">
              {/* Quote Icon Background */}
              <div className="absolute -top-4 -left-4 text-slate-50 opacity-5 pointer-events-none scale-150">
                <Quote size={200} />
              </div>

              {/* Stars */}
              <div className="flex items-center justify-center gap-1.5 z-10 relative">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} className={i < active.rating ? "fill-[#C29D59] text-[#C29D59]" : "fill-slate-100 text-slate-100"} />
                ))}
              </div>

              {/* Review text */}
              <p className="font-serif text-lg md:text-2xl lg:text-3xl text-slate-700 leading-relaxed italic max-w-3xl mx-auto z-10 relative">
                "{active.text}"
              </p>

              {/* User Meta */}
              <div className="flex flex-col items-center gap-2 z-10 relative mt-auto">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center border-2 border-amber-100 text-sm md:text-base shadow-inner">
                  {active.initials}
                </div>
                <div>
                  <h4 className="font-sans font-bold text-slate-950 uppercase tracking-widest text-xs md:text-sm">
                    {active.name}
                  </h4>
                  <p className="text-[10px] md:text-xs text-[#C29D59] font-medium tracking-wide">
                    {active.location}
                  </p>
                </div>
              </div>
            </div>

            {/* Controls */}
            {testimonialsList.length > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8 md:mt-10">
                <button 
                  onClick={prev}
                  className="w-11 h-11 rounded-full border border-slate-200 bg-white shadow-sm flex items-center justify-center text-slate-900 hover:bg-[#C29D59] hover:text-white hover:border-[#C29D59] transition-all duration-300 active:scale-95 group"
                >
                  <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
                </button>
                
                {/* Slide Indicators */}
                <div className="flex items-center gap-2 overflow-x-auto max-w-[150px] no-scrollbar">
                  {testimonialsList.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveIndex(idx)}
                      className={`h-1.5 rounded-full transition-all duration-500 shrink-0 ${
                        activeIndex === idx ? "w-8 bg-[#C29D59]" : "w-1.5 bg-slate-200"
                      }`}
                    />
                  ))}
                </div>

                <button 
                  onClick={next}
                  className="w-11 h-11 rounded-full border border-slate-200 bg-white shadow-sm flex items-center justify-center text-slate-950 hover:bg-[#C29D59] hover:text-white hover:border-[#C29D59] transition-all duration-300 active:scale-95 group"
                >
                  <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

    </section>
  );
}
