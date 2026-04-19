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
// import { useCart } from "../context/CartContext";

export default function Navbar() {
  // const { cart } = useCart();

  const location = useLocation();
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  // const cartItemCount = cart.reduce(
  //   (total, item) => total + item.quantity,
  //   0
  // );

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

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
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-md py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

        {/* LOGO */}
        <Link
          to="/"
          className="flex items-center gap-3 group"
        >
          <div className="w-11 h-11 bg-[#D92323] rounded-xl flex items-center justify-center rotate-3 group-hover:rotate-12 transition-transform">
            <ShoppingBag className="text-white" size={22} />
          </div>

          <span className="text-xl sm:text-2xl font-black text-[#1A1A1A]">
            Nirosha Sweet House
          </span>
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`font-semibold transition ${
                location.pathname === link.path
                  ? "text-[#D92323]"
                  : "text-[#1A1A1A] hover:text-[#D92323]"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-3 sm:gap-4">

          {/* CART */}
          <Link
            to="/cart"
            className="relative p-2 text-[#1A1A1A] hover:text-[#D92323]"
          >
            <ShoppingBag size={24} />

            {/* {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#D92323] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {cartItemCount}
              </span>
            )} */}
          </Link>

          {/* USER LOGGED IN */}
          {user ? (
            <div className="hidden md:flex items-center gap-3">

              {(user.role === "admin" || user.role === "staff") && (
                <Link
                  to="/admin"
                  className="flex items-center gap-2 bg-[#1A1A1A] text-white px-4 py-2 rounded-xl font-semibold hover:bg-[#D92323] transition"
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>
              )}

              <div className="flex items-center gap-2 text-sm font-semibold">
                <User size={18} />
                {user.firstName}
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden md:flex items-center gap-2 bg-[#1A1A1A] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#D92323] transition"
            >
              <User size={18} />
              Login
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
        <div className="md:hidden bg-white shadow-xl border-t px-6 py-5 flex flex-col gap-4">

          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="font-semibold text-[#1A1A1A]"
            >
              {link.name}
            </Link>
          ))}

          {user ? (
            <>
              {(user.role === "admin" || user.role === "staff") && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-semibold text-[#D92323]"
                >
                  Dashboard
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="text-left font-semibold text-red-500"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="font-semibold text-[#D92323]"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}