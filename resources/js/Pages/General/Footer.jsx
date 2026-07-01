import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';
import {
    faHome,
    faCalendar,
    faHeart,
    faBuilding,
    faBookmark,
} from '@fortawesome/free-solid-svg-icons';
import FooterLink from '../../Components/FooterLink.jsx';

function Footer() {
    const { companies, auth, pendingAppointmentsCount, appointmentsCount } = usePage().props;

    const { t } = useTranslation();
    console.log('pendingAppointmentsCount:', pendingAppointmentsCount);

    return (
        <footer className="bg-gray-800 dark:bg-gray-900 text-white dark:text-gray-200 py-2 fixed bottom-0 left-0 w-full border-t border-gray-700 dark:border-gray-700">
            <div className="container mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center h-full">
                    {/* Mobile footer met 3 links */}
                    {!!auth.user && (
                        <div className="md:hidden text-center flex justify-evenly w-full">
                            <div className="flex space-x-6 w-full justify-evenly">
                                {!!auth.user && !auth.user.owner && !auth.user.company_id && (
                                    <FooterLink
                                        href="/company/home"
                                        icon={faHome}
                                        label={t('home')}
                                    />
                                )}

                                {!!auth.user && !auth.user.owner && !auth.user.company_id && (
                                    <FooterLink
                                        href="/myappointments"
                                        icon={faCalendar}
                                        label={t('appointments')}
                                    />
                                )}

                                {!!auth.user && (
                                    <>
                                        <FooterLink
                                            href="/company/favorites"
                                            icon={faBookmark}
                                            label={t('favorites')}
                                        />
                                    </>
                                )}

                                {auth.user?.owner && (
                                    <>
                                        <FooterLink
                                            href="/owner/mycompany"
                                            icon={faBuilding}
                                            label={t('my_company')}
                                        />
                                    </>
                                )}

                                {(auth.user.owner || auth.user.company_id) && (
                                    <>
                                        {(auth.user.owner || auth.user.company_id) && (
                                            <>
                                                <FooterLink
                                                    href="/company-appointments"
                                                    icon={faCalendar}
                                                    label={t('appointments')}
                                                    badge={
                                                        appointmentsCount > 0
                                                            ? appointmentsCount
                                                            : '0'
                                                    }
                                                />

                                                <FooterLink
                                                    href="/new-company-appointments"
                                                    icon={faCalendar}
                                                    label={t('new_appointments')}
                                                    badge={
                                                        pendingAppointmentsCount > 0
                                                            ? pendingAppointmentsCount
                                                            : '0'
                                                    }
                                                />
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Desktop footer */}
                    <div className="hidden md:flex justify-between items-center w-full px-4 text-gray-300 dark:text-gray-400">
                        <div className="text-sm select-none">
                            &copy; {new Date().getFullYear()} MMCODE. {t('all_rights_reserved')}
                        </div>
                        <div className="flex space-x-4">
                            <a
                                href="#"
                                className="hover:text-blue-500 dark:hover:text-blue-400 text-sm select-none"
                            >
                                {t('privacy_policy')}
                            </a>
                            <Link
                                href="/about"
                                className="hover:text-blue-300 dark:hover:text-blue-400 text-sm select-none"
                            >
                                {t('About')}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
