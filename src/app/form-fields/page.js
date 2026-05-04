'use client';

import { useState } from 'react';
import { 
    FileText, 
    ChevronRight, 
    Building2,
    UserCog,
    Brush,
    Users,
    BedDouble,
    CalendarCheck,
    CreditCard,
    MessageSquareWarning,
    UserCheck,
    Search,
    Copy,
    Check
} from 'lucide-react';
import styles from './page.module.css';

// Pre-defined menus for form field mapping
const menus = [
    { id: 'properties', label: 'Properties', icon: Building2 },
    { id: 'property-managers', label: 'Property Managers', icon: UserCog },
    { id: 'housekeepers', label: 'Housekeepers', icon: Brush },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'rooms', label: 'Rooms', icon: BedDouble },
    { id: 'bookings', label: 'Bookings', icon: CalendarCheck },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'complaints', label: 'Complaints', icon: MessageSquareWarning },
    { id: 'visitors', label: 'Visitors', icon: UserCheck },
];

// Mapping data
const fieldMappings = {
    'properties': [
        { fieldName: 'Property Name', key: 'name', type: 'String', inputType: 'Text', required: true, description: 'Name of the hostel or PG (e.g. Sunset Heights Hostel)' },
        { fieldName: 'Category', key: 'category', type: 'String', inputType: 'Select', required: true, description: 'Type of property (Hostel, PG, Apartment)' },
        { fieldName: 'Full Address', key: 'address', type: 'String', inputType: 'Textarea', required: true, description: 'Complete building address' },
        { fieldName: 'City', key: 'city', type: 'String', inputType: 'Text', required: false, description: 'City name' },
        { fieldName: 'State', key: 'state', type: 'String', inputType: 'Text', required: false, description: 'State name' },
        { fieldName: 'Pincode', key: 'pincode', type: 'String', inputType: 'Text', required: false, description: '6-digit ZIP code' },
        { fieldName: 'Property Description', key: 'description', type: 'String', inputType: 'Textarea', required: false, description: 'Features, amenities, and house rules' },
        { fieldName: 'Room Configuration', key: 'rooms', type: 'Array of Objects', inputType: 'Dynamic Row', required: false, description: 'Array containing { type, count, price }' },
        { fieldName: 'Room Type', key: 'rooms[].type', type: 'String', inputType: 'Text', required: true, description: 'e.g. Single Sharing' },
        { fieldName: 'Total Rooms', key: 'rooms[].count', type: 'Number', inputType: 'Number', required: true, description: 'Number of rooms of this type' },
        { fieldName: 'Monthly Price', key: 'rooms[].price', type: 'Number', inputType: 'Number', required: true, description: 'Price in INR (₹)' },
        { fieldName: 'Media Images', key: 'images', type: 'Array of Files', inputType: 'File Upload', required: false, description: 'Support JPG, PNG up to 5MB' },
    ],
    'property-managers': [
        // Personal Info
        { fieldName: 'First Name', key: 'firstName', type: 'String', inputType: 'Text', required: true, description: 'Manager\'s first name' },
        { fieldName: 'Last Name', key: 'lastName', type: 'String', inputType: 'Text', required: true, description: 'Manager\'s last name' },
        { fieldName: 'Gender', key: 'gender', type: 'String', inputType: 'Select', required: false, description: 'Male, Female, Other' },
        { fieldName: 'Date of Birth', key: 'dob', type: 'Date', inputType: 'Date', required: false, description: 'Manager\'s date of birth' },
        // Contact Details
        { fieldName: 'Email Address', key: 'email', type: 'String', inputType: 'Email', required: true, description: 'Primary email address' },
        { fieldName: 'Phone Number', key: 'phone', type: 'String', inputType: 'Tel', required: true, description: 'Primary contact number' },
        { fieldName: 'Secondary Phone', key: 'altPhone', type: 'String', inputType: 'Tel', required: false, description: 'Optional emergency contact' },
        { fieldName: 'City', key: 'city', type: 'String', inputType: 'Text', required: false, description: 'Current city' },
        { fieldName: 'Full Residential Address', key: 'address', type: 'String', inputType: 'Textarea', required: false, description: 'Complete permanent address' },
        // Professional Info
        { fieldName: 'Employee ID', key: 'employeeId', type: 'String', inputType: 'Text', required: false, description: 'Unique internal employee ID' },
        { fieldName: 'Designation', key: 'designation', type: 'String', inputType: 'Text', required: false, description: 'Job title (e.g., Property Manager)' },
        { fieldName: 'Date of Joining', key: 'joiningDate', type: 'Date', inputType: 'Date', required: false, description: 'First day of employment' },
        { fieldName: 'Monthly Salary', key: 'salary', type: 'Number', inputType: 'Number', required: false, description: 'Salary in INR (₹)' },
        // Permissions
        { fieldName: 'System Role', key: 'role', type: 'String', inputType: 'Select', required: false, description: 'Property Manager, Senior Manager, Admin' },
        { fieldName: 'Working Status', key: 'status', type: 'String', inputType: 'Select', required: false, description: 'Active, On Leave, Inactive' },
        { fieldName: 'Assigned Properties', key: 'assignedProperties', type: 'Array of Strings', inputType: 'Multi-Select', required: false, description: 'List of property names/IDs assigned' },
        // Account Security
        { fieldName: 'Login Username', key: 'username', type: 'String', inputType: 'Text', required: true, description: 'Username for system login' },
        { fieldName: 'Account Password', key: 'password', type: 'String', inputType: 'Password', required: true, description: 'Login password' },
    ],
    'housekeepers': [
        // Personal Info
        { fieldName: 'First Name', key: 'firstName', type: 'String', inputType: 'Text', required: true, description: 'Housekeeper\'s first name' },
        { fieldName: 'Last Name', key: 'lastName', type: 'String', inputType: 'Text', required: true, description: 'Housekeeper\'s last name' },
        { fieldName: 'Gender', key: 'gender', type: 'String', inputType: 'Select', required: false, description: 'Male, Female, Other' },
        { fieldName: 'Date of Birth', key: 'dob', type: 'Date', inputType: 'Date', required: false, description: 'Housekeeper\'s date of birth' },
        // Contact Details
        { fieldName: 'Email Address', key: 'email', type: 'String', inputType: 'Email', required: false, description: 'Email address (optional)' },
        { fieldName: 'Phone Number', key: 'phone', type: 'String', inputType: 'Tel', required: true, description: 'Primary contact number' },
        { fieldName: 'City', key: 'city', type: 'String', inputType: 'Text', required: false, description: 'Current city' },
        { fieldName: 'State', key: 'state', type: 'String', inputType: 'Text', required: false, description: 'State name' },
        { fieldName: 'Full Residential Address', key: 'address', type: 'String', inputType: 'Textarea', required: false, description: 'Complete permanent address' },
        // Professional Info
        { fieldName: 'Employee ID', key: 'employeeId', type: 'String', inputType: 'Text', required: false, description: 'Unique internal employee ID' },
        { fieldName: 'Work Shift', key: 'workShift', type: 'String', inputType: 'Select', required: false, description: 'Day, Evening, or Night Shift' },
        { fieldName: 'Date of Joining', key: 'joiningDate', type: 'Date', inputType: 'Date', required: false, description: 'First day of employment' },
        { fieldName: 'Monthly Salary', key: 'salary', type: 'Number', inputType: 'Number', required: false, description: 'Salary in INR (₹)' },
        { fieldName: 'Experience (Years)', key: 'experience', type: 'Number', inputType: 'Number', required: false, description: 'Years of prior experience' },
        { fieldName: 'Working Status', key: 'status', type: 'String', inputType: 'Select', required: false, description: 'Active, On Leave, Inactive' },
        // Assignments
        { fieldName: 'Assigned Properties', key: 'assignedProperties', type: 'Array of Strings', inputType: 'Multi-Select', required: false, description: 'List of property names/IDs assigned for maintenance' },
    ],
    'customers': [
        // Basic Details
        { fieldName: 'Full Name', key: 'name', type: 'String', inputType: 'Text', required: true, description: 'Resident\'s full legal name' },
        { fieldName: 'Mobile Number', key: 'mobile', type: 'String', inputType: 'Text', required: true, description: 'Primary contact number' },
        { fieldName: 'Alternate Mobile', key: 'altMobile', type: 'String', inputType: 'Text', required: false, description: 'Secondary contact number' },
        { fieldName: 'Email ID', key: 'email', type: 'String', inputType: 'Email', required: false, description: 'Personal email address' },
        { fieldName: 'Gender', key: 'gender', type: 'String', inputType: 'Select', required: false, description: 'Male, Female, Other' },
        { fieldName: 'Date of Birth', key: 'dob', type: 'Date', inputType: 'Date', required: false, description: 'Resident\'s date of birth' },
        { fieldName: 'Marital Status', key: 'maritalStatus', type: 'String', inputType: 'Select', required: false, description: 'Single, Married, Other' },
        { fieldName: 'Profile Photo', key: 'profilePhoto', type: 'File', inputType: 'File Upload', required: false, description: 'Resident\'s profile picture' },
        // Address Details
        { fieldName: 'Current Address Line', key: 'currentAddress.line', type: 'String', inputType: 'Text', required: true, description: 'Current residence address' },
        { fieldName: 'Current City', key: 'currentAddress.city', type: 'String', inputType: 'Text', required: false, description: 'Current city' },
        { fieldName: 'Current State', key: 'currentAddress.state', type: 'String', inputType: 'Text', required: false, description: 'Current state' },
        { fieldName: 'Current Pincode', key: 'currentAddress.pincode', type: 'String', inputType: 'Text', required: false, description: 'Current area pincode' },
        { fieldName: 'Same as Current Address', key: 'sameAsCurrent', type: 'Boolean', inputType: 'Checkbox', required: false, description: 'Is permanent address same as current?' },
        { fieldName: 'Permanent Address Line', key: 'permanentAddress.line', type: 'String', inputType: 'Text', required: false, description: 'Permanent residence address' },
        { fieldName: 'Permanent City', key: 'permanentAddress.city', type: 'String', inputType: 'Text', required: false, description: 'Permanent city' },
        { fieldName: 'Permanent State', key: 'permanentAddress.state', type: 'String', inputType: 'Text', required: false, description: 'Permanent state' },
        { fieldName: 'Permanent Pincode', key: 'permanentAddress.pincode', type: 'String', inputType: 'Text', required: false, description: 'Permanent area pincode' },
        // Stay Details
        { fieldName: 'Property Name', key: 'propertyName', type: 'String', inputType: 'Text', required: false, description: 'Assigned hostel/PG name' },
        { fieldName: 'Room Number', key: 'roomNumber', type: 'String', inputType: 'Text', required: false, description: 'Assigned room number' },
        { fieldName: 'Bed Number', key: 'bedNumber', type: 'String', inputType: 'Text', required: false, description: 'Assigned bed number' },
        { fieldName: 'Customer Type', key: 'customerType', type: 'String', inputType: 'Select', required: false, description: 'Short Stay, Long Stay, Corporate' },
        { fieldName: 'Joining Date', key: 'joiningDate', type: 'Date', inputType: 'Date', required: false, description: 'Date of move-in' },
        { fieldName: 'Expected Check-out', key: 'expectedCheckOut', type: 'Date', inputType: 'Date', required: false, description: 'Planned move-out date' },
        // KYC Details
        { fieldName: 'ID Proof Type', key: 'idProofType', type: 'String', inputType: 'Select', required: false, description: 'Aadhaar, PAN, Passport, DL' },
        { fieldName: 'ID Proof Number', key: 'idProofNumber', type: 'String', inputType: 'Text', required: false, description: 'Unique identification number' },
        { fieldName: 'Aadhaar Front', key: 'aadhaarFront', type: 'File', inputType: 'File Upload', required: false, description: 'Image of front side of Aadhaar' },
        { fieldName: 'Aadhaar Back', key: 'aadhaarBack', type: 'File', inputType: 'File Upload', required: false, description: 'Image of back side of Aadhaar' },
        { fieldName: 'PAN Card Image', key: 'panCardImage', type: 'File', inputType: 'File Upload', required: false, description: 'Image of PAN Card' },
        // Emergency Contact
        { fieldName: 'Emergency Contact Person', key: 'emergencyContact.name', type: 'String', inputType: 'Text', required: false, description: 'Emergency contact name' },
        { fieldName: 'Emergency Relationship', key: 'emergencyContact.relationship', type: 'String', inputType: 'Text', required: false, description: 'Relationship with resident' },
        { fieldName: 'Emergency Mobile', key: 'emergencyContact.mobile', type: 'String', inputType: 'Text', required: false, description: 'Emergency contact number' },
        { fieldName: 'Emergency Address', key: 'emergencyContact.address', type: 'String', inputType: 'Textarea', required: false, description: 'Emergency contact address' },
        // Work Info
        { fieldName: 'Company Name', key: 'officeInfo.company', type: 'String', inputType: 'Text', required: false, description: 'Resident\'s employer name' },
        { fieldName: 'Designation', key: 'officeInfo.designation', type: 'String', inputType: 'Text', required: false, description: 'Resident\'s job title' },
        { fieldName: 'Office Address', key: 'officeInfo.address', type: 'String', inputType: 'Textarea', required: false, description: 'Employer\'s address' },
        { fieldName: 'Digital Signature', key: 'signature', type: 'File', inputType: 'File Upload', required: false, description: 'Digital signature of resident' },
        // Payment & System
        { fieldName: 'Rent Amount', key: 'rentAmount', type: 'Number', inputType: 'Number', required: false, description: 'Monthly rent amount' },
        { fieldName: 'Security Deposit', key: 'securityDeposit', type: 'Number', inputType: 'Number', required: false, description: 'Refundable security deposit' },
        { fieldName: 'Payment Mode', key: 'paymentMode', type: 'String', inputType: 'Select', required: false, description: 'Cash, UPI, Bank Transfer' },
        { fieldName: 'Police Verification', key: 'policeVerification', type: 'String', inputType: 'Select', required: false, description: 'Verified, Pending, Partial' },
        { fieldName: 'Account Status', key: 'status', type: 'String', inputType: 'Select', required: false, description: 'Active, Inactive' },
        { fieldName: 'Remarks', key: 'remarks', type: 'String', inputType: 'Textarea', required: false, description: 'Additional notes or remarks' },
    ],
    'rooms': [
        { fieldName: 'Room Number', key: 'roomNumber', type: 'String', inputType: 'Text', required: true, description: 'Unique identification for the room (e.g. 101, B-20)' },
        { fieldName: 'Room Type', key: 'type', type: 'String', inputType: 'Select', required: true, description: 'Single, Double, Triple, etc.' },
        { fieldName: 'Property Name', key: 'propertyName', type: 'String', inputType: 'Text', required: true, description: 'Hostel/PG property this room belongs to' },
        { fieldName: 'Floor', key: 'floor', type: 'String', inputType: 'Text', required: false, description: 'Floor level (e.g. 1st Floor, Ground Floor)' },
        { fieldName: 'Capacity (Beds)', key: 'capacity', type: 'Number', inputType: 'Number', required: true, description: 'Total number of beds available in the room' },
        { fieldName: 'Price Per Month', key: 'pricePerMonth', type: 'Number', inputType: 'Number', required: true, description: 'Monthly rent for a bed in this room' },
        { fieldName: 'Current Status', key: 'status', type: 'String', inputType: 'Select', required: false, description: 'Available, Full, Maintenance' },
        { fieldName: 'Description', key: 'description', type: 'String', inputType: 'Textarea', required: false, description: 'Special features or notes about the room' },
        { fieldName: 'Amenities', key: 'amenities', type: 'Array of Strings', inputType: 'Multi-Select', required: false, description: 'List of amenities (WiFi, AC, Attached Bath, etc.)' },
    ],
    'bookings': [
        // Resident Info
        { fieldName: 'Resident Name', key: 'customerName', type: 'String', inputType: 'Text', required: true, description: 'Full name of the resident' },
        { fieldName: 'Mobile Number', key: 'mobile', type: 'String', inputType: 'Text', required: true, description: 'Primary contact number' },
        { fieldName: 'Email ID', key: 'email', type: 'String', inputType: 'Email', required: false, description: 'Personal email address' },
        // Stay Details
        { fieldName: 'Property Name', key: 'propertyName', type: 'String', inputType: 'Select', required: true, description: 'Hostel/PG property name' },
        { fieldName: 'Room Number', key: 'roomNumber', type: 'String', inputType: 'Text', required: true, description: 'Assigned room number' },
        { fieldName: 'Bed Number', key: 'bedNumber', type: 'String', inputType: 'Text', required: false, description: 'Assigned bed number (optional)' },
        { fieldName: 'Room Type', key: 'roomType', type: 'String', inputType: 'Select', required: false, description: 'Single, Double, Triple, Dormitory' },
        // Schedule
        { fieldName: 'Check-in Date', key: 'checkIn', type: 'Date', inputType: 'Date', required: true, description: 'Date of joining/move-in' },
        { fieldName: 'Expected Check-out', key: 'checkOut', type: 'Date', inputType: 'Date', required: true, description: 'Planned move-out date' },
        { fieldName: 'Number of Guests', key: 'guests', type: 'Number', inputType: 'Number', required: false, description: 'Total number of occupants' },
        { fieldName: 'Purpose of Stay', key: 'purpose', type: 'String', inputType: 'Select', required: false, description: 'Short Stay, Long Stay, Business, Education' },
        // Pricing & Payment
        { fieldName: 'Monthly Rent', key: 'rentAmount', type: 'Number', inputType: 'Number', required: true, description: 'Monthly rent in INR' },
        { fieldName: 'Security Deposit', key: 'securityDeposit', type: 'Number', inputType: 'Number', required: false, description: 'Refundable security deposit' },
        { fieldName: 'Payment Mode', key: 'paymentMode', type: 'String', inputType: 'Select', required: false, description: 'UPI, Cash, Bank Transfer, Card' },
        { fieldName: 'Initial Payment Status', key: 'paymentStatus', type: 'String', inputType: 'Select', required: false, description: 'Paid, Partial, Pending' },
        // KYC
        { fieldName: 'ID Proof Type', key: 'idProofType', type: 'String', inputType: 'Select', required: true, description: 'Aadhaar, PAN, Passport, DL' },
        { fieldName: 'ID Proof Number', key: 'idProofNumber', type: 'String', inputType: 'Text', required: true, description: 'Unique ID number' },
        // Emergency Contact
        { fieldName: 'Emergency Contact Person', key: 'emergencyContact.name', type: 'String', inputType: 'Text', required: false, description: 'Guardian/Contact name' },
        { fieldName: 'Emergency Relationship', key: 'emergencyContact.relationship', type: 'String', inputType: 'Text', required: false, description: 'Relationship with resident' },
        { fieldName: 'Emergency Mobile', key: 'emergencyContact.mobile', type: 'String', inputType: 'Text', required: false, description: 'Emergency contact number' },
        { fieldName: 'Emergency Address', key: 'emergencyContact.address', type: 'String', inputType: 'Textarea', required: false, description: 'Emergency contact address' },
        // System Control
        { fieldName: 'Booking Status', key: 'bookingStatus', type: 'String', inputType: 'Select', required: false, description: 'Confirmed, Pending, Cancelled, Completed' },
        { fieldName: 'Internal Remarks', key: 'remarks', type: 'String', inputType: 'Textarea', required: false, description: 'Staff notes or special requests' },
    ],
    'payments': [
        // Payer Information
        { fieldName: 'Customer Name', key: 'customerName', type: 'String', inputType: 'Text', required: true, description: 'Name of the resident making the payment' },
        { fieldName: 'Property Name', key: 'propertyName', type: 'String', inputType: 'Select', required: false, description: 'Property associated with the payment' },
        { fieldName: 'Room Number', key: 'roomNo', type: 'String', inputType: 'Text', required: false, description: 'Room assigned to the resident' },
        { fieldName: 'Customer ID', key: 'customerId', type: 'String', inputType: 'Text', required: false, description: 'System-generated unique customer ID' },
        // Transaction Details
        { fieldName: 'Amount (INR)', key: 'amount', type: 'Number', inputType: 'Number', required: true, description: 'Total payment amount collected' },
        { fieldName: 'Payment Category', key: 'type', type: 'String', inputType: 'Select', required: false, description: 'Monthly Rent, Deposit, Fine, etc.' },
        { fieldName: 'Payment Method', key: 'method', type: 'String', inputType: 'Select', required: false, description: 'UPI, Cash, Bank Transfer, Card' },
        { fieldName: 'Payment Date', key: 'date', type: 'Date', inputType: 'Date', required: false, description: 'Date the transaction occurred' },
        { fieldName: 'Transaction ID', key: 'transactionId', type: 'String', inputType: 'Text', required: false, description: 'Bank reference or UPI UTR number' },
        // Final Review & Notes
        { fieldName: 'Internal Remarks', key: 'remarks', type: 'String', inputType: 'Textarea', required: false, description: 'Any specific notes about this payment' },
    ],
    'complaints': [
        { fieldName: 'Resident Name', key: 'residentName', type: 'String', inputType: 'Text', required: true, description: 'Name of the resident raising the complaint' },
        { fieldName: 'Issue Type', key: 'issueType', type: 'String', inputType: 'Select', required: false, description: 'Plumbing, Electrical, Internet, etc.' },
        { fieldName: 'Property Name', key: 'hostelName', type: 'String', inputType: 'Text', required: false, description: 'Property where the issue occurred' },
        { fieldName: 'Room Number', key: 'roomNumber', type: 'String', inputType: 'Text', required: false, description: 'Room associated with the complaint' },
        { fieldName: 'Priority Level', key: 'priority', type: 'String', inputType: 'Select', required: false, description: 'Urgent, High, Medium, Low' },
        { fieldName: 'Current Status', key: 'status', type: 'String', inputType: 'Select', required: false, description: 'Pending, In Progress, Resolved, Closed' },
        { fieldName: 'Assigned To', key: 'assignedTo', type: 'String', inputType: 'Text', required: false, description: 'Staff member assigned to resolve the issue' },
        { fieldName: 'Problem Description', key: 'description', type: 'String', inputType: 'Textarea', required: true, description: 'Detailed description of the problem' },
    ],
    'visitors': [
        { fieldName: 'Visitor Name', key: 'name', type: 'String', inputType: 'Text', required: true, description: 'Full name of the visitor' },
        { fieldName: 'Mobile Number', key: 'mobile', type: 'String', inputType: 'Text', required: true, description: 'Contact phone number' },
        { fieldName: 'Visiting Purpose', key: 'purpose', type: 'String', inputType: 'Select', required: true, description: 'Meeting Resident, Delivery, Maintenance, etc.' },
        { fieldName: 'Resident Name', key: 'residentName', type: 'String', inputType: 'Text', required: false, description: 'Resident being visited' },
        { fieldName: 'Property Being Visited', key: 'propertyName', type: 'String', inputType: 'Select', required: false, description: 'Property where the visit is taking place' },
        { fieldName: 'ID Proof Type', key: 'idProofType', type: 'String', inputType: 'Select', required: false, description: 'Aadhaar, PAN, Driving License, Voter ID' },
        { fieldName: 'ID Proof Number', key: 'idProofNumber', type: 'String', inputType: 'Text', required: false, description: 'Unique identification number' },
        { fieldName: 'Additional Remarks', key: 'remarks', type: 'String', inputType: 'Textarea', required: false, description: 'Internal security notes' },
    ],
};

