import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCalendar,
    faCity,
    faPhone,
    faLocationPin,
    faEnvelope,
    faBookmark,
} from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import NavigationButton from '@/components/NavigationButton';
import DropdownToggleButton from '@/components/DropdownToggleButton';
import useConfirmAction from '@/hooks/useConfirmAction';
import { useToast } from '@/Components/Toast/ToastProvider';
import ConfirmModal from '@/Components/ConfirmModal';

export default function FavoriteCompanies({ myfavorites }) {
    const { t } = useTranslation();
    const { auth } = usePage().props;
    const [openDropdowns, setOpenDropdowns] = useState({});

    const { showToast } = useToast();

    const { action, openConfirm, confirm, cancel } = useConfirmAction({ t, showToast });

    const toggleDropdown = (id) => {
        setOpenDropdowns((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const navigateToEmployeeList = (company) => {
        router.get(`/company/${company.id}/employees-dates-hours?companyId=${company.id}`);
    };

    const toggleFavorite = (company) => {
        if (confirm('Weet je zeker dat je dit bedrijf uit je favorieten wilt verwijderen?')) {
            router.post('/favorite/' + company.id);
        }
    };

    return (
        <div className="bg-light dark:bg-grayDark text-dark dark:text-dark-text text-left mb-20 transition-colors duration-300">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 p-4">
                {myfavorites.map((favorite) => {
                    const company = favorite.company;
                    if (!company) return null;

                    return (
                        <div
                            key={company.id}
                            className="bg-light dark:bg-dark-surface p-4 shadow-md rounded-md transition-colors duration-300 w-full max-w-sm mx-auto"
                        >
                            <div className="flex items-center justify-between mt-2">
                                <h2 className="text-xl font-semibold dark:text-dark-text">
                                    {company.name}
                                </h2>

                                <button
                                    onClick={() =>
                                        openConfirm({
                                            url: `/favorite/${company.id}`,
                                            method: 'post',
                                            successMessage: t('Removed from favorites'),
                                            errorMessage: t('Failed to remove favorite'),
                                        })
                                    }
                                    className="text-primary"
                                >
                                    <FontAwesomeIcon icon={faBookmark} />
                                </button>
                            </div>

                            <p className="text-dark dark:text-dark-text">
                                {t('kind')}: {company.kind}
                            </p>

                            <div className="mt-2 space-y-1">
                                <div className="flex items-center gap-1">
                                    <FontAwesomeIcon className="text-primary" icon={faEnvelope} />
                                    <a
                                        href={`mailto:${company.email}`}
                                        className="hover:underline dark:text-light"
                                    >
                                        {company.email}
                                    </a>
                                </div>

                                <div className="flex items-center gap-1">
                                    <FontAwesomeIcon className="text-primary" icon={faCity} />
                                    <a
                                        href={`https://www.google.com/maps/place/${company.city}`}
                                        className="hover:underline dark:text-light"
                                        target="_blank"
                                    >
                                        {company.city}
                                    </a>
                                </div>

                                <div className="flex items-center gap-1">
                                    <FontAwesomeIcon
                                        className="text-primary"
                                        icon={faLocationPin}
                                    />
                                    <a
                                        href={`https://www.google.com/maps/place/${company.address}`}
                                        className="hover:underline dark:text-light"
                                        target="_blank"
                                    >
                                        {company.address}
                                    </a>
                                </div>

                                <div className="flex items-center gap-1">
                                    <FontAwesomeIcon className="text-primary" icon={faPhone} />
                                    <a
                                        href={`tel:${company.phone}`}
                                        className="hover:underline dark:text-light"
                                    >
                                        {company.phone}
                                    </a>
                                </div>
                            </div>

                            <div className="w-full mt-4">
                                <DropdownToggleButton
                                    isOpen={openDropdowns[company.id]}
                                    onClick={() => toggleDropdown(company.id)}
                                    label={t('Options')}
                                />

                                {openDropdowns[company.id] && (
                                    <div className="flex flex-col gap-3 w-full mt-3 animate-fadeIn">
                                        <NavigationButton
                                            to={`/companies/${company.id}/workdays`}
                                            icon="📅"
                                            label={t('Workdays')}
                                        />

                                        <NavigationButton
                                            to={`/companies/${company.id}/services`}
                                            icon="💈"
                                            label={t('Services')}
                                        />

                                        <NavigationButton
                                            to={`/companies/${company.id}/employees`}
                                            icon="👥"
                                            label={t('Employees')}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="mt-4">
                                {/* Afspraak kalender knop */}
                                <NavigationButton
                                    icon={<FontAwesomeIcon icon={faCalendar} size="lg" />}
                                    label={t('Appointments Calendar')}
                                    to={`/company/${company.id}/employees-dates-hours?companyId=${company.id}`}
                                    bgColor="bg-success"
                                    hoverColor="hover:bg-successDark"
                                />
                            </div>
                        </div>
                    );
                })}
                <ConfirmModal
                    open={!!action}
                    title={t('Remove favorite')}
                    message={t('Are you sure you want to remove this company from your favorites?')}
                    confirmText={t('Yes, remove')}
                    cancelText={t('Cancel')}
                    onConfirm={confirm}
                    onCancel={cancel}
                />
            </div>
        </div>
    );
}
