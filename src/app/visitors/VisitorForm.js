'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft, User, Phone, Tag,
    Home, ShieldCheck, Save, X,
    Calendar, Clock, UserCircle, Users, FileText, ChevronRight
} from 'lucide-react';
import formStyles from '../customers/form.module.css';
import { visitorPurposes } from './data';
import CustomSelect from '../../components/CustomSelect';
import { useToast } from '../../context/ToastContext';

const tabs = [
    { id: 1, label: 'Visitor Profile', icon: <UserCircle size={16} /> },
    { id: 2, label: 'Visit Details', icon: <Clock size={16} /> },
    { id: 3, label: 'Security & KYC', icon: <ShieldCheck size={16} /> },
];

export default function VisitorForm({ initialData = null, isEdit = false }) {
    const router = useRouter();
    const showToast = useToast();
    const [activeTab, setActiveTab] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        purpose: 'Meeting Resident',
        residentName: '',
        propertyName: 'Sunset Heights',
        idProofType: 'Aadhaar',
        idProofNumber: '',
        remarks: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({ ...prev, ...initialData }));
        }
    }, [initialData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(isEdit ? 'Updating visitor:' : 'Logging visitor:', formData);
        showToast(isEdit ? 'Visitor details updated successfully!' : 'Visitor checked in successfully!', 'success');
        router.push('/visitors');
    };

    const title = isEdit ? 'Edit Visitor Details' : 'Visitor Check-in';
    const subtitle = isEdit
        ? 'Update visitor information and registration details.'
        : 'Register guest entry and assign visiting purpose for security tracking.';

    return (
        <div className={formStyles.pageContainer}>
            <div className={formStyles.header}>
                <div className={formStyles.headerInfo}>
                    <h1 className={formStyles.title}>{title}</h1>
                    <p className={formStyles.subtitle}>{subtitle}</p>
                </div>
                <div className={formStyles.headerActions}>
                    <Link href="/visitors" className={formStyles.backBtn}>
                        <ArrowLeft size={18} /> <span>Back to List</span>
                    </Link>
                </div>
            </div>

            <div className={formStyles.formCard}>
                <div className={formStyles.tabsContainer}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`${formStyles.tab} ${activeTab === tab.id ? formStyles.activeTab : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className={formStyles.formBody}>
                    <form onSubmit={handleSubmit}>
                        {/* Tab 1: Visitor Profile */}
                        <div className={`${formStyles.formSection} ${activeTab === 1 ? formStyles.activeSection : ''}`}>
                            <div className={formStyles.sectionHeader}>
                                <h2 className={formStyles.sectionTitle}>Visitor Profile</h2>
                                <p className={formStyles.sectionDesc}>Basic identity and contact information.</p>
                            </div>
                            <div className={formStyles.grid}>
                                <div className={formStyles.formGroup}>
                                    <label>Visitor Full Name *</label>
                                    <div className={formStyles.inputWrapper}>
                                        <User className={formStyles.inputIcon} size={18} />
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="e.g. Rahul Sharma"
                                        />
                                    </div>
                                </div>
                                <div className={formStyles.formGroup}>
                                    <label>Mobile Number *</label>
                                    <div className={formStyles.inputWrapper}>
                                        <Phone className={formStyles.inputIcon} size={18} />
                                        <input
                                            type="tel"
                                            name="mobile"
                                            value={formData.mobile}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="98765 43210"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={formStyles.uploadWrapper} style={{ marginTop: '30px' }}>
                                <div className={formStyles.uploadBox}>
                                    <div className={formStyles.uploadIcon}><User size={24} /></div>
                                    <span className={formStyles.uploadLabel}>Capture Live Photo (Optional)</span>
                                </div>
                            </div>
                        </div>

                        {/* Tab 2: Visit Details */}
                        <div className={`${formStyles.formSection} ${activeTab === 2 ? formStyles.activeSection : ''}`}>
                            <div className={formStyles.sectionHeader}>
                                <h2 className={formStyles.sectionTitle}>Visit Details</h2>
                                <p className={formStyles.sectionDesc}>Purpose, destination and timing of the visit.</p>
                            </div>
                            <div className={formStyles.grid}>
                                <div className={formStyles.formGroup}>
                                    <label>Visiting Purpose</label>
                                    <div className={formStyles.inputWrapper}>
                                        <Tag className={formStyles.inputIcon} size={18} />
                                        <CustomSelect name="purpose" value={formData.purpose} onChange={handleInputChange} options={visitorPurposes} />
                                    </div>
                                </div>
                                <div className={formStyles.formGroup}>
                                    <label>Property Being Visited</label>
                                    <div className={formStyles.inputWrapper}>
                                        <Home className={formStyles.inputIcon} size={18} />
                                        <CustomSelect name="propertyName" value={formData.propertyName} onChange={handleInputChange} options={['Sunset Heights', 'Urban Living', 'Elite Boys Hostel']} />
                                    </div>
                                </div>
                            </div>
                            <div className={formStyles.grid} style={{ marginTop: '20px' }}>
                                <div className={formStyles.formGroup}>
                                    <label>Assign to Resident (Optional)</label>
                                    <div className={formStyles.inputWrapper}>
                                        <Users className={formStyles.inputIcon} size={18} />
                                        <input
                                            type="text"
                                            name="residentName"
                                            value={formData.residentName}
                                            onChange={handleInputChange}
                                            placeholder="Enter resident name or ID"
                                        />
                                    </div>
                                </div>
                                <div className={formStyles.formGroup}>
                                    <label>Check-in Time</label>
                                    <div className={formStyles.inputWrapper}>
                                        <Clock className={formStyles.inputIcon} size={18} />
                                        <input
                                            type="text"
                                            value={formData.inTime ? new Date(formData.inTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            disabled
                                            style={{ background: '#f8fafc' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tab 3: Security & KYC */}
                        <div className={`${formStyles.formSection} ${activeTab === 3 ? formStyles.activeSection : ''}`}>
                            <div className={formStyles.sectionHeader}>
                                <h2 className={formStyles.sectionTitle}>Security & Identification</h2>
                                <p className={formStyles.sectionDesc}>Verify identity for safety and auditing.</p>
                            </div>
                            <div className={formStyles.grid}>
                                <div className={formStyles.formGroup}>
                                    <label>ID Proof Type</label>
                                    <div className={formStyles.inputWrapper}>
                                        <ShieldCheck className={formStyles.inputIcon} size={18} />
                                        <CustomSelect
                                            name="idProofType"
                                            value={formData.idProofType}
                                            onChange={handleInputChange}
                                            options={[
                                                { value: 'Aadhaar', label: 'Aadhaar Card' },
                                                { value: 'PAN', label: 'PAN Card' },
                                                { value: 'Driving License', label: 'Driving License' },
                                                { value: 'Voter ID', label: 'Voter ID' }
                                            ]}
                                        />
                                    </div>
                                </div>
                                <div className={formStyles.formGroup}>
                                    <label>ID Number</label>
                                    <div className={formStyles.inputWrapper}>
                                        <FileText className={formStyles.inputIcon} size={18} />
                                        <input
                                            type="text"
                                            name="idProofNumber"
                                            value={formData.idProofNumber}
                                            onChange={handleInputChange}
                                            placeholder="Enter ID number"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={formStyles.formGroup} style={{ marginTop: '20px' }}>
                                <label>Additional Remarks</label>
                                <textarea
                                    name="remarks"
                                    value={formData.remarks}
                                    onChange={handleInputChange}
                                    rows={4}
                                    placeholder="Any internal notes about the visit..."
                                />
                            </div>
                        </div>

                        <div className={formStyles.formFooterActions}>
                            <button type="button" onClick={() => router.push('/visitors')} className={formStyles.btnFooterCancel}>
                                <X size={18} /> Discard Changes
                            </button>
                            {activeTab < tabs.length ? (
                                <button type="button" className={formStyles.btnFooterSubmit} onClick={() => setActiveTab(activeTab + 1)}>
                                    <span>Continue</span> <ChevronRight size={18} />
                                </button>
                            ) : (
                                <button type="submit" className={formStyles.btnFooterSubmit}>
                                    <Save size={18} /> <span>{isEdit ? 'Update Details' : 'Complete Check-in'}</span>
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
