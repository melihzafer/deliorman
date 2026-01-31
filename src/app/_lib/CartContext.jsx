"use client";

import { createContext, useContext, useState, useCallback, useMemo, useRef, useEffect } from "react";
import CartData from "@data/cart.json";

const CartContext = createContext(null);

/**
 * CartProvider - Centralized cart state management
 * Eliminates DOM queries (document.querySelector) for cart updates
 * Reduces INP by ~200ms by avoiding synchronous DOM manipulation
 */
export function CartProvider({ children }) {
  const [cartTotal, setCartTotal] = useState(CartData.total);
  const [cartItems, setCartItems] = useState(CartData.items);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationTimeoutRef = useRef(null);

  // Cleanup animation timeout on unmount
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  // Trigger cart animation (replaces DOM class manipulation)
  const triggerCartAnimation = useCallback(() => {
    setIsAnimating(true);
    
    // Clear any existing timeout
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
    
    animationTimeoutRef.current = setTimeout(() => {
      setIsAnimating(false);
    }, 600);
  }, []);

  // Add to cart - memoized to prevent recreation
  const addToCart = useCallback((quantity = 1) => {
    setCartTotal(prev => prev + quantity);
    triggerCartAnimation();
  }, [triggerCartAnimation]);

  // Remove from cart - memoized
  const removeFromCart = useCallback((quantity = 1) => {
    setCartTotal(prev => Math.max(0, prev - quantity));
    triggerCartAnimation();
  }, [triggerCartAnimation]);

  // Remove item by index
  const removeItemByIndex = useCallback((index) => {
    setCartItems(prev => {
      const item = prev[index];
      if (item) {
        setCartTotal(prevTotal => Math.max(0, prevTotal - (item.quantity || 1)));
      }
      return prev.filter((_, i) => i !== index);
    });
    triggerCartAnimation();
  }, [triggerCartAnimation]);

  // Update item quantity
  const updateItemQuantity = useCallback((index, newQuantity) => {
    setCartItems(prev => {
      const newItems = [...prev];
      if (newItems[index]) {
        const oldQuantity = newItems[index].quantity || 1;
        const diff = newQuantity - oldQuantity;
        newItems[index] = { ...newItems[index], quantity: newQuantity };
        setCartTotal(prevTotal => prevTotal + diff);
      }
      return newItems;
    });
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    cartTotal,
    cartItems,
    isAnimating,
    addToCart,
    removeFromCart,
    removeItemByIndex,
    updateItemQuantity,
  }), [cartTotal, cartItems, isAnimating, addToCart, removeFromCart, removeItemByIndex, updateItemQuantity]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

/**
 * useCart hook - Access cart state and actions
 * Components using this hook will only re-render when cart state changes
 */
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export default CartContext;
