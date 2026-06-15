import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@inertiajs/react';

export default function NotFound() {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-light dark:bg-dark-background text-dark dark:text-dark-text p-6 text-center">
            <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
            <p className="text-xl mb-6">
                {t('page_not_found') || 'De pagina die je zoekt bestaat niet.'}
            </p>
            <Link
                href="/"
                className="mt-4 px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/80 transition"
            >
                {t('go_home') || 'Ga naar home'}
            </Link>
        </div>
    );
}
