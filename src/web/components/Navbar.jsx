import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Menu,
  X,
  User,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../../shared/context/AuthContext";
import { useCart } from "../../shared/context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };


  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Cakes", path: "/products" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl border-b border-stone-200 py-2 md:py-3"
          : "bg-transparent py-3 md:py-4"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex items-center justify-between h-full">

        {/* LOGO - VERTICALLY CENTERED */}
        <Link
          to="/"
          className="flex items-center gap-1 md:gap-2 group h-full flex-shrink-0"
        >
          <div className="relative flex items-center justify-center h-full">
            <img 
              src="/images/nirosha bg removed.png" 
              alt="Nirosha Sweet House" 
              className="h-6 md:h-12 w-auto object-contain transition-transform duration-500 group-hover:scale-110"
            />
          </div>

          <div className="flex flex-col justify-center">
            <span className="font-serif text-[10px] md:text-2xl tracking-tighter text-slate-900 leading-none">
              NIROSHA
            </span>
            <span className="text-[4px] md:text-[9px] font-sans font-light tracking-[0.2em] md:tracking-[0.4em] text-stone-400 uppercase leading-none mt-0.5 md:mt-1">
              Sweet House
            </span>
          </div>
        </Link>

        {/* NAVIGATION LINKS - VISIBLE ON DESKTOP ONLY */}
        <div className="hidden md:flex items-center gap-6 lg:gap-10 h-full">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-[11px] font-medium uppercase tracking-[0.2em] transition-all duration-300 relative group/link flex items-center h-full ${
                location.pathname === link.path
                  ? "text-slate-900"
                  : "text-stone-400 hover:text-slate-900"
              }`}
            >
              {link.name}
              <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] bg-slate-900 transition-all duration-500 ${location.pathname === link.path ? "w-full" : "w-0 group-hover/link:w-full"}`}></span>
            </Link>
          ))}
          <Link
            to="/contact"
            className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-900 relative group/link ml-4 flex items-center h-full whitespace-nowrap"
          >
            GET IN TOUCH
            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-slate-900/30 group-hover:bg-slate-900 transition-colors"></span>
          </Link>
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-3 md:gap-6 h-full">
          
          {/* SEARCH (ICON ONLY) */}
          <button className="text-stone-400 hover:text-slate-900 transition-colors hidden sm:flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </button>

          {/* CART */}
          <Link
            to="/cart"
            className="group relative p-1 text-slate-400 hover:text-slate-900 transition-colors"
          >
            <ShoppingBag size={18} md:size={20} strokeWidth={1.5} className="group-hover:scale-105 transition-transform" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-slate-900 text-white text-[7px] md:text-[8px] font-bold w-3 h-3 md:w-4 md:h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* AUTH / DASHBOARD (Desktop only) */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                {(user.role === "admin" || user.role === "staff") && (
                  <Link
                    to="/admin"
                    className="p-1 text-slate-400 hover:text-slate-900 transition-colors"
                  >
                    <LayoutDashboard size={20} strokeWidth={1.5} />
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-[10px] font-medium uppercase tracking-widest text-slate-500 hover:text-rose-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-900"
              >
                Log In
              </Link>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden p-2 text-slate-900 transition-transform active:scale-90"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>


      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 shadow-2xl border-t border-white/5 px-6 py-8 flex flex-col gap-6 animate-in slide-in-from-top-10 duration-500">

          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`text-[11px] font-black uppercase tracking-[0.3em] transition-colors ${
                location.pathname === link.path ? "text-gold" : "text-slate-400 hover:text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}

          <div className="h-px bg-white/5 w-full"></div>

          {user ? (
            <div className="flex flex-col gap-6">
              {(user.role === "admin" || user.role === "staff") && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[11px] font-black uppercase tracking-[0.3em] text-gold"
                >
                  Access Registry
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="text-left text-[11px] font-black uppercase tracking-[0.3em] text-rose-500"
              >
                Terminate Session
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[11px] font-black uppercase tracking-[0.3em] text-gold"
            >
              Authenticate
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}