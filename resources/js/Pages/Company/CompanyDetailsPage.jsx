import React from 'react';
import { useTranslation } from 'react-i18next';
import { Inertia } from '@inertiajs/inertia';
import { faCity, faEnvelope, faLocationPin, faPhone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function CompanyDetailsPage({ company }) {
    const { t } = useTranslation();

    return (
        <div className="p-6 max-w-xl mx-auto">
            <div className="bg-white dark:bg-dark-surface rounded-lg p-6 shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">{company.name}</h2>
                    <button
                        onClick={() => window.history.back()}
                        className="text-gray-500 hover:text-red-500 font-bold text-lg"
                    >
                        ← {t('back')}
                    </button>
                </div>

                <p className="text-dark dark:text-dark-text mb-2">
                    {t('kind')}: {company.kind}
                </p>
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faEnvelope} className="text-primary" />
                        <a
                            href={`mailto:${company.email}`}
                            className="hover:underline dark:text-light"
                        >
                            {company.email}
                        </a>
                    </div>
                    <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faCity} className="text-primary" />
                        <a
                            href={`https://www.google.com/maps/place/${company.city}`}
                            className="hover:underline dark:text-light"
                        >
                            {company.city}
                        </a>
                    </div>
                    <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faLocationPin} className="text-primary" />
                        <a
                            href={`https://www.google.com/maps/place/${company.address}`}
                            className="hover:underline dark:text-light"
                        >
                            {company.address}
                        </a>
                    </div>
                    <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faPhone} className="text-primary" />
                        <a
                            href={`tel:${company.phone}`}
                            className="hover:underline dark:text-light"
                        >
                            {company.phone}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
