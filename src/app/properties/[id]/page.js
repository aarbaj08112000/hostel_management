'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Building2,
    MapPin,
    BedDouble,
    Star,
    ChevronLeft,
    Edit,
    User,
    ShieldCheck,
    TrendingUp,
    Users,
    LayoutGrid,
    History,
    Info,
    BadgeCheck,
    ChevronRight,
    MoreVertical,
    Image as ImageIcon,
    Trash2,
    AlertTriangle,
    CheckCircle2,
    Loader2
} from 'lucide-react';
import styles from './page.module.css';
import { BASE_URL, getHeaders } from '@/utils/api';
import { useToast } from '@/context/ToastContext';

// Fallback dummy data for things not yet in API
const fallbackData = {
    rating: 4.8,
    status: 'Active',
    stats: [
        { label: 'Occupancy', value: '78%', icon: Users, color: '#10b981' },
        { label: 'Revenue (MTD)', value: '₹1.2L', icon: TrendingUp, color: '#1e88e5' },
        { label: 'Complaints', value: '2 Open', icon: Info, color: '#f59e0b' },
        { label: 'Staff', value: '4 Active', icon: ShieldCheck, color: '#8b5cf6' },
    ],
    rooms: [
        { id: '101A', type: 'Single', status: 'Occupied', resident: 'Amara Khan', due: 'Paid' },
        { id: '101B', type: 'Single', status: 'Available', resident: '-', due: '-' },
        { id: '102A', type: 'Double', status: 'Occupied', resident: 'John Doe', due: 'Pending' },
        { id: '102B', type: 'Double', status: 'Occupied', resident: 'Sarah Jain', due: 'Paid' },
        { id: '201A', type: 'Triple', status: 'Occupied', resident: 'Vijay Pal', due: 'Paid' },
    ],
    staff: [
        { name: 'Rajesh Kumar', role: 'Property Manager', phone: '+91 98765 43210', image: '' },
        { name: 'Sunita Devi', role: 'Head Housekeeper', phone: '+91 98765 12345', image: '' },
    ]
};

const getPlaceholder = (text = 'Image Not Available') =>
    `https://placehold.co/800x450/e2e8f0/64748b?text=${encodeURIComponent(text)}`;

