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

  const addToCart = (product, quantity = 1, customProps = {}) => {
    if (!product || !product._id) return;
    setCart((prevCart) => {
      const currentCart = Array.isArray(prevCart) ? prevCart : [];
      
      const existingItemIndex = currentCart.findIndex((item) => {
        if (item._id !== product._id) return false;
        if (customProps.selectedFlavor && item.selectedFlavor !== customProps.selectedFlavor) return false;
        if (customProps.cakeMessage && item.cakeMessage !== customProps.cakeMessage) return false;
        if (customProps.selectedWeight?.weight && item.selectedWeight?.weight !== customProps.selectedWeight?.weight) return false;
        return true;
      });

      if (existingItemIndex > -1) {
        const updatedCart = [...currentCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + quantity
        };
        return updatedCart;
      }

      // Generate a unique composite key for the item configuration
      const flavorStr = customProps.selectedFlavor || "";
      const msgStr = customProps.cakeMessage || "";
      const weightStr = customProps.selectedWeight?.weight || "";
      const cartItemId = `${product._id}_${flavorStr}_${msgStr}_${weightStr}`;

      return [
        ...currentCart,
        {
          ...product,
          cartItemId,
          quantity,
          ...customProps
        }
      ];
    });
  };

  const removeFromCart = (cartItemId) => {
    setCart((prevCart) => prevCart.filter((item) => (item.cartItemId || item._id) !== cartItemId));
  };

  const updateQuantity = (cartItemId, quantity) => {
    if (quantity < 1) return;
    setCart((prevCart) =>
      prevCart.map((item) =>
        (item.cartItemId || item._id) === cartItemId ? { ...item, quantity } : item
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
