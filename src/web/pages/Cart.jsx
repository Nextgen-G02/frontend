import React, { useState, useEffect } from 'react';
import { useCart } from '../../shared/context/CartContext';
import { useAuth } from '../../shared/context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, CheckCircle2, Circle, X, ShoppingCart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [detailProduct, setDetailProduct] = useState(null);
  const [isOrdering, setIsOrdering] = useState(false);

  const toggleSelection = (cartItemId) => {
    setSelectedItems(prev => {
      const next = new Set(prev);
      if (next.has(cartItemId)) {
        next.delete(cartItemId);
      } else {
        next.add(cartItemId);
      }
      return next;
    });
  };

  // If nothing is selected, show the total of all items in the cart.
  // Otherwise, show the total of only the selected items.
  const selectedTotal = selectedItems.size === 0
    ? cart.reduce((total, item) => total + (item.price * item.quantity), 0)
    : cart
      .filter(item => selectedItems.has(item.cartItemId || item._id))
      .reduce((total, item) => total + (item.price * item.quantity), 0);

  const handleOrder = async () => {
    if (!user) {
      toast.error("Please login to place an order");
      navigate('/login');
      return;
    }

    const itemsToOrder = selectedItems.size === 0
      ? cart
      : cart.filter(item => selectedItems.has(item.cartItemId || item._id));

    if (itemsToOrder.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsOrdering(true);
    const orderData = {
      customerName: `${user.firstName} ${user.lastName}`,
      phone: user.phone || "0000000000",
      address: user.address || "Web Order",
      type: 'Order',
      source: 'Website',
      items: itemsToOrder.map(item => ({
        pName: item.pName,
        category: item.pCategory,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount: selectedTotal,
      paymentStatus: 'Unpaid',
      orderStatus: 'Pending'
    };

    try {
      const token = localStorage.getItem('token');

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
        toast.error(error.message || "Failed to create order");
        setIsOrdering(false);
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
          amount: selectedTotal,
          currency: "LKR"
        })
      });

      if (!hashResponse.ok) {
        toast.error("Failed to securely initiate payment");
        setIsOrdering(false);
        return;
      }

      const { hash, amount, currency } = await hashResponse.json();

      // 3. Define PayHere configuration
      payhere.onCompleted = function onCompleted(orderId) {
        toast.success("Payment completed successfully!");
        itemsToOrder.forEach(item => removeFromCart(item.cartItemId || item._id));
        setSelectedItems(new Set());
        setIsOrdering(false);
        navigate('/products');
      };

      payhere.onDismissed = function onDismissed() {
        toast.error("Payment dismissed");
        setIsOrdering(false);
      };

      payhere.onError = function onError(error) {
        console.error("PayHere error:", error);
        toast.error("An error occurred during payment");
        setIsOrdering(false);
      };

      const payment = {
        sandbox: import.meta.env.VITE_PAYHERE_ENV === "sandbox",
        merchant_id: import.meta.env.VITE_PAYHERE_MERCHANT_ID,
        return_url: `${window.location.origin}/products`,
        cancel_url: `${window.location.origin}/cart`,
        notify_url: `${import.meta.env.VITE_BACKEND_URL}/api/payment/notify`,
        order_id: createdOrder._id,
        items: "Nirosha Sweet House Order",
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
      payhere.startPayment(payment);

    } catch (err) {
      console.error("Order error:", err);
      toast.error("An error occurred while placing your order");
      setIsOrdering(false);
    }
  };

  return (
    <div className="bg-slate-50/30 min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/products" className="p-2 hover:bg-white rounded-full transition-colors text-slate-400 hover:text-slate-900">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight uppercase">Your Shopping Cart</h1>
          </div>

          {cart.length === 0 ? (
            <div className="bg-white rounded-[32px] p-12 md:p-20 text-center shadow-xl shadow-black/5 border border-slate-50 animate-in fade-in zoom-in duration-500">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <ShoppingBag size={48} className="text-slate-200" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">Your cart is empty</h2>
              <p className="text-slate-400 font-medium mb-10 max-w-md mx-auto text-sm md:text-base">
                Looks like you haven't added any of our delicious treats to your collection yet.
              </p>
              <Link
                to="/products"
                className="inline-flex items-center gap-3 bg-slate-900 text-gold px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-primary hover:text-white transition-all duration-500 shadow-2xl shadow-slate-200"
              >
                Add To cart

              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Items List */}
              <div className="lg:col-span-2 space-y-4">
                {cart.map((item) => {
                  const itemId = item.cartItemId || item._id;
                  const isSelected = selectedItems.has(itemId);
                  return (
                    <div
                      key={itemId}
                      className={`bg-white p-4 md:p-6 rounded-[24px] md:rounded-[32px] shadow-sm border transition-all flex items-center gap-4 md:gap-6 group hover:shadow-xl hover:shadow-black/5 ${isSelected ? 'border-primary/20 bg-white' : 'border-slate-50 opacity-70'}`}
                    >
                      {/* Selection Radio/Toggle */}
                      <button
                        onClick={() => toggleSelection(itemId)}
                        className={`p-1 transition-all duration-300 ${isSelected ? 'text-primary' : 'text-slate-200 hover:text-slate-300'}`}
                      >
                        {isSelected ? <CheckCircle2 size={24} className="fill-primary/10" /> : <Circle size={24} />}
                      </button>

                      <div
                        onDoubleClick={() => setDetailProduct(item)}
                        className="w-20 h-20 md:w-28 md:h-28 rounded-2xl overflow-hidden shrink-0 border border-slate-50 cursor-pointer"
                      >
                        <img src={item.images?.[0] || "/images/cake_main.png"} alt={item.pName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" title="Double click for details" />
                      </div>

                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h3 className="font-black text-slate-900 text-sm md:text-lg uppercase tracking-tight leading-none">{item.pName}</h3>
                          {(item.selectedFlavor || item.cakeMessage || item.selectedWeight) && (
                            <span className="px-2 py-0.5 bg-[#F3EAD3] text-[#84632A] border border-[#DFCE9F] text-[8px] md:text-[9px] font-black uppercase tracking-wider rounded-md shadow-sm">
                              Customized
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">{item.pCategory}</p>
                        
                        {/* Customization Details */}
                        {(item.selectedFlavor || item.cakeMessage || item.selectedWeight) && (
                          <div className="text-[11px] text-[#84632A] space-y-0.5 mb-3 bg-[#FAF6F0]/80 p-2.5 rounded-xl border border-[#EADFC9]/60 max-w-xs md:max-w-sm">
                            {item.selectedWeight && (
                              <div><span className="font-semibold text-[#84632A]/80">Weight:</span> {item.selectedWeight.weight}</div>
                            )}
                            {item.selectedFlavor && (
                              <div><span className="font-semibold text-[#84632A]/80">Flavor:</span> {item.selectedFlavor}</div>
                            )}
                            {item.cakeMessage && (
                              <div><span className="font-semibold text-[#84632A]/80">Message:</span> "{item.cakeMessage}"</div>
                            )}
                          </div>
                        )}

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(itemId, item.quantity - 1)}
                            className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-900 transition-colors border border-slate-100"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="font-black text-slate-900 w-8 text-center text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(itemId, item.quantity + 1)}
                            className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-900 transition-colors border border-slate-100"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="text-right flex flex-col justify-between items-end h-20 md:h-28">
                        <button
                          onClick={() => removeFromCart(itemId)}
                          className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 size={20} />
                        </button>
                        <div className="font-black text-slate-900 text-sm md:text-base">
                          Rs.{(item.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  );
                })}

                <button
                  onClick={clearCart}
                  className="text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-rose-500 transition-colors ml-4 mt-4"
                >
                  Clear Shopping Cart
                </button>
              </div>

              {/* Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white p-8 rounded-[32px] shadow-xl shadow-black/5 border border-slate-50 sticky top-28">
                  <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-8">Order Summary</h2>

                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center text-sm font-medium text-slate-400 uppercase tracking-widest">
                      <span>Subtotal</span>
                      <span className="text-slate-900 font-black">Rs.{selectedTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-medium text-slate-400 uppercase tracking-widest">
                      <span>Delivery</span>
                      {/* <span className="text-emerald-500 font-black">Calculated at checkout</span> */}
                    </div>
                    <div className="h-px bg-slate-50 my-4"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Total</span>
                      <span className="text-2xl font-black text-slate-900">Rs.{selectedTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleOrder}
                    disabled={isOrdering || cart.length === 0}
                    className="w-full bg-slate-900 text-gold py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] shadow-xl shadow-slate-200 hover:bg-primary hover:text-white transition-all duration-500 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isOrdering ? 'Processing...' : 'Order product'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Product Details Modal */}
      {detailProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[32px] md:rounded-[48px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 relative">
            <button
              onClick={() => setDetailProduct(null)}
              className="absolute top-6 right-6 z-10 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-400 transition-all"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col md:flex-row h-full">
              {/* Modal Image */}
              <div className="md:w-1/2 aspect-square md:aspect-auto overflow-hidden">
                <img
                  src={detailProduct.images?.[0] || "https://images.unsplash.com/photo-1621303837174-89787a7d4729"}
                  alt={detailProduct.pName}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Modal Content */}
              <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <div className="space-y-6">
                  <div>
                    <span className="px-3 py-1 bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-[0.3em] rounded-full border border-slate-100">
                      {detailProduct.pCategory}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter mt-4 leading-none">
                      {detailProduct.pName}
                    </h2>
                  </div>

                  <p className="text-slate-500 text-sm leading-relaxed font-medium italic">
                    {detailProduct.description || "No detailed description available for this masterpiece."}
                  </p>

                  <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-1">Premium Value</span>
                      <span className="text-2xl font-black text-slate-900">Rs.{detailProduct.price?.toLocaleString()}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setDetailProduct(null)}
                    className="w-full bg-slate-900 text-gold py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] shadow-xl shadow-slate-200 hover:bg-primary hover:text-white transition-all duration-500 mt-4 flex items-center justify-center gap-3"
                  >
                    Return to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Cart;
