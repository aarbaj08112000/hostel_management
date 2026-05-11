'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    User, MapPin, Home, ShieldCheck, Phone,
    Briefcase, PenTool, CreditCard, Info,
    ArrowLeft, Upload, Check, Save, X,
    FileText, UserCircle, ChevronRight
} from 'lucide-react';
import styles from './form.module.css';
import CustomSelect from '../../components/CustomSelect';
import { useToast } from '../../context/ToastContext';

const initialFormData = {
    name: '', mobile: '', altMobile: '', email: '', gender: 'Male', dob: '', maritalStatus: 'Single',
    currentAddress: { line: '', city: '', state: '', pincode: '' },
    permanentAddress: { line: '', city: '', state: '', pincode: '' },
    sameAsCurrent: false,
    propertyName: '', roomNumber: '', bedNumber: '', joiningDate: '', expectedCheckOut: '', customerType: 'Long Stay',
    idProofType: 'Aadhaar', idProofNumber: '',
    emergencyContact: { name: '', relationship: '', mobile: '', address: '' },
    officeInfo: { company: '', designation: '', address: '', contact: '' },
    rentAmount: '', securityDeposit: '', paymentMode: 'UPI', paymentStatus: 'Pending',
    policeVerification: 'Pending', remarks: '',
    status: 'Active'
};

