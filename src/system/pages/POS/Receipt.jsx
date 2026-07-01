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

          <div className="text-center mb-6">
            <div className="flex justify-center mb-2">
              <img 
                src="/images/nirosha bg removed.png" 
                alt="Nirosha Sweets" 
                className="h-20 w-auto object-contain"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
            <p className="text-[14px] text-slate-900 font-black uppercase tracking-widest">Nirosha Sweets</p>
            <p className="text-[12px] text-slate-400 font-bold uppercase tracking-widest leading-tight">
              Kurundugahahetekma, Elpitiya <br/> 076 670 9860
            </p>
            <div className="h-px w-12 bg-slate-100 mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-[12px] font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-50 pb-4">
            <div className="space-y-1">
               <p><span className="text-slate-300">Date:</span> {order.scheduleDate || new Date().toLocaleDateString()}</p>
               <p><span className="text-slate-300">Time:</span> {order.scheduleTime || new Date().toLocaleTimeString()}</p>
               <p><span className="text-slate-300">Ref:</span> #{order._id?.slice(-8).toUpperCase()}</p>
            </div>
            <div className="text-right space-y-1">
               <p><span className="text-slate-300">Customer:</span> {order.customerName}</p>
               <p><span className="text-slate-300">Payment:</span> {order.paymentMethod || 'Cash'}</p>
               <p><span className="text-slate-300">Type:</span> {order.type || 'Direct'}</p>
            </div>
          </div>

          {/* Tabular Items */}
          <div className="mb-8">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 text-[12px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="py-2 text-left w-8">#</th>
                  <th className="py-2 text-left">Description</th>
                  <th className="py-2 text-center w-20">Price</th>
                  <th className="py-2 text-center w-12">Qty</th>
                  <th className="py-2 text-right w-20">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {order.items?.map((item, idx) => (
                  <tr key={idx} className="text-[14px]">
                    <td className="py-3 text-slate-300 font-bold">{idx + 1}</td>
                    <td className="py-3 pr-4">
                      <p className="font-black text-slate-900 uppercase leading-tight">{item.pName}</p>
                    </td>
                    <td className="py-3 text-center font-black text-slate-400">
                       <span className="text-slate-900">Rs.{item.price}</span>
                       <span className="text-[10px] block">/{item.unit || 'pcs'}</span>
                    </td>
                    <td className="py-3 text-center font-black text-slate-900">{item.quantity}</td>
                    <td className="py-3 text-right font-black text-slate-900">Rs.{item.price * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t-2 border-dashed border-slate-100 pt-6 space-y-2">
            <div className="flex justify-between items-center text-slate-400 font-bold text-[13px] uppercase tracking-widest">
              <p>Total Items: {order.items?.length || 0}</p>
              <div className="text-right">
                <p>Subtotal: Rs.{order.totalAmount}</p>
              </div>
            </div>
            <div className="flex justify-between items-center pt-4 bg-slate-50 -mx-8 px-8 py-4">
              <div>
                <p className="text-[14px] font-black text-slate-400 uppercase tracking-widest">Total Payable</p>
                <p className="text-[12px] text-slate-300 font-bold uppercase mt-1 italic">Incl. all taxes</p>
              </div>
              <p className="text-3xl font-black text-primary tracking-tighter">Rs.{order.totalAmount.toLocaleString()}</p>
            </div>
          </div>

          <div className="mt-10 text-center space-y-4">
            <div className="inline-block p-4 bg-slate-50/50 rounded-2xl border border-slate-100 w-full">
               <p className="text-[13px] font-black text-slate-900 uppercase tracking-[0.2em]">Thank you for shopping with us!</p>
               <p className="text-[12px] text-slate-400 font-bold uppercase tracking-widest mt-2 leading-relaxed">
                 Please keep this receipt for returns within 7 days. <br/>
                 Items must be in original packaging.
               </p>
            </div>
            
            <div className="flex justify-center gap-4 opacity-20 grayscale">
               <div className="w-8 h-8 bg-slate-900 rounded-full"></div>
               <div className="w-8 h-8 bg-slate-900 rounded-full"></div>
               <div className="w-8 h-8 bg-slate-900 rounded-full"></div>
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
