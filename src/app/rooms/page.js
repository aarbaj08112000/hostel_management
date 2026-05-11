'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Plus, Search, Building2, BedDouble, Users, Trash2, Edit3, Eye, Filter,
    ChevronDown, MoreVertical, X, AlertTriangle, Save, LayoutGrid, Table, Check
} from 'lucide-react';
import Header from '@/components/Header';
import CustomSelect from '../../components/CustomSelect';
import styles from './page.module.css';
import { fetchRooms, addRoom, updateRoom } from '@/utils/api';
import { useToast } from '@/context/ToastContext';

const initialRoomData = {
    roomNumber: '',
    propertyId: '',
    propertyName: '',
    type: 'Single',
    capacity: 1,
    currentOccupants: 0,
    pricePerMonth: '',
    status: 'Available',
    floor: '',
    amenities: [],
    description: ''
};

const roomTypes = ['Single', 'Double', 'Triple', 'Studio'];
const roomStatuses = ['Available', 'Full', 'Maintenance'];
const roomAmenities = ['WiFi', 'AC', 'Attached Bath', 'TV', 'Balcony'];

export default function RoomsPage() {
    const router = useRouter();
    const showToast = useToast();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [activeMenuId, setActiveMenuId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const [deletingRoom, setDeletingRoom] = useState(null);
    const [formData, setFormData] = useState(initialRoomData);
    const [viewMode, setViewMode] = useState('grid');
    const [showLayoutMenu, setShowLayoutMenu] = useState(false);

    useEffect(() => {
        loadRooms();
    }, []);

    const loadRooms = async () => {
        setLoading(true);
        try {
            const response = await fetchRooms({ limit: 100 });
            if (response.settings.success) {
                const mapped = response.data.rooms.map(r => ({
                    id: String(r.room_id),
                    roomNumber: r.room_number,
                    propertyName: r.hostel_name || 'N/A',
                    type: r.room_type,
                    capacity: Number(r.total_beds),
                    currentOccupants: 0, // Need occupants count from backend
                    pricePerMonth: 5000, // Missing in DB? Using placeholder
                    status: 'Available',
                    floor: r.floor_number || 'N/A',
                    amenities: [],
                    description: '',
                    room_id: r.room_id
                }));
                setRooms(mapped);
            } else {
                setRooms([]);
            }
        } catch (err) {
            console.error(err);
            setError('Failed to load rooms');
        } finally {
            setLoading(false);
        }
    };

    const filteredRooms = rooms.filter(room => {
        const matchesSearch = room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            room.propertyName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === 'All' || room.type === typeFilter;
        const matchesStatus = statusFilter === 'All' || room.status === statusFilter;
        return matchesSearch && matchesType && matchesStatus;
    });

    const handleOpenModal = (room = null) => {
        if (room) {
            setEditingRoom(room);
            setFormData(room);
        } else {
            setEditingRoom(null);
            setFormData(initialRoomData);
        }
        setShowModal(true);
        setActiveMenuId(null);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingRoom(null);
        setFormData(initialRoomData);
    };

    const handleDeleteClick = (room) => {
        setDeletingRoom(room);
        setShowDeleteModal(true);
        setActiveMenuId(null);
    };

    const confirmDelete = async () => {
        try {
            await deleteRoom(deletingRoom.room_id);
            loadRooms();
            setShowDeleteModal(false);
            setDeletingRoom(null);
        } catch (err) {
            showToast('Failed to delete room', 'error');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAmenityToggle = (amenity) => {
        setFormData(prev => {
            const amenities = prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity];
            return { ...prev, amenities };
        });
    };

    const handleSaveRoom = async (e) => {
        e.preventDefault();
        try {
            const body = {
                room_number: formData.roomNumber,
                room_type: formData.type,
                total_beds: formData.capacity,
                hostel_id: 1, // Need property selection logic
                floor_id: 1, // Need floor selection logic
            };

            if (editingRoom) {
                await updateRoom(editingRoom.room_id, body);
            } else {
                await addRoom(body);
            }
            loadRooms();
            handleCloseModal();
        } catch (err) {
            showToast('Failed to save room', 'error');
        }
    };

    return (
        <main style={{ minHeight: '100vh' }}>
            <Header title="Room Management" />

            <div className={styles.container} onClick={() => setActiveMenuId(null)}>
                <div className={styles.header}>
                    <div className={styles.titleSection}>
                        <h1>Rooms & Occupancy</h1>
                        <p>Track room status, occupancy levels, and property assignments across your portfolio.</p>
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
                        <button className={styles.addBtn} onClick={() => handleOpenModal()}>
                            <Plus size={18} />
                            <span>Add New Room</span>
                        </button>
                    </div>
                </div>

                <div className={styles.filterBar}>
                    <div className={styles.searchWrapper}>
                        <Search className={styles.searchIcon} size={18} />
                        <input
                            type="text"
                            placeholder="Search by room number or property..."
                            className={styles.searchInput}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className={styles.filterGroup}>
                        <select
                            className={styles.filterBtn}
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                        >
                            <option value="All">All Types</option>
                            {roomTypes.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>

                        <select
                            className={styles.filterBtn}
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="All">All Statuses</option>
                            {roomStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '100px' }}>Loading...</div>
                ) : error ? (
                    <div style={{ textAlign: 'center', padding: '100px', color: '#ef4444' }}>{error}</div>
                ) : viewMode === 'grid' ? (
                    <div className={styles.roomsGrid}>
                        {filteredRooms.map((room) => {
                            const occupancyPercent = (room.currentOccupants / room.capacity) * 100;
                            const statusClass = room.status.toLowerCase();

                            return (
                                <div key={room.id} className={styles.roomCard}>
                                    <div className={styles.cardHeader}>
                                        <span className={styles.roomBadge}>{room.type}</span>
                                        <span className={`${styles.statusBadge} ${styles[statusClass]}`}>
                                            {room.status}
                                        </span>
                                    </div>

                                    <div className={styles.roomInfo}>
                                        <h2 className={styles.roomNumber}>Room {room.roomNumber}</h2>
                                        <div className={styles.propertyName}>
                                            <Building2 size={14} />
                                            <span>{room.propertyName}</span>
                                        </div>
                                    </div>

                                    <div className={styles.occupancySection}>
                                        <div className={styles.occupancyLabel}>
                                            <span>Occupancy</span>
                                            <span>{room.currentOccupants} / {room.capacity} beds</span>
                                        </div>
                                        <div className={styles.progressBar}>
                                            <div
                                                className={styles.progressFill}
                                                style={{ width: `${occupancyPercent}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className={styles.cardFooter}>
                                        <div className={styles.priceTag}>
                                            <span className={styles.priceVal}>₹{room.pricePerMonth.toLocaleString()}</span>
                                            <span className={styles.priceLbl}>per month</span>
                                        </div>

                                        <div className={styles.actions}>
                                            <button
                                                className={styles.actionBtn}
                                                title="View Details"
                                                onClick={() => router.push(`/rooms/${room.id}`)}
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button className={styles.actionBtn} title="Edit Room" onClick={() => handleOpenModal(room)}>
                                                <Edit3 size={16} />
                                            </button>
                                            <button className={`${styles.actionBtn} ${styles.deleteBtn}`} title="Delete Room" onClick={() => handleDeleteClick(room)}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Room Details</th>
                                    <th>Property & Floor</th>
                                    <th>Occupancy Status</th>
                                    <th>Pricing</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRooms.map((room) => {
                                    const occupancyPercent = (room.currentOccupants / room.capacity) * 100;
                                    const statusClass = room.status.toLowerCase();

                                    return (
                                        <tr key={room.id}>
                                            <td>
                                                <div className={styles.tableRoomCell}>
                                                    <div className={styles.tableRoomIcon}>
                                                        <BedDouble size={20} />
                                                    </div>
                                                    <div className={styles.tableRoomInfo}>
                                                        <div className={styles.tableRoomNumber}>Room {room.roomNumber}</div>
                                                        <div className={styles.tableRoomType}>{room.type}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className={styles.tablePropertyInfo}>
                                                    <div className={styles.tablePropertyName}>{room.propertyName}</div>
                                                    <div className={styles.tableFloor}>{room.floor || 'N/A'}</div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className={styles.tableOccupancyInfo}>
                                                    <div className={styles.tableOccupancyLabel}>
                                                        <span>{room.currentOccupants} / {room.capacity} Beds</span>
                                                        <span>{Math.round(occupancyPercent)}%</span>
                                                    </div>
                                                    <div className={styles.tableProgressBar}>
                                                        <div
                                                            className={styles.tableProgressFill}
                                                            style={{ width: `${occupancyPercent}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className={styles.tableFinanceInfo}>
                                                    <div className={styles.tablePrice}>₹{room.pricePerMonth.toLocaleString()}</div>
                                                    <div className={styles.tablePriceLbl}>per month</div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`${styles.statusBadgeTable} ${styles[statusClass]}`}>
                                                    {room.status}
                                                </span>
                                            </td>
                                            <td>
                                                <div className={styles.tableActions}>
                                                    <button
                                                        className={styles.actionBtnIcon}
                                                        title="View Details"
                                                        onClick={() => router.push(`/rooms/${room.id}`)}
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    <button
                                                        className={styles.actionBtnIcon}
                                                        title="Edit Room"
                                                        onClick={() => handleOpenModal(room)}
                                                    >
                                                        <Edit3 size={16} />
                                                    </button>
                                                    <button
                                                        className={`${styles.actionBtnIcon} ${styles.deleteBtnIcon}`}
                                                        title="Delete Room"
                                                        onClick={() => handleDeleteClick(room)}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {filteredRooms.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                        <BedDouble size={48} color="#94a3b8" style={{ marginBottom: '16px' }} />
                        <h3 style={{ color: '#1e293b', marginBottom: '8px' }}>No rooms found</h3>
                        <p style={{ color: '#64748b' }}>Try adjusting your search or filters to find what you're looking for.</p>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className={styles.modalOverlay} onClick={handleCloseModal}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>{editingRoom ? 'Edit Room' : 'Add New Room'}</h2>
                            <button className={styles.closeBtn} onClick={handleCloseModal}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveRoom}>
                            <div className={styles.modalBody}>
                                <div className={styles.formGrid}>
                                    <div className={styles.formGroup}>
                                        <label>Room Number *</label>
                                        <input
                                            type="text"
                                            name="roomNumber"
                                            className={styles.formInput}
                                            placeholder="e.g. 101, B-20"
                                            value={formData.roomNumber}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Room Type *</label>
                                        <CustomSelect
                                            name="type"
                                            value={formData.type}
                                            onChange={handleInputChange}
                                            options={roomTypes}
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Property Name *</label>
                                        <input
                                            type="text"
                                            name="propertyName"
                                            className={styles.formInput}
                                            placeholder="Property assigning to"
                                            value={formData.propertyName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Floor</label>
                                        <input
                                            type="text"
                                            name="floor"
                                            className={styles.formInput}
                                            placeholder="e.g. 1st Floor"
                                            value={formData.floor}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Capacity (Beds) *</label>
                                        <input
                                            type="number"
                                            name="capacity"
                                            className={styles.formInput}
                                            min="1"
                                            value={formData.capacity}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Price Per Month (₹) *</label>
                                        <input
                                            type="number"
                                            name="pricePerMonth"
                                            className={styles.formInput}
                                            placeholder="Monthly rent"
                                            value={formData.pricePerMonth}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Status</label>
                                        <CustomSelect
                                            name="status"
                                            value={formData.status}
                                            onChange={handleInputChange}
                                            options={roomStatuses}
                                        />
                                    </div>

                                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                        <label>Description</label>
                                        <textarea
                                            name="description"
                                            className={styles.formTextarea}
                                            placeholder="Additional details about the room..."
                                            value={formData.description}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                        <span className={styles.amenityLabel}>Amenities</span>
                                        <div className={styles.amenityGrid}>
                                            {roomAmenities.map(amenity => (
                                                <div
                                                    key={amenity}
                                                    className={`${styles.amenityCheckbox} ${formData.amenities.includes(amenity) ? styles.checked : ''}`}
                                                    onClick={() => handleAmenityToggle(amenity)}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.amenities.includes(amenity)}
                                                        readOnly
                                                    />
                                                    <span className={styles.amenityText}>{amenity}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.modalFooter}>
                                <button type="button" className={styles.cancelBtn} onClick={handleCloseModal}>
                                    Cancel
                                </button>
                                <button type="submit" className={styles.submitBtn}>
                                    <Save size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                                    {editingRoom ? 'Update Room' : 'Add Room'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className={styles.modalOverlay} onClick={() => setShowDeleteModal(false)}>
                    <div className={styles.modalContent} style={{ maxWidth: '400px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalBody}>
                            <div className={styles.modalIcon} style={{ background: '#fef2f2', color: '#ef4444', height: '64px', width: '64px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                                <AlertTriangle size={32} />
                            </div>
                            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', marginBottom: '12px' }}>Delete Room?</h2>
                            <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#64748b', marginBottom: '24px' }}>
                                Are you sure you want to delete <strong style={{ color: '#0f172a' }}>Room {deletingRoom?.roomNumber}</strong> at {deletingRoom?.propertyName}?<br />
                                This action cannot be undone and will remove all associated data.
                            </p>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button className={styles.cancelBtn} style={{ flex: 1 }} onClick={() => setShowDeleteModal(false)}>
                                    Cancel
                                </button>
                                <button
                                    className={styles.submitBtn}
                                    style={{ flex: 1.5, background: '#ef4444', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)' }}
                                    onClick={confirmDelete}
                                >
                                    Yes, Delete Room
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
