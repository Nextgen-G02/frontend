import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  LogIn,
  UserPlus,
  Mail,
  Lock,
  User,
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
        ? {
            email: formData.email,
            password: formData.password,
          }
        : formData;

      const response = await axios.post(url, payload);

      // Use Context instead of direct localStorage
      login(response.data.user, response.data.token);

      toast.success(response.data.message);

      switch (response.data.user.role) {
        case "admin":
          navigate("/admin");
          break;
        case "staff":
          navigate("/staff");
          break;
        default:
          navigate("/");
      }

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Authentication failed"
      );
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
        case "admin":
          navigate("/admin");
          break;
        case "staff":
          navigate("/staff");
          break;
        default:
          navigate("/");
      }
    } catch (error) {
      console.error("Google Login Error:", error);
      toast.error(error.response?.data?.message || "Google authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-24 md:pt-32 pb-12 bg-slate-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 animate-in fade-in duration-1000">
        <div className="w-full max-w-5xl bg-white rounded-[32px] md:rounded-[48px] shadow-[0_64px_128px_-24px_rgba(0,0,0,0.1)] overflow-hidden grid grid-cols-1 lg:grid-cols-2 min-h-[auto] md:min-h-[650px] border border-white">

          {/* LEFT HERO PANEL - DARK AUTHENTICITY */}
          <div className="relative hidden lg:block overflow-hidden">
            <img
              src="/images/leftimg.png"
              alt="Nirosha Sweet House Storefront"
              className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-[3s]"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/40 to-transparent flex flex-col justify-between p-12 xl:p-20 text-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-1 bg-primary rounded-full"></div>
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gold opacity-80">Established Excellence</p>
              </div>

              <div>
                <h1 className="heading-premium text-4xl lg:text-5xl mb-6 leading-tight text-gold drop-shadow-2xl">
         
                </h1>

                <div className="h-px w-20 bg-primary mb-8"></div>

                <p className="text-base xl:text-lg text-slate-300 leading-relaxed max-w-md font-medium italic">
                  
                </p>
              </div>

              <div className="flex items-center gap-6">
                
              </div>
            </div>
          </div>

          {/* RIGHT FORM PANEL - LIGHT REFINEMENT */}
          <div className="p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-white relative">
            <div className="absolute top-6 md:top-10 right-6 md:right-10 flex gap-2">
              <div className="w-2 h-2 rounded-full bg-slate-100"></div>
              <div className="w-2 h-2 rounded-full bg-slate-200"></div>
              <div className="w-2 h-2 rounded-full bg-primary"></div>
            </div>

            <div className="mb-8 sm:mb-10">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mb-2 md:mb-4 tracking-tighter">
                {isLogin ? "Sign In" : "Register"}
              </h1>

              <p className="text-sm md:text-base text-slate-400 font-medium leading-relaxed">
                {isLogin
                  ? "Identity not yet established?"
                  : "Already possess credentials?"}

                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-0 sm:ml-2 block sm:inline-block mt-1 sm:mt-0 text-primary font-black hover:text-slate-900 transition-colors uppercase text-[9px] md:text-[10px] tracking-widest border-b-2 border-primary/20 hover:border-primary"
                >
                  {isLogin ? "Sign Up" : "Return to Login"}
                </button>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">

              {/* REGISTER ONLY FIELDS */}
              {!isLogin && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-in slide-in-from-top-4">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="John"
                      className="w-full px-5 md:px-6 py-3 md:py-3.5 bg-slate-50 border border-slate-100 rounded-2xl md:rounded-3xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-slate-900 placeholder:opacity-30 text-sm md:text-base"
                      required={!isLogin}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      className="w-full px-5 md:px-6 py-3 md:py-3.5 bg-slate-50 border border-slate-100 rounded-2xl md:rounded-3xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-slate-900 placeholder:opacity-30 text-sm md:text-base"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              {/* EMAIL */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300"
                    size={20}
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@nirosha.com"
                    className="w-full pl-12 md:pl-14 pr-5 md:pr-6 py-3 md:py-3.5 bg-slate-50 border border-slate-100 rounded-2xl md:rounded-[32px] outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-slate-900 placeholder:opacity-30 text-sm md:text-base"
                    required
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
                  Password
                </label>

                <div className="relative">
                  <Lock
                    className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300"
                    size={20}
                  />

                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••••••"
                    className="w-full pl-12 md:pl-14 pr-5 md:pr-6 py-3 md:py-3.5 bg-slate-50 border border-slate-100 rounded-2xl md:rounded-[32px] outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-slate-900 placeholder:opacity-30 text-sm md:text-base"
                    required
                  />
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-slate-900 text-gold py-3.5 md:py-4 rounded-2xl md:rounded-[32px] font-black text-[10px] md:text-xs uppercase tracking-[0.4em] hover:bg-primary hover:text-white transition-all duration-500 flex items-center justify-center gap-4 shadow-2xl shadow-slate-200 active:scale-95 disabled:opacity-50 border border-white/10"
                >
                  {loading
                    ? "Synchronizing..."
                    : isLogin
                    ? "Login"
                    : "Sign Up"}

                  {!loading &&
                    (isLogin ? <LogIn size={16} md:size={18} /> : <UserPlus size={16} md:size={18} />)}
                </button>
                
              </div>

              {/* OR SEPARATOR */}
              <div className="relative flex items-center gap-4 pt-4">
                <div className="h-px bg-slate-100 flex-1"></div>
                <span className="text-[9px] font-black uppercase text-slate-300 tracking-[0.3em]">OR</span>
                <div className="h-px bg-slate-100 flex-1"></div>
              </div>

              {/* GOOGLE LOGIN */}
              <div className="flex justify-center pt-2">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => {
                    toast.error("Google Login Failed");
                  }}
                  useOneTap
                  theme="filled_black"
                  shape="pill"
                  width="350"
                />
              </div>

              {isLogin && (
                <p className="mt-8 text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
                  Secure End-to-End Encryption Enabled
                </p>
              )}

            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}