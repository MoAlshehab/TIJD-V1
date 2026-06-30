import React, { useState, useRef, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import LanguageDropdown from './General/LanguageDropdown.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBars,
    faUser,
    faSignOut,
    faGear,
    faBuilding,
    faHeart,
    faCalendar,
    faHome,
    faPlus,
} from '@fortawesome/free-solid-svg-icons';
import BackButton from '../Components/BackButton.jsx';

function Navbar() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
    const [isOwnerDropdownOpen, setIsOwnerDropdownOpen] = useState(false);

    const [isEmployeeDropdownOpen, setIsEmployeeDropdownOpen] = useState(false);
    const { t } = useTranslation();
    const adminDropdownRef = useRef(null);
    const ownerDropdownRef = useRef(null);

    const employeeDropdownRef = useRef(null);
    const { auth, url } = usePage().props;

    const logout = () => {
        router.post('/logout', {}, { onSuccess: () => location.reload() });
    };

    const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);
    const handleDrawerLinkClick = () => setIsDrawerOpen(false);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (adminDropdownRef.current && !adminDropdownRef.current.contains(event.target)) {
                setIsAdminDropdownOpen(false);
            }
            if (
                employeeDropdownRef.current &&
                !employeeDropdownRef.current.contains(event.target)
            ) {
                setIsEmployeeDropdownOpen(false);
            }
            if (ownerDropdownRef.current && !ownerDropdownRef.current.contains(event.target)) {
                setIsOwnerDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const DrawerLink = ({ href, icon, label, onClick }) => {
        const isActive = url === href;

        return (
            <Link
                href={href}
                onClick={onClick}
                className={`text-white dark:text-gray-100 flex items-center transition
                ${isActive ? 'text-blue-300 ' : 'hover:text-primary dark:hover:text-primary'}`}
            >
                {icon && <FontAwesomeIcon icon={icon} className="mr-2" />} {label}
            </Link>
        );
    };

    const DropdownLink = ({ href, children }) => (
        <Link
            href={href}
            className="block px-4 py-3 bg-gray-900  hover:text-primary dark:text-gray-100 dark:hover:text-primary transition"
        >
            {children}
        </Link>
    );

    return (
        <nav className="bg-gray-900 shadow-md fixed top-0 left-0 w-full z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <BackButton />
                </div>
                <div className="hidden md:flex space-x-4 items-center text-white ">
                    <DrawerLink href="/company/home" icon={faHome} label={t('home')} />
                    {!!auth.user?.owner && (
                        <DrawerLink
                            href="/owner/mycompany"
                            icon={faBuilding}
                            label={t('my_company')}
                        />
                    )}
                    {!!auth.user && (
                        <>
                            <DrawerLink
                                href="/myappointments"
                                icon={faCalendar}
                                label={t('my_appointments')}
                            />
                            <DrawerLink
                                href="/company/favorites"
                                icon={faHeart}
                                label={t('favorites')}
                            />
                            <DrawerLink href="/settings" icon={faGear} label={t('settings')} />
                        </>
                    )}

                    {/*<Link href="/woocommerce/products/create" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">*/}
                    {/*    Nieuw product toevoegen*/}
                    {/*</Link>*/}

                    {/*<a href="/woocommerce/products" className="text-white underline dark:text-gray-200 hover:text-blue-200">*/}
                    {/*    Bekijk WooCommerce-producten*/}
                    {/*</a>*/}

                    {/*{(auth.user.owner || auth.user.company_id) && (*/}
                    {/*    <>*/}

                    {/*        <DrawerLink href="/company-appointments" icon={faCalendar} label={t('company_appointments')} onClick={handleDrawerLinkClick} />*/}
                    {/*        <DrawerLink href="/new-company-appointments" icon={faCalendar} label={t('new_appointments')} onClick={handleDrawerLinkClick} />*/}

                    {/*    </>*/}
                    {/*)}*/}

                    {auth.user?.company_id && (
                        <div className="relative" ref={employeeDropdownRef}>
                            <button
                                onClick={() => setIsEmployeeDropdownOpen((prev) => !prev)}
                                className="flex items-center space-x-1 text-white hover:text-primary focus:outline-none"
                            >
                                <FontAwesomeIcon icon={faUser} />
                                <span>{t('employee_dashboard')}</span>
                                <span className="ml-1">▾</span>
                            </button>
                            {isEmployeeDropdownOpen && (
                                <div className="absolute left-0 mt-1 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl z-50 overflow-hidden">
                                    <DropdownLink
                                        href={`/employee-dashboard/${auth.user.company_id}`}
                                    >
                                        {t('dashboard')}
                                    </DropdownLink>
                                    <DropdownLink href="/employee/appointments">
                                        {t('my_appointments')}
                                    </DropdownLink>
                                    <DropdownLink href="/my-schedule">
                                        {t('my-schedule')}
                                    </DropdownLink>
                                </div>
                            )}
                        </div>
                    )}
                    {auth.user?.owner && (
                        <div className="relative" ref={ownerDropdownRef}>
                            <button
                                onClick={() => setIsOwnerDropdownOpen((prev) => !prev)}
                                className="flex items-center space-x-2 text-white hover:text-primary focus:outline-none"
                            >
                                <FontAwesomeIcon icon={faGear} />
                                <span>{t('owner')}</span>
                                <span className="ml-1">▾</span>
                            </button>

                            {isOwnerDropdownOpen && (
                                <div className="absolute left-0 mt-1 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl z-50 overflow-hidden">
                                    <DropdownLink href="/company/new_company">
                                        <FontAwesomeIcon icon={faPlus} className="mr-2" />
                                        {t('aad_company')}
                                    </DropdownLink>
                                </div>
                            )}
                        </div>
                    )}

                    {auth.user?.is_admin && (
                        <div className="relative" ref={adminDropdownRef}>
                            <button
                                onClick={() => setIsAdminDropdownOpen((prev) => !prev)}
                                className="flex items-center  space-x-1 text-white  hover:text-danger focus:outline-none"
                            >
                                <FontAwesomeIcon icon={faGear} />
                                <span>Admin</span>
                                <span className="ml-1">▾</span>
                            </button>
                            {isAdminDropdownOpen && (
                                <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl z-50 overflow-hidden">
                                    <DropdownLink href="/admin/appointments">
                                        {t('appointments')}
                                    </DropdownLink>
                                    <DropdownLink href="/admin/users">{t('users')}</DropdownLink>
                                    <DropdownLink href="/admin/companies/archive">
                                        {t('archive')}
                                    </DropdownLink>
                                </div>
                            )}
                        </div>
                    )}

                    {!!auth.user && (
                        <button onClick={logout} className="text-white hover:text-danger">
                            <FontAwesomeIcon icon={faSignOut} size="2x" />
                        </button>
                    )}
                    <LanguageDropdown />
                </div>

                <div className="md:hidden">
                    <button
                        onClick={toggleDrawer}
                        className="text-white dark:text-gray-100 hover:text-blue-300"
                    >
                        {!isDrawerOpen && <FontAwesomeIcon icon={faBars} size="2x" />}
                    </button>
                </div>
            </div>

            {isDrawerOpen && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={toggleDrawer}>
                    <div
                        className="fixed inset-y-0 left-0 w-72 bg-gray-900 text-white p-6 transform transition-transform duration-300 ease-in-out overflow-y-auto shadow-xl z-50"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex flex-col space-y-6 mt-14">
                            <DrawerLink
                                href="/company/home"
                                label={t('Tijd')}
                                onClick={handleDrawerLinkClick}
                            />

                            <hr className="border-gray-700" />

                            {auth.user?.company_id && (
                                <>
                                    <DrawerLink
                                        href={`/employee-dashboard/${auth.user.company_id}`}
                                        label={t('employee_dashboard')}
                                        onClick={handleDrawerLinkClick}
                                    />
                                    <DrawerLink
                                        href="/employee/appointments"
                                        label={t('appointments')}
                                        onClick={handleDrawerLinkClick}
                                    />
                                    <DrawerLink
                                        href="/my-schedule"
                                        label={t('my-schedule')}
                                        onClick={handleDrawerLinkClick}
                                    />
                                    <DrawerLink
                                        href="/myappointments"
                                        label={t('my_appointments')}
                                        onClick={handleDrawerLinkClick}
                                    />

                                    <hr className="border-gray-700" />
                                </>
                            )}

                            {!!auth.user?.owner && (
                                <>
                                    <DrawerLink
                                        href="/owner/mycompany"
                                        icon={faBuilding}
                                        label={t('my_company')}
                                        onClick={handleDrawerLinkClick}
                                    />
                                    <DrawerLink
                                        href="/myappointments"
                                        icon={faCalendar}
                                        label={t('my_appointments')}
                                        onClick={handleDrawerLinkClick}
                                    />
                                    <DrawerLink
                                        href="/company/favorites"
                                        icon={faHeart}
                                        label={t('favorites')}
                                        onClick={handleDrawerLinkClick}
                                    />
                                    <DrawerLink
                                        href="/company/new_company"
                                        icon={faPlus}
                                        label={t('aad_company')}
                                        onClick={handleDrawerLinkClick}
                                    />

                                    <hr className="border-gray-700" />
                                </>
                            )}

                            {!!auth.user && (
                                <>
                                    <DrawerLink
                                        href="/profile"
                                        icon={faUser}
                                        label={t('profile')}
                                        onClick={handleDrawerLinkClick}
                                    />
                                    <DrawerLink
                                        href="/settings"
                                        icon={faGear}
                                        label={t('settings')}
                                        onClick={handleDrawerLinkClick}
                                    />
                                </>
                            )}

                            <DrawerLink
                                href="/about"
                                label={t('About')}
                                onClick={handleDrawerLinkClick}
                            />
                            <LanguageDropdown />
                            {!!auth.user?.is_admin && (
                                <>
                                    <hr className="border-gray-700" />
                                    <DrawerLink
                                        href="/admin/appointments"
                                        label={t('appointments')}
                                        onClick={handleDrawerLinkClick}
                                    />
                                    <DrawerLink
                                        href="/admin/users"
                                        label={t('users')}
                                        onClick={handleDrawerLinkClick}
                                    />
                                </>
                            )}

                            {!!auth.user && (
                                <button
                                    onClick={() => {
                                        logout();
                                        handleDrawerLinkClick();
                                    }}
                                    className="text-red-500 hover:text-red-300 text-left"
                                >
                                    <FontAwesomeIcon icon={faSignOut} className="mr-2" />{' '}
                                    {t('logout')}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