export default function CustomerForm({ initialData = null, title = "Register New Customer" }) {
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

            // Handle "Same as Current Address" logic
            if (name === 'sameAsCurrent' && val) {
                setFormData(prev => ({
                    ...prev,
                    permanentAddress: { ...prev.currentAddress }
                }));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: val }));

            // Sync permanent address if checkbox is checked and current address changes
            if (formData.sameAsCurrent && (name.includes('currentAddress'))) {
                // This part is handled by the section check above usually, 
                // but let's be explicit for the nested objects if needed.
            }
        }
    };

    // Special handler for nested address fields to support "Same as Current"
    const handleAddressChange = (e, type) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newState = {
                ...prev,
                [type]: { ...prev[type], [name]: value }
            };
            if (type === 'currentAddress' && prev.sameAsCurrent) {
                newState.permanentAddress = { ...newState.currentAddress };
            }
            return newState;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitting Customer Data:', formData);
        showToast('Customer data saved successfully!', 'success');
    };

    const tabs = [
        { id: 1, label: 'Basic Details', icon: <User size={16} /> },
        { id: 2, label: 'Address Details', icon: <MapPin size={16} /> },
        { id: 3, label: 'Stay Details', icon: <Home size={16} /> },
        { id: 4, label: 'KYC Documents', icon: <ShieldCheck size={16} /> },
        { id: 5, label: 'Emergency Contact', icon: <Phone size={16} /> },
        { id: 6, label: 'Work & Signature', icon: <PenTool size={16} /> },
        { id: 7, label: 'Payment & Addon', icon: <CreditCard size={16} /> }
    ];

    return (
        <div className={styles.pageContainer}>
            <div className={styles.header}>
                <div className={styles.headerInfo}>
                    <h1 className={styles.title}>{title}</h1>
                    <p className={styles.subtitle}>Please fill in all the required information to register a new resident.</p>
                </div>
                <div className={styles.headerActions}>
                    <Link href="/customers" className={styles.backBtn}>
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
                    {/* 1. Basic Information */}
                    <div className={`${styles.formSection} ${activeTab === 1 ? styles.activeSection : ''}`}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>Basic Information</h2>
                        </div>
                        <div className={styles.grid}>
                            <div className={styles.formGroup}>
                                <label>Full Name *</label>
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Mobile Number *</label>
                                <input type="text" name="mobile" value={formData.mobile} onChange={handleInputChange} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Alternate Mobile</label>
                                <input type="text" name="altMobile" value={formData.altMobile} onChange={handleInputChange} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Email ID</label>
                                <input type="email" name="email" value={formData.email} onChange={handleInputChange} />
                            </div>
                        </div>
                        <div className={styles.grid3} style={{ marginTop: '20px' }}>
                            <div className={styles.formGroup}>
                                <label>Gender</label>
                                <CustomSelect name="gender" value={formData.gender} onChange={handleInputChange} options={['Male', 'Female', 'Other']} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Date of Birth</label>
                                <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Marital Status</label>
                                <CustomSelect name="maritalStatus" value={formData.maritalStatus} onChange={handleInputChange} options={['Single', 'Married', 'Other']} />
                            </div>
                        </div>
                        <div className={styles.uploadWrapper}>
                            <div className={styles.uploadBox}>
                                <div className={styles.uploadIcon}><User size={24} /></div>
                                <span className={styles.uploadLabel}>Profile Photo</span>
                            </div>
                        </div>
                    </div>

                    {/* 2. Address Information */}
                    <div className={`${styles.formSection} ${activeTab === 2 ? styles.activeSection : ''}`}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>Current Address</h2>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Address Line *</label>
                            <input type="text" name="line" value={formData.currentAddress.line} onChange={(e) => handleAddressChange(e, 'currentAddress')} required />
                        </div>
                        <div className={styles.grid3} style={{ marginTop: '16px' }}>
                            <div className={styles.formGroup}><label>City</label><input type="text" name="city" value={formData.currentAddress.city} onChange={(e) => handleAddressChange(e, 'currentAddress')} /></div>
                            <div className={styles.formGroup}><label>State</label><input type="text" name="state" value={formData.currentAddress.state} onChange={(e) => handleAddressChange(e, 'currentAddress')} /></div>
                            <div className={styles.formGroup}><label>Pincode</label><input type="text" name="pincode" value={formData.currentAddress.pincode} onChange={(e) => handleAddressChange(e, 'currentAddress')} /></div>
                        </div>

                        <div className={styles.sectionHeader} style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 className={styles.sectionTitle}>Permanent Address</h2>
                            <div className={styles.checkboxGroup} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input
                                    type="checkbox"
                                    name="sameAsCurrent"
                                    className={styles.checkbox}
                                    checked={formData.sameAsCurrent}
                                    onChange={(e) => {
                                        const checked = e.target.checked;
                                        setFormData(prev => ({
                                            ...prev,
                                            sameAsCurrent: checked,
                                            permanentAddress: checked ? { ...prev.currentAddress } : prev.permanentAddress
                                        }));
                                    }}
                                />
                                <label style={{ fontSize: '13px', fontWeight: '700', color: '#64748b' }}>Same as Current Address</label>
                            </div>
                        </div>
                        {!formData.sameAsCurrent && (
                            <>
                                <div className={styles.formGroup}>
                                    <label>Address Line</label>
                                    <input type="text" name="line" value={formData.permanentAddress.line} onChange={(e) => handleAddressChange(e, 'permanentAddress')} />
                                </div>
                                <div className={styles.grid3} style={{ marginTop: '16px' }}>
                                    <div className={styles.formGroup}><label>City</label><input type="text" name="city" value={formData.permanentAddress.city} onChange={(e) => handleAddressChange(e, 'permanentAddress')} /></div>
                                    <div className={styles.formGroup}><label>State</label><input type="text" name="state" value={formData.permanentAddress.state} onChange={(e) => handleAddressChange(e, 'permanentAddress')} /></div>
                                    <div className={styles.formGroup}><label>Pincode</label><input type="text" name="pincode" value={formData.permanentAddress.pincode} onChange={(e) => handleAddressChange(e, 'permanentAddress')} /></div>
                                </div>
                            </>
                        )}
                        {formData.sameAsCurrent && <p style={{ color: '#10b981', fontSize: '14px', fontWeight: '600' }}>Permanent address is synced with current address.</p>}
                    </div>

                    {/* 3. Stay Details */}
                    <div className={`${styles.formSection} ${activeTab === 3 ? styles.activeSection : ''}`}>
                        <div className={styles.sectionHeader}><h2 className={styles.sectionTitle}>Stay / Booking Information</h2></div>
                        <div className={styles.grid}>
                            <div className={styles.formGroup}><label>Property Name</label><input type="text" name="propertyName" value={formData.propertyName} onChange={handleInputChange} /></div>
                            <div className={styles.formGroup}><label>Room Number</label><input type="text" name="roomNumber" value={formData.roomNumber} onChange={handleInputChange} /></div>
                            <div className={styles.formGroup}><label>Bed Number</label><input type="text" name="bedNumber" value={formData.bedNumber} onChange={handleInputChange} /></div>
                            <div className={styles.formGroup}><label>Customer Type</label><CustomSelect name="customerType" value={formData.customerType} onChange={handleInputChange} options={['Short Stay', 'Long Stay', 'Corporate']} /></div>
                        </div>
                        <div className={styles.grid} style={{ marginTop: '20px' }}>
                            <div className={styles.formGroup}><label>Joining Date</label><input type="date" name="joiningDate" value={formData.joiningDate} onChange={handleInputChange} /></div>
                            <div className={styles.formGroup}><label>Expected Check-out</label><input type="date" name="expectedCheckOut" value={formData.expectedCheckOut} onChange={handleInputChange} /></div>
                        </div>
                    </div>

                    {/* 4. KYC Documents */}
                    <div className={`${styles.formSection} ${activeTab === 4 ? styles.activeSection : ''}`}>
                        <div className={styles.sectionHeader}><h2 className={styles.sectionTitle}>KYC Details</h2></div>
                        <div className={styles.grid}>
                            <div className={styles.formGroup}><label>ID Proof Type</label><CustomSelect name="idProofType" value={formData.idProofType} onChange={handleInputChange} options={['Aadhaar Card', 'PAN Card', 'Passport', 'Driving License']} /></div>
                            <div className={styles.formGroup}><label>ID Proof Number</label><input type="text" name="idProofNumber" value={formData.idProofNumber} onChange={handleInputChange} /></div>
                        </div>
                        <div className={styles.uploadWrapper}>
                            <div className={styles.uploadBox}><div className={styles.uploadIcon}><Upload size={24} /></div><span className={styles.uploadLabel}>Aadhaar Front</span></div>
                            <div className={styles.uploadBox}><div className={styles.uploadIcon}><Upload size={24} /></div><span className={styles.uploadLabel}>Aadhaar Back</span></div>
                            <div className={styles.uploadBox}><div className={styles.uploadIcon}><Upload size={24} /></div><span className={styles.uploadLabel}>PAN Card Image</span></div>
                        </div>
                    </div>

                    {/* 5. Emergency Contact */}
                    <div className={`${styles.formSection} ${activeTab === 5 ? styles.activeSection : ''}`}>
                        <div className={styles.sectionHeader}><h2 className={styles.sectionTitle}>Emergency Contact</h2></div>
                        <div className={styles.grid}>
                            <div className={styles.formGroup}><label>Contact Person Name</label><input type="text" name="name" value={formData.emergencyContact.name} onChange={(e) => handleInputChange(e, 'emergencyContact')} /></div>
                            <div className={styles.formGroup}><label>Relationship</label><input type="text" name="relationship" value={formData.emergencyContact.relationship} onChange={(e) => handleInputChange(e, 'emergencyContact')} /></div>
                            <div className={styles.formGroup}><label>Mobile Number</label><input type="text" name="mobile" value={formData.emergencyContact.mobile} onChange={(e) => handleInputChange(e, 'emergencyContact')} /></div>
                        </div>
                        <div className={styles.formGroup} style={{ marginTop: '16px' }}><label>Address</label><textarea rows={3} name="address" value={formData.emergencyContact.address} onChange={(e) => handleInputChange(e, 'emergencyContact')} /></div>
                    </div>

                    {/* 6. Office / Work & Signature */}
                    <div className={`${styles.formSection} ${activeTab === 6 ? styles.activeSection : ''}`}>
                        <div className={styles.sectionHeader}><h2 className={styles.sectionTitle}>Office / Work Information (Optional)</h2></div>
                        <div className={styles.grid}>
                            <div className={styles.formGroup}><label>Company Name</label><input type="text" name="company" value={formData.officeInfo.company} onChange={(e) => handleInputChange(e, 'officeInfo')} /></div>
                            <div className={styles.formGroup}><label>Designation</label><input type="text" name="designation" value={formData.officeInfo.designation} onChange={(e) => handleInputChange(e, 'officeInfo')} /></div>
                        </div>
                        <div className={styles.formGroup} style={{ marginTop: '16px' }}><label>Office Address</label><textarea rows={2} name="address" value={formData.officeInfo.address} onChange={(e) => handleInputChange(e, 'officeInfo')} /></div>

                        <div className={styles.sectionHeader} style={{ marginTop: '40px' }}><h2 className={styles.sectionTitle}>Customer Signature</h2></div>
                        <div className={styles.signaturePad}>
                            <span className={styles.signaturePlaceholder}>Digital Signature Pad (Click and Draw)</span>
                        </div>
                        <div style={{ marginTop: '12px', display: 'flex', gap: '12px' }}>
                            <button type="button" className={styles.tab} style={{ border: '1px solid #e2e8f0' }}><Upload size={14} /> Upload Image</button>
                            <button type="button" className={styles.tab} style={{ border: '1px solid #e2e8f0', color: '#ef4444' }}><X size={14} /> Clear</button>
                        </div>
                    </div>

                    {/* 7. Payment & System Fields */}
                    <div className={`${styles.formSection} ${activeTab === 7 ? styles.activeSection : ''}`}>
                        <div className={styles.sectionHeader}><h2 className={styles.sectionTitle}>Payment Details</h2></div>
                        <div className={styles.grid3}>
                            <div className={styles.formGroup}><label>Rent Amount</label><input type="number" name="rentAmount" value={formData.rentAmount} onChange={handleInputChange} /></div>
                            <div className={styles.formGroup}><label>Security Deposit</label><input type="number" name="securityDeposit" value={formData.securityDeposit} onChange={handleInputChange} /></div>
                            <div className={styles.formGroup}><label>Payment Mode</label><CustomSelect name="paymentMode" value={formData.paymentMode} onChange={handleInputChange} options={['Cash', 'UPI', 'Bank Transfer']} /></div>
                        </div>

                        <div className={styles.sectionHeader} style={{ marginTop: '40px' }}><h2 className={styles.sectionTitle}>Additional & System</h2></div>
                        <div className={styles.grid}>
                            <div className={styles.formGroup}><label>Police Verification Status</label><CustomSelect name="policeVerification" value={formData.policeVerification} onChange={handleInputChange} options={['Verified', 'Pending', 'Partial']} /></div>
                            <div className={styles.formGroup}><label>Account Status</label><CustomSelect name="status" value={formData.status} onChange={handleInputChange} options={['Active', 'Inactive']} /></div>
                        </div>
                        <div className={styles.formGroup} style={{ marginTop: '16px' }}><label>Remarks / Notes</label><textarea rows={3} name="remarks" value={formData.remarks} onChange={handleInputChange}></textarea></div>
                    </div>

                    <div className={styles.formFooterActions}>
                        <button type="button" onClick={() => router.push('/customers')} className={styles.btnFooterCancel}>
                            <X size={18} /> Cancel
                        </button>
                        {activeTab < 7 ? (
                            <button type="button" className={styles.btnFooterSubmit} onClick={() => setActiveTab(activeTab + 1)}>
                                <span>Next Section</span> <ChevronRight size={18} />
                            </button>
                        ) : (
                            <button type="submit" className={styles.btnFooterSubmit}>
                                <Save size={18} /> <span>Save Customer</span>
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
