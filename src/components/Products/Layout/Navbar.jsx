import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShoppingBag, X, Menu, Star, LogOut, User as UserIcon, ShieldCheck } from 'lucide-react';

const Navbar = () => {
    const location = useLocation();
    const isHome = location.pathname === '/';
    const [scrolled, setScrolled] = useState(!isHome);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            if (isHome) {
                setScrolled(window.scrollY > 50);
            } else {
                setScrolled(true);
            }
        };

        window.addEventListener('scroll', handleScroll);
        // Sync state on route change
        setScrolled(!isHome || window.scrollY > 50);

        return () => window.removeEventListener('scroll', handleScroll);
    }, [isHome]);

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'py-3 glass shadow-xl' : 'py-6 bg-transparent'}`}>
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
                <div className="flex justify-between items-center h-12">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transform group-hover:rotate-12 transition-all duration-700 ${scrolled ? 'bg-primary-burgundy' : 'bg-white shadow-2xl'}`}>
                            <span className={`font-serif text-xl font-bold ${scrolled ? 'text-accent-gold' : 'text-primary-burgundy'}`}>N</span>
                        </div>
                        <div className="flex flex-col">
                            <span className={`font-serif text-2xl font-black tracking-tighter leading-none transition-colors duration-500 ${scrolled ? 'text-primary-burgundy' : 'text-white'}`}>NIROSHA</span>
                            <span className={`text-[9px] uppercase tracking-[0.4em] font-bold leading-none mt-1 transition-colors duration-500 ${scrolled ? 'text-rich-black/50' : 'text-soft-cream/70'}`}>Sweet House</span>
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-12">
                        {['Home', 'Shop', 'Custom Cake'].map((item) => (
                            <Link
                                key={item}
                                to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
                                className={`relative text-[11px] uppercase tracking-[0.3em] font-black transition-all duration-500 group ${scrolled ? 'text-rich-black/80 hover:text-primary-burgundy' : 'text-white hover:text-accent-gold'}`}
                            >
                                {item}
                                <span className={`absolute -bottom-2 left-0 w-0 h-[1.5px] transition-all duration-500 group-hover:w-full ${scrolled ? 'bg-primary-burgundy' : 'bg-accent-gold'}`}></span>
                            </Link>
                        ))}
                        {user && ['admin', 'staff', 'cashier'].includes(user.role) && (
                            <Link
                                to="/admin"
                                className={`relative text-[11px] uppercase tracking-[0.3em] font-black transition-all duration-500 group ${scrolled ? 'text-primary-burgundy hover:text-rich-black' : 'text-accent-gold hover:text-white'}`}
                            >
                                Dashboard
                                <span className={`absolute -bottom-2 left-0 w-0 h-[1.5px] transition-all duration-500 group-hover:w-full ${scrolled ? 'bg-primary-burgundy' : 'bg-accent-gold'}`}></span>
                            </Link>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-8">
                        <Link to="/cart" className={`relative transition-all duration-300 hover:scale-110 ${scrolled ? 'text-rich-black' : 'text-white'}`}>
                            <ShoppingBag size={22} strokeWidth={1.5} />
                            <span className="absolute -top-2 -right-2 bg-primary-burgundy text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center border-2 border-white/10">0</span>
                        </Link>

                        {user ? (
                            <div className="flex items-center gap-4">
                                <div className={`flex flex-col items-end hidden lg:flex`}>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${scrolled ? 'text-rich-black' : 'text-white'}`}>{user.name}</span>
                                    <span className={`text-[8px] font-bold uppercase tracking-[0.3em] px-2 py-0.5 rounded-full mt-1 ${user.role === 'admin' ? 'bg-red-500 text-white' : 'bg-accent-gold text-rich-black'}`}>{user.role}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className={`px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 hover:scale-105 active:scale-95 shadow-xl flex items-center gap-2 ${scrolled ? 'bg-rich-black text-white' : 'bg-white text-primary-burgundy'}`}
                                >
                                    <LogOut size={14} />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className={`hidden sm:block px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 hover:scale-105 active:scale-95 shadow-xl ${scrolled ? 'bg-primary-burgundy text-white' : 'bg-white text-primary-burgundy'}`}>
                                Sign In
                            </Link>
                        )}

                        <button
                            onClick={toggleMenu}
                            className={`md:hidden transition-colors ${scrolled ? 'text-rich-black' : 'text-white'}`}
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden fixed inset-0 z-[60] bg-rich-black/95 backdrop-blur-2xl flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-500 p-10">
                    <button onClick={toggleMenu} className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors">
                        <X size={32} />
                    </button>

                    {user && (
                        <div className="text-center mb-8 bg-white/5 p-6 rounded-3xl border border-white/10 w-full animate-in zoom-in-50 duration-500">
                            <div className="w-16 h-16 bg-primary-burgundy rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl shadow-primary-burgundy/20">
                                <UserIcon size={32} className="text-white" />
                            </div>
                            <h3 className="text-white text-xl font-black uppercase tracking-widest">{user.name}</h3>
                            <span className="text-accent-gold text-[10px] font-bold uppercase tracking-[0.4em] mt-1 block">{user.role}</span>
                        </div>
                    )}

                    <div className="flex flex-col items-center space-y-6 w-full">
                        {['Home', 'Shop', 'Custom Cake'].map((item) => (
                            <Link
                                key={item}
                                to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
                                className="text-white text-3xl font-serif font-bold tracking-tight hover:text-accent-gold transition-colors"
                                onClick={toggleMenu}
                            >
                                {item}
                            </Link>
                        ))}

                        {user && ['admin', 'staff', 'cashier'].includes(user.role) && (
                            <Link
                                to="/admin"
                                className="text-accent-gold text-3xl font-serif font-bold tracking-tight hover:text-white transition-colors"
                                onClick={toggleMenu}
                            >
                                Dashboard
                            </Link>
                        )}

                        <Link
                            to="/cart"
                            className="text-white text-3xl font-serif font-bold tracking-tight hover:text-accent-gold transition-colors flex items-center gap-4"
                            onClick={toggleMenu}
                        >
                            Cart <ShoppingBag size={24} />
                        </Link>

                        {user ? (
                            <button
                                onClick={() => { handleLogout(); toggleMenu(); }}
                                className="w-full bg-white text-primary-burgundy py-5 rounded-full text-xs font-black uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 mt-4"
                            >
                                <LogOut size={16} /> Logout
                            </button>
                        ) : (
                            <Link
                                to="/login"
                                className="w-full bg-primary-burgundy text-white py-5 rounded-full text-xs font-black uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all text-center mt-4"
                                onClick={toggleMenu}
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
