import React from 'react';
import { Link, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import InputField from '@/Components/InputField';

export default function ForgotPassword() {
    const { t } = useTranslation();

    const { data, setData, post, processing, errors, status } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/forgot-password');
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
                <h3 className="text-3xl font-semibold text-center text-gray-900 dark:text-gray-100 mb-6">
                    {t('reset_password')}
                </h3>

                {status && (
                    <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 text-sm p-3 rounded mb-4 text-center">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} noValidate>
                    <InputField
                        label={t('email')}
                        name="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder={t('email_address')}
                        error={errors.email}
                    />

                    <button
                        type="submit"
                        disabled={processing}
                        className={`w-full py-3 rounded-md text-white font-semibold transition duration-200 ${
                            processing
                                ? 'bg-blue-300 cursor-not-allowed'
                                : 'bg-primary hover:bg-primaryDark'
                        }`}
                    >
                        {t('send')}
                    </button>
                </form>
            </div>
        </div>
    );
}
