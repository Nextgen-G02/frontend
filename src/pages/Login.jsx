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

export default function AuthPage() {
  const navigate = useNavigate();

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

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

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

  return (
    <div className="min-h-screen bg-[#FDF1F1] flex items-center justify-center px-4 sm:px-6 py-6 sm:py-10">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">

        {/* LEFT IMAGE PANEL */}
        <div className="relative hidden lg:block min-h-[650px]">
          <img
            src="/images/login_cake.png"
            alt="Sweet House"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-10 xl:p-14 text-white">
            <h2 className="text-3xl xl:text-4xl font-black mb-4 leading-tight">
              {isLogin
                ? "Welcome Back to Nirosha Sweet House"
                : "Join Nirosha Sweet House"}
            </h2>

            <p className="text-sm xl:text-base text-white/80 leading-relaxed">
              {isLogin
                ? "Login to manage your sweet orders and enjoy delicious moments."
                : "Create your account and start ordering delicious cakes today."}
            </p>
          </div>
        </div>

        {/* RIGHT FORM PANEL */}
        <div className="p-6 sm:p-10 md:p-14 flex flex-col justify-center">
          <div className="mb-8 sm:mb-10 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl font-black text-[#1A1A1A] mb-3">
              {isLogin ? "Sign In" : "Register"}
            </h1>

            <p className="text-sm sm:text-base text-gray-500">
              {isLogin
                ? "Don't have an account?"
                : "Already have an account?"}

              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-[#D92323] font-bold hover:underline"
              >
                {isLogin ? "Register Here" : "Login Here"}
              </button>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* REGISTER ONLY FIELDS */}
            {!isLogin && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>
                  <label className="text-xs sm:text-sm font-bold uppercase text-gray-700">
                    First Name
                  </label>

                  <div className="relative mt-2">
                    <User
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />

                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="John"
                      className="w-full pl-12 pr-4 py-3 sm:py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#D92323]"
                      required={!isLogin}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-bold uppercase text-gray-700">
                    Last Name
                  </label>

                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#D92323] mt-2"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            {/* EMAIL */}
            <div>
              <label className="text-xs sm:text-sm font-bold uppercase text-gray-700">
                Email
              </label>

              <div className="relative mt-2">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="hello@example.com"
                  className="w-full pl-12 pr-4 py-3 sm:py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#D92323]"
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-xs sm:text-sm font-bold uppercase text-gray-700">
                Password
              </label>

              <div className="relative mt-2">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 sm:py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#D92323]"
                  required
                />
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-[#1A1A1A] text-white py-3 sm:py-4 rounded-2xl font-bold text-base sm:text-lg hover:bg-[#D92323] transition-all duration-300 flex items-center justify-center gap-3"
            >
              {loading
                ? "Processing..."
                : isLogin
                ? "Secure Login"
                : "Create Account"}

              {!loading &&
                (isLogin ? <LogIn size={20} /> : <UserPlus size={20} />)}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}