import React from 'react';
import { useTranslation } from 'react-i18next';

export default function EmployeeDashboard({ message }) {
    const { t } = useTranslation();

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-2">{t('employee_dashboard_title')}</h1>

            {message && <p className="text-gray-700 dark:text-gray-300">{message}</p>}
        </div>
    );
}
