import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      const parsed = savedCart ? JSON.parse(savedCart) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("Failed to parse cart from local storage", e);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const isSameCustomization = (c1, c2) => {
    if (!c1 && !c2) return true;
    if (!c1 || !c2) return false;
    return c1.message === c2.message && c1.flavor === c2.flavor && c1.weight === c2.weight;
  };

  const addToCart = (product) => {
    if (!product || !product._id) return;
    setCart((prevCart) => {
      const currentCart = Array.isArray(prevCart) ? prevCart : [];
      const existingItem = currentCart.find((item) => 
        item._id === product._id && isSameCustomization(item.customization, product.customization)
      );
      if (existingItem) {
        return currentCart.map((item) =>
          (item._id === product._id && isSameCustomization(item.customization, product.customization))
            ? { ...item, quantity: item.quantity + (product.quantity || 1) } 
            : item
        );
      }
      return [...currentCart, { ...product, quantity: product.quantity || 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
