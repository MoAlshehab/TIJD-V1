import React from 'react';
import { router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import LazyLoad from 'react-lazyload';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashRestore, faBan } from '@fortawesome/free-solid-svg-icons';

export default function ArchivedUsersList({ users }) {
    const { t } = useTranslation();

    const restoreUser = (id) => {
        if (!confirm(t('are_you_sure_restore'))) return;
        router.post(`/admin/users/${id}/restore`);
    };

    const forceDeleteUser = (id) => {
        if (!confirm(t('are_you_sure_force_delete'))) return;
        router.delete(`/admin/users/${id}/force-delete`);
    };

    return (
        <div className="bg-light dark:bg-grayDark min-h-screen px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                {t('archived_users')}
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map((user) => (
                    <div
                        key={user.id}
                        className="bg-light dark:bg-grayDark p-6 rounded-lg shadow-md"
                    >
                        <LazyLoad>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {user.name}
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                {t('email_address')}: {user.email}
                            </p>

                            <div className="flex gap-4 mt-4 items-center">
                                <button
                                    onClick={() => restoreUser(user.id)}
                                    className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                                    title={t('restore_user')}
                                >
                                    <FontAwesomeIcon icon={faTrashRestore} /> {t('restore')}
                                </button>

                                <button
                                    onClick={() => forceDeleteUser(user.id)}
                                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                    title={t('delete_forever')}
                                >
                                    <FontAwesomeIcon icon={faBan} /> {t('delete_forever')}
                                </button>
                            </div>
                        </LazyLoad>
                    </div>
                ))}
            </div>
        </div>
    );
}
