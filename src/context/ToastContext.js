'use client';

import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.map(t => t.id === id ? { ...t, leaving: true } : t));
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 380);
    }, []);

    const showToast = useCallback((message, type = 'success', duration = 4500) => {
        const id = ++toastId;
        setToasts(prev => [...prev, { id, message, type, leaving: false }]);
        setTimeout(() => removeToast(id), duration);
        return id;
    }, [removeToast]);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within a ToastProvider');
    return ctx.showToast;
}

/* ─── Toast Container ─────────────────────────────────────────── */
function ToastContainer({ toasts, onRemove }) {
    if (toasts.length === 0) return null;
    return (
        <div style={containerStyle}>
            {toasts.map(toast => (
                <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
            ))}
        </div>
    );
}

/* ─── Individual Toast ────────────────────────────────────────── */
function ToastItem({ toast, onRemove }) {
    const cfg = toastConfig[toast.type] || toastConfig.info;

    return (
        <div
            style={{
                ...itemBaseStyle,
                backgroundColor: cfg.bg,
                border: `1.5px solid ${cfg.border}`,
                animation: toast.leaving
                    ? 'toastSlideOut 0.38s cubic-bezier(0.4, 0, 0.2, 1) forwards'
                    : 'toastSlideIn 0.38s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}
        >
            {/* Circular icon */}
            <div style={{ ...iconWrapStyle, backgroundColor: cfg.iconBg }}>
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    stroke="#fff"
                >
                    <path d={cfg.iconPath} />
                </svg>
            </div>

            {/* Text block */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <p style={titleStyle}>{cfg.title}</p>
                <p style={msgStyle}>{toast.message}</p>
            </div>

            {/* Close button */}
            <button
                onClick={() => onRemove(toast.id)}
                style={closeBtnStyle}
                aria-label="Dismiss"
            >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </button>
        </div>
    );
}

/* ─── Config per type ─────────────────────────────────────────── */
const toastConfig = {
    success: {
        title:    'Congratulations!',
        bg:       '#f0fdf4',
        border:   '#bbf7d0',
        iconBg:   '#22c55e',
        // checkmark
        iconPath: 'M20 6L9 17l-5-5',
    },
    error: {
        title:    'Something went wrong!',
        bg:       '#fef2f2',
        border:   '#fecaca',
        iconBg:   '#ef4444',
        // X
        iconPath: 'M18 6L6 18M6 6l12 12',
    },
    warning: {
        title:    'Warning!',
        bg:       '#fffbeb',
        border:   '#fde68a',
        iconBg:   '#f59e0b',
        // exclamation — circle handled inline, so we use a vertical line + dot
        iconPath: 'M12 9v4M12 17h.01',
    },
    info: {
        title:    'Did you know?',
        bg:       '#eff6ff',
        border:   '#bfdbfe',
        iconBg:   '#3b82f6',
        // lightbulb approximation via info 'i'
        iconPath: 'M12 16v-4M12 8h.01',
    },
};

/* ─── Styles ──────────────────────────────────────────────────── */
const containerStyle = {
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: 99999,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    width: '360px',
    maxWidth: 'calc(100vw - 40px)',
    pointerEvents: 'none',
};

const itemBaseStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '16px 18px',
    borderRadius: '14px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.06)',
    pointerEvents: 'all',
    position: 'relative',
    overflow: 'hidden',
};

const iconWrapStyle = {
    flexShrink: 0,
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

const titleStyle = {
    margin: 0,
    fontSize: '14px',
    fontWeight: '700',
    color: '#111827',
    letterSpacing: '-0.01em',
};

const msgStyle = {
    margin: '3px 0 0',
    fontSize: '13px',
    color: '#6b7280',
    lineHeight: 1.5,
    wordBreak: 'break-word',
};

const closeBtnStyle = {
    flexShrink: 0,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.7,
    transition: 'opacity 0.15s',
    alignSelf: 'flex-start',
};

/* ─── Keyframes ───────────────────────────────────────────────── */
if (typeof document !== 'undefined') {
    const styleId = '__toast_kf__';
    if (!document.getElementById(styleId)) {
        const s = document.createElement('style');
        s.id = styleId;
        s.textContent = `
            @keyframes toastSlideIn {
                from { opacity: 0; transform: translateX(calc(100% + 24px)); }
                to   { opacity: 1; transform: translateX(0); }
            }
            @keyframes toastSlideOut {
                from { opacity: 1; transform: translateX(0);                   max-height: 100px; }
                to   { opacity: 0; transform: translateX(calc(100% + 24px));   max-height: 0;    }
            }
        `;
        document.head.appendChild(s);
    }
}
