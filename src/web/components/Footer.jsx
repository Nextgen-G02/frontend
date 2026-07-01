import React from 'react';
import { Phone, Mail, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#0f0f0f] text-slate-400 pt-16 pb-8 px-6 md:px-12 relative overflow-hidden">
      {/* Subtle Background Pattern (Leaf/Flower Inspiration) */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] opacity-[0.02] pointer-events-none select-none translate-x-20 -translate-y-20">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 0C100 0 120 40 160 60C120 80 100 120 100 120C100 120 80 80 40 60C80 40 100 0 100 0Z" fill="#C29D59" />
        </svg>
      </div>

      <div className="max-w-[1440px] mx-auto">
        
        {/* Top Call to Action Section */}
        <div className="flex flex-col items-center text-center gap-4 mb-12 border-b border-white/5 pb-10">
          <div className="space-y-3">
            <h2 className="font-serif text-2xl md:text-4xl text-white leading-tight">
              Order to <span className="text-[#C29D59]">Sweetness</span> For <span className="text-[#C29D59]">Special</span> Days
            </h2>
            <p className="text-slate-500 font-sans text-xs md:text-base max-w-xl mx-auto">
              Indulge in handcrafted excellence delivered right to your doorstep for your most cherished moments.
            </p>
          </div>
        </div>

        {/* Main Footer Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16 mb-12">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="flex flex-col group">
              <div className="flex items-center gap-3 mb-1">
                <img 
                  src="/images/nirosha bg removed.png" 
                  alt="Logo" 
                  className="h-8 w-auto object-contain transition-transform group-hover:scale-110"
                />
                <span className="font-serif text-xl text-white tracking-widest uppercase">NIROSHA</span>
              </div>
              <p className="text-[9px] font-sans font-medium uppercase tracking-[0.4em] text-[#C29D59] pl-1">Sweet House</p>
            </Link>
            
            <p className="text-slate-500 text-xs leading-relaxed">
              Kurundugahahetekma, <br></br>
              Elpitiya, <br></br>
              Sri lanka
            </p>
            
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 border border-white/10 rounded-full flex items-center justify-center text-slate-400 hover:bg-[#1877F2] hover:text-white transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" className="w-8 h-8 border border-white/10 rounded-full flex items-center justify-center text-slate-400 hover:bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] hover:text-white transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="#" className="w-8 h-8 border border-white/10 rounded-full flex items-center justify-center text-slate-400 hover:bg-[#FF0000] hover:text-white transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.14 1 12 1 12s0 3.86.42 5.58a2.78 2.78 0 0 0 1.94 2c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.86 23 12 23 12s0-3.86-.42-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
              </a>
            </div>
          </div>

          {/* Support Column */}
          <div>
            <h4 className="font-serif text-lg text-white mb-6 border-l-2 border-[#C29D59] pl-3">Support</h4>
            <ul className="space-y-3">
              {['Help Center', 'Our Services', 'Contact Us', 'Pricing & Plans'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-xs hover:text-[#C29D59] flex items-center gap-2 transition-colors group">
                    <ChevronRight size={10} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Important Column */}
          <div>
            <h4 className="font-serif text-lg text-white mb-6 border-l-2 border-[#C29D59] pl-3">Important</h4>
            <ul className="space-y-3">
              {['About Us', 'Bespoke Process', 'My Account', 'Privacy & Policy'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-xs hover:text-[#C29D59] flex items-center gap-2 transition-colors group">
                    <ChevronRight size={10} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="font-serif text-lg text-white mb-6 border-l-2 border-[#C29D59] pl-3">Get In Touch</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center text-[#C29D59]">
                  <Phone size={14} />
                </div>
                <div>
                  <p className="text-[9px] uppercase font-bold tracking-widest text-slate-600 mb-0.5">Call Us</p>
                  <a href="tel:+94774153806" className="text-xs text-white hover:text-[#C29D59] transition-colors font-medium">(+94) 774153806</a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center text-[#C29D59]">
                  <Mail size={14} />
                </div>
                <div>
                  <p className="text-[9px] uppercase font-bold tracking-widest text-slate-600 mb-0.5">Email Us</p>
                  <a href="mailto:info@niroshasweet.com" className="text-xs text-white hover:text-[#C29D59] transition-colors font-medium">info@niroshasweet.com</a>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-8 text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-600 font-bold">
            © {new Date().getFullYear()} <span className="text-white">Nirosha Sweet House</span>. All Rights Reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;