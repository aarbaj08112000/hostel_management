'use client';

import { useState } from 'react';
import {
    Menu, Bell, Search, ChevronDown,
    Settings, LogOut, User, Building2, Plus, Home, Calendar, Users, IndianRupee, ShieldCheck, LayoutGrid
} from 'lucide-react';
import styles from './Header.module.css';
import MegaMenu from './MegaMenu';

export default function Header({ collapsed, onMenuToggle }) {
    const [profileOpen, setProfileOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [quickMenuOpen, setQuickMenuOpen] = useState(false);

    const notifications = [
        { id: 1, text: 'New booking confirmed — Room 204, Tech Corp', time: '5m ago', unread: true },
        { id: 2, text: 'Payment ₹42,000 received from Infosys Ltd.', time: '1h ago', unread: true },
        { id: 3, text: 'Complaint #31 has been marked as resolved', time: '3h ago', unread: false },
    ];

    const unread = notifications.filter(n => n.unread).length;

    const closeAll = () => { setProfileOpen(false); setNotifOpen(false); setQuickMenuOpen(false); };

    return (
        <>
            <header className={`${styles.header} ${collapsed ? styles.collapsed : ''}`}>
                {/* Left */}
                <div className={styles.left}>
                    <button className={styles.iconBtn} onClick={onMenuToggle} aria-label="Toggle sidebar">
                        <Menu size={18} />
                    </button>
                    <div className={styles.searchBar}>
                        <Search size={15} className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search properties, bookings, customers…"
                            className={styles.searchInput}
                            suppressHydrationWarning
                        />
                    </div>
                </div>

                {/* Right */}
                <div className={styles.right}>

                    {/* Quick Add Menu (Mega Menu Toggle) */}
                    <div className={styles.dropdownWrapper}>
                        <button
                            className={styles.primaryIconBtn}
                            onClick={() => { setQuickMenuOpen(p => !p); setNotifOpen(false); setProfileOpen(false); }}
                            aria-label="Quick Actions Mega Menu"
                            title="Admin Quick Menu"
                        >
                            <LayoutGrid size={18} />
                        </button>
                    </div>

                    {/* Notifications */}
                    <div className={styles.dropdownWrapper}>
                        <button
                            className={styles.iconBtn}
                            onClick={() => { setNotifOpen(p => !p); setProfileOpen(false); setQuickMenuOpen(false); }}
                            aria-label="Notifications"
                        >
                            <Bell size={17} />
                            {unread > 0 && <span className={styles.badge}>{unread}</span>}
                        </button>

                        {notifOpen && (
                            <div className={styles.dropdown}>
                                <div className={styles.dropdownHeader}>
                                    Notifications
                                    <span className={styles.badgeInline}>{unread} new</span>
                                </div>
                                {notifications.map(n => (
                                    <div key={n.id} className={`${styles.notifItem} ${n.unread ? styles.unread : ''}`}>
                                        <div className={styles.notifRow}>
                                            {n.unread && <span className={styles.notifDot} />}
                                            <div>
                                                <p className={styles.notifText}>{n.text}</p>
                                                <span className={styles.notifTime}>{n.time}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div className={styles.dropdownFooter}>View all notifications</div>
                            </div>
                        )}
                    </div>

                    <div className={styles.divider} />

                    {/* Profile */}
                    <div className={styles.dropdownWrapper}>
                        <button
                            className={styles.profileBtn}
                            onClick={() => { setProfileOpen(p => !p); setNotifOpen(false); setQuickMenuOpen(false); }}
                            aria-label="User menu"
                        >
                            <div className={styles.avatar}>A</div>
                            <div className={styles.profileInfo}>
                                <span className={styles.profileName}>Admin</span>
                                <span className={styles.profileRole}>Super Admin</span>
                            </div>
                            <ChevronDown size={13} className={`${styles.chevron} ${profileOpen ? styles.open : ''}`} />
                        </button>

                        {profileOpen && (
                            <div className={styles.dropdown}>
                                <div className={styles.dropdownHeader}>My Account</div>
                                <a href="/profile" className={styles.dropdownItem}><User size={15} />My Profile</a>
                                <a href="/properties" className={styles.dropdownItem}><Building2 size={15} />My Properties</a>
                                <a href="/settings" className={styles.dropdownItem}><Settings size={15} />Settings</a>
                                <div className={styles.dropdownDivider} />
                                <a href="/logout" className={`${styles.dropdownItem} ${styles.danger}`}>
                                    <LogOut size={15} />Sign Out
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {(profileOpen || notifOpen) && (
                    <div className={styles.overlay} onClick={closeAll} />
                )}
            </header>

            <MegaMenu
                isOpen={quickMenuOpen}
                onClose={() => setQuickMenuOpen(false)}
                collapsed={collapsed}
            />
        </>
    );
}
