import React, { useState } from "react";
import { createPortal } from "react-dom";
import { ShoppingCart, CreditCard, X } from "lucide-react";
import { useCart } from "../../../shared/context/CartContext";
import { useAuth } from "../../../shared/context/AuthContext";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product, hideDescription = false, isHomepageTheme = false }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [deliveryDetails, setDeliveryDetails] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "Colombo",
    scheduleDate: "",
    scheduleTime: ""
  });

  const generateSlug = (name, id) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + id;
  };

  const handleBuyNow = async (product, details) => {
    const orderData = {
      customerName: `${details.firstName} ${details.lastName}`,
      phone: details.phone,
      address: `${details.address}, ${details.city}`,
      scheduleDate: details.scheduleDate,
      scheduleTime: details.scheduleTime,
      type: 'Order',
      items: [{
        pName: product.pName,
        category: product.pCategory,
        quantity: 1,
        price: product.price
      }],
      totalAmount: product.price,
      paymentStatus: 'Unpaid',
      orderStatus: 'Pending'
    };

    try {
      const token = localStorage.getItem('token');
      toast.loading("Initiating payment gateway...", { id: "buyNow" });

      // 1. Save the order as Pending
      const orderResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      if (!orderResponse.ok) {
        const error = await orderResponse.json();
        toast.error(error.message || "Failed to create order", { id: "buyNow" });
        return;
      }

      const createdOrder = await orderResponse.json();

      // 2. Request PayHere Hash
      const hashResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/payment/hash`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          order_id: createdOrder._id,
          amount: product.price,
          currency: "LKR"
        })
      });

      if (!hashResponse.ok) {
        toast.error("Failed to securely initiate payment", { id: "buyNow" });
        return;
      }

      const { hash, amount, currency } = await hashResponse.json();
      toast.dismiss("buyNow");

      // 3. Define PayHere configuration
      window.payhere.onCompleted = function onCompleted(orderId) {
        toast.success("Payment completed successfully!");
        navigate('/products');
      };

      window.payhere.onDismissed = function onDismissed() {
        toast.error("Payment dismissed");
      };

      window.payhere.onError = function onError(error) {
        console.error("PayHere error:", error);
        toast.error("An error occurred during payment");
      };

      const payment = {
        sandbox: import.meta.env.VITE_PAYHERE_ENV === "sandbox",
        merchant_id: import.meta.env.VITE_PAYHERE_MERCHANT_ID,
        return_url: `${window.location.origin}/products`,
        cancel_url: `${window.location.origin}/products`,
        notify_url: `${import.meta.env.VITE_BACKEND_URL}/api/payment/notify`,
        order_id: createdOrder._id,
        items: `Nirosha Sweet House - ${product.pName}`,
        amount: amount,
        currency: currency,
        hash: hash,
        first_name: details.firstName,
        last_name: details.lastName,
        email: user.email || "customer@example.com",
        phone: details.phone,
        address: `${details.address}, ${details.city}`,
        city: details.city,
        country: "Sri Lanka"
      };

      // 4. Start PayHere
      window.payhere.startPayment(payment);

    } catch (err) {
      console.error("Buy Now error:", err);
      toast.error("An error occurred while placing your order", { id: "buyNow" });
    }
  };

  const handleConfirmOrder = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!deliveryDetails.firstName || !deliveryDetails.phone || !deliveryDetails.address || !deliveryDetails.scheduleDate || !deliveryDetails.scheduleTime) {
      toast.error("Please fill in all required delivery details");
      return;
    }
    setShowDeliveryModal(false);
    handleBuyNow(product, deliveryDetails);
  };

  return (
    <div className={`w-full h-full rounded-xl md:rounded-2xl shadow-sm overflow-hidden bg-white border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group flex flex-col ${isHomepageTheme ? '' : 'font-sans'}`}>
      {/* Clickable Product Details Area */}
      <div
        onClick={() => navigate(`/product/${generateSlug(product.pName, product._id)}`)}
        className="cursor-pointer flex-grow flex flex-col"
      >
        <div className="relative overflow-hidden aspect-[4/3] flex-shrink-0">
          <img
            src={
              product.images?.[0] || product.pImg?.[0] ||
              "https://images.unsplash.com/photo-1621303837174-89787a7d4729"
            }
            alt={product.pName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute top-2 right-2">
            <span className="text-[8px] font-black px-2 py-1 rounded-full bg-white/90 backdrop-blur-sm text-slate-900 border border-slate-100 shadow-sm uppercase tracking-widest">
              {product.pCategory}
            </span>
          </div>
        </div>

        <div className="p-3.5 md:p-4 pb-0 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className={
              isHomepageTheme
                ? "font-serif font-bold text-base md:text-lg lg:text-xl text-slate-900 leading-tight group-hover:text-gold transition-colors line-clamp-2"
                : "text-xs md:text-sm font-black text-slate-900 uppercase tracking-tight leading-tight line-clamp-1 group-hover:text-gold transition-colors"
            }>{product.pName}</h3>
          </div>

          {!hideDescription && (
            <p className="text-[10px] text-slate-400 font-medium line-clamp-2 leading-relaxed mb-3 h-8">{product.description || ""}</p>
          )}

          <div className={`flex justify-between items-end ${hideDescription ? 'mb-1 mt-2' : 'mb-4 mt-auto'}`}>
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Unit Val</span>
              <span className="text-sm md:text-base font-black text-slate-900 tracking-tighter">
                Rs.{product.price?.toLocaleString()}
              </span>
            </div>
            <div className="text-right">
              <span className={`text-[9px] font-black uppercase tracking-widest block mb-1 ${product.stockStatus === "In Stock"
                ? "text-emerald-500"
                : product.stockStatus === "Low Stock"
                  ? "text-amber-500"
                  : "text-rose-500"
                }`}>
                {product.stockStatus || (product.stock > 0 ? "In Stock" : "Out of Stock")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Actions Area */}
      <div className="px-3.5 md:px-4 pb-3.5 md:pb-4 pt-0 mt-auto flex-shrink-0">
        <div className={`flex gap-2 ${hideDescription ? 'pt-2' : 'border-t border-slate-50 pt-3.5'}`}>
          <button
            disabled={product.stockStatus === "Out of Stock" || product.stock === 0}
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
              toast.success(`${product.pName} added to cart!`);
            }}
            className={`flex-1 rounded-lg py-2 text-[9px] font-bold uppercase tracking-wide flex items-center justify-center gap-1 px-1 transition-all ${(product.stockStatus === "Out of Stock" || product.stock === 0)
              ? "bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed"
              : "bg-gold/10 border border-gold/40 text-[#84632A] hover:bg-gold hover:text-white"
              }`}
          >
            <ShoppingCart size={12} />
            {(product.stockStatus === "Out of Stock" || product.stock === 0) ? "Add to cart" : "Add to Cart"}
          </button>
          <button
            disabled={product.stockStatus === "Out of Stock" || product.stock === 0}
            onClick={(e) => {
              e.stopPropagation();
              if (!user) {
                toast.error("Please login to place an order");
                navigate('/login');
                return;
              }
              setDeliveryDetails({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                phone: user.phone || "",
                address: user.address || "",
                city: "Colombo",
                scheduleDate: "",
                scheduleTime: ""
              });
              setShowDeliveryModal(true);
            }}
            className={`flex-1 rounded-lg py-2 text-[9px] font-bold uppercase tracking-wide flex items-center justify-center gap-1 px-1 transition-all active:bg-slate-950 ${(product.stockStatus === "Out of Stock" || product.stock === 0)
              ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
              : "bg-gold text-slate-900 hover:bg-slate-900 hover:text-white shadow-lg shadow-gold/10"
              }`}
          >
            <CreditCard size={12} />
            {(product.stockStatus === "Out of Stock" || product.stock === 0) ? "Sold Out" : "Buy Now"}
          </button>
        </div>
      </div>

      {showDeliveryModal && createPortal(
        <div
          onClick={(e) => e.stopPropagation()}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 relative border border-slate-100 flex flex-col"
          >
            <div className="h-2 w-full bg-gold"></div>

            <button
              onClick={() => setShowDeliveryModal(false)}
              className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-700 transition-all cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="p-8 md:p-10 space-y-5">
              <div>
                <h3 className="text-xl font-serif text-slate-800 tracking-tight font-bold">
                  Delivery <span className="text-gold italic font-normal">Details</span>
                </h3>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1 font-bold">Please confirm your receiving coordinates</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">First Name</label>
                    <input
                      type="text"
                      required
                      value={deliveryDetails.firstName}
                      onChange={(e) => setDeliveryDetails({ ...deliveryDetails, firstName: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-gold/15 focus:border-gold transition-all font-semibold text-slate-800 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Last Name</label>
                    <input
                      type="text"
                      required
                      value={deliveryDetails.lastName}
                      onChange={(e) => setDeliveryDetails({ ...deliveryDetails, lastName: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-gold/15 focus:border-gold transition-all font-semibold text-slate-800 text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={deliveryDetails.phone}
                    onChange={(e) => setDeliveryDetails({ ...deliveryDetails, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-gold/15 focus:border-gold transition-all font-semibold text-slate-800 text-xs"
                    placeholder="e.g. 0771234567"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Delivery Address</label>
                  <input
                    type="text"
                    required
                    value={deliveryDetails.address}
                    onChange={(e) => setDeliveryDetails({ ...deliveryDetails, address: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-gold/15 focus:border-gold transition-all font-semibold text-slate-800 text-xs"
                    placeholder="Street No, Building, Area"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">City</label>
                  <input
                    type="text"
                    required
                    value={deliveryDetails.city}
                    onChange={(e) => setDeliveryDetails({ ...deliveryDetails, city: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-gold/15 focus:border-gold transition-all font-semibold text-slate-800 text-xs"
                    placeholder="e.g. Colombo, Kandy"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Delivery Date</label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={deliveryDetails.scheduleDate}
                      onChange={(e) => setDeliveryDetails({ ...deliveryDetails, scheduleDate: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-gold/15 focus:border-gold transition-all font-semibold text-slate-800 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Delivery Time</label>
                    <input
                      type="time"
                      required
                      value={deliveryDetails.scheduleTime}
                      onChange={(e) => setDeliveryDetails({ ...deliveryDetails, scheduleTime: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-gold/15 focus:border-gold transition-all font-semibold text-slate-800 text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowDeliveryModal(false)}
                  className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-200 hover:text-slate-900 transition-all border border-slate-200/50 shadow-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmOrder}
                  className="flex-[2] py-3 bg-slate-900 text-gold rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2 cursor-pointer"
                >
                  Confirm & Pay
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ProductCard;
