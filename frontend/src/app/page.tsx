'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import {
    Box,
    Container,
    TextField,
    FormControl,
    FormLabel,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Pagination,
    Typography,
    CircularProgress,
    Button,
    Paper,
    Grid,
    InputAdornment,
    Chip,
    Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
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

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa' }}>
            {/* Hero Section */}
            <Box
                sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    pt: 8,
                    pb: 12,
                    mb: -6,
                    backgroundImage: 'linear-gradient(45deg, #FF7043 30%, #FF8A65 90%)',
                    borderRadius: '0 0 24px 24px',
                    boxShadow: '0 4px 20px rgba(255, 112, 67, 0.2)'
                }}
            >
                <Container maxWidth="lg">
                    <Typography variant="h3" component="h1" fontWeight="800" gutterBottom align="center">
                        Craving something delicious?
                    </Typography>
                    <Typography variant="h6" align="center" sx={{ opacity: 0.9, mb: 4, maxWidth: 600, mx: 'auto' }}>
                        Discover the best food from over 1,000 restaurants and get it delivered fast.
                    </Typography>

                    <Paper
                        component="form"
                        sx={{
                            p: '2px 4px',
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                            maxWidth: 600,
                            mx: 'auto',
                            borderRadius: 50,
                            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                        }}
                    >
                        <InputAdornment position="start" sx={{ pl: 2 }}>
                            <SearchIcon color="action" />
                        </InputAdornment>
                        <TextField
                            fullWidth
                            placeholder="Search for restaurants or cuisines..."
                            variant="standard"
                            InputProps={{ disableUnderline: true }}
                            value={search}
                            onChange={handleSearchChange}
                            sx={{ ml: 1, flex: 1 }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ borderRadius: 50, m: 0.5, px: 4 }}
                        >
                            Search
                        </Button>
                    </Paper>
                </Container>
            </Box>

            <Container maxWidth="xl" sx={{ pt: 12, pb: 4 }}>
                <Grid container spacing={4}>
                    {/* Sidebar Filters */}
                    <Grid size={{ xs: 12, md: 3, lg: 2 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: 4,
                                position: 'sticky',
                                top: 100,
                                border: '1px solid #eee'
                            }}
                        >
                            <Box display="flex" alignItems="center" mb={2}>
                                <FilterListIcon sx={{ mr: 1, color: 'primary.main' }} />
                                <Typography variant="h6" fontWeight="bold">Filters</Typography>
                            </Box>

                            <Divider sx={{ mb: 2 }} />

                            <FormControl component="fieldset">
                                <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1, fontSize: '0.9rem' }}>Dietary Preference</FormLabel>
                                <FormGroup>
                                    {['VEG', 'NON_VEG', 'EGG'].map((type) => (
                                        <FormControlLabel
                                            key={type}
                                            control={
                                                <Checkbox
                                                    checked={dietary.includes(type)}
                                                    onChange={handleDietaryChange}
                                                    name={type}
                                                    sx={{
                                                        color: '#e0e0e0',
                                                        '&.Mui-checked': { color: 'primary.main' }
                                                    }}
                                                />
                                            }
                                            label={
                                                <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                                                    {type.replace('_', ' ').toLowerCase()}
                                                </Typography>
                                            }
                                        />
                                    ))}
                                </FormGroup>
                            </FormControl>

                            <Box mt={4}>
                                <Typography variant="caption" color="text.secondary">
                                    More filters coming soon...
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Restaurant Grid */}
                    <Grid size={{ xs: 12, md: 9, lg: 10 }}>
                        <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="h5" fontWeight="bold" color="text.primary">
                                {search ? `Search results for "${search}"` : "Top Picks for You"}
                            </Typography>
                            <Chip label={`${breadcrumbs.total} Restaurants`} size="small" variant="outlined" />
                        </Box>

                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
                                <CircularProgress color="primary" thickness={4} />
                            </Box>
                        ) : (
                            <>
                                {restaurants.length === 0 ? (
                                    <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 4, bgcolor: 'transparent' }} elevation={0}>
                                        <Typography variant="h6" color="text.secondary">No restaurants found matching your criteria.</Typography>
                                        <Button variant="outlined" color="primary" sx={{ mt: 2 }} onClick={() => { setSearch(''); setDietary([]); }}>
                                            Clear Filters
                                        </Button>
                                    </Paper>
                                ) : (
                                    <Grid container spacing={3}>
                                        {restaurants.map((restaurant) => (
                                            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={restaurant.id}>
                                                <RestaurantCard restaurant={restaurant} />
                                            </Grid>
                                        ))}
                                    </Grid>
                                )}

                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8, mb: 4 }}>
                                    <Pagination
                                        count={breadcrumbs.totalPages}
                                        page={page}
                                        onChange={handlePageChange}
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

export default function Home() {
    return (
        <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', p: 4, height: '100vh', alignItems: 'center' }}><CircularProgress /></Box>}>
            <Dashboard />
        </Suspense>
    );
}
