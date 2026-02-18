'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;

        if (!isAuthenticated) {
            router.push('/verificar-edad');
            return;
        }

        if (user?.role !== 'admin') {
            router.push('/');
        }
    }, [isAuthenticated, user, router, loading]);

    if (loading || !isAuthenticated || user?.role !== 'admin') {
        return null;
    }

    return (
        <div className="flex min-h-screen bg-[#0d0d12]">
            <AdminSidebar />
            <main className="flex-1">
                {children}
            </main>
        </div>
    );
}
