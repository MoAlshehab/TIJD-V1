import React from 'react';
import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { route } from 'ziggy-js';

const GetStarted = () => {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen flex items-center justify-center bg-light dark:bg-grayDark px-4">
            <div className="max-w-lg text-center">
                {/* Logo */}
                <Link href="/company/home" className="flex justify-center mb-0 group">
                    <img
                        src="/storage/images/tijd-logo.png"
                        alt="Tijd Logo"
                        className="w-96 max-w-full h-auto transition-all duration-300 ease-in-out
                   group-hover:scale-105 group-hover:opacity-90"
                    />
                </Link>

                <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-6">
                    {t('welcome_to_app')}
                </h1>

                <p className="text-gray-700 dark:text-gray-300 text-lg sm:text-xl mb-10">
                    {t('get_started_description')}
                </p>

                <Link
                    href={route('registration')}
                    className="inline-block bg-primary hover:bg-primaryDark focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800
                               text-white font-semibold py-3 px-8 rounded-lg transition duration-300"
                    aria-label={t('get_started_aria')}
                >
                    {/*<span className="text-white tracking-widest">{t('app_name')}</span>*/}
                    <span className="text-white tracking-widest">{t('start')}</span>
                </Link>
            </div>
        </div>
    );
};

export default GetStarted;
