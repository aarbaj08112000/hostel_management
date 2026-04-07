'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchHostels } from '../../utils/api';
import {
    Building2,
    Search,
    Plus,
    MapPin,
    BedDouble,
    Star,
    Filter,
    MoreVertical,
    ChevronRight,
    Edit3,
    Trash2,
    Eye,
    AlertTriangle,
    LayoutGrid,
    Table,
    Check
} from 'lucide-react';
import styles from './page.module.css';

// API Data mapping function
const transformPropertyData = (item) => ({
    id: item.hostel_id,
    name: item.hostel_name || 'Unnamed Property',
    category: 'Hostel', // Default as not provided by API
    address: item.address || 'Address not available',
    totalRooms: 50, // Placeholder
    availableRooms: 10, // Placeholder
    rating: 4.5, // Placeholder
    status: 'Active', // Placeholder
    image: `https://images.unsplash.com/photo-1555854817-5b2247a8175f?w=400&h=300&fit=crop&q=${item.hostel_id}`,
});

export default function PropertiesPage() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeMenuId, setActiveMenuId] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [viewMode, setViewMode] = useState('grid');
    const [showLayoutMenu, setShowLayoutMenu] = useState(false);
    const [displayLimit, setDisplayLimit] = useState(6);
    useEffect(() => {
        const loadProperties = async () => {
            try {
                setLoading(true);
                const response = await fetchHostels();
                console.log('Properties API Response:', response);

                if ((response.success || response.status === true || response.status === 'success') && response.data) {
                    const transformedData = response.data.map(transformPropertyData);
                    setProperties(transformedData);
                } else if (response.data && Array.isArray(response.data)) {
                    // Fallback if success/status is missing but data is present
                    const transformedData = response.data.map(transformPropertyData);
                    setProperties(transformedData);
                } else {
                    throw new Error(response.message || 'Failed to load properties');
                }
            } catch (err) {
                setError(err.message);
                console.error('Error fetching hostels:', err);
            } finally {
                setLoading(false);
            }
        };

        loadProperties();
    }, []);

    const filteredProperties = properties.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const visibleProperties = filteredProperties.slice(0, displayLimit);

    const toggleMenu = (id, e) => {
        e.stopPropagation();
        setActiveMenuId(activeMenuId === id ? null : id);
    };

    const handleDeleteClick = (id, e) => {
        e.stopPropagation();
        setDeleteId(id);
        setActiveMenuId(null);
    };

    const confirmDelete = () => {
        alert(`Property ${deleteId} deleted (Mock)`);
        setDeleteId(null);
    };

    const getPlaceholder = (text = 'No Image') =>
        `https://placehold.co/400x300/e2e8f0/64748b?text=${encodeURIComponent(text)}`;

    return (
        <div className={styles.container}>
            {/* Header section */}
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Properties</h1>
                    <p className={styles.subtitle}>Manage and monitor all your hostel and PG properties from here.</p>
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
                    <Link href="/properties/new" className={styles.addButton}>
                        <Plus size={18} />
                        <span>Add New Property</span>
                    </Link>
                </div>
            </div>

            {/* Filter and Search section */}
            <div className={styles.filterBar}>
                <div className={styles.searchWrapper}>
                    <Search className={styles.searchIcon} size={18} />
                    <input
                        type="text"
                        placeholder="Search by property name or location..."
                        className={styles.searchInput}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className={styles.filterActions}>
                    <button className={styles.filterButton}>
                        <Filter size={18} />
                        <span>Filters</span>
                    </button>
                    <div className={styles.viewToggle}>
                        <span className={styles.viewLabel}>Total: {properties.length} Properties</span>
                    </div>
                </div>
            </div>

            {/* Content section */}
            {loading ? (
                <div className={styles.loadingContainer}>
                    <div className={styles.loader}></div>
                    <p>Loading properties...</p>
                </div>
            ) : error ? (
                <div className={styles.errorContainer}>
                    <AlertTriangle size={48} className={styles.errorIcon} />
                    <h2 className={styles.errorTitle}>Oops! Something went wrong</h2>
                    <p className={styles.errorText}>{error}</p>
                    <button className={styles.retryButton} onClick={() => window.location.reload()}>
                        Retry
                    </button>
                </div>
            ) : viewMode === 'grid' ? (
                <div className={styles.grid}>
                    {visibleProperties.map((property) => (
                        <div key={property.id} className={styles.card}>
                            <div className={styles.cardImageContainer} onClick={() => setActiveMenuId(null)}>
                                <img
                                    src={property.image}
                                    alt={property.name}
                                    className={styles.cardImage}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = getPlaceholder(property.name);
                                    }}
                                />
                                <div className={`${styles.statusBadge} ${styles[property.status.toLowerCase()]}`}>
                                    {property.status}
                                </div>
                                <div className={styles.moreWrapper}>
                                    <button
                                        className={`${styles.moreButton} ${activeMenuId === property.id ? styles.activeMore : ''}`}
                                        onClick={(e) => toggleMenu(property.id, e)}
                                    >
                                        <MoreVertical size={18} />
                                    </button>

                                    {activeMenuId === property.id && (
                                        <div className={styles.actionMenu}>
                                            <Link href={`/properties/${property.id}`} className={styles.menuItem}>
                                                <Eye size={16} />
                                                <span>View Full Details</span>
                                            </Link>
                                            <Link href={`/properties/edit/${property.id}`} className={styles.menuItem}>
                                                <Edit3 size={16} />
                                                <span>Edit Property</span>
                                            </Link>
                                            <div className={styles.menuDivider} />
                                            <button
                                                className={`${styles.menuItem} ${styles.deleteAction}`}
                                                onClick={(e) => handleDeleteClick(property.id, e)}
                                            >
                                                <Trash2 size={16} />
                                                <span>Delete Property</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={styles.cardContent}>
                                <div className={styles.cardHeader}>
                                    <span className={styles.categoryBadge}>{property.category}</span>
                                    <div className={styles.rating}>
                                        <Star size={14} className={styles.starIcon} fill="currentColor" />
                                        <span>{property.rating}</span>
                                    </div>
                                </div>

                                <h3 className={styles.propertyName}>{property.name}</h3>

                                <div className={styles.propertyInfo}>
                                    <div className={styles.infoItem}>
                                        <MapPin size={14} className={styles.infoIcon} />
                                        <span>{property.address}</span>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <BedDouble size={14} className={styles.infoIcon} />
                                        <span>{property.availableRooms} / {property.totalRooms} Rooms Available</span>
                                    </div>
                                </div>

                                <div className={styles.cardFooter}>
                                    <div className={styles.progressContainer}>
                                        <div
                                            className={styles.progressBar}
                                            style={{ width: `${((property.totalRooms - property.availableRooms) / property.totalRooms) * 100}%` }}
                                        />
                                    </div>
                                    <div className={styles.progressLabel}>
                                        {Math.round(((property.totalRooms - property.availableRooms) / property.totalRooms) * 100)}% Occupied
                                    </div>

                                    <Link href={`/properties/${property.id}`} className={styles.viewLink}>
                                        <span>View Details</span>
                                        <ChevronRight size={16} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Property</th>
                                <th>Category</th>
                                <th>Location</th>
                                <th>Occupancy</th>
                                <th>Status</th>
                                <th>Rating</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visibleProperties.map((property) => (
                                <tr key={property.id}>
                                    <td>
                                        <div className={styles.tablePropertyCell}>
                                            <img
                                                src={property.image}
                                                className={styles.tableThumb}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = getPlaceholder(property.name);
                                                }}
                                            />
                                            <div className={styles.tableNameInfo}>
                                                <div className={styles.tableName}>{property.name}</div>
                                                <div className={styles.tableId}>ID: PROP-{property.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td><span className={styles.categoryBadge}>{property.category}</span></td>
                                    <td>
                                        <div className={styles.tableLocation}>
                                            <MapPin size={12} />
                                            {property.address}
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.tableOccupancy}>
                                            <div className={styles.tableOccupancyText}>
                                                {property.availableRooms} / {property.totalRooms} Available
                                            </div>
                                            <div className={styles.tableMiniProgress}>
                                                <div
                                                    className={styles.tableMiniProgressBar}
                                                    style={{ width: `${((property.totalRooms - property.availableRooms) / property.totalRooms) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`${styles.statusBadgeTable} ${styles[property.status.toLowerCase()]}`}>
                                            {property.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={styles.tableRating}>
                                            <Star size={14} fill="#f59e0b" color="#f59e0b" />
                                            {property.rating}
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.tableActions}>
                                            <Link href={`/properties/${property.id}`} className={styles.actionBtnIcon} title="View Details">
                                                <Eye size={16} />
                                            </Link>
                                            <Link href={`/properties/edit/${property.id}`} className={styles.actionBtnIcon} title="Edit">
                                                <Edit3 size={16} />
                                            </Link>
                                            <button
                                                className={`${styles.actionBtnIcon} ${styles.deleteActionTable}`}
                                                onClick={(e) => handleDeleteClick(property.id, e)}
                                                title="Delete"
                                            >
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

            {/* Load More section */}
            {filteredProperties.length > displayLimit && (
                <div className={styles.loadMoreContainer}>
                    <button
                        className={styles.loadMoreButton}
                        onClick={() => setDisplayLimit(prev => prev + 6)}
                    >
                        Load More Properties
                    </button>
                    <p className={styles.loadMoreText}>
                        Showing {visibleProperties.length} of {filteredProperties.length} properties
                    </p>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className={styles.modalOverlay} onClick={() => setDeleteId(null)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalIcon}>
                            <AlertTriangle size={32} />
                        </div>
                        <h2 className={styles.modalTitle}>Delete Property?</h2>
                        <p className={styles.modalText}>
                            Are you sure you want to delete this property? This action cannot be undone and will remove all associated room and booking data.
                        </p>
                        <div className={styles.modalActions}>
                            <button className={styles.cancelModalBtn} onClick={() => setDeleteId(null)}>
                                Cancel
                            </button>
                            <button className={styles.confirmDeleteBtn} onClick={confirmDelete}>
                                Yes, Delete Property
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
