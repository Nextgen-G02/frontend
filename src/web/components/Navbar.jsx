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

export default function Navbar() {
  const { user, logout } = useAuth();
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
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl shadow-xl shadow-black/5 py-2.5"
          : "bg-transparent py-4 md:py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

        {/* LOGO */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group"
        >
          <div className="w-9 h-9 md:w-10 md:h-10 bg-slate-900 rounded-lg flex items-center justify-center rotate-3 group-hover:rotate-0 transition-all duration-500 shadow-xl">
            <ShoppingBag className="text-gold" size={18} md:size={20} />
          </div>

          <div className="flex flex-col">
            <span className="text-sm md:text-lg font-black text-slate-900 leading-none tracking-tight">
              Nirosha <span className="italic font-medium text-slate-400">Sweet House</span>
            </span>
            <p className="text-[7px] md:text-[8px] font-black text-primary uppercase tracking-[0.3em] mt-1">Confectionary Excellence</p>
          </div>
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500 relative group/link ${
                location.pathname === link.path
                  ? "text-primary"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {link.name}
              <span className={`absolute -bottom-1 left-0 h-[2px] bg-primary transition-all duration-500 ${location.pathname === link.path ? "w-full" : "w-0 group-hover/link:w-full"}`}></span>
            </Link>
          ))}
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-2 md:gap-4">

          {/* CART */}
          <Link
            to="/cart"
            className="group relative p-2.5 text-slate-400 hover:text-primary transition-colors"
          >
            <ShoppingBag size={20} md:size={22} className="group-hover:scale-110 transition-transform" />
          </Link>

          {/* USER LOGGED IN */}
          {user ? (
            <div className="hidden md:flex items-center gap-4">

              {(user.role === "admin" || user.role === "staff") && (
                <Link
                  to="/admin"
                  className="flex items-center gap-2.5 bg-slate-900 text-gold px-4 py-2 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all duration-500 shadow-xl shadow-slate-100"
                >
                  <LayoutDashboard size={14} md:size={16} />
                  Registry
                </Link>
              )}

              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg md:rounded-xl border border-slate-100 group">
                <User size={14} md:size={16} className="text-primary" />
                <span className="text-[9px] md:text-[10px] font-black uppercase text-slate-900 tracking-widest">{user.firstName}</span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2.5 bg-rose-50 text-rose-500 px-4 py-2 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] hover:bg-rose-500 hover:text-white transition-all duration-500"
              >
                <LogOut size={14} md:size={16} />
                Exit
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden md:flex items-center gap-2.5 bg-slate-900 text-gold px-5 py-2.5 md:px-6 md:py-3 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] hover:bg-primary hover:text-white transition-all duration-500 shadow-xl shadow-slate-100"
            >
              <User size={14} md:size={16} />
              Sign Up
            </Link>
          )}

          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden p-2"
            onClick={() =>
              setMobileMenuOpen(!mobileMenuOpen)
            }
          >
            {mobileMenuOpen ? (
              <X size={28} />
            ) : (
              <Menu size={28} />
            )}
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
