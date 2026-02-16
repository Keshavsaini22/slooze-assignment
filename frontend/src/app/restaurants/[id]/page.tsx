'use client';

import React, { useEffect, useState, Suspense } from 'react';
import {
    Box,
    Button,
    Checkbox,
    CircularProgress,
    Container,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Grid,
    Pagination,
    TextField,
    Typography,
    Paper,
    Divider,
    Chip,
    InputAdornment
} from '@mui/material';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import MenuCard from '../../../components/MenuCard';
import { MenuItem, Restaurant, RestaurantService } from '../../../services/restaurant.service';
import { useDebounce } from '../../../hooks/useDebounce';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarIcon from '@mui/icons-material/Star';

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
    // ...

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa', pb: 8 }}>
            {/* Header Section with Image Background/Gradient */}
            <Box
                sx={{
                    bgcolor: 'primary.dark',
                    color: 'white',
                    pt: 4,
                    pb: 6,
                    backgroundImage: restaurant?.image
                        ? `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${restaurant.image})`
                        : 'linear-gradient(45deg, #FF7043 30%, #FF8A65 90%)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    mb: 4
                }}
            >
                <Container maxWidth="xl">
                    <Button
                        variant="text"
                        onClick={() => router.back()}
                        sx={{ color: 'white', mb: 2, '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
                        startIcon={<ArrowBackIcon />}
                    >
                        Back to Restaurants
                    </Button>

                    {restaurant ? (
                        <Box>
                            <Box display="flex" alignItems="center" gap={2} mb={1}>
                                <Chip label={restaurant.cuisine} color="primary" sx={{ bgcolor: 'white', color: 'primary.main', fontWeight: 'bold' }} />
                                <Box display="flex" alignItems="center" bgcolor="success.main" color="white" px={1} py={0.5} borderRadius={1}>
                                    <Typography variant="body2" fontWeight="bold">4.5</Typography>
                                    <StarIcon sx={{ fontSize: 14, ml: 0.5 }} />
                                </Box>
                            </Box>
                            <Typography variant="h2" component="h1" fontWeight="800" gutterBottom>
                                {restaurant.name}
                            </Typography>
                            <Typography variant="h6" sx={{ opacity: 0.9 }}>
                                {restaurant.address}, {restaurant.country}
                            </Typography>
                        </Box>
                    ) : (
                        <Box sx={{ height: 100 }} /> // Placeholder
                    )}
                </Container>
            </Box>

            <Container maxWidth="xl">
                <Grid container spacing={4}>
                    {/* Sidebar Filters */}
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Paper sx={{ p: 3, borderRadius: 4, position: 'sticky', top: 100 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>Menu Filters</Typography>
                            <Divider sx={{ mb: 2 }} />

                            <TextField
                                fullWidth
                                placeholder="Search menu items..."
                                variant="outlined"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    router.push(`/restaurants/${restaurantId}?page=1`);
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ mb: 3 }}
                            />

                            <FormControl component="fieldset">
                                <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1 }}>Dietary Preference</FormLabel>
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
                        </Paper>
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
                                    <Paper sx={{ py: 8, textAlign: 'center', borderRadius: 4, bgcolor: 'transparent' }} elevation={0}>
                                        <Typography variant="h6" color="text.secondary">No menu items found.</Typography>
                                    </Paper>
                                )}

                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                                    <Pagination
                                        count={breadcrumbs.totalPages}
                                        page={page}
                                        onChange={(e, v) => router.push(`/restaurants/${restaurantId}?page=${v}`)}
                                        color="primary"
                                        size="large"
                                        shape="rounded"
                                    />
                                </Box>
                            </>
                        )}
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default function MenuPage() {
    return (
        <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>}>
            <MenuList />
        </Suspense>
    );
}
