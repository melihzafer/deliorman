"use client";

import { createContext, useContext, useState, useCallback, useMemo, useRef, useEffect } from "react";
import { getRestaurantPhoneDisplay, getRestaurantPhoneNormalized } from "@library/siteContact";

const CartContext = createContext(null);

/**
 * CartProvider - Centralized menu ordering state management
 * Keeps the legacy cart API available while exposing the new order helpers.
 */
export function CartProvider({ children }) {
  const [orderItems, setOrderItems] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationTimeoutRef = useRef(null);
  const restaurantPhone = getRestaurantPhoneDisplay();
  const restaurantPhoneNormalized = getRestaurantPhoneNormalized();

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

  const totalCount = useMemo(
    () => orderItems.reduce((total, item) => total + (Number(item.quantity) || 0), 0),
    [orderItems]
  );

  const addItem = useCallback((item) => {
    if (!item?.title) {
      return;
    }

    const quantityToAdd = Math.max(1, Number(item.quantity) || 1);

    setOrderItems((prev) => {
      const itemIndex = prev.findIndex(
        (existingItem) =>
          existingItem.title === item.title &&
          (existingItem.amount ?? "") === (item.amount ?? "")
      );

      if (itemIndex === -1) {
        return [
          ...prev,
          {
            title: item.title,
            amount: item.amount ?? "",
            price: item.price ?? "",
            notes: item.notes ?? "",
            quantity: quantityToAdd,
          },
        ];
      }

      return prev.map((existingItem, index) =>
        index === itemIndex
          ? {
              ...existingItem,
              price: existingItem.price || item.price || "",
              quantity: existingItem.quantity + quantityToAdd,
            }
          : existingItem
      );
    });

    triggerCartAnimation();
  }, [triggerCartAnimation]);

  const removeItem = useCallback((title, amount = "") => {
    setOrderItems((prev) => {
      const itemIndex = prev.findIndex(
        (item) => item.title === title && (item.amount ?? "") === (amount ?? "")
      );

      if (itemIndex === -1) {
        return prev;
      }

      const nextItems = [...prev];
      const currentItem = nextItems[itemIndex];

      if ((currentItem.quantity || 1) <= 1) {
        nextItems.splice(itemIndex, 1);
        return nextItems;
      }

      nextItems[itemIndex] = {
        ...currentItem,
        quantity: currentItem.quantity - 1,
      };

      return nextItems;
    });

    triggerCartAnimation();
  }, [triggerCartAnimation]);

  const clearOrder = useCallback(() => {
    setOrderItems([]);
    triggerCartAnimation();
  }, [triggerCartAnimation]);

  const getItemQuantity = useCallback((title, amount = "") => {
    const item = orderItems.find(
      (orderItem) => orderItem.title === title && (orderItem.amount ?? "") === (amount ?? "")
    );

    return item?.quantity ?? 0;
  }, [orderItems]);

  const updateNotes = useCallback((title, amount = "", notes = "") => {
    setOrderItems((prev) =>
      prev.map((item) =>
        item.title === title && (item.amount ?? "") === (amount ?? "")
          ? { ...item, notes }
          : item
      )
    );
  }, []);

  const getOrderText = useCallback((introText = "Бих искал/а да поръчам:", thanksText = "Благодаря!") => {
    if (orderItems.length === 0) {
      return "";
    }

    const itemsText = orderItems
      .map((item, index) => {
        const noteText = item.notes ? ` - ${item.notes}` : "";
        const amountText = item.amount ? ` (${item.amount})` : "";

        return `${index + 1}. ${item.title}${amountText} x${item.quantity}${noteText}`;
      })
      .join("\n");

    return `${introText}\n${itemsText}\n\n${thanksText}`;
  }, [orderItems]);

  const generateWhatsAppLink = useCallback((options = {}) => {
    const orderText = getOrderText(options.introText, options.thanksText);

    if (!orderText) {
      return `https://wa.me/${restaurantPhoneNormalized}`;
    }

    return `https://wa.me/${restaurantPhoneNormalized}?text=${encodeURIComponent(orderText)}`;
  }, [getOrderText, restaurantPhoneNormalized]);

  const generatePhoneCallLink = useCallback(() => {
    return `tel:${restaurantPhoneNormalized}`;
  }, [restaurantPhoneNormalized]);

  // Legacy aliases kept for existing shop/product components.
  const addToCart = useCallback((itemOrQuantity = 1) => {
    if (typeof itemOrQuantity === "object" && itemOrQuantity?.title) {
      addItem(itemOrQuantity);
      return;
    }

    triggerCartAnimation();
  }, [addItem, triggerCartAnimation]);

  const removeFromCart = useCallback(() => {
    triggerCartAnimation();
  }, [triggerCartAnimation]);

  const removeItemByIndex = useCallback((index) => {
    setOrderItems((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
    triggerCartAnimation();
  }, [triggerCartAnimation]);

  const updateItemQuantity = useCallback((index, newQuantity) => {
    setOrderItems((prev) => {
      if (!prev[index]) {
        return prev;
      }

      if (newQuantity <= 0) {
        return prev.filter((_, itemIndex) => itemIndex !== index);
      }

      return prev.map((item, itemIndex) =>
        itemIndex === index ? { ...item, quantity: newQuantity } : item
      );
    });
  }, []);

  const contextValue = useMemo(() => ({
    cartTotal: totalCount,
    cartItems: orderItems,
    orderItems,
    totalCount,
    isAnimating,
    addItem,
    removeItem,
    clearOrder,
    getItemQuantity,
    updateNotes,
    getOrderText,
    generateWhatsAppLink,
    generatePhoneCallLink,
    restaurantPhone,
    addToCart,
    removeFromCart,
    removeItemByIndex,
    updateItemQuantity,
  }), [
    totalCount,
    orderItems,
    isAnimating,
    addItem,
    removeItem,
    clearOrder,
    getItemQuantity,
    updateNotes,
    getOrderText,
    generateWhatsAppLink,
    generatePhoneCallLink,
    restaurantPhone,
    addToCart,
    removeFromCart,
    removeItemByIndex,
    updateItemQuantity,
  ]);

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
    throw new Error("useOrder must be used within an OrderProvider (CartProvider)");
  }
  return context;
}

export function useOrder() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useOrder must be used within an OrderProvider (CartProvider)");
  }
  return context;
}

export default CartContext;
