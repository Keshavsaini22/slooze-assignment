'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { Box, Button, Checkbox, CircularProgress, Container, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, Pagination, TextField, Typography } from '@mui/material';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import MenuCard from '../../../components/MenuCard';
import { MenuItem, Restaurant, RestaurantService } from '../../../services/restaurant.service';
import { useDebounce } from '../../../hooks/useDebounce';

function MenuList() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const restaurantId = params.id as string;

    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [breadcrumbs, setBreadcrumbs] = useState({ total: 0, page: 1, limit: 12, totalPages: 1 });

    // Filter states
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const [dietary, setDietary] = useState<string[]>([]);

    const page = parseInt(searchParams.get('page') || '1');

    useEffect(() => {
        fetchData();
    }, [restaurantId, page, debouncedSearch, dietary]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (!restaurant) {
                const restData = await RestaurantService.getOne(restaurantId);
                setRestaurant(restData);
            }

            const dietaryString = dietary.length > 0 ? dietary[0] : undefined;
            const { data, meta } = await RestaurantService.getMenu(restaurantId, {
                page,
                limit: 12,
                search: debouncedSearch,
                dietary: dietaryString
            });
            setMenuItems(data);
            setBreadcrumbs(meta);
        } catch (error) {
            console.error('Failed to fetch menu', error);
        } finally {
            setLoading(false);
        }
    };
    // ... (rest of logic same)

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Button variant="text" onClick={() => router.back()} sx={{ mb: 2 }}>
                &larr; Back to Restaurants
            </Button>

            {restaurant && (
                <Box sx={{ mb: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
                    <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
                        {restaurant.name}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        {restaurant.address}, {restaurant.country}
                    </Typography>
                    <Typography variant="subtitle2" color="primary">
                        {restaurant.cuisine}
                    </Typography>
                </Box>
            )}

            <Grid container spacing={4}>
                {/* Sidebar Filters */}
                <Grid size={{ xs: 12, md: 3 }}>
                    <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
                        <Typography variant="h6" gutterBottom>Filters</Typography>

                        <TextField
                            fullWidth
                            label="Search Menu"
                            variant="outlined"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                router.push(`/restaurants/${restaurantId}?page=1`);
                            }}
                            sx={{ mb: 3 }}
                        />

                        <FormControl component="fieldset">
                            <FormLabel component="legend">Dietary</FormLabel>
                            <FormGroup>
                                <FormControlLabel
                                    control={<Checkbox checked={dietary.includes('VEG')} onChange={() => {
                                        const newDietary = dietary.includes('VEG') ? [] : ['VEG'];
                                        setDietary(newDietary);
                                        router.push(`/restaurants/${restaurantId}?page=1`);
                                    }} name="VEG" />}
                                    label="Pure Veg"
                                />
                                <FormControlLabel
                                    control={<Checkbox checked={dietary.includes('NON_VEG')} onChange={() => {
                                        const newDietary = dietary.includes('NON_VEG') ? [] : ['NON_VEG'];
                                        setDietary(newDietary);
                                        router.push(`/restaurants/${restaurantId}?page=1`);
                                    }} name="NON_VEG" />}
                                    label="Non Veg"
                                />
                                <FormControlLabel
                                    control={<Checkbox checked={dietary.includes('EGG')} onChange={() => {
                                        const newDietary = dietary.includes('EGG') ? [] : ['EGG'];
                                        setDietary(newDietary);
                                        router.push(`/restaurants/${restaurantId}?page=1`);
                                    }} name="EGG" />}
                                    label="Contains Egg"
                                />
                            </FormGroup>
                        </FormControl>
                    </Box>
                </Grid>

                {/* Menu List */}
                <Grid size={{ xs: 12, md: 9 }}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            <Grid container spacing={3}>
                                {menuItems.map((item) => (
                                    <Grid size={{ xs: 12, lg: 6 }} key={item.id}>
                                        <MenuCard item={item} restaurantName={restaurant?.name || ''} />
                                    </Grid>
                                ))}
                            </Grid>

                            {menuItems.length === 0 && (
                                <Box sx={{ py: 4, textAlign: 'center' }}>
                                    <Typography color="text.secondary">No menu items found.</Typography>
                                </Box>
                            )}

                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                                <Pagination
                                    count={breadcrumbs.totalPages}
                                    page={page}
                                    onChange={(e, v) => router.push(`/restaurants/${restaurantId}?page=${v}`)}
                                    color="primary"
                                    size="large"
                                />
                            </Box>
                        </>
                    )}
                </Grid>
            </Grid>
        </Container>
    );
}

export default function MenuPage() {
    return (
        <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>}>
            <MenuList />
        </Suspense>
    );
}
