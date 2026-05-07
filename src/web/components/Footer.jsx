import React from 'react';
import { MapPin, Phone, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

//footer component with contact info, internal links, and social media icons
const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-12 md:pt-16 pb-8 px-6 md:px-10 border-t border-white/5">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-3 mb-6 group cursor-pointer">
            <div className="relative">
              <img 
                src="/images/nirosha bg removed.png" 
                alt="Nirosha Sweet House" 
                className="h-10 md:h-12 w-auto object-contain scale-150 translate-y-1 transition-transform duration-500 group-hover:scale-[1.6]"
              />
            </div>
            <div className="flex flex-col ml-4">
              <h3 className="text-lg font-black text-white leading-none tracking-tight">Nirosha <span className="italic font-medium text-slate-400">Sweet House</span></h3>
              <p className="text-[7px] font-black text-amber-500 uppercase tracking-[0.3em] mt-1">Confectionary Excellence</p>
            </div>
          </div>
          <p className="mb-8 leading-relaxed text-xs md:text-sm italic font-medium">
            "Crafting excellence with every transmission since inception. Local, fresh, and handmade with integrity in Kurundugahahetekma."
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center text-slate-400 hover:bg-[#1877F2] hover:text-white transition-all duration-500 shadow-xl group/social">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover/social:scale-110 transition-transform"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="#" className="w-10 h-10 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center text-slate-400 hover:bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] hover:text-white transition-all duration-500 shadow-xl group/social">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover/social:scale-110 transition-transform"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            <a href="#" className="w-10 h-10 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center text-slate-400 hover:bg-[#FF0000] hover:text-white transition-all duration-500 shadow-xl group/social">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover/social:scale-110 transition-transform"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.14 1 12 1 12s0 3.86.42 5.58a2.78 2.78 0 0 0 1.94 2c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.86 23 12 23 12s0-3.86-.42-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-6">Internal Links</h4>
          <ul className="space-y-3.5">
            <li><Link to="/" className="text-[11px] font-bold uppercase tracking-widest hover:text-gold transition-colors">Home</Link></li>
            <li><Link to="/products" className="text-[11px] font-bold uppercase tracking-widest hover:text-gold transition-colors">Cakes</Link></li>
            <li><Link to="/contact" className="text-[11px] font-bold uppercase tracking-widest hover:text-gold transition-colors">Contact</Link></li>
            <li><Link to="/cart" className="text-[11px] font-bold uppercase tracking-widest hover:text-gold transition-colors">Cart</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-6">Hub Intelligence</h4>
          <ul className="space-y-5">
            <li className="flex items-start gap-4">
              <MapPin size={16} className="text-primary mt-0.5 shrink-0" />
              <span className="text-[11px] font-bold uppercase tracking-wider leading-relaxed">74FQ+V9X, Kurundugahahetekma, Sri Lanka</span>
            </li>
            <li className="flex items-center gap-4">
              <Phone size={16} className="text-primary shrink-0" />
              <a href="tel:+94123456789" className="text-[11px] font-bold uppercase tracking-wider">012 345 6789</a>
            </li>
            <li className="pt-2">
              <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Operational Window</span>
              <span className="text-[11px] font-bold uppercase tracking-wider">Daily: 08:00 - 20:00</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-6">Protocol Notice</h4>
          <p className="text-xs italic leading-relaxed text-slate-300 font-medium mb-6">"Direct acquisition is currently limited to **takeaway mode**. Pre-authorize custom items and special transmissions."</p>
          <Link to="/contact" className="text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2 bg-white/5 rounded-lg border border-white/5 hover:bg-gold hover:text-slate-900 transition-all">Geographic Node</Link>
        </div>
      </div>

      <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 max-w-[1600px] mx-auto">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">© 2026 Nirosha Sweet House. Secure Registry Protocols Applied.</p>
        <div className="flex gap-6">
           <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Privacy Ledger</span>
           <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Ops Terms</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;