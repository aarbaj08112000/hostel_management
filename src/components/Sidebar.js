'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Building2,
    UserCog,
    Brush,
    Briefcase,
    Users,
    BedDouble,
    CalendarCheck,
    CreditCard,
    MessageSquareWarning,
    UserCheck,
    BarChart3,
    Settings,
    ChevronLeft,
    ChevronRight,
    Hotel,
    FileText,
} from 'lucide-react';
import styles from './Sidebar.module.css';

const menuGroups = [
    {
        label: 'Main',
        items: [
            { label: 'Dashboard', icon: LayoutDashboard, href: '/' },
        ],
    },
    {
        label: 'Management',
        items: [
            { label: 'Properties', icon: Building2, href: '/properties' },
            { label: 'Property Managers', icon: UserCog, href: '/property-managers' },
            { label: 'Housekeepers', icon: Brush, href: '/housekeepers' },
            // { label: 'Companies', icon: Briefcase, href: '/companies' },
            { label: 'Customers', icon: Users, href: '/customers' },
            { label: 'Rooms', icon: BedDouble, href: '/rooms' },
        ],
    },
    {
        label: 'Operations',
        items: [
            { label: 'Bookings', icon: CalendarCheck, href: '/bookings' },
            { label: 'Payments', icon: CreditCard, href: '/payments' },
            { label: 'Complaints', icon: MessageSquareWarning, href: '/complaints' },
            { label: 'Visitors', icon: UserCheck, href: '/visitors' },
        ],
    },
    {
        label: 'System',
        items: [
            { label: 'Reports', icon: BarChart3, href: '/reports' },
            { label: 'Settings', icon: Settings, href: '/settings' },
            { label: 'Form Fields', icon: FileText, href: '/form-fields' },
        ],
    },
];

export default function Sidebar({ collapsed, onCollapseChange }) {
    const pathname = usePathname();

    const toggle = () => {
        if (onCollapseChange) onCollapseChange(!collapsed);
    };

    return (
        <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>

            {/* Brand */}
            <div className={styles.brand}>
                <div className={styles.brandIcon}>
                    <Hotel size={22} color="#fff" />
                </div>
                {!collapsed && (
                    <div className={styles.brandText}>
                        <span className={styles.brandName}>HostelPro</span>
                        <span className={styles.brandBadge}>Corporate Suite</span>
                    </div>
                )}
            </div>

            {/* Nav Groups */}
            <nav className={styles.nav}>
                {menuGroups.map((group, gi) => (
                    <div key={group.label}>
                        {!collapsed && <div className={styles.sectionLabel}>{group.label}</div>}
                        {gi > 0 && collapsed && <div className={styles.menuDivider} />}
                        <ul className={styles.menuList}>
                            {group.items.map(({ label, icon: Icon, href }) => {
                                const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
                                return (
                                    <li key={href} className={styles.menuItem}>
                                        <Link
                                            href={href}
                                            className={`${styles.menuLink} ${isActive ? styles.active : ''}`}
                                            title={collapsed ? label : undefined}
                                        >
                                            <span className={styles.menuIcon}><Icon size={17} /></span>
                                            {!collapsed && <span className={styles.menuLabel}>{label}</span>}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </nav>

            {/* Collapse Toggle */}
            <button className={styles.collapseBtn} onClick={toggle} aria-label="Toggle sidebar">
                {collapsed ? <ChevronRight size={15} /> : <><ChevronLeft size={15} /><span>Collapse menu</span></>}
            </button>
        </aside>
    );
}
