import React from 'react';
import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

const About = () => {
    const { t } = useTranslation();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 px-4">
            <div className="bg-white dark:bg-gray-900 p-10 rounded-2xl max-w-2xl w-full shadow-2xl">
                <h2 className="text-4xl font-extrabold mb-6 text-gray-900 dark:text-white text-center">
                    {t('about_title')}
                </h2>

                <p className="text-lg text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                    {t('about_description_1')}
                </p>

                <p className="text-lg text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                    {t('about_description_2')}
                </p>

                <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                    {t('about_description_3')}
                </p>

                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center mb-6">
                    <p className="font-semibold text-gray-800 dark:text-gray-200">
                        {t('built_by_mmcode')}
                    </p>
                </div>

                <div className="text-center">
                    <Link
                        href="/company/home"
                        className="inline-block bg-primary hover:bg-primaryDark text-white font-semibold py-3 px-8 rounded-lg transition"
                    >
                        {t('close')}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default About;
