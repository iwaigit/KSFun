"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

interface User {
    id: string;
    email: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
    isVerified: boolean;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Query to check if user is verified in Convex
    const isVerifiedQuery = useQuery(
        api.users.isUserVerified,
        user?.id ? { userId: user.id as Id<"users"> } : "skip"
    );

    // Debug log for production
    useEffect(() => {
        if (typeof window !== 'undefined') {
            console.log('[AuthContext] isVerifiedQuery:', isVerifiedQuery, 'user:', user?.email);
        }
    }, [isVerifiedQuery, user]);

    useEffect(() => {
        const savedUser = localStorage.getItem('ks-auth');
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) {
                console.error('Error loading auth', e);
            }
        }
        setLoading(false);
    }, []);

    const login = (newUser: User) => {
        setUser(newUser);
        localStorage.setItem('ks-auth', JSON.stringify(newUser));
        document.cookie = `ks-auth=${encodeURIComponent(JSON.stringify(newUser))}; path=/; max-age=86400`;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('ks-auth');
        document.cookie = 'ks-auth=; path=/; max-age=0';
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            isAuthenticated: !!user,
            isVerified: isVerifiedQuery ?? false,
            loading: loading || isVerifiedQuery === undefined
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
