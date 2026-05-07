import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  {
    title: "Signature Cakes",
    description: "Luxury designs for your most precious moments.",
    image: "/images/category_cakes.png", // We'll assume the user moves the generated image here or I use the generated path
    // Fallback to the generated image if possible or use a high-quality placeholder
    path: "/products?category=cake",
    color: "from-rose-500/20 to-rose-900/40"
  },
  {
    title: "Gourmet Pastries",
    description: "Handcrafted delicacies baked fresh every morning.",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=800",
    path: "/products?category=pastry",
    color: "from-amber-500/20 to-amber-900/40"
  },
  {
    title: "Artisan Cupcakes",
    description: "Small bites of heaven, decorated with love.",
    image: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&q=80&w=800",
    path: "/products?category=cupcake",
    color: "from-purple-500/20 to-purple-900/40"
  }
];

// NOTE: Using the image from the public folder
categories[0].image = "/images/category_cakes.png";

export default function CategoryShowcase() {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 md:px-10">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-4 md:gap-6">
          <div className="space-y-2 md:space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 md:w-12 h-[1px] md:h-[2px] bg-primary"></div>
              <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-primary">Curated Collections</p>
            </div>
            <h2 className="heading-premium text-3xl md:text-6xl">Shop by <span className="italic font-normal text-slate-400">Category</span></h2>
          </div>
          
          <p className="text-slate-500 max-w-sm text-xs md:text-base font-medium leading-relaxed">
            Explore our handcrafted selections, each prepared with the finest ingredients and a touch of heritage.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
          {categories.map((cat, idx) => (
            <Link 
              to={cat.path} 
              key={idx}
              className={`group relative h-[280px] md:h-[380px] rounded-[30px] md:rounded-[40px] overflow-hidden shadow-xl md:shadow-2xl transition-all duration-700 hover:-translate-y-1 md:hover:-translate-y-2 ${idx === 2 ? 'sm:col-span-2 md:col-span-1' : ''}`}
            >
              {/* Background Image */}
              <img 
                src={cat.image} 
                alt={cat.title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
              />
              
              {/* Overlays */}
              <div className={`absolute inset-0 bg-gradient-to-b ${cat.color} opacity-60 group-hover:opacity-40 transition-opacity duration-700`}></div>
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors"></div>

              {/* Content */}
              <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end text-white">
                <div className="md:translate-y-8 group-hover:translate-y-0 transition-transform duration-700">
                  <h3 className="text-xl md:text-3xl font-black mb-1 md:mb-3 tracking-tight">{cat.title}</h3>
                  <p className="text-white/80 text-[10px] md:text-sm mb-4 md:mb-6 max-w-[200px] md:max-w-[240px] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100 hidden md:block">
                    {cat.description}
                  </p>
                  <div className="flex items-center gap-2 md:gap-3 text-gold font-black uppercase text-[8px] md:text-[10px] tracking-[0.2em] md:tracking-[0.3em]">
                    Discover More <ArrowRight size={14} className="md:w-[16px]" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
