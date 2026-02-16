'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#FF7043', // Deep Orange
            contrastText: '#fff',
        },
        secondary: {
            main: '#FFB74D', // Amber/Orange
            contrastText: '#000',
        },
        background: {
            default: '#FAFAFA', // Soft Off-White
            paper: '#FFFFFF',
        },
        text: {
            primary: '#212121',
            secondary: '#757575',
        },
    },
    typography: {
        fontFamily: 'var(--font-geist-sans), "Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
        h4: {
            fontWeight: 700,
            letterSpacing: '-0.02em',
        },
        h5: {
            fontWeight: 600,
        },
        h6: {
            fontWeight: 600,
        },
        button: {
            fontWeight: 600,
            textTransform: 'none',
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 50, // Pill shape buttons
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(255, 112, 67, 0.2)',
                    },
                },
                containedPrimary: {
                    background: 'linear-gradient(45deg, #FF7043 30%, #FF8A65 90%)',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#FFFFFF',
                    color: '#212121',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none', // Remove default gradient in dark mode if any
                },
                elevation1: {
                    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                },
            },
        },
    },
});

export default theme;
