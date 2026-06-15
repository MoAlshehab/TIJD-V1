import React from 'react';
import { usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function EmployeeList() {
    const { company, employees } = usePage().props;
    const { t } = useTranslation();

    return (
        <div className="p-6 max-w-xl mx-auto">
            <div className="bg-white dark:bg-dark-surface rounded-lg p-6 shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">
                        {company?.name} - {t('Employees')}
                    </h2>
                    <button
                        onClick={() => window.history.back()}
                        className="text-gray-500 hover:text-red-500 font-bold text-lg"
                    >
                        ← {t('Back')}
                    </button>
                </div>

                {employees.length === 0 ? (
                    <p className="text-gray-500">{t('No employees available')}</p>
                ) : (
                    <ul className="space-y-4">
                        {employees.map((employee) => (
                            <li
                                key={employee.id}
                                className="p-4 border rounded shadow-sm hover:shadow-md transition-shadow duration-200"
                            >
                                <div className="font-semibold text-lg">{employee.name}</div>
                                {employee.email && (
                                    <div className="text-gray-700">Email: {employee.email}</div>
                                )}
                                {/* Voeg eventueel meer info toe */}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
