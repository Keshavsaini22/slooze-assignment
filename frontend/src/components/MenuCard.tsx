'use client';

import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Chip, Button, Snackbar } from '@mui/material';
import { MenuItem } from '../services/restaurant.service';
import { useCart } from '@/lib/cart';
import { useAuth } from '@/hooks/useAuth';

interface MenuCardProps {
    item: MenuItem;
    restaurantName: string;
}

const MenuCard: React.FC<MenuCardProps> = ({ item, restaurantName }) => {
    const { addToCart } = useCart();
    const { user } = useAuth();
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');

    const handleAddToCart = () => {
        const isReplaced = addToCart({
            menuItemId: item.id,
            name: item.name,
            price: item.price,
            quantity: 1,
            restaurantId: item.restaurantId,
            restaurantName,
            image: item.image,
            dietaryType: item.dietaryType
        });

        if (isReplaced) {
            setSnackbarMessage('Cart replaced with new restaurant items!');
        } else {
            setSnackbarMessage(`${item.name} added to cart!`);
        }
        setOpenSnackbar(true);
    };

    const canOrder = !!user;

    return (
        <Card sx={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
            <CardMedia
                component="img"
                sx={{ height: 150, objectFit: 'cover' }}
                image={item.image || `https://placehold.co/150?text=${encodeURIComponent(item.name)}`}
                alt={item.name}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography gutterBottom variant="h6" component="div">
                        {item.name}
                    </Typography>
                    <Typography variant="h6" color="primary">
                        ${item.price}
                    </Typography>
                </Box>

                <Box sx={{ mb: 1 }}>
                    <Chip
                        label={item.dietaryType}
                        size="small"
                        color={item.dietaryType === 'VEG' ? 'success' : item.dietaryType === 'NON_VEG' ? 'error' : 'warning'}
                        variant="outlined"
                    />
                </Box>

                <Typography variant="body2" color="text.secondary">
                    {item.description}
                </Typography>
            </CardContent>

            <Box sx={{ p: 2, mt: 'auto' }}>
                <Button
                    variant="contained"
                    fullWidth
                    onClick={handleAddToCart}
                    disabled={!canOrder}
                    title={!canOrder ? "Login to order" : "Add to Cart"}
                >
                    Add to Cart
                </Button>
            </Box>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={2000}
                onClose={() => setOpenSnackbar(false)}
                message={snackbarMessage}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            />
        </Card>
    );
};

export default MenuCard;
