'use client';

import { useCart } from '@/lib/cart';
import { OrderService } from '@/services/order.service';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
    const { items, total, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    if (items.length === 0) {
        return <div className="p-8 text-center">Your cart is empty.</div>;
    }

    const handleCheckout = async () => {
        setLoading(true);
        try {
            const restaurantId = items[0].restaurantId;

            await OrderService.create({
                restaurantId,
                items: items.map(i => ({
                    menuItemId: i.menuItemId,
                    quantity: i.quantity
                }))
            });

            clearCart();
            alert('Order placed successfully!');
            router.push('/');
        } catch (error) {
            console.error(error);
            alert('Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen p-8 bg-gray-50 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Checkout</h1>

            <div className="bg-white p-6 rounded shadow-md mb-6">
                <h2 className="text-xl font-semibold mb-4">Cart Items</h2>
                <ul className="divide-y">
                    {items.map((item) => (
                        <li key={item.menuItemId} className="py-2 flex justify-between">
                            <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                            </div>
                            <p>${(item.price * item.quantity).toFixed(2)}</p>
                        </li>
                    ))}
                </ul>
                <div className="mt-4 pt-4 border-t flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                </div>
            </div>

            <div className="bg-white p-6 rounded shadow-md mb-6">
                <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                        <input type="radio" name="payment" defaultChecked /> Credit Card
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="radio" name="payment" /> Cash
                    </label>
                </div>
            </div>

            <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 rounded font-semibold text-lg hover:bg-green-700 disabled:opacity-50"
            >
                {loading ? 'Processing...' : 'Place Order'}
            </button>
        </div>
    );
}
