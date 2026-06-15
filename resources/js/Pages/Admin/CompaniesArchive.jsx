import React from 'react';
import { usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

const CompaniesArchive = () => {
    const { companies, companiesCount } = usePage().props;
    const { t } = useTranslation();

    const handleRestore = (id) => {
        if (confirm(t('confirm_restore'))) {
            router.post(`/admin/companies/restore/${id}`);
        }
    };

    const handleForceDelete = (id) => {
        if (confirm(t('confirm_force_delete'))) {
            router.delete(
                `/admin/companies/force-delete/${id}`,
                {},
                {
                    onSuccess: () => {
                        console.log(t('company_deleted'));
                    },
                    onError: (errors) => {
                        console.error(t('delete_error'), errors);
                    },
                }
            );
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6 bg-light dark:bg-grayDark min-h-screen text-gray-900 dark:text-gray-100">
            <h1 className="text-3xl font-bold mb-6">
                {t('deleted_companies')} ({companiesCount})
            </h1>

            {companies.length === 0 && (
                <p className="text-gray-600 dark:text-gray-400">{t('no_deleted_companies')}</p>
            )}

            <div className="space-y-4">
                {companies.map((company) => (
                    <div
                        key={company.id}
                        className="border rounded p-4 flex justify-between items-center bg-red-50 dark:bg-red-900 shadow-sm border-red-400 dark:border-red-700"
                    >
                        <div>
                            <h2 className="text-xl font-semibold">{company.name}</h2>
                            <p>
                                {t('owner')}: {company.owner?.name || t('unknown')}
                            </p>
                            <p>
                                {t('employees_count')}: {company.employees_count}
                            </p>
                        </div>
                        <div className="space-x-2">
                            <button
                                onClick={() => handleRestore(company.id)}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                            >
                                {t('restore')}
                            </button>
                            <button
                                onClick={() => handleForceDelete(company.id)}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                            >
                                {t('force_delete')}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CompaniesArchive;
