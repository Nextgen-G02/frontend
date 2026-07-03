import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Upload, Camera, Calendar, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../../shared/context/AuthContext';

export default function CustomizeCakeForm() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    const [formData, setFormData] = useState({
        customerName: user?.firstName ? `${user.firstName} ${user.lastName}` : '',
        email: user?.email || '',
        phone: '',
        address: '',
        scheduleDate: '',
        quantity: 1,
        description: '',
        referenceImage: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image is too large. Please select an image under 5MB.");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setFormData(prev => ({ ...prev, referenceImage: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const payload = { ...formData, user: user?.id || user?._id };
            
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/custom-cakes/request`, payload);
            
            toast.success("Custom cake request submitted! We will review it shortly.");
            navigate(user ? '/my-orders' : '/');
        } catch (error) {
            console.error("Submission error:", error);
            toast.error(error.response?.data?.message || "Failed to submit request. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFBF8] flex flex-col font-sans selection:bg-[#C29D59] selection:text-white">
            <Navbar />

            <main className="flex-1 pt-24 pb-16 md:pt-32 md:pb-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    
                    {/* Header */}
                    <div className="text-center mb-12 md:mb-16">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <span className="h-[1px] w-8 md:w-12 bg-[#C29D59]"></span>
                            <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-[#C29D59]">Bespoke Creation</p>
                            <span className="h-[1px] w-8 md:w-12 bg-[#C29D59]"></span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-slate-900 tracking-tight leading-tight mb-4">
                            Design Your <span className="italic font-light">Dream Cake</span>
                        </h1>
                        <p className="text-slate-500 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
                            Fill out the details below to request a custom cake. Our expert bakers will review your design and provide a quote.
                        </p>
                    </div>

                    {/* Form Container */}
                    <div className="bg-white rounded-[32px] md:rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100 p-6 md:p-10 lg:p-12">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            
                            {/* Section 1: Contact Details */}
                            <div>
                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-6 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">1</span>
                                    Contact Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest ml-1">Full Name *</label>
                                        <input type="text" name="customerName" value={formData.customerName} onChange={handleInputChange} required
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#C29D59] transition-all font-medium text-slate-900 placeholder:opacity-30 text-sm" placeholder="e.g. John Doe" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest ml-1">Email Address *</label>
                                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} required
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#C29D59] transition-all font-medium text-slate-900 placeholder:opacity-30 text-sm" placeholder="john@example.com" />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest ml-1">Phone Number *</label>
                                        <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#C29D59] transition-all font-medium text-slate-900 placeholder:opacity-30 text-sm" placeholder="+94 77 123 4567" />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest ml-1">Delivery Address *</label>
                                        <textarea name="address" value={formData.address} onChange={handleInputChange} required rows="2"
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#C29D59] transition-all font-medium text-slate-900 placeholder:opacity-30 text-sm resize-none" placeholder="Enter full delivery address"></textarea>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-slate-100" />

                            {/* Section 2: Cake Details */}
                            <div>
                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-6 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">2</span>
                                    Cake Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-2">
                                            <Calendar size={14} className="text-[#C29D59]" /> Needed By Date *
                                        </label>
                                        <input type="date" name="scheduleDate" value={formData.scheduleDate} onChange={handleInputChange} required
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#C29D59] transition-all font-medium text-slate-900 text-sm" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest ml-1">Quantity *</label>
                                        <input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} min="1" required
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#C29D59] transition-all font-medium text-slate-900 placeholder:opacity-30 text-sm" placeholder="e.g. 1" />
                                    </div>
                                </div>
                            </div>

                            <hr className="border-slate-100" />

                            {/* Section 3: Design & Vision */}
                            <div>
                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-6 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">3</span>
                                    Design & Vision
                                </h3>
                                
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest ml-1">Describe your ideal cake *</label>
                                        <textarea name="description" value={formData.description} onChange={handleInputChange} required rows="4"
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#C29D59] transition-all font-medium text-slate-900 placeholder:opacity-30 text-sm resize-none" 
                                            placeholder="Theme, colors, special decorations, message on cake, etc..."></textarea>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest ml-1">Reference Image (Optional)</label>
                                        <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 md:p-8 text-center hover:border-[#C29D59] hover:bg-[#C29D59]/5 transition-colors group relative cursor-pointer overflow-hidden h-48 md:h-64 flex flex-col items-center justify-center">
                                            
                                            {imagePreview ? (
                                                <div className="absolute inset-0 w-full h-full bg-slate-50">
                                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <p className="text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2"><Camera size={16}/> Change Image</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                        <Upload size={20} className="text-slate-400 group-hover:text-[#C29D59] transition-colors" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-xs md:text-sm font-bold text-slate-900">Click to upload or drag & drop</p>
                                                        <p className="text-[10px] md:text-xs text-slate-400">JPG, PNG, WEBP (Max 5MB)</p>
                                                    </div>
                                                </div>
                                            )}
                                            <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6">
                                <button type="submit" disabled={loading}
                                    className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-xs md:text-sm uppercase tracking-[0.3em] hover:bg-[#C29D59] transition-all duration-500 flex items-center justify-center gap-3 shadow-xl shadow-slate-100 disabled:opacity-50 group">
                                    {loading ? "Submitting..." : "Submit Custom Request"}
                                    {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                                </button>
                                {!user && (
                                    <p className="text-center text-xs text-slate-400 mt-4 font-medium">
                                        We recommend <a href="/login" className="text-[#C29D59] hover:underline font-bold">logging in</a> before submitting so you can easily track your order.
                                    </p>
                                )}
                            </div>

                        </form>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
