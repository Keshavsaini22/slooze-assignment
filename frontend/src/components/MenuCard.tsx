'use client';

import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Chip, Button, Snackbar } from '@mui/material';
import { MenuItem } from '../services/restaurant.service';
import { useCart } from '@/lib/cart';
import { useAuth } from '@/hooks/useAuth';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

interface MenuCardProps {
    item: MenuItem;
    restaurantName: string;
}

const MenuCard: React.FC<MenuCardProps> = ({ item, restaurantName }) => {
    const { addToCart } = useCart();
    const { user } = useAuth();
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');

    const handleAddToCart = async () => {
        const success = await addToCart({
            menuItemId: item.id,
            name: item.name,
            price: item.price,
            quantity: 1,
            restaurantId: item.restaurantId,
            restaurantName,
            image: item.image,
            dietaryType: item.dietaryType
        });

        if (success) {
            setSnackbarMessage(`${item.name} added to cart!`);
        } else {
            // success is false if user cancelled replacement or error occurred
            // failing silently here or maybe showing error if not cancelled
            // For now, let's just not show success message if failed
            return;
        }
        setOpenSnackbar(true);
    };

    const canOrder = !!user;

    const dietaryColor = item.dietaryType === 'VEG' ? 'success' : item.dietaryType === 'NON_VEG' ? 'error' : 'warning';

    return (
        <Card
            sx={{
                display: 'flex',
                height: '100%',
                flexDirection: 'row', // Horizontal layout for menu items often looks better
                borderRadius: 4,
                overflow: 'hidden',
                position: 'relative'
            }}
        >
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                        <Chip
                            label={item.dietaryType === 'NON_VEG' ? 'Non-Veg' : item.dietaryType === 'VEG' ? 'Veg' : 'Egg'}
                            size="small"
                            color={dietaryColor}
                            variant="outlined"
                            sx={{ mb: 1, height: 20, fontSize: '0.65rem', fontWeight: 'bold' }}
                        />
                        <Typography variant="h6" component="div" fontWeight="bold" sx={{ lineHeight: 1.2, mb: 0.5 }}>
                            {item.name}
                        </Typography>
                    </Box>
                    <Typography variant="h6" color="secondary.main" fontWeight="bold">
                        ${item.price}
                    </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.description}
                </Typography>

                <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleAddToCart}
                    disabled={!canOrder}
                    startIcon={<AddShoppingCartIcon />}
                    sx={{ alignSelf: 'flex-start', borderRadius: 50, px: 3 }}
                >
                    Add
                </Button>
            </Box>

            <Box sx={{ width: 140, position: 'relative' }}>
                <CardMedia
                    component="img"
                    sx={{ height: '100%', width: '100%', objectFit: 'cover' }}
                    image={item.image || `https://placehold.co/150?text=${encodeURIComponent(item.name)}`}
                    alt={item.name}
                />
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
