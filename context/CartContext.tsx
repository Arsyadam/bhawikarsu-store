"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: string;
  variantKey: string | null;
  name: string;
  price: number;
  image: string;
  quantity: number;
  color?: string | null;
  size?: string | null;
  sleeve?: string | null;
}

interface CartContextType {
  cart: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string, variantKey: string | null) => void;
  updateQuantity: (id: string, variantKey: string | null, quantity: number) => void;
  clearCart: () => void;
  donation: number;
  setDonation: (amount: number) => void;
  totalItems: number;
  subtotal: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [donation, setDonation] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart and donation from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("bhawikarsu_cart");
    const savedDonation = localStorage.getItem("bhawikarsu_donation");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
    if (savedDonation) {
      setDonation(Number(savedDonation));
    }
    setIsInitialized(true);
  }, []);

  // Save cart and donation to localStorage
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("bhawikarsu_cart", JSON.stringify(cart));
      localStorage.setItem("bhawikarsu_donation", donation.toString());
    }
  }, [cart, donation, isInitialized]);

  const addItem = (newItem: CartItem) => {
    setCart((prev) => {
      const existingItemIndex = prev.findIndex(
        (item) => item.id === newItem.id && item.variantKey === newItem.variantKey
      );

      if (existingItemIndex > -1) {
        const updatedCart = [...prev];
        updatedCart[existingItemIndex].quantity += newItem.quantity;
        return updatedCart;
      }

      return [...prev, newItem];
    });
  };

  const removeItem = (id: string, variantKey: string | null) => {
    setCart((prev) => prev.filter((item) => !(item.id === id && item.variantKey === variantKey)));
  };

  const updateQuantity = (id: string, variantKey: string | null, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id, variantKey);
      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        item.id === id && item.variantKey === variantKey ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setDonation(0);
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalAmount = subtotal + donation;

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        donation,
        setDonation,
        totalItems,
        subtotal,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
