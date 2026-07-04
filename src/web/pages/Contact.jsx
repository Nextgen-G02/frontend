import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../../shared/components/SEO';
import { Phone, Mail, MapPin, Clock, Send, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    // Simulate API request delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast.success("Thank you! Your message has been sent successfully.");
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    setIsSubmitting(false);
  };

  return (
    <div className="bg-[#FDFBF8] min-h-screen selection:bg-[#C29D59] selection:text-white">
      <SEO 
        title="Contact Us"
        description="Get in touch with Nirosha Sweet House. Send us a message, find our phone number, email, or visit our live location in Kurundugahahetekma, Elpitiya."
        url="/contact"
      />
      <Navbar />

      <main className="pt-24 md:pt-32 pb-16">
        
        {/* HEADER / HERO SECTION */}
        <section className="px-6 md:px-12 max-w-[1440px] mx-auto text-center mb-16 md:mb-24">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="h-[1px] w-12 md:w-24 bg-slate-900"></span>
            <p className="text-[9px] md:text-xs font-black uppercase tracking-[0.4em] text-slate-900">Reach Out</p>
            <span className="h-[1px] w-12 md:w-24 bg-slate-900"></span>
          </div>
          
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-slate-900 leading-[1.1] tracking-tighter max-w-4xl mx-auto mb-6">
            We’d Love to Hear <br />
            <span className="italic font-light text-[#C29D59]">From You</span>
          </h1>
          
          <p className="text-slate-500 max-w-2xl mx-auto text-sm md:text-base leading-relaxed font-medium">
            Whether you want to place a custom cake order, inquire about our daily sweet selection, or just share your sweet moments, we are here to help.
          </p>
        </section>

        {/* CONTACT CONTENT SECTION */}
        <section className="px-6 md:px-12 max-w-[1440px] mx-auto mb-16 md:mb-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* LEFT COLUMN: CONTACT DETAILS & LIVE MAP */}
            <div className="lg:col-span-5 space-y-10">
              <div className="space-y-8">
                <h2 className="font-serif text-2xl md:text-3xl text-slate-900">
                  Store Information
                </h2>
                
                <div className="space-y-6">
                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#C29D59] border border-slate-100 shadow-sm flex-shrink-0">
                      <MapPin size={20} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Our Location</h3>
                      <p className="text-slate-700 text-sm font-medium leading-relaxed">
                        Nirosha Sweet House,<br />
                        Kurundugahahetekma, Elpitiya,<br />
                        Sri Lanka
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#C29D59] border border-slate-100 shadow-sm flex-shrink-0">
                      <Phone size={20} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Call Us</h3>
                      <p className="text-slate-700 text-sm font-semibold">
                        <a href="tel:+94774153806" className="hover:text-[#C29D59] transition-colors">(+94) 774 153 806</a>
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#C29D59] border border-slate-100 shadow-sm flex-shrink-0">
                      <Mail size={20} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Email Us</h3>
                      <p className="text-slate-700 text-sm font-semibold">
                        <a href="mailto:niroshasweethouse77@gmail.com" className="hover:text-[#C29D59] transition-colors">niroshasweethouse77@gmail.com</a>
                      </p>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#C29D59] border border-slate-100 shadow-sm flex-shrink-0">
                      <Clock size={20} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Opening Hours</h3>
                      <p className="text-slate-700 text-sm font-medium leading-relaxed">
                        Monday – Sunday: <br />
                        <span className="font-semibold text-slate-800">8:00 AM – 9:00 PM</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* LIVE MAP CONTAINER */}
              <div className="space-y-4 pt-4">
                <h3 className="font-serif text-xl text-slate-900">Find Us on Live Map</h3>
                <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-md border border-slate-100 bg-slate-50 relative group">
                  <iframe 
                    title="Nirosha Sweet House Live Location"
                    src="https://maps.google.com/maps?q=Nirosha%20Sweet%20House,%20Kurundugahahetekma,%20Elpitiya,%20Sri%20Lanka&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-700"
                    allowFullScreen="" 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: CONTACT FORM */}
            <div className="lg:col-span-7 bg-white p-8 md:p-12 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-100/50">
              <div className="mb-8">
                <h2 className="font-serif text-2xl md:text-3xl text-slate-900 mb-2">Send a Message</h2>
                <p className="text-slate-400 text-sm font-medium">Leave us a line and we'll get back to you shortly.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Input */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Your Name *</label>
                    <input 
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium text-slate-900 placeholder-slate-300 outline-none focus:ring-4 focus:ring-[#C29D59]/5 focus:border-[#C29D59] transition-all"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Your Email *</label>
                    <input 
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium text-slate-900 placeholder-slate-300 outline-none focus:ring-4 focus:ring-[#C29D59]/5 focus:border-[#C29D59] transition-all"
                    />
                  </div>
                </div>

                {/* Subject Input */}
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Subject</label>
                  <input 
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Custom cake consultation / General Inquiry"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium text-slate-900 placeholder-slate-300 outline-none focus:ring-4 focus:ring-[#C29D59]/5 focus:border-[#C29D59] transition-all"
                  />
                </div>

                {/* Message Input */}
                <div className="space-y-2">
                  <label htmlFor="message" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Your Message *</label>
                  <textarea 
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Hello, I would like to inquire about..."
                    required
                    rows="6"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium text-slate-900 placeholder-slate-300 outline-none focus:ring-4 focus:ring-[#C29D59]/5 focus:border-[#C29D59] transition-all resize-none"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto px-10 py-4 bg-slate-900 hover:bg-[#C29D59] text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all duration-300 shadow-xl shadow-slate-150 disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
