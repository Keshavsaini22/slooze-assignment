'use client';

import React, { createContext, useContext, useState } from 'react';

export interface CartItem {
    menuItemId: string;
    name: string;
    price: number;
    quantity: number;
    restaurantId: string;
    restaurantName: string;
    image?: string;
    dietaryType?: string;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (item: CartItem) => boolean;
    removeFromCart: (menuItemId: string) => void;
    clearCart: () => void;
    total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    const addToCart = (item: CartItem): boolean => {
        if (items.length > 0 && items[0].restaurantId !== item.restaurantId) {
            setItems([item]);
            return true;
        }

        setItems((prev) => {
            const existing = prev.find((i) => i.menuItemId === item.menuItemId);
            if (existing) {
                return prev.map((i) =>
                    i.menuItemId === item.menuItemId
                        ? { ...i, quantity: i.quantity + item.quantity }
                        : i
                );
            }
            return [...prev, item];
        });
        return false;
    };

    const removeFromCart = (menuItemId: string) => {
        setItems(prev => prev.filter(i => i.menuItemId !== menuItemId));
    };

    const clearCart = () => setItems([]);

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, total }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
