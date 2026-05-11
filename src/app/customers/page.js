'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Plus, Search, Filter, User, Phone, Mail,
    Home, CreditCard, ShieldCheck, MoreVertical,
    Edit3, Trash2, ChevronRight, MapPin, Calendar,
    UserCircle, LayoutGrid, Table, Check
} from 'lucide-react';
import styles from './page.module.css';
import { fetchStudents } from '@/utils/api';

export default function CustomersPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('grid');
    const [showLayoutMenu, setShowLayoutMenu] = useState(false);
    const [activeMenuId, setActiveMenuId] = useState(null);

    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = async () => {
        setLoading(true);
        try {
            const response = await fetchStudents({ limit: 100 });
            if (response.settings.success) {
                // Map API data to UI structure
                const mapped = response.data.students.map(s => ({
                    id: s.student_id ? String(s.student_id) : 'N/A',
                    name: `${s.first_name} ${s.last_name}`,
                    email: s.email,
                    mobile: s.phone_number,
                    propertyName: s.propertyName,
                    roomNumber: s.roomNumber,
                    bedNumber: s.bedNumber,
                    status: s.status,
                    joiningDate: s.joiningDate,
                    customerType: s.gender === 'Male' ? 'Student (M)' : 'Student (F)',
                    rentAmount: 5000, // Placeholder or fetch from stays/rooms
                }));
                setCustomers(mapped);
            } else {
                setCustomers([]);
            }
        } catch (err) {
            console.error(err);
            setError('Failed to load residents');
        } finally {
            setLoading(false);
        }
    };

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.mobile.includes(searchTerm)
    );

    const toggleMenu = (id, e) => {
        e.stopPropagation();
        setActiveMenuId(activeMenuId === id ? null : id);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Customers Overview</h1>
                    <p className={styles.subtitle}>Manage your residents, stay history, and KYC records.</p>
                </div>
                <div className={styles.headerActions}>
                    <div className={styles.layoutToggleWrapper}>
                        <button
                            className={`${styles.iconButton} ${showLayoutMenu ? styles.active : ''}`}
                            onClick={() => setShowLayoutMenu(!showLayoutMenu)}
                        >
                            <MoreVertical size={20} />
                        </button>
                        {showLayoutMenu && (
                            <div className={styles.layoutMenu}>
                                <div className={styles.menuHeader}>Display Options</div>
                                <button
                                    className={`${styles.layoutOption} ${viewMode === 'grid' ? styles.selected : ''}`}
                                    onClick={() => { setViewMode('grid'); setShowLayoutMenu(false); }}
                                >
                                    <LayoutGrid size={16} />
                                    <span>Grid View</span>
                                    {viewMode === 'grid' && <Check size={14} className={styles.checkIcon} />}
                                </button>
                                <button
                                    className={`${styles.layoutOption} ${viewMode === 'table' ? styles.selected : ''}`}
                                    onClick={() => { setViewMode('table'); setShowLayoutMenu(false); }}
                                >
                                    <Table size={16} />
                                    <span>Table View</span>
                                    {viewMode === 'table' && <Check size={14} className={styles.checkIcon} />}
                                </button>
                            </div>
                        )}
                    </div>
                    <Link href="/customers/new" className={styles.addButton}>
                        <Plus size={18} />
                        <span>New Customer</span>
                    </Link>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px', background: 'white', border: '1px solid #e2e8f0', padding: '0 16px', borderRadius: '14px', height: '48px' }}>
                    <Search color="#94a3b8" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name, ID or mobile..."
                        style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none', fontSize: '14px' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', border: '1px solid #e2e8f0', padding: '0 20px', height: '48px', borderRadius: '14px', fontWeight: '600', color: '#475569', cursor: 'pointer' }}>
                    <Filter size={18} />
                    <span>Filter</span>
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '100px' }}>
                    <div className="spinner">Loading...</div>
                </div>
            ) : error ? (
                <div style={{ textAlign: 'center', padding: '100px', color: '#ef4444' }}>
                    <p>{error}</p>
                    <button onClick={loadStudents} className={styles.addButton} style={{ marginTop: '16px' }}>Retry</button>
                </div>
            ) : filteredCustomers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '100px', background: 'white', borderRadius: '24px' }}>
                    <UserCircle size={48} color="#94a3b8" style={{ marginBottom: '16px' }} />
                    <h3 style={{ color: '#1e293b' }}>No residents found</h3>
                    <p style={{ color: '#64748b' }}>Try adjusting your search or add a new customer.</p>
                </div>
            ) : viewMode === 'grid' ? (
                <div className={styles.grid}>
                    {filteredCustomers.map(customer => (
                        <div key={customer.id} className={styles.customerCard}>
                            <div className={styles.cardTop}>
                                <div className={styles.avatar}>
                                    <UserCircle size={32} />
                                    <div className={`${styles.statusDot} ${customer.status === 'Active' ? styles.active : styles.inactive}`} />
                                </div>
                                <div className={styles.basicInfo}>
                                    <h3 className={styles.name}>{customer.name}</h3>
                                    <span className={styles.id}>{customer.id} • {customer.customerType}</span>
                                </div>
                                <button style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                                    <MoreVertical size={18} />
                                </button>
                            </div>

                            <div className={styles.detailsGrid}>
                                <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>Mobile</span>
                                    <span className={styles.detailValue}><Phone size={12} style={{ marginRight: '4px' }} /> {customer.mobile}</span>
                                </div>
                                <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>Property</span>
                                    <span className={styles.detailValue}><Home size={12} style={{ marginRight: '4px' }} /> {customer.propertyName}</span>
                                </div>
                                <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>Room / Bed</span>
                                    <span className={styles.detailValue}>{customer.roomNumber} / {customer.bedNumber}</span>
                                </div>
                                <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>Rent Due</span>
                                    <span className={styles.detailValue} style={{ color: '#10b981' }}>₹{customer.rentAmount}</span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#64748b' }}>
                                <Calendar size={14} />
                                <span>Check-in: {new Date(customer.joiningDate).toLocaleDateString()}</span>
                            </div>

                            <div className={styles.cardFooter}>
                                <div className={styles.actions}>
                                    <Link href={`/customers/${customer.id}/edit`} className={styles.actionBtn}>
                                        <Edit3 size={16} />
                                    </Link>
                                    <button className={styles.actionBtn} style={{ color: '#ef4444' }}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <Link href={`/customers/${customer.id}`} className={styles.viewBtn}>
                                    View Profile <ChevronRight size={16} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Resident</th>
                                <th>Contact Details</th>
                                <th>Stay Info</th>
                                <th>Financials</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCustomers.map((customer) => (
                                <tr key={customer.id}>
                                    <td>
                                        <div className={styles.tableUserCell}>
                                            <div className={styles.tableAvatarWrapper}>
                                                <div className={styles.tableAvatarPlaceholder}>
                                                    <UserCircle size={20} />
                                                </div>
                                                <div className={`${styles.tableStatusDot} ${customer.status === 'Active' ? styles.active : styles.inactive}`} />
                                            </div>
                                            <div className={styles.tableNameInfo}>
                                                <div className={styles.tableName}>{customer.name}</div>
                                                <div className={styles.tableId}>{customer.id} • {customer.customerType}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.tableContact}>
                                            <div className={styles.tableContactItem}><Phone size={12} /> {customer.mobile}</div>
                                            <div className={styles.tableContactItem}><Mail size={12} /> {customer.email}</div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.tableStayInfo}>
                                            <div className={styles.tableProperty}>{customer.propertyName}</div>
                                            <div className={styles.tableRoom}>Room {customer.roomNumber} / Bed {customer.bedNumber}</div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.tableFinance}>
                                            <div className={styles.tableAmount}>₹{customer.rentAmount}</div>
                                            <div className={styles.tableDate}>In: {new Date(customer.joiningDate).toLocaleDateString()}</div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`${styles.statusBadgeTable} ${customer.status === 'Active' ? styles.active : styles.inactive}`}>
                                            {customer.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={styles.tableActions}>
                                            <Link href={`/customers/${customer.id}`} className={styles.actionBtnIcon} title="View Profile">
                                                <User size={16} />
                                            </Link>
                                            <Link href={`/customers/${customer.id}/edit`} className={styles.actionBtnIcon} title="Edit">
                                                <Edit3 size={16} />
                                            </Link>
                                            <button className={`${styles.actionBtnIcon} ${styles.deleteBtnIcon}`} title="Delete">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
