'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
    Check,
    Clock,
    DollarSign
} from 'lucide-react';
import styles from '../../new/page.module.css';
import { useToast } from '../../../../context/ToastContext';

const tabs = [
    { id: 1, label: 'Personal Info', icon: <User size={16} /> },
    { id: 2, label: 'Contact Details', icon: <Mail size={16} /> },
    { id: 3, label: 'Professional Info', icon: <Briefcase size={16} /> },
    { id: 4, label: 'Assignments', icon: <Building2 size={16} /> },
];

export default function EditHousekeeperPage({ params: paramsPromise }) {
    const params = use(paramsPromise);
    const router = useRouter();
    const showToast = useToast();
    const { id } = params;

    const [activeTab, setActiveTab] = useState(1);

    // Mock existing data based on ID
    const [formData, setFormData] = useState({
        firstName: id === '1' ? 'Priya' : 'Anita',
        lastName: id === '1' ? 'Sharma' : 'Desai',
        gender: 'Female',
        dob: '1992-05-15',
        email: id === '1' ? 'priya.s@hostel.com' : 'anita.d@hostel.com',
        phone: id === '1' ? '+91 98765 43210' : '+91 87654 32109',
        altPhone: '+91 99887 76655',
        address: 'Flat 402, Sai Garden, Baner-Pashan Link Road',
        city: 'Pune',
        state: 'Maharashtra',
        employeeId: id === '1' ? 'HK-2024-001' : 'HK-2024-002',
        designation: 'Senior Housekeeper',
        joiningDate: '2024-01-10',
        salary: '18500',
        workShift: 'Day Shift',
        status: 'Active',
        assignedProperties: ['Sunset Heights', 'Citrus Living'],
        experience: '4',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Updating Housekeeper:', formData);
        showToast('Housekeeper details updated successfully!', 'success');
        router.push('/housekeepers');
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.header}>
                <div className={styles.headerInfo}>
                    <h1 className={styles.title}>Edit Housekeeper</h1>
                    <p className={styles.subtitle}>Update profile, employment details and assignments for {formData.firstName} {formData.lastName}.</p>
                </div>
                <div className={styles.headerActions}>
                    <Link href="/housekeepers" className={styles.backBtn}>
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
                        <div className={styles.grid}>
                            <div className={styles.formGroup}>
                                <label>First Name *</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    placeholder="Enter first name"
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
                                    placeholder="Enter last name"
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
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="housekeeper@example.com"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Phone Number *</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="+91 XXXXX XXXXX"
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Pune"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>State</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Maharashtra"
                                />
                            </div>
                            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                <label>Full Residential Address</label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    placeholder="Enter complete permanent address..."
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
                                    placeholder="HK-2024-001"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Work Shift</label>
                                <select name="workShift" value={formData.workShift} onChange={handleInputChange}>
                                    <option value="Day Shift">Day Shift (8 AM - 4 PM)</option>
                                    <option value="Evening Shift">Evening Shift (4 PM - 12 AM)</option>
                                    <option value="Night Shift">Night Shift (12 AM - 8 AM)</option>
                                </select>
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
                                    placeholder="0"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Experience (Years)</label>
                                <input
                                    type="number"
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleInputChange}
                                    placeholder="e.g. 2"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Status</label>
                                <select name="status" value={formData.status} onChange={handleInputChange}>
                                    <option value="Active">Active</option>
                                    <option value="On Leave">On Leave</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Tab 4: Assignments */}
                    <div className={`${styles.formSection} ${activeTab === 4 ? styles.activeSection : ''}`}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>Property Assignments</h2>
                        </div>

                        <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>
                            Select the properties where this housekeeper will be responsible for maintenance.
                        </p>

                        <div className={styles.propertyList}>
                            {['Sunset Heights', 'Green Valley PG', 'Ocean View Hostel', 'Citrus Living', 'Urban Luxury'].map(prop => (
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

                        <div style={{ marginTop: '24px', padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <Clock size={20} color="#1e88e5" />
                                <span style={{ fontWeight: '700', color: '#1e293b' }}>Assignment Note</span>
                            </div>
                            <p style={{ fontSize: '13px', color: '#64748b', marginTop: '8px' }}>
                                Assigned properties will determine which cleaning schedules and tasks are available for this staff member in their dashboard.
                            </p>
                        </div>
                    </div>

                    {/* Form Footer Actions */}
                    <div className={styles.formFooterActions}>
                        <button type="button" onClick={() => router.push('/housekeepers')} className={styles.btnFooterCancel}>
                            <X size={18} /> Discard Changes
                        </button>
                        {activeTab < 4 ? (
                            <button
                                type="button"
                                className={styles.btnFooterSubmit}
                                onClick={() => setActiveTab(activeTab + 1)}
                            >
                                <span>Next Section</span> <ChevronRight size={18} />
                            </button>
                        ) : (
                            <button type="submit" className={styles.btnFooterSubmit}>
                                <Save size={18} /> <span>Update Housekeeper</span>
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
