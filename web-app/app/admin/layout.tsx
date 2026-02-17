'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/verificar-edad');
            return;
        }

        // Only allow admin role
        if (user?.role !== 'admin') {
            router.push('/'); // Redirect non-admins to home
        }
    }, [isAuthenticated, user, router]);

    // Don't render anything until auth is verified
    if (!isAuthenticated || user?.role !== 'admin') {
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
