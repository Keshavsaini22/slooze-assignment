'use client';

import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Chip } from '@mui/material';
import { Restaurant } from '../services/restaurant.service';
import { useRouter } from 'next/navigation';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StarIcon from '@mui/icons-material/Star';

interface RestaurantCardProps {
    restaurant: Restaurant;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
    const router = useRouter();

    return (
        <Card
            sx={{ cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}
            onClick={() => router.push(`/restaurants/${restaurant.id}`)}
        >
            <Box sx={{ position: 'relative' }}>
                <CardMedia
                    component="img"
                    height="180"
                    image={restaurant.image || 'https://placehold.co/600x400'}
                    alt={restaurant.name}
                    sx={{ transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' } }}
                />
                <Chip
                    label={restaurant.cuisine}
                    size="small"
                    sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(4px)',
                        fontWeight: 600,
                        color: 'primary.main'
                    }}
                />
            </Box>
            <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                        {restaurant.name}
                    </Typography>
                    <Box display="flex" alignItems="center" bgcolor="success.light" color="white" px={0.5} borderRadius={1}>
                        <Typography variant="caption" fontWeight="bold">4.5</Typography>
                        <StarIcon sx={{ fontSize: 12, ml: 0.2 }} />
                    </Box>
                </Box>

                <Box display="flex" alignItems="center" color="text.secondary" mb={0.5}>
                    <LocationOnIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.disabled' }} />
                    <Typography variant="body2" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {restaurant.address}, {restaurant.country}
                    </Typography>
                </Box>

                <Box display="flex" alignItems="center" color="text.secondary">
                    <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.disabled' }} />
                    <Typography variant="caption">30-40 min</Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default RestaurantCard;
