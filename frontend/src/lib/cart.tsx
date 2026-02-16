'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from './axios';
import { useAuth } from '@/hooks/useAuth';

export interface CartItem {
    id?: string;
    menuItemId: string;
    name: string;
    price: number;
    quantity: number;
    restaurantId: string;
    restaurantName: string;
    restaurantCountry?: string; // For Access Control check
    image?: string;
    dietaryType?: string;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (item: CartItem) => Promise<boolean>;
    removeFromCart: (menuItemId: string) => void;
    clearCart: () => void;
    total: number;
    loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);
    const { user, isAuthenticated } = useAuth(); // Assuming useAuth provides isAuthenticated check

    const fetchCart = useCallback(async () => {
        if (!isAuthenticated) return;
        setLoading(true);
        try {
            const response = await api.get('/cart');
            // Transform backend response to CartItem format if needed
            // Backend returns: { items: [...], totalAmount: ... }
            if (response.data && response.data.items) {
                setItems(response.data.items);
            }
        } catch (error) {
            console.error('Failed to fetch cart:', error);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
        } else {
            setItems([]); // Clear local state on logout
        }
    }, [isAuthenticated, fetchCart]);

    const addToCart = async (item: CartItem): Promise<boolean> => {
        // Optimistic UI update could be done here, but let's rely on server response for truth source regarding validation
        try {
            // Check if cart has items from another restaurant (Frontend check as first line of defense)
            if (items.length > 0 && items[0].restaurantId !== item.restaurantId) {
                const confirmReplace = window.confirm(
                    `Your cart contains items from ${items[0].restaurantName}. Do you want to discard the selection and add items from ${item.restaurantName}?`
                );

                if (!confirmReplace) return false;

                await clearCart(); // Clear server cart first
            }

            // Call Backend
            await api.post('/cart/items', {
                menuItemId: item.menuItemId,
                quantity: item.quantity
            });

            await fetchCart(); // Refresh cart from server
            return true; // Return success (or false if replaced, but here we handled replacement explicitly)
        } catch (error) {
            console.error('Failed to add item to cart:', error);
            alert('Failed to add item. ' + ((error as any).response?.data?.message || ''));
            return false;
        }
    };

    const removeFromCart = async (menuItemId: string) => {
        try {
            await api.delete(`/cart/items/${menuItemId}`);
            setItems(prev => prev.filter(i => i.menuItemId !== menuItemId));
        } catch (error) {
            console.error('Failed to remove item:', error);
        }
    };

    const clearCart = async () => {
        try {
            if (isAuthenticated) {
                await api.delete('/cart');
            }
            setItems([]);
        } catch (error) {
            console.error('Failed to clear cart:', error);
        }
    };

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, total, loading }}>
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
