import React from 'react';
import { MapPin, Phone, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

//footer component with contact info, internal links, and social media icons
const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-12 md:pt-16 pb-8 px-6 md:px-10 border-t border-white/5">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-2.5 mb-6 group cursor-pointer">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center rotate-3 group-hover:rotate-0 transition-all duration-500">
               <ShoppingBag className="text-gold" size={16} />
            </div>
            <h3 className="text-lg font-black text-white uppercase tracking-tight">Nirosha <span className="italic font-medium text-slate-400">Sweet House</span></h3>
          </div>
          <p className="mb-8 leading-relaxed text-xs md:text-sm italic font-medium">
            "Crafting excellence with every transmission since inception. Local, fresh, and handmade with integrity in Kurundugahahetekma."
          </p>
          <div className="flex gap-3">
            <a href="#" className="w-10 h-10 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-500 shadow-xl">FB</a>
            <a href="#" className="w-10 h-10 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-500 shadow-xl">IG</a>
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