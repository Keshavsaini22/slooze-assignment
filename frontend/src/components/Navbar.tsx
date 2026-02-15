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
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
                            Slooze Food
                        </Link>
                    </Typography>

                    {user && (
                        <>
                            <Typography variant="subtitle1" sx={{ mr: 2 }}>
                                Hello, {user.email} ({user.role})
                            </Typography>

                            <Button color="inherit" onClick={() => router.push('/orders')} sx={{ mr: 2 }}>
                                My Orders
                            </Button>

                            <IconButton
                                size="large"
                                aria-label="show cart items"
                                color="inherit"
                                onClick={() => router.push('/cart')}
                                sx={{ mr: 2 }}
                            >
                                <Badge badgeContent={totalItems} color="error">
                                    <ShoppingCartIcon />
                                </Badge>
                            </IconButton>

                            <Button color="inherit" onClick={handleLogout}>Logout</Button>
                        </>
                    )}

                    {!user && !loading && (
                        <Button color="inherit" onClick={() => router.push('/login')}>Login</Button>
                    )}
                </Toolbar>
            </AppBar>
        </Box>
    );
}
