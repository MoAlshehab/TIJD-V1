import React from 'react';
import LazyLoad from 'react-lazyload';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faCity, faLocationPin, faPhone } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

const CompanyCard = ({ company }) => {
    const { t } = useTranslation();
    return (
        <div
            className={`relative bg-light dark:bg-dark-surface p-0 shadow-md rounded-md transition-colors duration-300 w-full max-w-sm mx-auto border-l-4
                ${company.open_close ? 'border-green-500' : 'border-red-500'}`}
        >
            {/* Label Open/Gesloten */}
            <div
                className="absolute top-0 right-0 m-2 text-xs font-semibold px-2 py-1 rounded bg-green-100 text-green-800 dark:bg-green-700 dark:text-white"
                style={{ display: company.open_close ? 'block' : 'none' }}
            >
                {t('Open now')}
            </div>
            <div
                className="absolute top-0 right-0 m-2 text-xs font-semibold px-2 py-1 rounded bg-red-100 text-red-800 dark:bg-red-700 dark:text-white"
                style={{ display: !company.open_close ? 'block' : 'none' }}
            >
                {t('Closed')}
            </div>

            {/* Afbeeldingen */}
            {company.media && company.media.length > 0 ? (
                <div className="flex space-x-2">
                    {company.media.map((media, index) => (
                        <LazyLoad key={index}>
                            <img
                                src={media.original_url || media.url}
                                alt={`Media ${index + 1}`}
                                className="w-full h-40 object-cover rounded-t-md"
                                onError={(e) => {
                                    e.currentTarget.src = '/storage/images/leegbedrijf.jpg';
                                }}
                            />
                        </LazyLoad>
                    ))}
                </div>
            ) : (
                <img
                    src="/storage/images/leegbedrijf.jpg"
                    alt="Company Image"
                    className="w-full h-40 object-cover rounded-t-md"
                />
                            )}

            {/* Naam */}
            <h2 className="text-xl font-semibold dark:text-dark-text mt-2 px-4">{company.name}</h2>

            {/* Soort bedrijf */}
            <p className="text-dark dark:text-dark-text mt-1 px-4">{company.kind}</p>

            {/* Contact en locatie */}
            <div className="mt-2 space-y-1 px-4 pb-4">
                <div className="flex items-center gap-1">
                    <FontAwesomeIcon className="text-primary" icon={faEnvelope} />
                    <a
                        href={`mailto:${company.email}`}
                        target="_blank"
                        className="hover:underline dark:text-light"
                    >
                        {company.email}
                    </a>
                </div>

                <div className="flex items-center gap-1">
                    <FontAwesomeIcon className="text-primary" icon={faCity} />
                    <a
                        href={`https://www.google.com/maps/place/${company.city}`}
                        target="_blank"
                        className="hover:underline dark:text-light"
                    >
                        {company.city}
                    </a>
                </div>

                <div className="flex items-center gap-1">
                    <FontAwesomeIcon className="text-primary" icon={faLocationPin} />
                    <a
                        href={`https://www.google.com/maps/place/${company.address}`}
                        target="_blank"
                        className="hover:underline dark:text-light"
                    >
                        {company.address}
                    </a>
                </div>

                <div className="flex items-center gap-1">
                    <FontAwesomeIcon className="text-primary" icon={faPhone} />
                    <a href={`tel:${company.phone}`} className="hover:underline dark:text-light">
                        {company.phone}
                    </a>
                </div>
            </div>
        </div>
    );
};

export default CompanyCard;
