'use client';

import React from 'react';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import { Restaurant } from '../services/restaurant.service';
import { useRouter } from 'next/navigation';

interface RestaurantCardProps {
    restaurant: Restaurant;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
    const router = useRouter();

    return (
        <Card
            sx={{ cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column' }}
            onClick={() => router.push(`/restaurants/${restaurant.id}`)}
        >
            <CardMedia
                component="img"
                height="140"
                image={restaurant.image || 'https://placehold.co/600x400'}
                alt={restaurant.name}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="div">
                    {restaurant.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {restaurant.cuisine} • {restaurant.country}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {restaurant.address}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default RestaurantCard;
