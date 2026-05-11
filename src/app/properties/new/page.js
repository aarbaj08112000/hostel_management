'use client';

import { useState } from 'react';
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
    Loader2
} from 'lucide-react';
import styles from './page.module.css';
import CustomSelect from '../../../components/CustomSelect';
import { BASE_URL, getHeaders } from '@/utils/api';
import { useToast } from '@/context/ToastContext';

const tabs = [
    { id: 1, label: 'Basic Details', icon: <Building2 size={16} /> },
    { id: 2, label: 'Media & Description', icon: <ImageIcon size={16} /> },
];

export default function NewPropertyPage() {
    const router = useRouter();
    const showToast = useToast();
    const [activeTab, setActiveTab] = useState(1);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        hostel_name: '',
        category: 'Hostel',
        address: '',
        city: '',
        state: '',
        pincode: '',
        contact_number: '',
        description: '',
    });

    // Primary image state
    const [primaryFile, setPrimaryFile] = useState(null);
    const [primaryPreview, setPrimaryPreview] = useState(null);

    // Gallery images state
    const [galleryFiles, setGalleryFiles] = useState([]);
    const [galleryPreviews, setGalleryPreviews] = useState([]);

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
            const res = await fetch(`${BASE_URL}/core/hostle-add`, {
                method: 'POST',
                headers: getHeaders(true),
                body: submitData,
            });
            const data = await res.json();
            if (!res.ok || data?.settings?.success === 0) {
                throw new Error(data?.settings?.message || 'Failed to add property');
            }
            router.push('/properties');
        } catch (err) {
            showToast('Error: ' + err.message, 'error');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.header}>
                <div className={styles.headerInfo}>
                    <h1 className={styles.title}>Add New Property</h1>
                    <p className={styles.subtitle}>Fill in the details to list a new hostel or PG property.</p>
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
                                <CustomSelect name="category" value={formData.category} onChange={handleInputChange} options={['Hostel', 'PG', 'Apartment']} />
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
                                placeholder="Describe features, amenities, and house rules..."
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
                            <X size={18} /> Cancel
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
                                {saving ? ' Saving...' : ' Save Property'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
