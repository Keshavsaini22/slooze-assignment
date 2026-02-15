'use client';

import React, { useState } from 'react';
import { useCart, CartItem } from '@/lib/cart';
import { useAuth } from '@/hooks/useAuth';
import { Container, Typography, Box, List, ListItem, ListItemText, IconButton, Button, Divider, Alert, CircularProgress, ListItemAvatar, Avatar, Chip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function CartPage() {
    const { items, addToCart, removeFromCart, clearCart, total } = useCart();
    const { user, loading } = useAuth();
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleQuantityChange = (item: CartItem, delta: number) => {
        if (item.quantity + delta > 0) {
            addToCart({ ...item, quantity: delta });
        } else {
            removeFromCart(item.menuItemId);
        }
    };

    const handleCreateOrder = async () => {
        if (!user) {
            router.push('/login?from=/cart');
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            const restaurantIds = new Set(items.map(i => i.restaurantId));
            if (restaurantIds.size > 1) {
                setError('Please order from one restaurant at a time. Clear cart or remove items.');
                setSubmitting(false);
                return;
            }

            const restaurantId = restaurantIds.values().next().value;

            const orderPayload = {
                restaurantId,
                items: items.map(i => ({
                    menuItemId: i.menuItemId,
                    quantity: i.quantity
                }))
            };

            await api.post('/orders', orderPayload);
            setSuccess(true);
            clearCart();
            setTimeout(() => {
                router.push('/orders'); // Redirect to Orders page
            }, 1000);


        } catch (err: unknown) {
            console.error(err);
            const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to create order.';
            setError(message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <CircularProgress />;

    if (success) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Alert severity="success">Order created successfully! Redirecting to My Orders...</Alert>
            </Container>
        );
    }

    if (items.length === 0) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Typography variant="h5">Your cart is empty.</Typography>
                <Button variant="contained" sx={{ mt: 2 }} onClick={() => router.push('/')}>
                    Browse Restaurants
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Your Cart {items.length > 0 && items[0].restaurantName ? `from ${items[0].restaurantName}` : ''}
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <List>
                {items.map((item) => (
                    <React.Fragment key={item.menuItemId}>
                        <ListItem
                            secondaryAction={
                                <IconButton edge="end" aria-label="delete" onClick={() => removeFromCart(item.menuItemId)}>
                                    <DeleteIcon />
                                </IconButton>
                            }
                        >
                            <ListItemAvatar>
                                <Avatar src={item.image} variant="rounded" alt={item.name}>
                                    {item.name.charAt(0)}
                                </Avatar>
                            </ListItemAvatar>

                            <ListItemText
                                primary={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        {item.name}
                                        {item.dietaryType && (
                                            <Chip
                                                label={item.dietaryType}
                                                size="small"
                                                color={item.dietaryType === 'VEG' ? 'success' : item.dietaryType === 'NON_VEG' ? 'error' : 'warning'}
                                                variant="outlined"
                                                sx={{ height: 20, fontSize: '0.7rem' }}
                                            />
                                        )}
                                    </Box>
                                }
                                secondary={`$${item.price} x ${item.quantity}`}
                            />
                            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                                <IconButton size="small" onClick={() => handleQuantityChange(item, -1)}>
                                    <RemoveIcon />
                                </IconButton>
                                <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                                <IconButton size="small" onClick={() => handleQuantityChange(item, 1)}>
                                    <AddIcon />
                                </IconButton>
                            </Box>
                            <Typography variant="subtitle1" sx={{ minWidth: 60, textAlign: 'right' }}>
                                ${(item.price * item.quantity).toFixed(2)}
                            </Typography>
                        </ListItem>
                        <Divider />
                    </React.Fragment>
                ))}
            </List>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5">
                    Total: ${total.toFixed(2)}
                </Typography>
                <Box>
                    <Button color="inherit" onClick={clearCart} sx={{ mr: 2 }}>
                        Clear Cart
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={handleCreateOrder}
                        disabled={submitting}
                    >
                        {submitting ? 'Creating Order...' : 'Create Order'}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}
