'use client';

import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, List, Chip, CircularProgress, Tabs, Tab, Card, CardContent } from '@mui/material';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { Order, OrderItem } from '@/services/order.service';

export default function OrdersPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState(0);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
            return;
        }

        if (user) {
            fetchOrders();
        }
    }, [user, authLoading]);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/orders');
            setOrders(res.data);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
    };

    if (authLoading || loading) return <CircularProgress />;

    const pendingOrders = orders.filter(o => o.status === 'PENDING');
    const confirmedOrders = orders.filter(o => ['CONFIRMED', 'PREPARING', 'READY', 'COMPLETED'].includes(o.status));
    const cancelledOrders = orders.filter(o => o.status === 'CANCELLED');

    const getCurrentOrders = () => {
        switch (tab) {
            case 0: return pendingOrders;
            case 1: return confirmedOrders;
            case 2: return cancelledOrders;
            default: return [];
        }
    };

    const currentOrders = getCurrentOrders();

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>My Orders</Typography>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs value={tab} onChange={handleTabChange} aria-label="order tabs">
                    <Tab label={`Pending (${pendingOrders.length})`} />
                    <Tab label="History" />
                    <Tab label={`Cancelled (${cancelledOrders.length})`} />
                </Tabs>
            </Box>

            <List>
                {currentOrders.map((order) => (
                    <Card key={order.id} sx={{ mb: 2, cursor: 'pointer' }} onClick={() => router.push(`/orders/${order.id}`)}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box>
                                    <Typography variant="h6">
                                        {order.restaurant?.name || 'Unknown Restaurant'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Order ID: {order.id.slice(0, 8)}...
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Date: {new Date(order.createdAt).toLocaleDateString()}
                                    </Typography>
                                </Box>
                                <Box sx={{ textAlign: 'right' }}>
                                    <Chip
                                        label={order.status}
                                        color={
                                            order.status === 'PENDING' ? 'warning' :
                                                order.status === 'CANCELLED' ? 'error' :
                                                    order.status === 'CONFIRMED' ? 'info' : 'success'
                                        }
                                        size="small"
                                        sx={{ mb: 1 }}
                                    />
                                    <Typography variant="h6">
                                        ${order.totalAmount.toFixed(2)}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ mt: 1 }}>
                                {order.items?.map((item: OrderItem) => (
                                    <Typography key={item.id} variant="body2">
                                        {item.quantity}x {item.menuItem?.name || 'Item'}
                                    </Typography>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </List>

            {currentOrders.length === 0 && (
                <Typography variant="body1" sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}>
                    No orders found.
                </Typography>
            )}
        </Container>
    );
}
