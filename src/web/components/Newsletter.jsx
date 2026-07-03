import React, { useState } from 'react';
import { Send, Mail, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter a valid email address.");
      return;
    }
    
    setLoading(true);
    const toastId = toast.loading("Subscribing...");

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/newsletter/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Subscribed successfully!", { id: toastId });
        setSubscribed(true);
        setEmail("");
      } else {
        toast.error(data.message || "Failed to subscribe. Please try again.", { id: toastId });
      }
    } catch (error) {
      console.error("Subscription Error:", error);
      toast.error("Network error. Please try again later.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 md:py-24 bg-slate-950 text-white relative overflow-hidden">
      {/* Decorative gradients */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#C29D59]/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-slate-800/20 rounded-full translate-x-1/3 translate-y-1/3 blur-[80px] pointer-events-none"></div>

      <div className="max-w-[1200px] mx-auto px-6 relative z-10 text-center space-y-8 md:space-y-10">
        
        {/* Header */}
        <div className="space-y-4 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-[#C29D59]">
            <Mail size={20} className="animate-bounce" />
            <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.4em]">Newsletter</span>
          </div>
          <h2 className="font-serif text-3xl md:text-5xl font-light">
            Stay Updated on <span className="italic text-[#C29D59] font-normal">Fresh Batches</span>
          </h2>
          <p className="text-slate-400 text-xs md:text-sm font-medium leading-relaxed max-w-md mx-auto">
            Subscribe to get exclusive recipes, announcements of seasonal specials, and a 10% discount coupon directly to your inbox.
          </p>
        </div>

        {/* Form or Success State */}
        {!subscribed ? (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3 bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-md">
            <div className="flex-grow flex items-center gap-2 px-3 text-slate-400">
              <Mail size={18} />
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-none py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-0"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`bg-[#C29D59] hover:bg-[#b08e50] text-slate-950 font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 flex-shrink-0 ${loading ? 'opacity-70 cursor-not-allowed' : 'active:scale-95'}`}
            >
              {loading ? 'Subscribing...' : 'Subscribe'}
              {!loading && <Send size={12} />}
            </button>
          </form>
        ) : (
          <div className="max-w-md mx-auto bg-[#C29D59]/10 border border-[#C29D59]/20 rounded-2xl p-6 flex items-center justify-center gap-3 text-[#C29D59] animate-fade-in">
            <CheckCircle2 size={24} />
            <span className="text-sm font-bold tracking-wide">You are subscribed! Thank you.</span>
          </div>
        )}

      </div>
    </section>
  );
}
