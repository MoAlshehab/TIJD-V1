import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Close({ onClick, className = '' }) {
    const { t } = useTranslation();

    return (
        <button
            onClick={onClick}
            className={`text-sm text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-1 hover:underline ${className}`}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                />
            </svg>
            {t('close')}
        </button>
    );
}
