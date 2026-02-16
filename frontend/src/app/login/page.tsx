'use client';

import * as React from 'react';
import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '../../lib/axios';
import { loginSchema } from '../../lib/validations/LoginSchema';
import { CircularProgress, Paper, InputAdornment } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

import { useAuth } from '../../hooks/useAuth';

function LoginForm() {
    const router = useRouter();
    const { login } = useAuth();
    const searchParams = useSearchParams();
    const from = searchParams.get('from') || '/';

    const [loading, setLoading] = React.useState(false);
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const [snackbarSeverity, setSnackbarSeverity] = React.useState<'success' | 'error'>('success');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: { email?: string; password?: string }) => {
        setLoading(true);
        try {
            const response = await api.post('/auth/login', data);
            const { accessToken, user } = response.data;

            login(accessToken);

            localStorage.setItem('user', JSON.stringify(user));

            setSnackbarMessage('Login successful!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);

            router.push(from);
            router.refresh(); // Reloads route to update Navbar state
        } catch (err: unknown) {
            console.error(err);
            const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to login';
            setSnackbarMessage(message);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default',
                p: 2,
                backgroundImage: 'radial-gradient(circle at 50% 50%, #fff3e0 0%, #fafafa 100%)',
            }}
        >
            <Paper elevation={3} sx={{ maxWidth: 450, width: '100%', borderRadius: 6, overflow: 'hidden' }}>
                <Box sx={{ bgcolor: 'primary.main', py: 4, px: 3, textAlign: 'center', color: 'white' }}>
                    <Typography variant="h4" fontWeight="800" sx={{ letterSpacing: '-1px' }}>
                        Slooze<span style={{ color: '#FFCCBC' }}>Food</span>
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
                        Welcome back! Please login to continue.
                    </Typography>
                </Box>

                <CardContent sx={{ p: 4, pt: 5 }}>
                    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            autoComplete="email"
                            autoFocus
                            placeholder="Enter your email"
                            error={!!errors.email}
                            helperText={errors.email?.message as string}
                            {...register('email')}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ mb: 3 }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            placeholder="Enter your password"
                            error={!!errors.password}
                            helperText={errors.password?.message as string}
                            {...register('password')}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ mb: 4 }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            sx={{ py: 1.5, fontSize: '1rem', boxShadow: '0 4px 14px 0 rgba(255, 112, 67, 0.39)' }}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                        </Button>
                    </Box>

                    <Box mt={3} textAlign="center">
                        <Typography variant="body2" color="text.secondary">
                            Don't have an account? <Button color="primary" sx={{ fontWeight: 'bold' }}>Sign Up</Button>
                        </Typography>
                    </Box>
                </CardContent>
            </Paper>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>}>
            <LoginForm />
        </Suspense>
    );
}
