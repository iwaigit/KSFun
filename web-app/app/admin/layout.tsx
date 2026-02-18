'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        if (!isAuthenticated) {
            router.push('/verificar-edad');
            return;
        }

        if (user?.role !== 'admin') {
            router.push('/');
        }
    }, [isAuthenticated, user, router, mounted]);

    if (!mounted || !isAuthenticated || user?.role !== 'admin') {
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
