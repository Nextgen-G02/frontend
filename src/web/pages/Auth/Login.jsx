import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  LogIn,
  UserPlus,
  Mail,
  Lock,
  User,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../../../shared/context/AuthContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { GoogleLogin } from '@react-oauth/google';

export default function AuthPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const url = isLogin
        ? import.meta.env.VITE_BACKEND_URL + "/api/auth/login"
        : import.meta.env.VITE_BACKEND_URL + "/api/auth/register";

      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await axios.post(url, payload);
      login(response.data.user, response.data.token);
      toast.success(response.data.message);

      switch (response.data.user.role) {
        case "admin": navigate("/admin"); break;
        case "staff": navigate("/pos"); break;
        default: navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const res = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/auth/google-login",
        { tokenId: credentialResponse.credential }
      );
      login(res.data.user, res.data.token);
      toast.success(res.data.message);
      switch (res.data.user.role) {
        case "admin": navigate("/admin"); break;
        case "staff": navigate("/pos"); break;
        default: navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Google authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF8] flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center p-6 md:p-12 lg:p-20 pt-32">
        <div className="w-full max-w-[1200px] bg-white rounded-[40px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col lg:flex-row min-h-[700px] border border-slate-100">
          
          {/* Visual Hero Panel */}
          <div className="hidden lg:block w-5/12 relative overflow-hidden bg-slate-900">
            <img
              src="https://images.unsplash.com/photo-1535141192574-5d4897c826a0?auto=format&fit=crop&q=80&w=1200"
              alt="Boutique Confectionary"
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent flex flex-col justify-end p-12 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-[1px] bg-[#C29D59]"></span>
                  <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#C29D59]">Signature Experience</p>
                </div>
                <h2 className="font-serif text-5xl text-white leading-tight">
                  Taste the <br />
                  <span className="italic font-light">Elegance</span>
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed max-w-xs font-light italic">
                  "Every creation is a journey into the heart of artisanal perfection."
                </p>
              </div>
              <div className="pt-8 border-t border-white/10">
                <p className="text-[10px] uppercase font-bold tracking-widest text-white/40">Exclusive Member Access</p>
              </div>
            </div>
          </div>

          {/* Form Panel */}
          <div className="w-full lg:w-7/12 p-8 md:p-16 flex flex-col justify-center relative">
            {/* Top Bar Accent */}
            <div className="absolute top-10 right-10 flex items-center gap-4">
              <div className="h-[1px] w-12 bg-slate-100"></div>
              <div className="w-2 h-2 rounded-full border border-[#C29D59]"></div>
            </div>

            <div className="mb-12">
              <h1 className="font-serif text-4xl md:text-5xl text-slate-900 mb-4 tracking-tight">
                {isLogin ? "Welcome Back" : "Join the House"}
              </h1>
              <p className="text-slate-400 text-sm md:text-base font-medium">
                {isLogin ? "Step into our sweet world of wonders." : "Start your journey of pure delight with us."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 max-w-md">
              
              {!isLogin && (
                <div className="grid grid-cols-2 gap-6 animate-in slide-in-from-top-4 duration-500">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest ml-1">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="E.g. Julian"
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#C29D59] transition-all font-medium text-slate-900 placeholder:opacity-30 text-sm"
                      required={!isLogin}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest ml-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="E.g. Smith"
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#C29D59] transition-all font-medium text-slate-900 placeholder:opacity-30 text-sm"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest ml-1">
                  {isLogin ? "Email or NIC Identifier" : "Email Address"}
                </label>
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input
                    type={isLogin ? "text" : "email"}
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="yourname@example.com"
                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#C29D59] transition-all font-medium text-slate-900 placeholder:opacity-30 text-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Password</label>
                  {isLogin && <button type="button" className="text-[9px] font-bold uppercase text-[#C29D59] hover:text-slate-900 tracking-widest transition-colors">Forgot?</button>}
                </div>
                <div className="relative">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••••••"
                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#C29D59] transition-all font-medium text-slate-900 placeholder:opacity-30 text-sm"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 space-y-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-[0.3em] hover:bg-[#C29D59] transition-all duration-500 flex items-center justify-center gap-3 shadow-xl shadow-slate-100 disabled:opacity-50 group"
                >
                  {loading ? "Authenticating..." : isLogin ? "Enter the House" : "Create Account"}
                  {!loading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                </button>

                <div className="flex items-center gap-4">
                  <div className="h-px bg-slate-100 flex-1"></div>
                  <span className="text-[9px] font-bold uppercase text-slate-300 tracking-widest">Or Sign In with</span>
                  <div className="h-px bg-slate-100 flex-1"></div>
                </div>

                <div className="flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => toast.error("Google Authentication Failed")}
                    theme="outline"
                    shape="pill"
                    width="100%"
                  />
                </div>
              </div>

              <p className="text-center text-xs font-medium text-slate-400 pt-6">
                {isLogin ? "New to the Sweet House?" : "Already a member?"}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-2 text-[#C29D59] font-bold hover:text-slate-900 transition-colors underline underline-offset-4"
                >
                  {isLogin ? "Join now" : "Sign in instead"}
                </button>
              </p>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}