'use client';

import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useAuth } from '@/hooks/useAuth'; // uses AuthContext
import { useCart } from '@/lib/cart';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Navbar() {
    const { user, logout, loading } = useAuth();
    const { items } = useCart();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    const totalItems = items.length;

    return (
        <AppBar position="sticky" elevation={0} sx={{ borderBottom: '1px solid #f0f0f0', backgroundColor: 'background.paper' }}>
            <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
                <Box display="flex" alignItems="center">
                    <Typography
                        variant="h5"
                        component="div"
                        sx={{
                            fontWeight: 800,
                            color: 'primary.main',
                            letterSpacing: '-0.5px',
                            cursor: 'pointer'
                        }}
                    >
                        <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
                            Slooze<span style={{ color: '#212121' }}>Food</span>
                        </Link>
                    </Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={1}>
                    {user ? (
                        <>
                            <Box sx={{ mr: 2, display: { xs: 'none', md: 'block' }, textAlign: 'right' }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                    {user.email}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {user.role}
                                </Typography>
                            </Box>

                            <Button
                                color="inherit"
                                onClick={() => router.push('/orders')}
                                sx={{ borderRadius: 2 }}
                            >
                                Orders
                            </Button>

                            <IconButton
                                size="large"
                                aria-label="show cart items"
                                onClick={() => router.push('/cart')}
                                sx={{ color: 'text.primary' }}
                            >
                                <Badge badgeContent={totalItems} color="primary">
                                    <ShoppingCartIcon />
                                </Badge>
                            </IconButton>

                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={handleLogout}
                                sx={{ borderRadius: 50, px: 3, ml: 1 }}
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        !loading && (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => router.push('/login')}
                                sx={{ px: 4 }}
                            >
                                Login
                            </Button>
                        )
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
}
