import React from 'react';
import { Printer, X, CheckCircle2 } from 'lucide-react';

export default function Receipt({ order, onClose }) {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        {/* Header/Success Info */}
        <div className="p-8 bg-slate-900 text-white text-center relative">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-white/40 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-gold/30">
            <CheckCircle2 size={32} className="text-gold" />
          </div>
          <h2 className="text-2xl font-black tracking-tight uppercase">Sale Completed</h2>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Order ID: {order._id?.toUpperCase() || 'N/A'}</p>
        </div>

        {/* Receipt Body - The Printable Part */}
        <div className="flex-1 overflow-y-auto p-8 bg-white" id="printable-receipt">
          <style dangerouslySetInnerHTML={{ __html: `
            @media print {
              body * { visibility: hidden; }
              #printable-receipt, #printable-receipt * { visibility: visible; }
              #printable-receipt { 
                position: absolute; 
                left: 0; 
                top: 0; 
                width: 100%;
                padding: 20px;
              }
              .no-print { display: none !important; }
            }
          `}} />

          <div className="text-center space-y-1 mb-8">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">NIROSHA <span className="text-primary italic font-medium">Sweets</span></h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Premium Confectionery & Patisserie</p>
            <div className="flex flex-col gap-0.5 mt-2">
              <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">123 Galle Road, Colombo 03</p>
              <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">+94 11 234 5678</p>
            </div>
            <div className="h-px w-12 bg-slate-100 mx-auto mt-4"></div>
          </div>

          <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-50 pb-4">
            <div className="space-y-1">
               <p>Date: {order.scheduleDate || new Date().toLocaleDateString()}</p>
               <p>Time: {order.scheduleTime || new Date().toLocaleTimeString()}</p>
            </div>
            <div className="text-right space-y-1">
               <p>Customer: {order.customerName}</p>
               <p>Type: {order.type}</p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            {order.items?.map((item, idx) => (
              <div key={idx} className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <p className="text-[11px] font-black text-slate-900 uppercase leading-tight">{item.pName}</p>
                  <p className="text-[9px] text-slate-400 font-bold mt-0.5">{item.quantity}{item.unit || 'pcs'} x Rs.{item.price}</p>
                </div>
                <p className="text-[11px] font-black text-slate-900 whitespace-nowrap">Rs.{item.price * item.quantity}</p>
              </div>
            ))}
          </div>

          <div className="border-t-2 border-dashed border-slate-100 pt-6 space-y-2">
            <div className="flex justify-between items-center text-slate-400 font-bold text-[10px] uppercase tracking-widest">
              <p>Subtotal</p>
              <p>Rs.{order.totalAmount}</p>
            </div>
            <div className="flex justify-between items-center text-slate-400 font-bold text-[10px] uppercase tracking-widest">
              <p>Tax (0%)</p>
              <p>Rs.0</p>
            </div>
            <div className="flex justify-between items-center pt-2">
              <p className="text-[12px] font-black text-slate-900 uppercase tracking-widest">Grand Total</p>
              <p className="text-xl font-black text-primary tracking-tighter">Rs.{order.totalAmount}</p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <div className="inline-block p-4 bg-slate-50 rounded-2xl border border-slate-100">
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Thank you for your visit!</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4 no-print">
          <button 
            onClick={onClose}
            className="flex-1 py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-100 transition-all"
          >
            Back to Terminal
          </button>
          <button 
            onClick={handlePrint}
            className="flex-1 py-4 bg-slate-900 text-gold rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
          >
            <Printer size={16} /> Print Bill
          </button>
        </div>
      </div>
    </div>
  );
}
