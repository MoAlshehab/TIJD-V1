import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import InputField from '@/Components/InputField';

export default function Registration() {
    const { errors } = usePage().props;
    const { t } = useTranslation();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [isOwner, setIsOwner] = useState(false);

    const register = () => {
        router.post('/register', {
            name,
            email,
            password,
            password_confirmation: passwordConfirmation,
            owner: isOwner ? 1 : 0,
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-light dark:bg-grayDark px-4">
            <div className="w-full max-w-2xl bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 sm:p-10 space-y-6">
                <h1 className="text-4xl font-extrabold text-center text-gray-900 dark:text-white">
                    {t('registration')}
                </h1>

                <div className="space-y-4">
                    <InputField
                        label={t('username')}
                        name="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t('username')}
                        error={errors.name}
                    />

                    <InputField
                        label={t('email_address')}
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t('email_address')}
                        error={errors.email}
                    />

                    <InputField
                        label={t('password')}
                        name="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={t('password')}
                        error={errors.password}
                    />

                    <InputField
                        label={t('password_confirm')}
                        name="password_confirmation"
                        type="password"
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        placeholder={t('password_confirm')}
                        error={errors.password_confirmation}
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="isOwner"
                        checked={isOwner}
                        onChange={(e) => setIsOwner(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="isOwner" className="text-sm text-gray-700 dark:text-gray-300">
                        {t('register_as_owner')}
                    </label>
                </div>

                <button
                    onClick={register}
                    className="w-full bg-primary hover:bg-primaryDark text-white font-bold py-3 rounded-xl shadow transition duration-300"
                >
                    {t('registration')}
                </button>
            </div>
        </div>
    );
}
