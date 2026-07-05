import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import InputField from '@/Components/InputField';
import ConfirmModal from '@/Components/ConfirmModal';
import { useToast } from '@/Components/Toast/ToastProvider';

const Profile = ({ auth, profileImageUrl, user: initialUser }) => {
    const { t } = useTranslation();
    const [user, setUser] = useState({
        ...initialUser,
        phone: initialUser.phone ?? '',
    });
    const { showToast } = useToast();
    const [confirmDelete, setConfirmDelete] = useState(false);

    const deleteUser = () => {
        router.delete(`/user/${user.id}`, {
            onSuccess: () => {
                showToast({
                    message: t('Account deleted successfully'),
                    type: 'success',
                });
            },
            onError: () => {
                showToast({
                    message: t('Failed to delete account'),
                    type: 'error',
                });
            },
        });

        setConfirmDelete(false);
    };

    const changeUser = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const updateUser = () => {
        const formData = new FormData();
        formData.append('name', user.name);
        formData.append('email', user.email);
        formData.append('phone', user.phone || '');

        if (user.image) {
            formData.append('profile_image', user.image);
        }

        router.post(`/updateProfileImage/user/${auth.user.id}`, formData, {
            forceFormData: true,
            onSuccess: () => {
                showToast({
                    message: t('Profile updated successfully'),
                    type: 'success',
                });
            },
            onError: () => {
                showToast({
                    message: t('Failed to update profile'),
                    type: 'error',
                });
            },
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setUser({ ...user, image: file });
        } else {
            alert(t('please_select_a_valid_image_file'));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center py-10 px-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-xl w-full p-8">
                <div className="flex flex-col items-center space-y-6">
                    {/* Profielfoto */}
                    {auth.user?.company_id || auth.user?.is_owner ? (
                        <div className="relative w-28 h-28">
                     <img
                            // src={user.profile_image || '/images/default_profile.jpg'}
                            src={user.profile_image || '/default_profile.jpg'}
                            alt="Profielfoto"
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = '/default_profile.jpg';
                            }}
                            className="w-28 h-28 rounded-full object-cover border-4 border-blue-500 dark:border-blue-400"
                        />

                            {/* Upload knop als overlay */}
                            <label
                                htmlFor="profileImageUpload"
                                className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 cursor-pointer border-2 border-white dark:border-gray-900"
                                title={t('change_profile_picture')}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15.232 5.232l3.536 3.536M9 11l6-6m0 0L9 11m0 0l-4 4v4h4l4-4m0-4v4"
                                    />
                                </svg>
                                <input
                                    type="file"
                                    id="profileImageUpload"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                            </label>
                        </div>
                    ) : null}

                    {/* Naam en E-mail */}
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                        {user.name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
                </div>

                {/* Formulier */}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        updateUser();
                    }}
                    encType="multipart/form-data"
                    className="mt-8 space-y-6"
                >
                    <InputField
                        label={t('username')}
                        type="text"
                        name="name"
                        value={user.name}
                        onChange={changeUser}
                        placeholder={t('username')}
                    />
                    <InputField
                        label={t('email_address')}
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={changeUser}
                        placeholder={t('email_address')}
                    />
                    <InputField
                        label={t('phone_number')}
                        type="tel"
                        name="phone"
                        value={user.phone}
                        onChange={changeUser}
                        placeholder="+31 6 12345678"
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition duration-300"
                    >
                        {t('save')}
                    </button>
                </form>

                <button
                    onClick={() => setConfirmDelete(true)}
                    className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-md transition duration-300"
                >
                    {t('delete_your_account')}
                </button>

                <div className="mt-6 text-center text-gray-700 dark:text-gray-400">
                    {t('you_are_logged_as')}:{' '}
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                        {auth.user.name}
                    </span>
                </div>
            </div>
            <ConfirmModal
                open={confirmDelete}
                title={t('Delete account')}
                message={t('Are you sure you want to delete your account? This cannot be undone.')}
                confirmText={t('Yes, delete')}
                cancelText={t('Cancel')}
                onConfirm={deleteUser}
                onCancel={() => setConfirmDelete(false)}
            />
        </div>
    );
};

export default Profile;
