'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { getToken, clearAuth } from '@/utils/api';
import { ToastProvider } from '@/context/ToastContext';

const Sidebar = dynamic(() => import('@/components/Sidebar'), { ssr: false });
const Header = dynamic(() => import('@/components/Header'), { ssr: false });
const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });

export default function AppShell({ children }) {
    const [isMounted, setIsMounted] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const isLoginPage = pathname === '/login' || pathname?.startsWith('/login');

    useEffect(() => {
        setIsMounted(true);
        const token = getToken();
        if (!isLoginPage && !token) {
            router.push('/login');
        } else if (isLoginPage && token) {
            router.push('/');
        }
    }, [isLoginPage, pathname, router]);

    if (!isMounted) {
        return (
            <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
                <div style={{ padding: '24px', borderRadius: '16px', background: 'white', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                    Loading...
                </div>
            </div>
        );
    }

    const token = getToken();
    if (!isLoginPage && !token) {
        return null; // Prevent flicker while redirecting
    }

    if (isLoginPage) {
        return (
            <ToastProvider>
                <div className="login-shell">
                    {children}
                </div>
            </ToastProvider>
        );
    }

    return (
        <ToastProvider>
            <div className="app-shell">
                <Sidebar collapsed={collapsed} onCollapseChange={setCollapsed} />
                <div className={`main-content ${collapsed ? 'sidebar-collapsed' : ''}`}>
                    <Header collapsed={collapsed} onMenuToggle={() => setCollapsed(p => !p)} />
                    <main className="page-body">
                        {children}
                    </main>
                    <Footer />
                </div>
            </div>
        </ToastProvider>
    );
}
