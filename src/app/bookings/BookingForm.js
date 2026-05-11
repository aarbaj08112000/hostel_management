'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    User, MapPin, Home, ShieldCheck, Phone,
    Briefcase, PenTool, CreditCard, Info,
    ArrowLeft, Upload, Check, Save, X,
    FileText, UserCircle, ChevronRight,
    Calendar, Clock, DollarSign, Building2
} from 'lucide-react';
import styles from '../customers/form.module.css';
import CustomSelect from '../../components/CustomSelect';
import { useToast } from '../../context/ToastContext';

const initialFormData = {
    customerName: '', mobile: '', email: '',
    propertyName: '', roomNumber: '', bedNumber: '', roomType: 'Single',
    checkIn: '', checkOut: '', guests: '1', purpose: 'Short Stay',
    rentAmount: '', securityDeposit: '', paymentMode: 'UPI', paymentStatus: 'Pending',
    idProofType: 'Aadhaar', idProofNumber: '', remarks: '',
    bookingStatus: 'Pending',
    emergencyContact: { name: '', relationship: '', mobile: '', address: '' },
    officeInfo: { company: '', designation: '', address: '', contact: '' },
};

export default function BookingForm({ initialData = null, title = "New Booking Registration" }) {
    const router = useRouter();
    const showToast = useToast();
    const [formData, setFormData] = useState(initialFormData);
    const [activeTab, setActiveTab] = useState(1);

    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({ ...prev, ...initialData }));
        }
    }, [initialData]);

    const handleInputChange = (e, section = null) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;

        if (section) {
            setFormData(prev => ({
                ...prev,
                [section]: { ...prev[section], [name]: val }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: val }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitting Booking Data:', formData);
        showToast('Booking data saved successfully!', 'success');
        router.push('/bookings');
    };

    const tabs = [
        { id: 1, label: 'Resident Info', icon: <User size={16} /> },
        { id: 2, label: 'Stay Details', icon: <Home size={16} /> },
        { id: 3, label: 'Schedule', icon: <Calendar size={16} /> },
        { id: 4, label: 'Pricing & Deposit', icon: <CreditCard size={16} /> },
        { id: 5, label: 'KYC & Proofs', icon: <ShieldCheck size={16} /> },
        { id: 6, label: 'Emergency Contact', icon: <Phone size={16} /> },
        { id: 7, label: 'System Control', icon: <FileText size={16} /> }
    ];

    return (
        <div className={styles.pageContainer}>
            <div className={styles.header}>
                <div className={styles.headerInfo}>
                    <h1 className={styles.title}>{title}</h1>
                    <p className={styles.subtitle}>Complete the multi-step form to manage booking registration and stay details.</p>
                </div>
                <div className={styles.headerActions}>
                    <Link href="/bookings" className={styles.backBtn}>
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
                    {/* 1. Resident Information */}
                    <div className={`${styles.formSection} ${activeTab === 1 ? styles.activeSection : ''}`}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>Resident Information</h2>
                        </div>
                        <div className={styles.grid}>
                            <div className={styles.formGroup}>
                                <label>Resident Name *</label>
                                <input type="text" name="customerName" value={formData.customerName} onChange={handleInputChange} required placeholder="Enter full name" />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Mobile Number *</label>
                                <input type="text" name="mobile" value={formData.mobile} onChange={handleInputChange} required placeholder="+91 XXXXX XXXXX" />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Email ID</label>
                                <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="resident@example.com" />
                            </div>
                        </div>
                    </div>

                    {/* 2. Property & Room Details */}
                    <div className={`${styles.formSection} ${activeTab === 2 ? styles.activeSection : ''}`}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>Property & Room Details</h2>
                        </div>
                        <div className={styles.grid}>
                            <div className={styles.formGroup}>
                                <label>Property Name *</label>
                                <CustomSelect
                                    name="propertyName"
                                    value={formData.propertyName}
                                    onChange={handleInputChange}
                                    options={[{ value: '', label: 'Select Property' }, 'Sunset Heights', 'Citrus Living', 'Urban Luxury']}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Room Number *</label>
                                <input type="text" name="roomNumber" value={formData.roomNumber} onChange={handleInputChange} required placeholder="e.g. 101" />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Bed Number</label>
                                <input type="text" name="bedNumber" value={formData.bedNumber} onChange={handleInputChange} placeholder="e.g. B1 (Optional)" />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Room Type</label>
                                <CustomSelect
                                    name="roomType"
                                    value={formData.roomType}
                                    onChange={handleInputChange}
                                    options={[
                                        { value: 'Single', label: 'Single Occupancy' },
                                        { value: 'Double', label: 'Double Sharing' },
                                        { value: 'Triple', label: 'Triple Sharing' },
                                        { value: 'Dormitory', label: 'Dormitory' }
                                    ]}
                                />
                            </div>
                        </div>
                    </div>

                    {/* 3. Schedule Details */}
                    <div className={`${styles.formSection} ${activeTab === 3 ? styles.activeSection : ''}`}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>Stay Schedule</h2>
                        </div>
                        <div className={styles.grid}>
                            <div className={styles.formGroup}>
                                <label>Check-in Date *</label>
                                <input type="date" name="checkIn" value={formData.checkIn} onChange={handleInputChange} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Expected Check-out *</label>
                                <input type="date" name="checkOut" value={formData.checkOut} onChange={handleInputChange} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Number of Guests</label>
                                <input type="number" name="guests" value={formData.guests} onChange={handleInputChange} min="1" />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Purpose of Stay</label>
                                <CustomSelect
                                    name="purpose"
                                    value={formData.purpose}
                                    onChange={handleInputChange}
                                    options={['Short Stay', 'Long Stay', 'Business/Corporate', 'Education']}
                                />
                            </div>
                        </div>
                    </div>

                    {/* 4. Pricing & Payment */}
                    <div className={`${styles.formSection} ${activeTab === 4 ? styles.activeSection : ''}`}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>Pricing & Payment</h2>
                        </div>
                        <div className={styles.grid}>
                            <div className={styles.formGroup}>
                                <label>Monthly Rent Amount (₹) *</label>
                                <input type="number" name="rentAmount" value={formData.rentAmount} onChange={handleInputChange} required placeholder="0.00" />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Security Deposit (₹)</label>
                                <input type="number" name="securityDeposit" value={formData.securityDeposit} onChange={handleInputChange} placeholder="0.00" />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Payment Mode</label>
                                <CustomSelect
                                    name="paymentMode"
                                    value={formData.paymentMode}
                                    onChange={handleInputChange}
                                    options={['UPI/Online', 'Cash', 'Bank Transfer', 'Card']}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Initial Payment Status</label>
                                <CustomSelect
                                    name="paymentStatus"
                                    value={formData.paymentStatus}
                                    onChange={handleInputChange}
                                    options={['Paid', 'Partial', 'Pending']}
                                />
                            </div>
                        </div>
                    </div>

                    {/* 5. KYC & Proofs */}
                    <div className={`${styles.formSection} ${activeTab === 5 ? styles.activeSection : ''}`}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>KYC & Identity Proofs</h2>
                        </div>
                        <div className={styles.grid}>
                            <div className={styles.formGroup}>
                                <label>ID Proof Type *</label>
                                <CustomSelect
                                    name="idProofType"
                                    value={formData.idProofType}
                                    onChange={handleInputChange}
                                    options={['Aadhaar Card', 'PAN Card', 'Passport', 'Driving License']}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>ID Proof Number *</label>
                                <input type="text" name="idProofNumber" value={formData.idProofNumber} onChange={handleInputChange} required placeholder="Enter ID number" />
                            </div>
                        </div>
                        <div className={styles.uploadWrapper}>
                            <div className={styles.uploadBox}>
                                <div className={styles.uploadIcon}><Upload size={24} /></div>
                                <span className={styles.uploadLabel}>ID Proof Front</span>
                            </div>
                            <div className={styles.uploadBox}>
                                <div className={styles.uploadIcon}><Upload size={24} /></div>
                                <span className={styles.uploadLabel}>ID Proof Back</span>
                            </div>
                        </div>
                    </div>

                    {/* 6. Emergency Contact */}
                    <div className={`${styles.formSection} ${activeTab === 6 ? styles.activeSection : ''}`}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>Emergency Contact</h2>
                        </div>
                        <div className={styles.grid}>
                            <div className={styles.formGroup}>
                                <label>Guardian/Contact Name</label>
                                <input type="text" name="name" value={formData.emergencyContact.name} onChange={(e) => handleInputChange(e, 'emergencyContact')} placeholder="Full name" />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Relationship</label>
                                <input type="text" name="relationship" value={formData.emergencyContact.relationship} onChange={(e) => handleInputChange(e, 'emergencyContact')} placeholder="e.g. Father, Mother" />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Mobile Number</label>
                                <input type="text" name="mobile" value={formData.emergencyContact.mobile} onChange={(e) => handleInputChange(e, 'emergencyContact')} placeholder="+91 XXXXX XXXXX" />
                            </div>
                        </div>
                        <div className={styles.formGroup} style={{ marginTop: '16px' }}>
                            <label>Address</label>
                            <textarea rows={3} name="address" value={formData.emergencyContact.address} onChange={(e) => handleInputChange(e, 'emergencyContact')} placeholder="Complete residential address" />
                        </div>
                    </div>

                    {/* 7. System Control */}
                    <div className={`${styles.formSection} ${activeTab === 7 ? styles.activeSection : ''}`}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>System Control & Remarks</h2>
                        </div>
                        <div className={styles.grid}>
                            <div className={styles.formGroup}>
                                <label>Booking Status</label>
                                <CustomSelect
                                    name="bookingStatus"
                                    value={formData.bookingStatus}
                                    onChange={handleInputChange}
                                    options={['Confirmed', 'Pending', 'Cancelled', 'Completed']}
                                />
                            </div>
                        </div>
                        <div className={styles.formGroup} style={{ marginTop: '16px' }}>
                            <label>Internal Remarks / Notes</label>
                            <textarea rows={4} name="remarks" value={formData.remarks} onChange={handleInputChange} placeholder="Any special requests or staff notes..." />
                        </div>
                    </div>

                    {/* Form Footer Actions */}
                    <div className={styles.formFooterActions}>
                        <button type="button" onClick={() => router.push('/bookings')} className={styles.btnFooterCancel}>
                            <X size={18} /> Discard
                        </button>
                        {activeTab < 7 ? (
                            <button type="button" className={styles.btnFooterSubmit} onClick={() => setActiveTab(activeTab + 1)}>
                                <span>Next Section</span> <ChevronRight size={18} />
                            </button>
                        ) : (
                            <button type="submit" className={styles.btnFooterSubmit}>
                                <Save size={18} /> <span>Save Booking</span>
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
