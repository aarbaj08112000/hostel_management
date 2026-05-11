'use client';

import { useState, useEffect } from 'react';
import {
    Search,
    Plus,
    Mail,
    Phone,
    Building2,
    MoreVertical,
    CheckCircle2,
    BarChart3,
    ArrowUpRight,
    Filter,
    User,
    Edit3,
    Trash2,
    Eye,
    AlertTriangle,
    LayoutGrid,
    Table,
    Check
} from 'lucide-react';
import styles from './page.module.css';

import { useRouter } from 'next/navigation';
import { fetchPropertyManagers, deletePropertyManager } from '../../utils/api';
import { useToast } from '../../context/ToastContext';

export default function PropertyManagers() {
    const router = useRouter();
    const showToast = useToast();
    const [managers, setManagers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingManager, setDeletingManager] = useState(null);
    const [activeMenuId, setActiveMenuId] = useState(null);
    const [viewMode, setViewMode] = useState('grid');
    const [showLayoutMenu, setShowLayoutMenu] = useState(false);
    const [displayLimit, setDisplayLimit] = useState(6);

    useEffect(() => {
        loadManagers();
    }, []);

    const loadManagers = async () => {
        setIsLoading(true);
        try {
            const res = await fetchPropertyManagers({ limit: 100 });
            const dataPool = res?.data?.property_managers || (Array.isArray(res?.data) ? res.data : []);
            setManagers(dataPool);
        } catch (error) {
            console.error('Failed to fetch managers:', error);
        }
        setIsLoading(false);
    };

    const getFullName = (m) => `${m.first_name || ''} ${m.last_name || ''}`.trim();

    const filteredManagers = managers.filter(manager => {
        const query = searchTerm.toLowerCase();
        const fullName = getFullName(manager).toLowerCase();
        const props = Array.isArray(manager.assigned_properties) ? manager.assigned_properties : [];
        return fullName.includes(query) ||
               (manager.email || '').toLowerCase().includes(query) ||
               props.some(p => p.toLowerCase().includes(query));
    });

    const visibleManagers = filteredManagers.slice(0, displayLimit);

    const toggleMenu = (id, e) => {
        e.stopPropagation();
        setActiveMenuId(activeMenuId === id ? null : id);
    };

    const handleEditManager = (manager) => {
        router.push(`/property-managers/edit/${manager.manager_id}`);
        setActiveMenuId(null);
    };

    const handleViewProfile = (manager) => {
        setActiveMenuId(null);
        router.push(`/property-managers/${manager.manager_id}`);
    };

    const handleDeleteClick = (manager) => {
        setDeletingManager(manager);
        setShowDeleteModal(true);
        setActiveMenuId(null);
    };

    const confirmDelete = async () => {
        try {
            await deletePropertyManager(deletingManager.manager_id);
            setManagers(managers.filter(m => m.manager_id !== deletingManager.manager_id));
        } catch (error) {
            console.error('Delete failed:', error);
            showToast('Failed to delete manager', 'error');
        }
        setShowDeleteModal(false);
        setDeletingManager(null);
    };

    if (isLoading) {
        return <div className={styles.container} style={{ textAlign:'center', paddingTop:'50px' }}>Loading Managers...</div>;
    }

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Property Managers</h1>
                    <p className={styles.subtitle}>Manage and monitor your property staff performance.</p>
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
                    <button className={styles.addButton} onClick={() => router.push('/property-managers/new')}>
                        <Plus size={18} />
                        <span>Add New Manager</span>
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className={styles.overviewGrid}>
                <div className={styles.overviewCard}>
                    <div className={styles.overviewIcon} style={{ background: '#e0f2fe', color: '#0ea5e9' }}>
                        <User size={20} />
                    </div>
                    <div>
                        <span className={styles.overviewLabel}>Total Managers</span>
                        <div className={styles.overviewValue}>{managers.length}</div>
                    </div>
                </div>
                <div className={styles.overviewCard}>
                    <div className={styles.overviewIcon} style={{ background: '#ecfdf5', color: '#10b981' }}>
                        <CheckCircle2 size={20} />
                    </div>
                    <div>
                        <span className={styles.overviewLabel}>Active Now</span>
                        <div className={styles.overviewValue}>
                            {managers.filter(m => m.status === 'Active').length}
                        </div>
                    </div>
                </div>
                <div className={styles.overviewCard}>
                    <div className={styles.overviewIcon} style={{ background: '#fef2f2', color: '#ef4444' }}>
                        <BarChart3 size={20} />
                    </div>
                    <div>
                        <span className={styles.overviewLabel}>Avg. Efficiency</span>
                        <div className={styles.overviewValue}>94%</div>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className={styles.filterBar}>
                <div className={styles.searchWrapper}>
                    <Search className={styles.searchIcon} size={18} />
                    <input
                        type="text"
                        placeholder="Search managers by name, email or property..."
                        className={styles.searchInput}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className={styles.filterButton}>
                    <Filter size={18} />
                    <span>Filter</span>
                </button>
            </div>

            {/* Content Section */}
            {viewMode === 'grid' ? (
                <div className={styles.grid}>
                    {visibleManagers.map((manager) => {
                        const avatarImage = manager.attachments?.length > 0
                            ? `http://localhost:3009/public/upload/attachments_local/${manager.attachments[0].file_path}`
                            : null;
                        const props = Array.isArray(manager.assigned_properties) ? manager.assigned_properties : [];
                        const statusClass = manager.status === 'Active' ? styles.active : manager.status === 'On Leave' ? styles.pending : styles.inactive;

                        return (
                        <div key={manager.manager_id} className={styles.managerCard}>
                            <div className={styles.cardHeader}>
                                <div className={styles.avatarWrapper}>
                                    {avatarImage ? (
                                        <img src={avatarImage} alt={manager.first_name} className={styles.avatar} />
                                    ) : (
                                        <div className={styles.avatarPlaceholder}>
                                            <User size={28} />
                                        </div>
                                    )}
                                    <div className={`${styles.statusDot} ${statusClass}`} />
                                </div>
                                <div className={styles.moreWrapper}>
                                    <button
                                        className={`${styles.moreButton} ${activeMenuId === manager.manager_id ? styles.activeMore : ''}`}
                                        onClick={(e) => toggleMenu(manager.manager_id, e)}
                                    >
                                        <MoreVertical size={18} />
                                    </button>
                                    {activeMenuId === manager.manager_id && (
                                        <div className={styles.actionMenu}>
                                            <button className={styles.menuItem} onClick={() => handleViewProfile(manager)}>
                                                <Eye size={16} />
                                                <span>View Profile</span>
                                            </button>
                                            <button className={styles.menuItem} onClick={() => handleEditManager(manager)}>
                                                <Edit3 size={16} />
                                                <span>Edit Details</span>
                                            </button>
                                            <div className={styles.menuDivider} />
                                            <button
                                                className={`${styles.menuItem} ${styles.deleteAction}`}
                                                onClick={() => handleDeleteClick(manager)}
                                            >
                                                <Trash2 size={16} />
                                                <span>Terminate Access</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={styles.managerInfo}>
                                <h3 className={styles.managerName}>{getFullName(manager)}</h3>
                                <div className={styles.contactInfo}>
                                    <div className={styles.contactItem}>
                                        <Mail size={14} />
                                        <span>{manager.email}</span>
                                    </div>
                                    <div className={styles.contactItem}>
                                        <Phone size={14} />
                                        <span>{manager.phone}</span>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.propertyInfo}>
                                <div className={styles.infoLabel}>
                                    <Building2 size={14} />
                                    <span>Assigned Properties</span>
                                </div>
                                <div className={styles.propertyTags}>
                                    {props.length > 0 ? (
                                        props.map((prop, i) => (
                                            <span key={i} className={styles.propTag}>{prop}</span>
                                        ))
                                    ) : (
                                        <span className={styles.noProp}>Unassigned</span>
                                    )}
                                </div>
                            </div>

                            <div className={styles.cardStats}>
                                <div className={styles.statItem}>
                                    <span className={styles.statVal}>90%</span>
                                    <span className={styles.statLbl}>Occupancy</span>
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statVal}>45</span>
                                    <span className={styles.statLbl}>Resolved</span>
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statVal}>4.8</span>
                                    <span className={styles.statLbl}>Rating</span>
                                </div>
                            </div>

                            <button className={styles.profileBtn} onClick={() => handleViewProfile(manager)}>
                                <span>View Full Performance</span>
                                <ArrowUpRight size={16} />
                            </button>
                        </div>
                    )})}
                </div>
            ) : (
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Manager</th>
                                <th>Contact Details</th>
                                <th>Assigned Properties</th>
                                <th>Performance</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visibleManagers.map((manager) => {
                                const avatarImage = manager.attachments?.length > 0
                                    ? `http://localhost:3009/public/upload/attachments_local/${manager.attachments[0].file_path}`
                                    : null;
                                const props = Array.isArray(manager.assigned_properties) ? manager.assigned_properties : [];
                                const statusClass = manager.status === 'Active' ? styles.active : manager.status === 'On Leave' ? styles.pending : styles.inactive;

                                return (
                                <tr key={manager.manager_id}>
                                    <td>
                                        <div className={styles.tableUserCell}>
                                            <div className={styles.tableAvatarWrapper}>
                                                {avatarImage ? (
                                                    <img src={avatarImage} alt={manager.first_name} className={styles.tableAvatar} />
                                                ) : (
                                                    <div className={styles.tableAvatarPlaceholder}>
                                                        <User size={18} />
                                                    </div>
                                                )}
                                                <div className={`${styles.tableStatusDot} ${statusClass}`} />
                                            </div>
                                            <div className={styles.tableNameInfo}>
                                                <div className={styles.tableName}>{getFullName(manager)}</div>
                                                <div className={styles.tableId}>ID: {manager.employee_id || `PM-${manager.manager_id}`}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.tableContact}>
                                            <div className={styles.tableContactItem}>
                                                <Mail size={12} />
                                                {manager.email}
                                            </div>
                                            <div className={styles.tableContactItem}>
                                                <Phone size={12} />
                                                {manager.phone}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.tablePropTags}>
                                            {props.slice(0, 2).map((prop, i) => (
                                                <span key={i} className={styles.tablePropTag}>{prop}</span>
                                            ))}
                                            {props.length > 2 && (
                                                <span className={styles.moreProps}>+{props.length - 2} more</span>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.tableStats}>
                                            <div className={styles.tableStatItem}>
                                                <span className={styles.tableStatLbl}>Occ:</span>
                                                <span className={styles.tableStatVal}>90%</span>
                                            </div>
                                            <div className={styles.tableStatItem}>
                                                <span className={styles.tableStatLbl}>Rating:</span>
                                                <span className={styles.tableStatVal}>4.8</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`${styles.statusBadgeTable} ${statusClass}`}>
                                            {manager.status || 'Active'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={styles.tableActions}>
                                            <button className={styles.actionBtnIcon} onClick={() => handleViewProfile(manager)} title="View Profile">
                                                <Eye size={16} />
                                            </button>
                                            <button className={styles.actionBtnIcon} onClick={() => handleEditManager(manager)} title="Edit">
                                                <Edit3 size={16} />
                                            </button>
                                            <button className={`${styles.actionBtnIcon} ${styles.deleteActionTable}`} onClick={() => handleDeleteClick(manager)} title="Terminate">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Load More section */}
            {filteredManagers.length > displayLimit && (
                <div className={styles.loadMoreContainer}>
                    <button
                        className={styles.loadMoreButton}
                        onClick={() => setDisplayLimit(prev => prev + 6)}
                    >
                        Load More Managers
                    </button>
                    <p className={styles.loadMoreText}>
                        Showing {visibleManagers.length} of {filteredManagers.length} managers
                    </p>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className={styles.modalOverlay} onClick={() => setShowDeleteModal(false)}>
                    <div className={styles.deleteModalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalIcon}>
                            <AlertTriangle size={32} />
                        </div>
                        <h2 className={styles.modalTitle}>Terminate Access?</h2>
                        <p className={styles.modalText}>
                            Are you sure you want to terminate access for <strong>{getFullName(deletingManager)}</strong>?<br />
                            This action cannot be undone.
                        </p>
                        <div className={styles.modalActions}>
                            <button className={styles.cancelModalBtn} onClick={() => setShowDeleteModal(false)}>
                                Cancel
                            </button>
                            <button className={styles.confirmDeleteBtn} onClick={confirmDelete}>
                                Yes, Terminate Access
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
