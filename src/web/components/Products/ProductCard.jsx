import React from "react";
import { ShoppingCart, CreditCard } from "lucide-react";
import { useCart } from "../../../shared/context/CartContext";
import { useAuth } from "../../../shared/context/AuthContext";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product, hideDescription = false, isHomepageTheme = false }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const generateSlug = (name, id) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + id;
  };

  const handleBuyNow = async (product) => {
    if (!user) {
      toast.error("Please login to place an order");
      navigate('/login');
      return;
    }

    const orderData = {
      customerName: `${user.firstName} ${user.lastName}`,
      phone: user.phone || "0000000000",
      address: user.address || "Web Order",
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
        first_name: user.firstName,
        last_name: user.lastName,
        email: user.email || "customer@example.com",
        phone: user.phone || "0000000000",
        address: user.address || "Web Order",
        city: "Colombo",
        country: "Sri Lanka"
      };

      // 4. Start PayHere
      window.payhere.startPayment(payment);

    } catch (err) {
      console.error("Buy Now error:", err);
      toast.error("An error occurred while placing your order", { id: "buyNow" });
    }
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
              handleBuyNow(product);
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
    </div>
  );
};

export default ProductCard;
