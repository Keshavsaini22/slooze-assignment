'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    sub: string;
    email: string;
    role: 'ADMIN' | 'MANAGER' | 'MEMBER';
    country?: string;
    exp: number;
}

export interface User {
    id: string;
    email: string;
    role: 'ADMIN' | 'MANAGER' | 'MEMBER';
    country?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            try {
                const decoded = jwtDecode<DecodedToken>(token);
                if (decoded.exp * 1000 < Date.now()) {
                    Cookies.remove('token');
                    setUser(null);
                } else {
                    setUser({
                        id: decoded.sub,
                        email: decoded.email,
                        role: decoded.role,
                    });
                }
            } catch (error) {
                console.error('Failed to decode token:', error);
                Cookies.remove('token');
                setUser(null);
            }
        }
        setLoading(false);
    }, []);

    const login = (token: string) => {
        Cookies.set('token', token, { expires: 1 });
        try {
            const decoded = jwtDecode<DecodedToken>(token);
            setUser({
                id: decoded.sub,
                email: decoded.email,
                role: decoded.role,
            });
        } catch {
            console.error('Login failed: Invalid token');
        }
    };

    const logout = () => {
        Cookies.remove('token');
        setUser(null);
        window.location.href = '/login';
    };

    const authContextValue = { user, loading, isAuthenticated: !!user, login, logout };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