export default function FormFieldsPage() {
    const [activeMenu, setActiveMenu] = useState('properties');
    const [searchTerm, setSearchTerm] = useState('');
    const [copied, setCopied] = useState(false);

    const activeFields = fieldMappings[activeMenu] || [];
    
    const handleCopy = () => {
        if (activeFields.length === 0) return;
        
        const jsonString = JSON.stringify(activeFields, null, 2);
        navigator.clipboard.writeText(jsonString).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const filteredFields = activeFields.filter(f => 
        f.fieldName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        f.key.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Form Field Mappings</h1>
                    <p className={styles.subtitle}>Standardized API field definitions across Web & Android applications.</p>
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.sidebar}>
                    <h2 className={styles.sidebarTitle}>Menus</h2>
                    <ul className={styles.menuList}>
                        {menus.map(menu => {
                            const Icon = menu.icon;
                            return (
                                <li key={menu.id}>
                                    <button 
                                        className={`${styles.menuButton} ${activeMenu === menu.id ? styles.activeMenu : ''}`}
                                        onClick={() => setActiveMenu(menu.id)}
                                    >
                                        <Icon size={18} />
                                        <span>{menu.label}</span>
                                        <ChevronRight size={16} className={styles.chevron} />
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <div className={styles.mainContent}>
                    <div className={styles.contentHeader}>
                        <h2 className={styles.contentTitle}>
                            {menus.find(m => m.id === activeMenu)?.label} Fields
                        </h2>
                        <div className={styles.actions}>
                            <button 
                                className={`${styles.copyButton} ${copied ? styles.copied : ''}`}
                                onClick={handleCopy}
                                title="Copy all fields to clipboard"
                            >
                                {copied ? <Check size={16} /> : <Copy size={16} />}
                                <span>{copied ? 'Copied JSON!' : 'Copy Fields'}</span>
                            </button>
                            <div className={styles.searchWrapper}>
                                <Search className={styles.searchIcon} size={16} />
                                <input 
                                    type="text" 
                                    placeholder="Search fields..." 
                                    className={styles.searchInput}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {activeFields.length === 0 ? (
                        <div className={styles.emptyState}>
                            <FileText size={48} className={styles.emptyIcon} />
                            <h3>No fields defined yet</h3>
                            <p>Form fields for this menu will be mapped soon.</p>
                        </div>
                    ) : (
                        <div className={styles.tableContainer}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Field Name</th>
                                        <th>API Key</th>
                                        <th>Data Type</th>
                                        <th>Input Type</th>
                                        <th>Required</th>
                                        <th>Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredFields.map((field, idx) => (
                                        <tr key={idx}>
                                            <td className={styles.fieldName}>{field.fieldName}</td>
                                            <td><code className={styles.code}>{field.key}</code></td>
                                            <td><span className={styles.badge}>{field.type}</span></td>
                                            <td>{field.inputType}</td>
                                            <td>
                                                {field.required ? (
                                                    <span className={styles.requiredBadge}>Yes</span>
                                                ) : (
                                                    <span className={styles.optionalBadge}>No</span>
                                                )}
                                            </td>
                                            <td className={styles.description}>{field.description}</td>
                                        </tr>
                                    ))}
                                    {filteredFields.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className={styles.noResults}>No matching fields found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
