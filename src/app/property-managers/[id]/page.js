'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Phone, User, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import { fetchPropertyManagerDetails } from '@/utils/api';
import styles from './page.module.css';

export default function PropertyManagerDetails() {
    const params = useParams();
    const id = params.id;
    
    const [manager, setManager] = useState(null);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        const loadDetail = async () => {
            try {
                const res = await fetchPropertyManagerDetails(id);
                const data = res?.data?.manager_details || res?.data;
                if (data && typeof data === 'object') {
                    setManager(data);
                }
            } catch (err) {
                console.error(err);
            }
            setIsFetching(false);
        };
        if (id) loadDetail();
    }, [id]);

    if (isFetching) {
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <h2>Loading manager details...</h2>
            </div>
        );
    }

    if (!manager) {
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <h2>Manager not found</h2>
                <Link href="/property-managers" className={styles.backLink}>
                    <ArrowLeft size={16} /> Back to Property Managers
                </Link>
            </div>
        );
    }

    const avatarImage = manager.attachments && manager.attachments.length > 0 
        ? `http://localhost:3009/public/upload/attachments_local/${manager.attachments[0].file_path}` 
        : null;
        
    const assignedProps = Array.isArray(manager.assigned_properties) ? manager.assigned_properties : [];

    return (
        <main>
            <Header title="Property Manager Details" />
            <div className={styles.pageContainer}>
                <Link href="/property-managers" className={styles.backLink}>
                    <ArrowLeft size={18} /> Back to Property Managers
                </Link>

                <div className={styles.profileCard}>
                    <div className={styles.profileCover}>
                        <div className={styles.coverBg}></div>
                        <div className={styles.avatarContainer}>
                            {avatarImage ? (
                                <img src={avatarImage} alt={manager.first_name} className={styles.profileHeroAvatar} />
                            ) : (
                                <div className={styles.profileHeroPlaceholder}>
                                    <User size={60} />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={styles.profileHeroInfo}>
                        <h2 className={styles.heroName}>{`${manager.first_name || ''} ${manager.last_name || ''}`}</h2>
                        <span className={`${styles.heroBadge} ${styles[manager.status?.toLowerCase() || 'inactive']}`}>
                            {manager.status || 'Inactive'}
                        </span>
                    </div>

                    <div className={styles.profileGrid}>
                        <div className={styles.detailCard}>
                            <h4 className={styles.detailTitle}>Personal & Contact</h4>
                            <div className={styles.contactList}>
                                <div className={styles.infoRow}><span className={styles.infoLabel}>Email:</span> <span className={styles.infoVal}>{manager.email || 'N/A'}</span></div>
                                <div className={styles.infoRow}><span className={styles.infoLabel}>Phone:</span> <span className={styles.infoVal}>{manager.phone || 'N/A'}</span></div>
                                <div className={styles.infoRow}><span className={styles.infoLabel}>DOB:</span> <span className={styles.infoVal}>{manager.dob ? new Date(manager.dob).toLocaleDateString() : 'N/A'}</span></div>
                                <div className={styles.infoRow}><span className={styles.infoLabel}>City:</span> <span className={styles.infoVal}>{manager.city || 'N/A'}</span></div>
                                <div className={styles.infoRow}><span className={styles.infoLabel}>Gender:</span> <span className={styles.infoVal}>{manager.gender || 'N/A'}</span></div>
                            </div>
                        </div>

                        <div className={styles.detailCard}>
                            <h4 className={styles.detailTitle}>Employment</h4>
                            <div className={styles.contactList}>
                                <div className={styles.infoRow}><span className={styles.infoLabel}>Emp ID:</span> <span className={styles.infoVal}>{manager.employee_id || 'N/A'}</span></div>
                                <div className={styles.infoRow}><span className={styles.infoLabel}>Role:</span> <span className={styles.infoVal}>{manager.role || 'Property Manager'}</span></div>
                                <div className={styles.infoRow}><span className={styles.infoLabel}>Designation:</span> <span className={styles.infoVal}>{manager.designation || 'N/A'}</span></div>
                                <div className={styles.infoRow}><span className={styles.infoLabel}>Joined:</span> <span className={styles.infoVal}>{manager.joining_date ? new Date(manager.joining_date).toLocaleDateString() : 'N/A'}</span></div>
                            </div>
                        </div>

                        <div className={styles.detailCard}>
                            <h4 className={styles.detailTitle}>Assigned Properties</h4>
                            <div className={styles.propertyTagsList}>
                                {assignedProps.length > 0 ? (
                                    assignedProps.map((prop, i) => (
                                        <span key={i} className={styles.heroPropTag}>{prop}</span>
                                    ))
                                ) : (
                                    <span className={styles.noProp}>Unassigned</span>
                                )}
                            </div>
                        </div>

                        <div className={styles.detailCard}>
                            <h4 className={styles.detailTitle}>Other Information</h4>
                            <div className={styles.contactList}>
                                <div className={styles.infoRow}><span className={styles.infoLabel}>Alt Phone:</span> <span className={styles.infoVal}>{manager.alt_phone || 'N/A'}</span></div>
                                <div className={styles.infoRow}><span className={styles.infoLabel}>Address:</span> <span className={styles.infoVal}>{manager.address || 'N/A'}</span></div>
                                <div className={styles.infoRow}><span className={styles.infoLabel}>Salary:</span> <span className={styles.infoVal}>{manager.salary ? `₹${manager.salary}` : 'N/A'}</span></div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.analyticsSection}>
                        <h4 className={styles.detailTitle} style={{ paddingLeft: '8px' }}>Performance Analytics</h4>
                        <div className={styles.analyticsGrid}>
                            <div className={styles.analyticsBox}>
                                <span className={styles.analyticsVal}>{manager.stats?.occupancy || '0%'}</span>
                                <span className={styles.analyticsLbl}>Occupancy</span>
                            </div>
                            <div className={styles.analyticsBox}>
                                <span className={styles.analyticsVal}>{manager.stats?.resolvedTickets || '0'}</span>
                                <span className={styles.analyticsLbl}>Resolved</span>
                            </div>
                            <div className={styles.analyticsBox}>
                                <span className={styles.analyticsVal}>{manager.stats?.rating || '0.0'}</span>
                                <span className={styles.analyticsLbl}>Rating</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