export default function PropertyDetailPage({ params }) {
    const router = useRouter();
    const showToast = useToast();
    const { id } = use(params);
    const [showMoreMenu, setShowMoreMenu] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [activeOperation, setActiveOperation] = useState(null);
    
    const [loading, setLoading] = useState(true);
    const [dbData, setDbData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;
        const fetchDetails = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${BASE_URL}/core/hostle-details/${id}`, {
                    method: 'GET',
                    headers: getHeaders(),
                });
                const responseData = await res.json();
                if (!res.ok || responseData?.settings?.success === 0) {
                    throw new Error(responseData?.settings?.message || 'Failed to fetch property details');
                }
                const hostel = Array.isArray(responseData.data) ? responseData.data[0] : responseData.data;
                setDbData(hostel);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    const handleOperation = (op) => {
        setActiveOperation(op);
        setTimeout(() => setActiveOperation(null), 3000);
    };

    const confirmDelete = () => {
        showToast(`Property ${id} deleted`, 'success');
        router.push('/properties');
    };

    if (loading) {
        return (
            <div className={styles.container} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
                <div style={{ textAlign: 'center', color: '#6b7280' }}>
                    <Loader2 size={40} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
                    <p>Loading property details...</p>
                </div>
            </div>
        );
    }

    if (error || !dbData) {
        return (
            <div className={styles.container} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
                <div style={{ textAlign: 'center', color: '#ef4444' }}>
                    <p style={{ fontSize: '18px', fontWeight: 600 }}>Failed to load property</p>
                    <p style={{ marginTop: 8, color: '#6b7280' }}>{error}</p>
                    <Link href="/properties" style={{ marginTop: 16, display: 'inline-block', color: '#6366f1' }}>← Back to Properties</Link>
                </div>
            </div>
        );
    }

    const images = (dbData.attachments && dbData.attachments.length > 0) 
        ? dbData.attachments.map(att => `${BASE_URL}/public/upload/attachments_local/${att.file_path}`) 
        : [];

    return (
        <div className={styles.container}>
            {/* Back & Breadcrumbs */}
            <div className={styles.topNav}>
                <button onClick={() => router.back()} className={styles.backBtn}>
                    <ChevronLeft size={18} />
                    <span>Back to List</span>
                </button>
                <div className={styles.breadcrumbs}>
                    <span>Properties</span>
                    <ChevronRight size={14} />
                    <span className={styles.activePath}>{dbData.hostel_name}</span>
                </div>
            </div>

            {/* Header Info */}
            <div className={styles.header}>
                <div className={styles.headerTitle}>
                    <div className={styles.titleRow}>
                        <h1 className={styles.name}>{dbData.hostel_name}</h1>
                        <div className={`${styles.statusBadge} ${styles[fallbackData.status.toLowerCase()]}`}>
                            {fallbackData.status}
                        </div>
                    </div>
                    <div className={styles.location}>
                        <MapPin size={16} />
                        <span>{dbData.address ? `${dbData.address}, ` : ''}{dbData.city}, {dbData.state} {dbData.pincode}</span>
                    </div>
                </div>
                <div className={styles.headerActions}>
                    <div className={styles.moreWrapper}>
                        <button className={styles.outlineBtn} onClick={() => setShowMoreMenu(!showMoreMenu)}>
                            <MoreVertical size={18} />
                        </button>

                        {showMoreMenu && (
                            <div className={styles.actionMenu}>
                                <button className={styles.menuItem}>
                                    <History size={16} />
                                    <span>Activity Log</span>
                                </button>
                                <button className={styles.menuItem}>
                                    <Star size={16} />
                                    <span>Analytics</span>
                                </button>
                                <div className={styles.menuDivider} />
                                <button className={`${styles.menuItem} ${styles.deleteAction}`} onClick={() => {
                                    setIsDeleting(true);
                                    setShowMoreMenu(false);
                                }}>
                                    <Trash2 size={16} />
                                    <span>Delete Property</span>
                                </button>
                            </div>
                        )}
                    </div>
                    <Link href={`/properties/edit/${id}`} className={styles.editBtn}>
                        <Edit size={16} />
                        <span>Edit Property</span>
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className={styles.statsGrid}>
                {fallbackData.stats.map((stat, i) => (
                    <div key={i} className={styles.statCard}>
                        <div className={styles.statIcon} style={{ background: `${stat.color}15`, color: stat.color }}>
                            <stat.icon size={20} />
                        </div>
                        <div className={styles.statInfo}>
                            <span className={styles.statLabel}>{stat.label}</span>
                            <span className={styles.statValue}>{stat.value}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.mainContent}>
                {/* Left Column: Gallery & Description */}
                <div className={styles.leftCol}>
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.cardTitle}>Property Gallery</h2>
                        </div>
                        <div className={styles.gallery}>
                            <div className={styles.mainImage}>
                                <img
                                    src={images[0] || getPlaceholder('Main Property Image')}
                                    alt={dbData.hostel_name}
                                />
                            </div>
                            <div className={styles.thumbnails}>
                                {images.slice(1).map((img, i) => (
                                    <div key={i} className={styles.thumb}>
                                        <img src={img || getPlaceholder(`View ${i + 2}`)} alt="Property view" />
                                    </div>
                                ))}
                                {images.length > 5 && (
                                    <div className={styles.addThumb}>
                                        <ImageIcon size={20} />
                                        <span>+{images.length - 5} more</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className={styles.description}>
                            <h3>About Property</h3>
                            <p>{dbData.description || 'No description provided.'}</p>
                        </div>
                    </div>

                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.cardTitle}>Rooms Inventory</h2>
                            <button className={styles.linkBtn}>View All Rooms</button>
                        </div>
                        <div className={styles.tableWrap}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Room ID</th>
                                        <th>Type</th>
                                        <th>Status</th>
                                        <th>Resident</th>
                                        <th>Payment</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fallbackData.rooms.map((room, i) => (
                                        <tr key={i}>
                                            <td className={styles.roomId}>{room.id}</td>
                                            <td>{room.type}</td>
                                            <td>
                                                <span className={`${styles.roomStatus} ${styles[room.status.toLowerCase()]}`}>
                                                    {room.status}
                                                </span>
                                            </td>
                                            <td>{room.resident}</td>
                                            <td>
                                                <span className={room.due === 'Paid' ? styles.paid : styles.pending}>
                                                    {room.due}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Column: Staff & Quick Tasks */}
                <div className={styles.rightCol}>
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.cardTitle}>Assigned Staff</h2>
                            <button className={styles.linkBtn}>Manage</button>
                        </div>
                        <div className={styles.staffList}>
                            {fallbackData.staff.map((p, i) => (
                                <div key={i} className={styles.staffItem}>
                                    <div className={styles.staffAvatar}>
                                        {p.image ? <img src={p.image} alt={p.name} /> : <User size={20} />}
                                    </div>
                                    <div className={styles.staffInfo}>
                                        <span className={styles.staffName}>{p.name}</span>
                                        <span className={styles.staffRole}>{p.role}</span>
                                        <span className={styles.staffPhone}>{p.phone}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.cardTitle}>Quick Operations</h2>
                        </div>
                        <div className={styles.quickTasks}>
                            <button className={styles.taskBtn} onClick={() => handleOperation('Assign Staff')}>
                                <div className={styles.taskIcon}><LayoutGrid size={18} /></div>
                                <span>Assign New Staff</span>
                            </button>
                            <button className={styles.taskBtn} onClick={() => handleOperation('Add Room')}>
                                <div className={styles.taskIcon}><BedDouble size={18} /></div>
                                <span>Add Room Entry</span>
                            </button>
                            <button className={styles.taskBtn} onClick={() => handleOperation('Maintenance')}>
                                <div className={styles.taskIcon}><History size={18} /></div>
                                <span>Maintenance Log</span>
                            </button>
                            <button className={styles.taskBtn} onClick={() => handleOperation('Reviews')}>
                                <div className={styles.taskIcon}><Star size={18} /></div>
                                <span>Guest Reviews</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Operation Notification */}
            {activeOperation && (
                <div className={styles.notification}>
                    <CheckCircle2 size={18} />
                    <span>Operation "{activeOperation}" initiated successfully!</span>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleting && (
                <div className={styles.modalOverlay} onClick={() => setIsDeleting(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalIcon}>
                            <AlertTriangle size={32} />
                        </div>
                        <h2 className={styles.modalTitle}>Delete Property?</h2>
                        <p className={styles.modalText}>
                            Warning: This will permanently delete <strong>{dbData.hostel_name}</strong> and all associated data. This action cannot be undone.
                        </p>
                        <div className={styles.modalActions}>
                            <button className={styles.cancelModalBtn} onClick={() => setIsDeleting(false)}>
                                Cancel
                            </button>
                            <button className={styles.confirmDeleteBtn} onClick={confirmDelete}>
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
