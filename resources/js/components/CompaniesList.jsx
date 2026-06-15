import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCalendar,
    faTrash,
    faCity,
    faPhone,
    faLocationPin,
    faEnvelope,
    faClipboardList,
    faBookmark,
} from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import LazyLoad from 'react-lazyload';
import { router, usePage } from '@inertiajs/react';
import NavigationButton from '@/components/NavigationButton';
import DropdownToggleButton from '@/components/DropdownToggleButton';
import CompanyCard from './CompanyCard';
import ActionButton from './ActionButton.jsx'; // pas het pad aan indien nodig
import ConfirmModal from '@/Components/ConfirmModal';
import { useToast } from '@/Components/Toast/ToastProvider';
import useConfirmAction from '@/hooks/useConfirmAction';

export default function CompaniesList({ companies, favorites }) {
    const { t } = useTranslation();
    const { auth, companiesCount, company, workdays } = usePage().props;
    const [openDropdowns, setOpenDropdowns] = useState({}); // start met een leeg object
    const { showToast } = useToast();

    const [companyToDelete, setCompanyToDelete] = useState(null);
    const [favoriteAction, setFavoriteAction] = useState(null); // { company, action }

    const confirmFavoriteAction = () => {
        if (!favoriteAction) return;

        const { company, action } = favoriteAction;

        router.post(
            action === 'remove' ? `/favorite/${company.id}` : `/company/${company.id}`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    showToast({
                        message:
                            action === 'remove'
                                ? t('Removed from favorites')
                                : t('Added to favorites'),
                        type: 'success',
                    });
                },
                onError: () => {
                    showToast({
                        message: t('Action failed'),
                        type: 'error',
                    });
                },
            }
        );

        setFavoriteAction(null);
    };

    const toggleDropdown = (id) => {
        setOpenDropdowns((prev) => ({
            ...prev,
            [id]: !prev[id], // toggle de boolean waarde voor deze id
        }));
    };

    const deleteCompany = () => {
        if (!companyToDelete) return;

        router.delete(`/admin/company/${companyToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                showToast({
                    message: t('Company deleted successfully'),
                    type: 'success',
                });
            },
            onError: () => {
                showToast({
                    message: t('Failed to delete company'),
                    type: 'error',
                });
            },
        });

        setCompanyToDelete(null);
    };

    const toggleFavorite = (company) => {
        const isFavorite = favorites.includes(company.id);

        setFavoriteAction({
            company,
            action: isFavorite ? 'remove' : 'add',
        });
    };

    return (
        <div className="bg-light dark:bg-grayDark  text-dark dark:text-dark-text text-left mb-20 transition-colors duration-300">
            {!!auth.user?.is_admin && (
                <p className="text-dark dark:text-dark-text text-center">
                    {companiesCount} Companies
                </p>
            )}

            <LazyLoad>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 p-0">
                    {companies.map((company) => (
                        <div
                            key={company.id}
                            className="bg-light dark:bg-dark-surface p-2 shadow-md rounded-md transition-colors duration-300 w-full max-w-sm mx-auto"
                        >
                            <CompanyCard company={company} />
                            <div className="flex justify-start mt-5">
                                {' '}
                                {/* container die links uitlijnt en margin top geeft */}
                                <button
                                    onClick={() => toggleFavorite(company)}
                                    aria-label="Sla bedrijf op als favoriet"
                                    className={`transition-colors duration-200 text-4xl p-2 rounded-full
      ${
          favorites.includes(company.id)
              ? 'text-primary' // favoriet: blauw
              : 'text-gray-400 hover:text-primary' // anders grijs met hover
      }
    `}
                                >
                                    <FontAwesomeIcon icon={faBookmark} />
                                </button>
                            </div>

                            <div className="mt-4 w-full flex flex-col gap-4">
                                {/* Bekijk bedrijf knop (alleen voor admin) */}
                                {auth.user?.is_admin && (
                                    <ActionButton
                                        onClick={() =>
                                            router.get(`/companies/${company.id}/details`)
                                        }
                                        label={t('View Company')}
                                    />
                                )}

                                {/* Toggle dropdown voor opties */}
                                <div className="w-full">
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

                                {/* Afspraak kalender knop */}
                                <NavigationButton
                                    icon={<FontAwesomeIcon icon={faCalendar} size="lg" />}
                                    label={t('Appointments Calendar')}
                                    bgColor="bg-success"
                                    hoverColor="hover:bg-successDark"
                                    to={`/company/${company.id}/employees-dates-hours?companyId=${company.id}`}
                                />

                                {/* Admin extra knoppen */}
                                {auth.user?.is_admin && (
                                    <div className="flex justify-between gap-4 mt-2">
                                        <button
                                            onClick={() => setCompanyToDelete(company)}
                                            className="text-danger hover:text-red-700 transition"
                                        >
                                            <FontAwesomeIcon icon={faTrash} size="2x" />
                                        </button>

                                        <button
                                            onClick={() =>
                                                router.get(
                                                    `/admin/appointments/company/${company.id}`
                                                )
                                            }
                                            className="text-primary dark:text-accent hover:text-blue-700 transition"
                                        >
                                            <FontAwesomeIcon icon={faClipboardList} size="2x" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    <ConfirmModal
                        open={!!companyToDelete}
                        title={t('Delete company')}
                        message={t('Are you sure you want to delete this company?')}
                        confirmText={t('Yes, delete')}
                        cancelText={t('Cancel')}
                        onConfirm={deleteCompany}
                        onCancel={() => setCompanyToDelete(null)}
                    />

                    <ConfirmModal
                        open={!!favoriteAction}
                        title={
                            favoriteAction?.action === 'remove'
                                ? t('Remove favorite')
                                : t('Add to favorites')
                        }
                        message={
                            favoriteAction?.action === 'remove'
                                ? t('Remove this company from your favorites?')
                                : t('Add this company to your favorites?')
                        }
                        confirmText={t('Confirm')}
                        cancelText={t('Cancel')}
                        onConfirm={confirmFavoriteAction}
                        onCancel={() => setFavoriteAction(null)}
                    />
                </div>
            </LazyLoad>
        </div>
    );
}
