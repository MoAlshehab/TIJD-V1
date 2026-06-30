import React, { createContext, useContext, useState } from 'react';
import {
    CheckCircleIcon,
    XCircleIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';

/**
 * ToastContext
 * Wordt gebruikt om overal in de app notificaties te tonen
 */
const ToastContext = createContext();

/**
 * Hook om toast te gebruiken
 */
export const useToast = () => useContext(ToastContext);

/**
 * ToastProvider
 * Deze provider moet 1x rond je hele app zitten
 */
export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    /**
     * showToast
     * @param {string} message - Tekst van de melding
     * @param {string} type - success | error | warning | info
     * @param {number} duration - Hoe lang zichtbaar (ms)
     */
    const showToast = ({ message, type = 'success', duration = 4000 }) => {
        const id = Date.now();

        setToasts((prev) => [...prev, { id, message, type }]);

        // Automatisch verwijderen
        setTimeout(() => {
            removeToast(id);
        }, duration);
    };

    /**
     * removeToast
     * Verwijdert een toast handmatig
     */
    const removeToast = (id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    // Tailwind styles per type
    const styles = {
        success: 'bg-success text-white',
        error: 'bg-danger text-white',
        warning: 'bg-warning text-white',
        info: 'bg-primary text-white',
    };

    // Iconen per type
    const icons = {
        success: <CheckCircleIcon className="w-5 h-5" />,
        error: <XCircleIcon className="w-5 h-5" />,
        warning: <ExclamationTriangleIcon className="w-5 h-5" />,
        info: <InformationCircleIcon className="w-5 h-5" />,
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* Toast container */}
            <div className="fixed top-5 right-5 z-50 space-y-3">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg animate-slide-in ${styles[toast.type]}`}
                    >
                        {icons[toast.type]}

                        <span className="text-sm font-medium">{toast.message}</span>

                        {/* Sluit knop */}
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="ml-auto opacity-70 hover:opacity-100"
                        >
                            <XMarkIcon className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
