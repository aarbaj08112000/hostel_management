'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { clearAuth } from '@/utils/api';

export default function LogoutPage() {
    const router = useRouter();

    useEffect(() => {
        clearAuth();
        router.push('/login');
    }, [router]);

    return (
        <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
            <div style={{ padding: '24px', borderRadius: '16px', background: 'white', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                Logging you out...
            </div>
        </div>
    );
}
