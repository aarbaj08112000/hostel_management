'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Building2,
    Image as ImageIcon,
    ChevronRight,
    ArrowLeft,
    Save,
    X,
    Upload,
    Plus,
    Loader2,
    Trash2
} from 'lucide-react';

import styles from '../../new/page.module.css';
import { BASE_URL, getHeaders } from '@/utils/api';
import { useToast } from '@/context/ToastContext';

const tabs = [
    { id: 1, label: 'Basic Details', icon: <Building2 size={16} /> },
    { id: 2, label: 'Media & Description', icon: <ImageIcon size={16} /> },
];

export default function EditPropertyPage({ params }) {
    const router = useRouter();
    const showToast = useToast();
    const { id } = use(params);
    const [activeTab, setActiveTab] = useState(1);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        hostel_name: '',
        category: 'PG',
        address: '',
        city: '',
        state: '',
        pincode: '',
        contact_number: '',
        description: '',
    });

    const [existingPrimary, setExistingPrimary] = useState(null);
    const [existingGallery, setExistingGallery] = useState([]);
    
    // Primary image state
    const [primaryFile, setPrimaryFile] = useState(null);
    const [primaryPreview, setPrimaryPreview] = useState(null);

    // Gallery images state
    const [galleryFiles, setGalleryFiles] = useState([]);
    const [galleryPreviews, setGalleryPreviews] = useState([]);

    // Fetch real hostel details on mount
    useEffect(() => {
        if (!id) return;
        const fetchDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`${BASE_URL}/core/hostle-details/${id}`, {
                    method: 'GET',
                    headers: getHeaders(),
                });
                const data = await res.json();
                if (!res.ok || data?.settings?.success === 0) {
                    throw new Error(data?.settings?.message || 'Failed to fetch property details');
                }
                const hostel = Array.isArray(data.data) ? data.data[0] : data.data;
                setFormData({
                    hostel_name: hostel.hostel_name || '',
                    category: hostel.category || 'PG',
                    address: hostel.address || '',
                    city: hostel.city || '',
                    state: hostel.state || '',
                    pincode: hostel.pincode || '',
                    contact_number: hostel.contact_number || '',
                    description: hostel.description || '',
                });

                if (hostel.attachments && Array.isArray(hostel.attachments)) {
                    // Split attachments by module
                    const primary = hostel.attachments.find(att => att.module === 'hostel_primary');
                    if (primary) {
                       setExistingPrimary({
                           id: primary.attachment_id || primary.id || primary.file_path,
                           url: primary.file_path.startsWith('http') ? primary.file_path : `${BASE_URL}/public/upload/attachments_local/${primary.file_path}`
                       });
                    }
                    
                    const galleryAtts = hostel.attachments.filter(att => att.module !== 'hostel_primary');
                    setExistingGallery(galleryAtts.map(att => ({
                        id: att.attachment_id || att.id || att.file_path,
                        url: att.file_path.startsWith('http') ? att.file_path : `${BASE_URL}/public/upload/attachments_local/${att.file_path}`
                    })));
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePrimaryFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setPrimaryFile(file);
        setPrimaryPreview(URL.createObjectURL(file));
    };

    const handleGalleryFilesChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length === 0) return;
        setGalleryFiles((prev) => [...prev, ...selectedFiles]);
        const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
        setGalleryPreviews((prev) => [...prev, ...newPreviews]);
    };

    const handleDeleteExistingPrimary = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete the primary image?')) return;
        try {
            const res = await fetch(`${BASE_URL}/core/hostle-attachment-delete/${existingPrimary.id}`, {
                method: 'DELETE',
                headers: getHeaders(),
            });
            if (!res.ok) throw new Error('Failed to delete attachment');
            setExistingPrimary(null);
        } catch (err) {
            showToast('Error deleting image: ' + err.message, 'error');
        }
    };

    const handleDeleteExistingGallery = async (e, imageObj) => {
        e.preventDefault();
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this gallery image?')) return;
        try {
            const res = await fetch(`${BASE_URL}/core/hostle-attachment-delete/${imageObj.id}`, {
                method: 'DELETE',
                headers: getHeaders(),
            });
            if (!res.ok) throw new Error('Failed to delete attachment');
            setExistingGallery(prev => prev.filter(img => img.id !== imageObj.id));
        } catch (err) {
            showToast('Error deleting image: ' + err.message, 'error');
        }
    };

    const handleRemovePrimaryPreview = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setPrimaryFile(null);
        setPrimaryPreview(null);
    };

    const handleRemoveGalleryPreview = (e, index) => {
        e.preventDefault();
        e.stopPropagation();
        setGalleryFiles(prev => prev.filter((_, i) => i !== index));
        setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        const submitData = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key] !== undefined && formData[key] !== null) {
                submitData.append(key, formData[key]);
            }
        });
        
        if (primaryFile) submitData.append('primary_image', primaryFile);
        galleryFiles.forEach((file) => {
            submitData.append(`files`, file);
        });

        try {
            const res = await fetch(`${BASE_URL}/core/hostle-update/${id}`, {
                method: 'PATCH',
                headers: getHeaders(true),
                body: submitData,
            });
            const data = await res.json();
            if (!res.ok || data?.settings?.success === 0) {
                throw new Error(data?.settings?.message || 'Update failed');
            }
            router.push('/properties');
        } catch (err) {
            showToast('Error: ' + err.message, 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.pageContainer} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
                <div style={{ textAlign: 'center', color: '#6b7280' }}>
                    <Loader2 size={40} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
                    <p>Loading property details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.pageContainer} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
                <div style={{ textAlign: 'center', color: '#ef4444' }}>
                    <p style={{ fontSize: '18px', fontWeight: 600 }}>Failed to load property</p>
                    <p style={{ marginTop: 8, color: '#6b7280' }}>{error}</p>
                    <Link href="/properties" style={{ marginTop: 16, display: 'inline-block', color: '#6366f1' }}>← Back to Properties</Link>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.pageContainer}>
            <div className={styles.header}>
                <div className={styles.headerInfo}>
                    <h1 className={styles.title}>Edit Property #{id}</h1>
                    <p className={styles.subtitle}>Update the details for your hostel or PG property.</p>
                </div>
                <div className={styles.headerActions}>
                    <Link href="/properties" className={styles.backBtn}>
                        <ArrowLeft size={18} /> <span>Back to List</span>
                    </Link>
                </div>
            </div>

            <div className={styles.formCard}>
                <div className={styles.tabsContainer}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="formContainer">
                    {/* 1. Basic Information */}
                    <div className={`${styles.formSection} ${activeTab === 1 ? styles.activeSection : ''}`}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>Basic Information</h2>
                        </div>
                        <div className={styles.grid}>
                            <div className={styles.formGroup}>
                                <label>Property Name *</label>
                                <input
                                    type="text"
                                    name="hostel_name"
                                    value={formData.hostel_name}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Sunset Heights Hostel"
                                    required
                                    suppressHydrationWarning
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Category</label>
                                <select name="category" value={formData.category} onChange={handleInputChange}>
                                    <option value="Hostel">Hostel</option>
                                    <option value="PG">PG</option>
                                    <option value="Apartment">Apartment</option>
                                </select>
                            </div>
                            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                <label>Full Address *</label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    placeholder="Enter complete building address..."
                                    rows={3}
                                    required
                                    suppressHydrationWarning
                                />
                            </div>
                        </div>
                        <div className={styles.grid3} style={{ marginTop: '20px' }}>
                            <div className={styles.formGroup}>
                                <label>City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Bangalore"
                                    suppressHydrationWarning
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>State</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Karnataka"
                                    suppressHydrationWarning
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Pincode</label>
                                <input
                                    type="text"
                                    name="pincode"
                                    value={formData.pincode}
                                    onChange={handleInputChange}
                                    placeholder="6-digit ZIP code"
                                    suppressHydrationWarning
                                />
                            </div>
                        </div>
                        <div className={styles.grid} style={{ marginTop: '20px' }}>
                            <div className={styles.formGroup}>
                                <label>Contact Number</label>
                                <input
                                    type="text"
                                    name="contact_number"
                                    value={formData.contact_number}
                                    onChange={handleInputChange}
                                    placeholder="e.g. 9876543210"
                                    suppressHydrationWarning
                                />
                            </div>
                        </div>
                    </div>

                    {/* 2. Media & Description */}
                    <div className={`${styles.formSection} ${activeTab === 2 ? styles.activeSection : ''}`}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>Media & Description</h2>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Property Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Describe the property..."
                                rows={6}
                                suppressHydrationWarning
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', marginTop: '24px' }}>
                            {/* Primary Image Upload */}
                            <div>
                                <h3 style={{ fontSize: '14px', marginBottom: '10px', fontWeight: 600 }}>Primary Image</h3>
                                <div className={styles.uploadWrapper} style={{ position: 'relative', height: '160px' }}>
                                    <input 
                                        type="file" 
                                        accept="image/png, image/jpeg, image/jpg, image/webp" 
                                        onChange={handlePrimaryFileChange}
                                        style={{
                                            position: 'absolute', width: '100%', height: '100%', 
                                            opacity: 0, cursor: 'pointer', zIndex: 10
                                        }}
                                    />
                                    <div className={styles.uploadLarge} style={{ padding: '20px' }}>
                                        <Upload size={24} />
                                        <span style={{ fontSize: '13px' }}>Click or drop primary image</span>
                                    </div>
                                </div>
                                <div className={styles.uploadPreview} style={{ marginTop: '10px', minHeight: '100px' }}>
                                    {existingPrimary && !primaryPreview && (
                                        <div className={styles.placeholderBox} style={{ overflow: 'hidden', padding: 0, position: 'relative', width: '100%', height: '120px' }}>
                                            <button 
                                                type="button"
                                                onClick={handleDeleteExistingPrimary}
                                                style={{ position: 'absolute', top: '4px', right: '4px', background: '#e11d48', color: '#fff', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                            <img src={existingPrimary.url} alt="Existing Primary" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                    )}
                                    {primaryPreview && (
                                        <div className={styles.placeholderBox} style={{ overflow: 'hidden', padding: 0, position: 'relative', width: '100%', height: '120px' }}>
                                            <span style={{ position: 'absolute', top: '4px', left: '4px', background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '10px', padding: '2px 4px', borderRadius: '4px', zIndex: 5 }}>New</span>
                                            <button 
                                                type="button"
                                                onClick={handleRemovePrimaryPreview}
                                                style={{ position: 'absolute', top: '4px', right: '4px', background: '#4b5563', color: '#fff', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}
                                            >
                                                <X size={14} />
                                            </button>
                                            <img src={primaryPreview} alt="new primary" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Gallery Images Upload */}
                            <div>
                                <h3 style={{ fontSize: '14px', marginBottom: '10px', fontWeight: 600 }}>Gallery Images</h3>
                                <div className={styles.uploadWrapper} style={{ position: 'relative', height: '160px' }}>
                                    <input 
                                        type="file" 
                                        multiple 
                                        accept="image/png, image/jpeg, image/jpg, image/webp" 
                                        onChange={handleGalleryFilesChange}
                                        style={{
                                            position: 'absolute', width: '100%', height: '100%', 
                                            opacity: 0, cursor: 'pointer', zIndex: 10
                                        }}
                                    />
                                    <div className={styles.uploadLarge} style={{ padding: '20px' }}>
                                        <Upload size={24} />
                                        <span style={{ fontSize: '13px' }}>Drag and drop images to update gallery</span>
                                    </div>
                                </div>

                                <div className={styles.uploadPreview} style={{ marginTop: '10px' }}>
                                    {existingGallery.map((imgObj, i) => (
                                        <div key={`existing-${i}`} className={styles.placeholderBox} style={{ overflow: 'hidden', padding: 0, position: 'relative' }}>
                                            <button 
                                                type="button"
                                                onClick={(e) => handleDeleteExistingGallery(e, imgObj)}
                                                style={{ position: 'absolute', top: '4px', right: '4px', background: '#e11d48', color: '#fff', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                            <img src={imgObj.url} alt="Existing" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                    ))}
                                    {galleryPreviews.map((src, i) => (
                                        <div key={`new-${i}`} className={styles.placeholderBox} style={{ overflow: 'hidden', padding: 0, position: 'relative' }}>
                                            <span style={{ position: 'absolute', top: '4px', left: '4px', background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '10px', padding: '2px 4px', borderRadius: '4px', zIndex: 5 }}>New</span>
                                            <button 
                                                type="button"
                                                onClick={(e) => handleRemoveGalleryPreview(e, i)}
                                                style={{ position: 'absolute', top: '4px', right: '4px', background: '#4b5563', color: '#fff', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}
                                            >
                                                <X size={14} />
                                            </button>
                                            <img src={src} alt="new preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.formFooterActions}>
                        <Link href="/properties" className={styles.btnFooterCancel}>
                            <X size={18} /> Discard Changes
                        </Link>
                        {activeTab < tabs.length ? (
                            <button
                                type="button"
                                className={styles.btnFooterSubmit}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setActiveTab(activeTab + 1);
                                }}
                            >
                                Continue <ChevronRight size={18} />
                            </button>
                        ) : (
                            <button type="button" className={styles.btnFooterSubmit} disabled={saving} onClick={handleSubmit}>
                                {saving ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={18} />}
                                {saving ? ' Saving...' : ' Update Property'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
