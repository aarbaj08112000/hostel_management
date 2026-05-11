'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft, User, Home, CreditCard,
    Calendar, Tag, IndianRupee, FileText,
    Save, X, ChevronRight, CheckCircle,
    Smartphone, Landmark, Wallet
} from 'lucide-react';
import formStyles from '../customers/form.module.css';
import { paymentMethods, paymentTypes } from './data';
import CustomSelect from '../../components/CustomSelect';
import { useToast } from '../../context/ToastContext';

const tabs = [
    { id: 1, label: 'Payer Information', icon: <User size={16} /> },
    { id: 2, label: 'Payment Details', icon: <IndianRupee size={16} /> },
    { id: 3, label: 'Confirmation', icon: <CheckCircle size={16} /> },
];

export default function PaymentForm({ initialData = null, isEdit = false }) {
    const router = useRouter();
    const showToast = useToast();
    const [activeTab, setActiveTab] = useState(1);
    const [formData, setFormData] = useState({
        customerName: '',
        customerId: '',
        propertyName: 'Sunset Heights',
        roomNo: '',
        amount: '',
        type: 'Monthly Rent',
        method: 'UPI',
        transactionId: '',
        date: new Date().toISOString().split('T')[0],
        remarks: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({
                ...prev,
                ...initialData,
                date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : prev.date
            }));
        }
    }, [initialData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(isEdit ? 'Updating payment:' : 'Recording payment:', formData);
        showToast(isEdit ? 'Payment record updated successfully!' : 'Payment collected successfully!', 'success');
        router.push('/payments');
    };

    const title = isEdit ? 'Edit Payment Record' : 'Collect New Payment';
    const subtitle = isEdit
        ? 'Update transaction details and payment status for the selected record.'
        : 'Register a new transaction, assign to a resident and generate a digital receipt.';

    return (
        <div className={formStyles.pageContainer}>
            <div className={formStyles.header}>
                <div className={formStyles.headerInfo}>
                    <h1 className={formStyles.title}>{title}</h1>
                    <p className={formStyles.subtitle}>{subtitle}</p>
                </div>
                <div className={formStyles.headerActions}>
                    <Link href="/payments" className={formStyles.backBtn}>
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
                        {/* Tab 1: Payer Information */}
                        <div className={`${formStyles.formSection} ${activeTab === 1 ? formStyles.activeSection : ''}`}>
                            <div className={formStyles.sectionHeader}>
                                <h2 className={formStyles.sectionTitle}>Payer & Property Information</h2>
                                <p className={formStyles.sectionDesc}>Select the resident and the property they are paying for.</p>
                            </div>
                            <div className={formStyles.grid}>
                                <div className={formStyles.formGroup}>
                                    <label>Customer/Resident Name *</label>
                                    <div className={formStyles.inputWrapper}>
                                        <User className={formStyles.inputIcon} size={18} />
                                        <input
                                            type="text"
                                            name="customerName"
                                            value={formData.customerName}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="e.g. Rahul Sharma"
                                        />
                                    </div>
                                </div>
                                <div className={formStyles.formGroup}>
                                    <label>Property Name</label>
                                    <div className={formStyles.inputWrapper}>
                                        <Home className={formStyles.inputIcon} size={18} />
                                        <CustomSelect
                                            name="propertyName"
                                            value={formData.propertyName}
                                            onChange={handleInputChange}
                                            options={['Sunset Heights', 'Urban Living', 'Elite Boys Hostel']}
                                        />
                                    </div>
                                </div>
                                <div className={formStyles.formGroup}>
                                    <label>Room Number</label>
                                    <div className={formStyles.inputWrapper}>
                                        <Home className={formStyles.inputIcon} size={18} />
                                        <input
                                            type="text"
                                            name="roomNo"
                                            value={formData.roomNo}
                                            onChange={handleInputChange}
                                            placeholder="e.g. 101"
                                        />
                                    </div>
                                </div>
                                <div className={formStyles.formGroup}>
                                    <label>Customer ID (Optional)</label>
                                    <div className={formStyles.inputWrapper}>
                                        <Tag className={formStyles.inputIcon} size={18} />
                                        <input
                                            type="text"
                                            name="customerId"
                                            value={formData.customerId}
                                            onChange={handleInputChange}
                                            placeholder="e.g. CUST-101"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tab 2: Payment Details */}
                        <div className={`${formStyles.formSection} ${activeTab === 2 ? formStyles.activeSection : ''}`}>
                            <div className={formStyles.sectionHeader}>
                                <h2 className={formStyles.sectionTitle}>Transaction Details</h2>
                                <p className={formStyles.sectionDesc}>Specify the amount, category and method of payment.</p>
                            </div>
                            <div className={formStyles.grid}>
                                <div className={formStyles.formGroup}>
                                    <label>Amount (INR) *</label>
                                    <div className={formStyles.inputWrapper}>
                                        <IndianRupee className={formStyles.inputIcon} size={18} />
                                        <input
                                            type="number"
                                            name="amount"
                                            value={formData.amount}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                                <div className={formStyles.formGroup}>
                                    <label>Payment Category</label>
                                    <div className={formStyles.inputWrapper}>
                                        <Tag className={formStyles.inputIcon} size={18} />
                                        <CustomSelect
                                            name="type"
                                            value={formData.type}
                                            onChange={handleInputChange}
                                            options={paymentTypes}
                                        />
                                    </div>
                                </div>
                                <div className={formStyles.formGroup}>
                                    <label>Payment Method</label>
                                    <div className={formStyles.inputWrapper}>
                                        <CreditCard className={formStyles.inputIcon} size={18} />
                                        <CustomSelect
                                            name="method"
                                            value={formData.method}
                                            onChange={handleInputChange}
                                            options={paymentMethods}
                                        />
                                    </div>
                                </div>
                                <div className={formStyles.formGroup}>
                                    <label>Payment Date</label>
                                    <div className={formStyles.inputWrapper}>
                                        <Calendar className={formStyles.inputIcon} size={18} />
                                        <input
                                            type="date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={formStyles.formGroup} style={{ marginTop: '20px' }}>
                                <label>Transaction ID / Reference (Optional)</label>
                                <div className={formStyles.inputWrapper}>
                                    <FileText className={formStyles.inputIcon} size={18} />
                                    <input
                                        type="text"
                                        name="transactionId"
                                        value={formData.transactionId}
                                        onChange={handleInputChange}
                                        placeholder="Enter bank reference or UPI UTR number"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Tab 3: Confirmation */}
                        <div className={`${formStyles.formSection} ${activeTab === 3 ? formStyles.activeSection : ''}`}>
                            <div className={formStyles.sectionHeader}>
                                <h2 className={formStyles.sectionTitle}>Final Review & Notes</h2>
                                <p className={formStyles.sectionDesc}>Review details and add any internal remarks.</p>
                            </div>
                            <div className={formStyles.grid}>
                                <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px', gridColumn: '1 / -1' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
                                        <span style={{ color: '#64748b', fontWeight: 600 }}>Total Amount:</span>
                                        <span style={{ fontSize: '20px', fontWeight: 900, color: '#1e88e5' }}>₹ {formData.amount || '0'}</span>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '14px' }}>
                                        <div><span style={{ color: '#94a3b8' }}>Customer:</span> <span style={{ fontWeight: 700 }}>{formData.customerName || '--'}</span></div>
                                        <div><span style={{ color: '#94a3b8' }}>Room:</span> <span style={{ fontWeight: 700 }}>{formData.roomNo || '--'} ({formData.propertyName})</span></div>
                                        <div><span style={{ color: '#94a3b8' }}>Category:</span> <span style={{ fontWeight: 700 }}>{formData.type}</span></div>
                                        <div><span style={{ color: '#94a3b8' }}>Method:</span> <span style={{ fontWeight: 700 }}>{formData.method}</span></div>
                                    </div>
                                </div>
                                <div className={formStyles.formGroup} style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
                                    <label>Internal Remarks</label>
                                    <textarea
                                        name="remarks"
                                        value={formData.remarks}
                                        onChange={handleInputChange}
                                        rows={4}
                                        placeholder="Any specific notes about this payment..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={formStyles.formFooterActions}>
                            <button type="button" onClick={() => router.push('/payments')} className={formStyles.btnFooterCancel}>
                                <X size={18} /> Discard Changes
                            </button>
                            {activeTab < tabs.length ? (
                                <button type="button" className={formStyles.btnFooterSubmit} onClick={() => setActiveTab(activeTab + 1)}>
                                    <span>Continue</span> <ChevronRight size={18} />
                                </button>
                            ) : (
                                <button type="submit" className={formStyles.btnFooterSubmit}>
                                    <Save size={18} /> <span>{isEdit ? 'Update Payment' : 'Complete Collection'}</span>
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
