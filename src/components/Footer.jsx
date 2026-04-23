import React from 'react';
import { MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#4A2E1B] text-white/80 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1 md:col-span-1">
          <h3 className="title-font text-2xl font-bold text-white mb-4">Nirosha <span className="text-[#FF6B8B]">Sweet House</span></h3>
          <p className="mb-6 leading-relaxed">
            Crafting smiles with every slice since we opened our doors. Local, fresh, and handmade with love in Kurundugahahetekma.
          </p>
          <div className="flex gap-4 font-bold text-sm">
            <a href="#" className="py-2 px-4 bg-white/10 rounded-full hover:bg-[#FF6B8B] hover:text-white transition-all">Facebook</a>
            <a href="#" className="py-2 px-4 bg-white/10 rounded-full hover:bg-[#FF6B8B] hover:text-white transition-all">Instagram</a>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-lg text-white mb-4">Quick Links</h4>
          <ul className="space-y-3">
            <li><Link to="/" className="hover:text-[#FF6B8B] transition-colors">Home</Link></li>
            <li><Link to="/products" className="hover:text-[#FF6B8B] transition-colors">Cake Catalog</Link></li>
            <li><Link to="/contact" className="hover:text-[#FF6B8B] transition-colors">Contact Us</Link></li>
            <li><Link to="/cart" className="hover:text-[#FF6B8B] transition-colors">Your Cart</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg text-white mb-4">Contact Info</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <MapPin size={20} className="text-[#FF6B8B] mt-1 shrink-0" />
              <span>74FQ+V9X, Kurundugahahetekma, Sri Lanka</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={20} className="text-[#FF6B8B] shrink-0" />
              <a href="tel:+94123456789" className="hover:text-white">012 345 6789 (Placeholder)</a>
            </li>
            <li className="mt-4">
              <span className="block font-bold text-white mb-1">Business Hours:</span>
              <span>Everyday: 8:00 AM - 8:00 PM</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg text-white mb-4">Services</h4>
          <p className="mb-4">We are currently <strong className="text-[#FF6B8B]">Takeaway Only</strong>. Please place orders ahead of pickup time for custom cakes.</p>
          <Link to="/contact" className="text-sm underline hover:text-[#D4AF37]">Location Map</Link>
        </div>
      </div>

      <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 max-w-7xl mx-auto">
        <p>© 2026 Nirosha Sweet House. All rights reserved.</p>
        <div className="flex gap-4 text-sm">
                 
        </div>
      </div>
    </footer>
  );
};

export default Footer;
