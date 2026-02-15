'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import { Box, Container, TextField, FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Pagination, Typography, CircularProgress, Button, Paper, Grid } from '@mui/material';
import RestaurantCard from '../components/RestaurantCard';
import { Restaurant, RestaurantService } from '../services/restaurant.service';
import { useDebounce } from '../hooks/useDebounce';

function Dashboard() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(true);
    const [breadcrumbs, setBreadcrumbs] = useState({ total: 0, page: 1, limit: 12, totalPages: 1 });

    // Filter states
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const [dietary, setDietary] = useState<string[]>([]);

    const page = parseInt(searchParams.get('page') || '1');

    useEffect(() => {
        fetchRestaurants();
    }, [page, debouncedSearch, dietary]);

    const fetchRestaurants = async () => {
        setLoading(true);
        try {
            const dietaryString = dietary.length > 0 ? dietary[0] : undefined;

            const { data, meta } = await RestaurantService.getAll({
                page,
                limit: 12,
                search: debouncedSearch,
                dietary: dietaryString
            });
            setRestaurants(data);
            setBreadcrumbs(meta);
        } catch (error) {
            console.error('Failed to fetch restaurants', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
        router.push(`/?page=1`);
    };

    const handleDietaryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.name;
        if (dietary.includes(value)) {
            setDietary([]);
        } else {
            setDietary([value]);
        }
        router.push(`/?page=1`);
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        router.push(`/?page=${value}`);
    };

    const handleLogout = () => {
        Cookies.remove('token');
        localStorage.removeItem('user');
        router.push('/login');
        router.refresh();
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h4" component="h1" fontWeight="bold">
                    Slooze Dashboard
                </Typography>
                <Button variant="outlined" color="secondary" onClick={handleLogout}>
                    Logout
                </Button>
            </Box>

            <Paper sx={{ p: 4, mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Welcome to Slooze Food Ordering
                </Typography>
                <Typography variant="body1">
                    Select a restaurant to view their menu.
                </Typography>
            </Paper>

            <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 3, lg: 2 }}>
                    <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
                        <Typography variant="h6" gutterBottom>Filters</Typography>

                        <TextField
                            fullWidth
                            label="Search Restaurants"
                            variant="outlined"
                            value={search}
                            onChange={handleSearchChange}
                            sx={{ mb: 3 }}
                        />

                        <FormControl component="fieldset">
                            <FormLabel component="legend">Dietary</FormLabel>
                            <FormGroup>
                                <FormControlLabel
                                    control={<Checkbox checked={dietary.includes('VEG')} onChange={handleDietaryChange} name="VEG" />}
                                    label="Pure Veg"
                                />
                                <FormControlLabel
                                    control={<Checkbox checked={dietary.includes('NON_VEG')} onChange={handleDietaryChange} name="NON_VEG" />}
                                    label="Non Veg"
                                />
                                <FormControlLabel
                                    control={<Checkbox checked={dietary.includes('EGG')} onChange={handleDietaryChange} name="EGG" />}
                                    label="Contains Egg"
                                />
                            </FormGroup>
                        </FormControl>
                    </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 9, lg: 10 }}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            <Grid container spacing={3}>
                                {restaurants.map((restaurant) => (
                                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={restaurant.id}>
                                        <RestaurantCard restaurant={restaurant} />
                                    </Grid>
                                ))}
                            </Grid>

                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                                <Pagination
                                    count={breadcrumbs.totalPages}
                                    page={page}
                                    onChange={handlePageChange}
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

export default function Home() {
    return (
        <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>}>
            <Dashboard />
        </Suspense>
    );
}
