import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { router } from '@inertiajs/react';
import LazyLoad from 'react-lazyload';
import React from 'react';

export default function UsersList({ users }) {
    const { t } = useTranslation();

    const deleteUser = (user) => {
        if (!confirm(t('are_you_sure_delete'))) return;
        router.delete('/admin/user/' + user.id);
    };

    const is_admin = (id) => router.post('/api/user/' + id + '/is_admin');
    const owner = (id) => router.post('/api/user/' + id + '/owner');
    const block = (id) => router.post('/api/user/' + id + '/block');

    return (
        <div className="min-h-screen bg-light dark:bg-grayDark text-black dark:text-white mb-28">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 p-4">
                {users.map((user) => (
                    <div
                        key={user.id}
                        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition"
                    >
                        <LazyLoad>
                            <h2 className="text-xl font-bold mb-1">{user.name}</h2>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                                {t('email_address')}: {user.email}
                            </p>

                            <div className="flex items-center justify-between mb-4">
                                <button
                                    onClick={() => deleteUser(user)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg
                                               bg-red-100 text-red-700 hover:bg-red-200
                                               dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800
                                               transition"
                                    title={t('delete_user')}
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                    <span className="text-sm font-medium">{t('delete_user')}</span>
                                </button>
                            </div>

                            <div className="space-y-3">
                                {/* Admin */}
                                <label className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-3 rounded-lg cursor-pointer">
                                    <span className="text-sm font-medium">
                                        {user.is_admin ? t('is_admin') : t('not_admin')}
                                    </span>
                                    <input
                                        type="checkbox"
                                        checked={!!user.is_admin}
                                        onChange={() => is_admin(user.id)}
                                        className="toggle toggle-primary"
                                    />
                                </label>

                                {/* Owner */}
                                <label className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-3 rounded-lg cursor-pointer">
                                    <span className="text-sm font-medium">
                                        {user.owner ? t('is_owner') : t('not_owner')}
                                    </span>
                                    <input
                                        type="checkbox"
                                        checked={!!user.owner}
                                        onChange={() => owner(user.id)}
                                        className="toggle toggle-primary"
                                    />
                                </label>

                                {/* Block */}
                                <label className="flex items-center justify-between bg-red-50 dark:bg-red-900 p-3 rounded-lg cursor-pointer">
                                    <span className="text-sm font-medium text-red-700 dark:text-red-300">
                                        {user.blocked ? t('is_blocked') : t('block')}
                                    </span>
                                    <input
                                        type="checkbox"
                                        checked={!!user.blocked}
                                        onChange={() => block(user.id)}
                                        className="toggle toggle-danger"
                                    />
                                </label>
                            </div>
                        </LazyLoad>
                    </div>
                ))}
            </div>
        </div>
    );
}
