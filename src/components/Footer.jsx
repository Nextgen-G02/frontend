import React from 'react';
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-rich-black text-white pt-20 pb-12 border-t-4 border-primary-burgundy">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1 space-y-4">
                        <h3 className="text-3xl font-serif font-black text-white uppercase tracking-tighter">
                            Nirosha <span className="text-accent-gold italic"> Sweet House</span>
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed font-light">
                            Sri Lanka's artisanal bakery and confectionery home since 1990.
                            Crafting traditional delicacies and contemporary masterpieces with pure love.
                        </p>
                    </div>

                    {/* Menu Explore */}
                    <div>
                        <h4 className="text-xs uppercase tracking-[0.3em] font-black mb-6 text-accent-gold">Our Menu</h4>
                        <ul className="space-y-3 text-sm text-gray-400 font-medium">
                            <li><a href="/shop" className="hover:text-accent-gold transition-colors">Premium Cakes</a></li>
                            <li><a href="/shop" className="hover:text-accent-gold transition-colors">Luxe Gateaux</a></li>
                            <li><a href="/shop" className="hover:text-accent-gold transition-colors">Sri Lankan Sweets</a></li>
                            <li><a href="/custom-cake" className="hover:text-accent-gold transition-colors">Custom Designs</a></li>
                        </ul>
                    </div>

                    {/* Experience Info */}
                    <div>
                        <h4 className="text-xs uppercase tracking-[0.3em] font-black mb-6 text-accent-gold">Contact Info</h4>
                        <ul className="space-y-3 text-sm text-gray-400 font-light">
                            <li>123, Galle Road, Colombo, Sri Lanka</li>
                            <li>+94 11 234 5678</li>
                            <li>contact@niroshasweets.lk</li>
                        </ul>
                    </div>

                    {/* Social Concierge */}
                    <div>
                        <h4 className="text-xs uppercase tracking-[0.3em] font-black mb-6 text-accent-gold">Social Channels</h4>
                        <div className="flex space-x-6">
                            <a href="#" className="text-gray-400 hover:text-accent-gold transition-colors text-xl">
                                <FaFacebook />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-accent-gold transition-colors text-xl">
                                <FaInstagram />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-accent-gold transition-colors text-xl">
                                <FaWhatsapp />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-[0.4em] text-gray-600 font-bold">
                    <span>&copy; {new Date().getFullYear()} NIROSHA SWEET HOUSE (PVT) LTD.</span>
                    <span className="mt-4 md:mt-0">ESTABLISHED 1990</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
