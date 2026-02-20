"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

console.log('[AuthContext] Module loaded');

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
    console.log('[AuthProvider] Rendering');
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    console.log('[AuthProvider] Current user:', user);

    // Query to check if user is verified in Convex
    const isVerifiedQuery = useQuery(
        api.users.isUserVerified,
        user?.id ? { userId: user.id as Id<"users"> } : "skip"
    );

    console.log('[AuthProvider] isVerifiedQuery:', isVerifiedQuery);

    useEffect(() => {
        console.log('[AuthProvider] useEffect - loading user from localStorage');
        const savedUser = localStorage.getItem('ks-auth');
        if (savedUser) {
            try {
                const parsed = JSON.parse(savedUser);
                console.log('[AuthProvider] Found saved user:', parsed.email);
                setUser(parsed);
            } catch (e) {
                console.error('[AuthProvider] Error loading auth', e);
            }
        } else {
            console.log('[AuthProvider] No saved user found');
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        console.log('[AuthProvider] isVerifiedQuery changed:', isVerifiedQuery);
    }, [isVerifiedQuery]);

    const login = (newUser: User) => {
        console.log('[AuthProvider] login called for:', newUser.email);
        setUser(newUser);
        localStorage.setItem('ks-auth', JSON.stringify(newUser));
        document.cookie = `ks-auth=${encodeURIComponent(JSON.stringify(newUser))}; path=/; max-age=86400`;
    };

    const logout = () => {
        console.log('[AuthProvider] logout called');
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
