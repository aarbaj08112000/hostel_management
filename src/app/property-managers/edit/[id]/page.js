'use client';

import { useState, use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchPropertyManagerDetails, updatePropertyManager } from '../../../../utils/api';
import { useToast } from '../../../../context/ToastContext';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Briefcase,
    ShieldCheck,
    Lock,
    ArrowLeft,
    Save,
    X,
    ChevronRight,
    Building2,
    Calendar,
    Camera,
    Plus,
    Check
} from 'lucide-react';

import styles from '../../new/page.module.css';

const tabs = [
    { id: 1, label: 'Personal Info', icon: <User size={16} /> },
    { id: 2, label: 'Contact Details', icon: <Mail size={16} /> },
    { id: 3, label: 'Professional Info', icon: <Briefcase size={16} /> },
    { id: 4, label: 'Permissions', icon: <ShieldCheck size={16} /> },
    { id: 5, label: 'Account Security', icon: <Lock size={16} /> },
];

export default function EditPropertyManagerPage({ params: paramsPromise }) {
    const params = use(paramsPromise);
    const router = useRouter();
    const showToast = useToast();
    const { id } = params;
    const [activeTab, setActiveTab] = useState(1);

    const [profileFile, setProfileFile] = useState(null);
    const [profilePreview, setProfilePreview] = useState(null);

    const [isFetching, setIsFetching] = useState(true);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        gender: 'Male',
        dob: '',
        email: '',
        phone: '',
        altPhone: '',
        address: '',
        city: '',
        state: '',
        employeeId: '',
        designation: 'Property Manager',
        joiningDate: '',
        salary: '',
        role: 'Manager',
        status: 'Active',
        username: '',
        password: '',
        assignedProperties: [],
    });

    useEffect(() => {
        const loadDetail = async () => {
            try {
                const res = await fetchPropertyManagerDetails(id);
                const data = res?.data?.manager_details || res?.data;
                if (data && typeof data === 'object' && !Array.isArray(data)) {
                    if (data.attachments && data.attachments.length > 0) {
                        setProfilePreview(`http://localhost:3009/public/upload/attachments_local/${data.attachments[0].file_path}`);
                    }
                    setFormData({
                        firstName: data.first_name || '',
                        lastName: data.last_name || '',
                        gender: data.gender || 'Male',
                        dob: data.dob ? data.dob.split('T')[0] : '',
                        email: data.email || '',
                        phone: data.phone || '',
                        altPhone: data.alt_phone || '',
                        address: data.address || '',
                        city: data.city || '',
                        state: data.state || '',
                        employeeId: data.employee_id || '',
                        designation: data.designation || 'Property Manager',
                        joiningDate: data.joining_date ? data.joining_date.split('T')[0] : '',
                        salary: data.salary || '',
                        role: data.role || 'Manager',
                        status: data.status || 'Active',
                        username: data.username || '',
                        password: '', // do not prepopulate password hash
                        assignedProperties: Array.isArray(data.assigned_properties) ? data.assigned_properties : [],
                    });
                }
            } catch (err) {
                console.error(err);
            }
            setIsFetching(false);
        };
        if (id) loadDetail();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleProfileFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setProfileFile(file);
        setProfilePreview(URL.createObjectURL(file));
    };

    const handleRemoveProfilePreview = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setProfileFile(null);
        setProfilePreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        let submitData = new FormData();
        submitData.append('first_name', formData.firstName);
        submitData.append('last_name', formData.lastName);
        submitData.append('gender', formData.gender);
        if (formData.dob) submitData.append('dob', formData.dob);
        submitData.append('email', formData.email);
        submitData.append('phone', formData.phone);
        if (formData.altPhone) submitData.append('alt_phone', formData.altPhone);
        submitData.append('address', formData.address);
        submitData.append('city', formData.city);
        submitData.append('state', formData.state);
        submitData.append('employee_id', formData.employeeId);
        submitData.append('designation', formData.designation);
        if (formData.joiningDate) submitData.append('joining_date', formData.joiningDate);
        submitData.append('salary', formData.salary || 0);
        submitData.append('role', formData.role);
        submitData.append('status', formData.status);
        submitData.append('username', formData.username);
        if (formData.password) submitData.append('password', formData.password);
        
        submitData.append('assigned_properties', JSON.stringify(formData.assignedProperties));
        
        if (profileFile) {
            submitData.append('files', profileFile);
        }

        try {
            const res = await updatePropertyManager(id, submitData, true);
            if (res?.settings?.success === 1) {
                showToast('Property Manager updated successfully!', 'success');
                router.push('/property-managers');
            } else {
                showToast(res?.settings?.message || 'Failed to update manager', 'error');
            }
        } catch (err) {
            console.error('Submit error:', err);
            showToast('Failed to update manager: ' + err.message, 'error');
        }
    };

    if (isFetching) {
        return <div className={styles.pageContainer} style={{padding: '50px', textAlign: 'center'}}>Loading details...</div>;
    }

    return (
        <div className={styles.pageContainer}>
            <div className={styles.header}>
                <div className={styles.headerInfo}>
                    <h1 className={styles.title}>Edit Property Manager #{id}</h1>
                    <p className={styles.subtitle}>Update the profile and permissions for this property manager.</p>
                </div>
                <div className={styles.headerActions}>
                    <Link href="/property-managers" className={styles.backBtn}>
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

                <form onSubmit={handleSubmit}>
                    {/* Tab 1: Personal Info */}
                    <div className={`${styles.formSection} ${activeTab === 1 ? styles.activeSection : ''}`}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>Personal Information</h2>
                        </div>
                        
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ fontSize: '13px', fontWeight: '700', color: '#475569', marginBottom: '10px', display: 'block' }}>Profile Image</label>
                            <div className={styles.uploadWrapper} style={{ position: 'relative', height: '160px', maxWidth: '300px' }}>
                                <input 
                                    type="file" 
                                    accept="image/png, image/jpeg, image/jpg, image/webp" 
                                    onChange={handleProfileFileChange}
                                    style={{
                                        position: 'absolute', width: '100%', height: '100%', 
                                        opacity: 0, cursor: 'pointer', zIndex: 10
                                    }}
                                />
                                <div className={styles.uploadLarge} style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#f8fafc', border: '2px dashed #cbd5e1', borderRadius: '12px' }}>
                                    <Camera size={24} color="#64748b" style={{ marginBottom: '8px' }} />
                                    <span style={{ fontSize: '13px', color: '#64748b' }}>Click or drop image</span>
                                </div>
                            </div>
                            {profilePreview && (
                                <div className={styles.uploadPreview} style={{ marginTop: '10px', width: '160px', height: '160px' }}>
                                    <div className={styles.placeholderBox} style={{ overflow: 'hidden', padding: 0, position: 'relative', width: '100%', height: '100%', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                        <button 
                                            type="button"
                                            onClick={handleRemoveProfilePreview}
                                            style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(75, 85, 99, 0.8)', color: '#fff', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}
                                        >
                                            <X size={14} />
                                        </button>
                                        <img src={profilePreview} alt="Profile preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className={styles.grid}>
                            <div className={styles.formGroup}>
                                <label>First Name *</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Last Name *</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Gender</label>
                                <select name="gender" value={formData.gender} onChange={handleInputChange}>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Date of Birth</label>
                                <input
                                    type="date"
                                    name="dob"
                                    value={formData.dob}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Tab 2: Contact Details */}
                    <div className={`${styles.formSection} ${activeTab === 2 ? styles.activeSection : ''}`}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>Contact Details</h2>
                        </div>
                        <div className={styles.grid}>
                            <div className={styles.formGroup}>
                                <label>Email Address *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Phone Number *</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Secondary Phone</label>
                                <input
                                    type="tel"
                                    name="altPhone"
                                    value={formData.altPhone}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                <label>Full Residential Address</label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    rows={3}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Tab 3: Professional Info */}
                    <div className={`${styles.formSection} ${activeTab === 3 ? styles.activeSection : ''}`}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>Professional Information</h2>
                        </div>
                        <div className={styles.grid}>
                            <div className={styles.formGroup}>
                                <label>Employee ID</label>
                                <input
                                    type="text"
                                    name="employeeId"
                                    value={formData.employeeId}
                                    onChange={handleInputChange}
                                    readOnly
                                    style={{ background: '#f8fafc' }}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Designation</label>
                                <input
                                    type="text"
                                    name="designation"
                                    value={formData.designation}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Date of Joining</label>
                                <input
                                    type="date"
                                    name="joiningDate"
                                    value={formData.joiningDate}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Monthly Salary (₹)</label>
                                <input
                                    type="number"
                                    name="salary"
                                    value={formData.salary}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Tab 4: Permissions */}
                    <div className={`${styles.formSection} ${activeTab === 4 ? styles.activeSection : ''}`}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>Permissions & Property Access</h2>
                        </div>
                        <div className={styles.grid}>
                            <div className={styles.formGroup}>
                                <label>System Role</label>
                                <select name="role" value={formData.role} onChange={handleInputChange}>
                                    <option value="Manager">Property Manager</option>
                                    <option value="Senior Manager">Senior Manager</option>
                                    <option value="Admin">System Admin</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Working Status</label>
                                <select name="status" value={formData.status} onChange={handleInputChange}>
                                    <option value="Active">Active</option>
                                    <option value="On Leave">On Leave</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ marginTop: '24px' }}>
                            <label style={{ fontSize: '13px', fontWeight: '700', color: '#475569', marginBottom: '10px', display: 'block' }}>
                                Assigned Properties
                            </label>
                            <div className={styles.propertyList}>
                                {['Sunset Heights', 'Green Valley PG', 'Ocean View Hostel', 'Citrus Living'].map(prop => (
                                    <div
                                        key={prop}
                                        className={`${styles.propertyChip} ${formData.assignedProperties.includes(prop) ? styles.propertyChipActive : ''}`}
                                        onClick={() => {
                                            const current = [...formData.assignedProperties];
                                            if (current.includes(prop)) {
                                                setFormData({ ...formData, assignedProperties: current.filter(p => p !== prop) });
                                            } else {
                                                setFormData({ ...formData, assignedProperties: [...current, prop] });
                                            }
                                        }}
                                    >
                                        <Building2 size={14} />
                                        {prop}
                                        {formData.assignedProperties.includes(prop) && <Check size={14} style={{ marginLeft: 'auto' }} />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Tab 5: Account Security */}
                    <div className={`${styles.formSection} ${activeTab === 5 ? styles.activeSection : ''}`}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>Account & Security</h2>
                        </div>
                        <div className={styles.grid}>
                            <div className={styles.formGroup}>
                                <label>Login Username *</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Account Password (leave blank to keep current)</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Form Footer Actions */}
                    <div className={styles.formFooterActions}>
                        <button type="button" onClick={() => router.push('/property-managers')} className={styles.btnFooterCancel}>
                            <X size={18} /> Discard Changes
                        </button>
                        {activeTab < 5 ? (
                            <button
                                type="button"
                                className={styles.btnFooterSubmit}
                                onClick={() => setActiveTab(activeTab + 1)}
                            >
                                <span>Next Section</span> <ChevronRight size={18} />
                            </button>
                        ) : (
                            <button type="submit" className={styles.btnFooterSubmit}>
                                <Save size={18} /> <span>Update Manager</span>
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
