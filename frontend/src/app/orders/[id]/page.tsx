'use client';

import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, List, ListItem, ListItemText, Chip, CircularProgress, Button, TextField, Alert, Divider, Avatar, ListItemAvatar, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/axios';
import { useRouter, useParams } from 'next/navigation';
import { Order, OrderItem, OrderService } from '@/services/order.service';

export default function OrderDetailPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const { id } = params;

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [address, setAddress] = useState('');
    const [placing, setPlacing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [cancelling, setCancelling] = useState(false);
    const [editPayment, setEditPayment] = useState(false);
    const [newPaymentMethod, setNewPaymentMethod] = useState('CASH');

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
            return;
        }

        if (user && id) {
            fetchOrder();
        }
    }, [user, id, authLoading]);

    const fetchOrder = async () => {
        try {
            const res = await api.get(`/orders/${id}`);
            setOrder(res.data);
            if (res.data.address) setAddress(res.data.address);
        } catch (error) {
            console.error('Failed to fetch order:', error);
            setError('Failed to load order.');
        } finally {
            setLoading(false);
        }
    };

    const handlePlaceOrder = async () => {
        if (!address.trim()) {
            setError('Please enter a delivery address.');
            return;
        }

        setPlacing(true);
        setError(null);

        try {
            await api.put(`/orders/${id}/place`, {
                address,
                paymentMethod: newPaymentMethod || 'CASH'
            });
            setSuccess(true);
            fetchOrder();
        } catch (err: unknown) {
            console.error(err);
            const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to place order.';
            setError(message);
        } finally {
            setPlacing(false);
        }
    };

    const handleCancelOrder = async () => {
        if (!confirm('Are you sure you want to cancel this order?')) {
            return;
        }
        setCancelling(true);
        setError(null);
        try {
            await api.put(`/orders/${id}/cancel`);
            setSuccess(true);
            fetchOrder();
        } catch (err: unknown) {
            console.error(err);
            const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to cancel order.';
            setError(message);
        } finally {
            setCancelling(false);
        }
    };

    const handleUpdatePaymentMethod = async () => {
        try {
            await OrderService.updatePaymentMethod(id as string, newPaymentMethod);
            setEditPayment(false);
            setSuccess(true);
            fetchOrder();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: unknown) {
            console.error(err);
            const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to update payment method.';
            setError(message);
        }
    };

    if (authLoading || loading) return <CircularProgress />;
    if (!order) return <Container><Typography>Order not found.</Typography></Container>;

    const isPending = order.status === 'PENDING';
    const canPlace = (user?.role === 'ADMIN' || user?.role === 'MANAGER') && isPending;

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Button onClick={() => router.push('/orders')} sx={{ mb: 2 }}>&larr; Back to Orders</Button>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">Order #{order.id.slice(0, 8)}</Typography>
                <Chip
                    label={order.status}
                    color={order.status === 'PENDING' ? 'warning' : 'success'}
                    size="medium"
                />
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>Order placed successfully!</Alert>}

            <Box sx={{ bgcolor: 'background.paper', p: 3, borderRadius: 1, mb: 3 }}>
                <Typography variant="h6" gutterBottom>items</Typography>
                <List>
                    {order.items?.map((item: OrderItem) => (
                        <React.Fragment key={item.id}>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar src={item.menuItem?.image} alt={item.menuItem?.name}>
                                        {item.menuItem?.name?.charAt(0)}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={item.menuItem?.name}
                                    secondary={`Qty: ${item.quantity} | $${item.price}`}
                                />
                                <Typography fontWeight="bold">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </Typography>
                            </ListItem>
                            <Divider />
                        </React.Fragment>
                    ))}
                </List>
                <Box sx={{ textAlign: 'right', mt: 2 }}>
                    <Typography variant="h5">Total: ${order.totalAmount.toFixed(2)}</Typography>
                </Box>
            </Box>

            <Box sx={{ bgcolor: 'background.paper', p: 3, borderRadius: 1, mb: 3 }}>
                <Typography variant="h6" gutterBottom>Payment Details</Typography>
                {editPayment ? (
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 2 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Payment Method</InputLabel>
                            <Select
                                value={newPaymentMethod}
                                label="Payment Method"
                                onChange={(e) => setNewPaymentMethod(e.target.value)}
                            >
                                <MenuItem value="CASH">CASH</MenuItem>
                                <MenuItem value="CARD">CARD</MenuItem>
                                <MenuItem value="UPI">UPI</MenuItem>
                            </Select>
                        </FormControl>
                        <Button variant="contained" onClick={handleUpdatePaymentMethod}>Save</Button>
                        <Button onClick={() => setEditPayment(false)}>Cancel</Button>
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Typography variant="body1">
                                Method: <strong>{order.payment?.method || 'N/A'}</strong>
                            </Typography>
                            <Typography variant="body1" sx={{ mt: 1 }}>
                                Status: <Chip label={order.payment?.status || 'PENDING'} size="small" color={order.payment?.status === 'SUCCESS' ? 'success' : 'warning'} />
                            </Typography>
                        </Box>
                        {user?.role === 'ADMIN' && (
                            <Button size="small" variant="outlined" onClick={() => {
                                setNewPaymentMethod(order.payment?.method || 'CASH');
                                setEditPayment(true);
                            }}>
                                Edit Payment
                            </Button>
                        )}
                    </Box>
                )}
            </Box>

            {(canPlace || order.address) && (order.status !== 'CANCELLED') && (
                <Box sx={{ bgcolor: 'background.paper', p: 3, borderRadius: 1 }}>
                    <Typography variant="h6" gutterBottom>Delivery Details</Typography>

                    {canPlace ? (
                        <>
                            <TextField
                                fullWidth
                                label="Delivery Address"
                                multiline
                                rows={3}
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                sx={{ mb: 2 }}
                                disabled={placing}
                            />
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel>Payment Method</InputLabel>
                                <Select
                                    value={newPaymentMethod || 'CASH'}
                                    label="Payment Method"
                                    onChange={(e) => setNewPaymentMethod(e.target.value)}
                                    disabled={placing || user?.role === 'MANAGER'}
                                >
                                    <MenuItem value="CASH">Cash on Delivery (CASH)</MenuItem>
                                    <MenuItem value="CARD">Card</MenuItem>
                                    <MenuItem value="UPI">UPI</MenuItem>
                                </Select>
                            </FormControl>
                            <Button
                                variant="contained"
                                size="large"
                                fullWidth
                                onClick={handlePlaceOrder}
                                disabled={placing}
                            >
                                {placing ? 'Placing Order...' : 'Confirm & Place Order'}
                            </Button>
                        </>
                    ) : (
                        <Typography variant="body1">{order.address || 'No address provided (Pick up?)'}</Typography>
                    )}
                </Box>
            )
            }

            {
                (user?.role === 'ADMIN' || user?.role === 'MANAGER') &&
                order.status !== 'CANCELLED' &&
                order.status !== 'COMPLETED' && (
                    <Box sx={{ mt: 3, textAlign: 'right' }}>
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={handleCancelOrder}
                            disabled={cancelling}
                        >
                            {cancelling ? 'Cancelling...' : 'Cancel Order'}
                        </Button>
                    </Box>
                )
            }

            {
                isPending && !canPlace && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                        Waiting for Manager/Admin to confirm and place this order.
                    </Alert>
                )
            }
        </Container >
    );
}
