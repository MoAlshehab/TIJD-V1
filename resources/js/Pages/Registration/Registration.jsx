import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import Register from '../../Components/Register.jsx';
import Forgot from '../Forgot.jsx';
import { useTranslation } from 'react-i18next';
import InputField from '@/Components/InputField';

// TODO : Ik ga dit rename to login page
export default function Registration() {
    const { errors } = usePage().props;
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [showRegister, setShowRegister] = useState(false);
    const [showForgot, setShowForgot] = useState(false);

    const toggleRegister = () => {
        setShowRegister(!showRegister);
        setShowForgot(false);
    };

    const toggleForgot = () => {
        setShowForgot(!showForgot);
        setShowRegister(false);
    };

    const login = () => {
        router.post('/login', { email, password });
    };

    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-2">
                {!showRegister && !showForgot && (
                    <>
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-6 text-center">
                            {t('login')}
                        </h1>

                        <InputField
                            label={t('email')}
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
                        <button
                            onClick={login}
                            className="w-full bg-primary hover:bg-primaryDark transition duration-200 text-white font-semibold py-3 rounded-md focus:outline-none focus:ring-4 focus:ring-blue-400"
                        >
                            {t('login')}
                        </button>

                        <div className="flex justify-center items-center mt-6 space-x-4 text-sm text-blue-500 dark:text-blue-400">
                            <button
                                onClick={toggleForgot}
                                className="hover:underline focus:outline-none"
                            >
                                {t('forgot_password')}
                            </button>
                            <span className="text-gray-400 dark:text-gray-500">|</span>
                            <button
                                onClick={toggleRegister}
                                className="hover:underline focus:outline-none"
                            >
                                {t('create_an_account')}
                            </button>
                        </div>
                    </>
                )}
            </div>
            {showForgot && <Forgot />}
            {showRegister && <Register />}
        </div>
    );
}
