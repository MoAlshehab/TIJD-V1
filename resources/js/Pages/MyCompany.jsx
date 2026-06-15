import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { QRCodeCanvas } from 'qrcode.react';
import ConfirmModal from '@/Components/ConfirmModal';

import {
    faCalendar,
    faTrash,
    faUsers,
    faFileEdit,
    faPlusCircle,
    faPen,
    faBuilding,
    faShareAlt,
    faCalendarDays,
} from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import Company from './Company/Company.jsx';
import ToggleSwitch from '@/Components/ToggleSwitch';
import ActionButton from '@/Components/ActionButton';
import DropdownToggleButton from '@/Components/DropdownToggleButton';
import NavigationButton from '../components/NavigationButton.jsx';
import InputField from '@/components/InputField';
import ImportExportDropdown from '@/components/ImportExportDropdown';
import FooterLink from '@/components/FooterLink.jsx';

export default function MyCompany({ companies }) {
    const { t } = useTranslation();
    const [showForm, setShowForm] = useState(false);
    const [editCompany, setEditCompany] = useState(null);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [companyFormData, setCompanyFormData] = useState({
        name: '',
        email: '',
        address: '',
        city: '',
        zip: '',
        phone: '',
        kind: '',
        photo: null,
    });
    const [appointment, setAppointment] = useState({ date: '', note: '', time: '' });

    const [serviceForm, setServiceForm] = useState(false);
    const [service, setService] = useState({ name: '', price: '', duration: '', description: '' });
    const [editingServiceId, setEditingServiceId] = useState(null);
    const [openDropdowns, setOpenDropdowns] = useState({});
    const [openDropdownsServices, setOpenDropdownsServices] = useState({});
    const [openDropdownsAppointmentssettings, setOpenDropdownsAppointmentssettings] = useState({});
    const [shareLink, setShareLink] = useState('');
    const [showQr, setShowQr] = useState(false);
    const [serviceToDelete, setServiceToDelete] = useState(null);
    const [forceDelete, setForceDelete] = useState(false);
    const deleteService = (service) => {
        setServiceToDelete(service);
        setForceDelete(false);
    };

    const forceDeleteService = (service) => {
        setServiceToDelete(service);
        setForceDelete(true);
    };

    const generateShareLink = (company) => {
        const link = `${window.location.origin}/company/${company.id}/employees-dates-hours?companyId=${company.id}`;
        setShareLink(link);
        setShowQr(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (editCompany) {
            setCompanyFormData({ ...companyFormData, [name]: value });
        } else {
            setAppointment({ ...appointment, [name]: value });
        }
    };
    const toggleDropdownAppointmentssettings = (id) => {
        setOpenDropdownsAppointmentssettings((prev) => ({
            ...prev,
            [id]: !prev[id], // toggle de boolean waarde voor deze id
        }));
    };
    const toggleDropdownServices = (id) => {
        setOpenDropdownsServices((prev) => ({
            ...prev,
            [id]: !prev[id], // toggle de boolean waarde voor deze id
        }));
    };
    const toggleDropdown = (id) => {
        setOpenDropdowns((prev) => ({
            ...prev,
            [id]: !prev[id], // toggle de boolean waarde voor deze id
        }));
    };

    const goToCompanyWorkdays = (company) => {
        router.get(`/owner/company/${company.id}/opening-hours`);
    };

    const openEditForm = (company) => {
        setEditCompany(company);
        setCompanyFormData({ ...company });
        setShowForm(true);
    };

    const openAddServiceForm = (company) => {
        setSelectedCompany(company);
        setServiceForm(true);
        setEditingServiceId(null);
        setService({ name: '', price: '', duration: '', description: '' });
    };

    const editServiceForm = (company, service) => {
        setSelectedCompany(company);
        setServiceForm(true);
        setService(service);
        setEditingServiceId(service.id);
    };

    const closeAddServiceForm = () => {
        setServiceForm(false);
        setSelectedCompany(null);
        setService({ name: '', price: '', duration: '', description: '' });
        setEditingServiceId(null);
    };

    // const updateCompany = () => {
    //     if (!editCompany) return;
    //     router.put(`/owner/company/${editCompany.id}`, { ...companyFormData }, {
    //         onSuccess: () => {
    //             closeForm();
    //         }
    //     });
    // };

    const updateCompany = () => {
        if (!editCompany) return;

        const formData = new FormData();

        formData.append('_method', 'PUT'); // ⭐ HEEL BELANGRIJK

        Object.keys(companyFormData).forEach((key) => {
            if (companyFormData[key] !== null) {
                formData.append(key, companyFormData[key]);
            }
        });

        router.post(`/owner/company/${editCompany.id}`, formData, {
            forceFormData: true,
            onSuccess: () => closeForm(),
        });
    };

    const addAppointment = () => {
        if (!selectedCompany) return;
        router.post(
            `/appointment/${selectedCompany.slug}`,
            { ...appointment },
            {
                onSuccess: () => {
                    closeForm();
                },
            }
        );
    };

    const deleteCompany = (company) => {
        setSelectedCompany(company);
    };
    const confirmDeleteCompany = () => {
        if (!selectedCompany) return;

        router.delete(`/owner/company/${selectedCompany.id}`, {
            preserveScroll: true,
        });

        setSelectedCompany(null);
    };

    const toggleOpenClose = (companyId) => {
        router.post('/companies/' + companyId + '/open_close');
    };

    const showEmployees = (company) => {
        router.get('/owner/company/' + company.id + '/company_employees');
    };

    const closeForm = () => {
        setShowForm(false);
        setEditCompany(null);
        setSelectedCompany(null);
    };

    const saveService = () => {
        if (editingServiceId) {
            router.put(`/owner/services/${editingServiceId}`, service, {
                onSuccess: () => {
                    closeAddServiceForm();
                },
            });
        } else {
            router.post(`/owner/company/${selectedCompany.id}/services`, service, {
                onSuccess: () => {
                    closeAddServiceForm();
                },
            });
        }
    };

    const toggleServiceStatus = (serviceId) => {
        router.patch(`/owner/services/${serviceId}/toggle-status`);
    };

    const confirmDeleteService = () => {
        if (!serviceToDelete) return;

        const url = forceDelete
            ? `/owner/services/${serviceToDelete.id}/force-delete`
            : `/owner/services/${serviceToDelete.id}`;

        router.delete(url, {
            preserveScroll: true,
        });

        setServiceToDelete(null);
        setForceDelete(false);
    };

    function restoreService(id) {
        // Herstel de service
        router.put(`/owner/services/${id}/restore`);
    }

    const toggleAutaccept = (companyId, currentValue) => {
        router.patch(
            `/owner/companies/${companyId}/autaccept`,
            {
                autaccept: currentValue ? 0 : 1,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setCompany((prev) => ({ ...prev, autaccept: currentValue ? 0 : 1 }));
                },
            }
        );
    };

    return (
        <div className="min-h-screen bg-light dark:bg-grayDark text-black dark:text-white mb-8">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 py-5">
                {companies.map((company) => (
                    <div
                        key={company.id}
                        className="bg-white dark:bg-gray-800 p-4 shadow-md rounded-md"
                    >
                        <h2 className="text-xl font-semibold">{company.name}</h2>
                        <ToggleSwitch
                            checked={!!company.open_close}
                            onChange={() => toggleOpenClose(company.id)}
                            labelOn="Open"
                        />

                        <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md max-w-md mx-auto">
                            <section className="mb-6">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                                    {t('employees')}
                                </h3>
                                <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                                    {company.employees.length > 0 ? (
                                        company.employees.map((employee) => (
                                            <li key={employee.id}>{employee.name}</li>
                                        ))
                                    ) : (
                                        <li className="italic text-gray-500 dark:text-gray-500">
                                            {t('no_employees')}
                                        </li>
                                    )}
                                </ul>
                            </section>

                            <section>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                                    {t('company_details')}
                                </h3>
                                <dl className="grid grid-cols-1 gap-y-2 text-gray-700 dark:text-gray-300">
                                    <div className="flex justify-between">
                                        <dt className="font-medium">{t('kind')}:</dt>
                                        <dd>
                                            {company.kind || (
                                                <span className="italic text-gray-500">
                                                    {t('not_specified')}
                                                </span>
                                            )}
                                        </dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="font-medium">{t('email_address')}:</dt>
                                        <dd>
                                            {company.email || (
                                                <span className="italic text-gray-500">
                                                    {t('not_specified')}
                                                </span>
                                            )}
                                        </dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="font-medium">{t('zip')}:</dt>
                                        <dd>
                                            {company.zip || (
                                                <span className="italic text-gray-500">
                                                    {t('not_specified')}
                                                </span>
                                            )}
                                        </dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="font-medium">{t('address')}:</dt>
                                        <dd>
                                            {company.address || (
                                                <span className="italic text-gray-500">
                                                    {t('not_specified')}
                                                </span>
                                            )}
                                        </dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="font-medium">{t('city')}:</dt>
                                        <dd>
                                            {company.city || (
                                                <span className="italic text-gray-500">
                                                    {t('not_specified')}
                                                </span>
                                            )}
                                        </dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="font-medium">{t('phone_number')}:</dt>
                                        <dd>
                                            {company.phone || (
                                                <span className="italic text-gray-500">
                                                    {t('not_specified')}
                                                </span>
                                            )}
                                        </dd>
                                    </div>
                                </dl>
                            </section>
                        </div>
                        <ActionButton
                            onClick={() => generateShareLink(company)}
                            icon={<FontAwesomeIcon icon={faShareAlt} />}
                            label={t('Share appointment link')}
                        />
                        <div key={company.id} className="mt-3">
                            <DropdownToggleButton
                                isOpen={openDropdownsAppointmentssettings[company.id] || false}
                                onClick={() => toggleDropdownAppointmentssettings(company.id)}
                                label={t('appointments_settings')}
                            />
                            {openDropdownsAppointmentssettings[company.id] && (
                                <div className="flex flex-col gap-4 mt-5">
                                    <div className="flex justify-between items-center">
                                        <label
                                            htmlFor={`autaccept-${company.id}`}
                                            className="text-sm text-gray-700 dark:text-gray-300"
                                        >
                                            {t('auto_accept_appointments')}
                                        </label>
                                        <ToggleSwitch
                                            checked={company.autaccept === 1}
                                            onChange={() =>
                                                toggleAutaccept(company.id, company.autaccept)
                                            }
                                            labelOn={t('on')}
                                        />
                                    </div>
                                    <a
                                        href={`/owner/company/${company.id}/appointments/export?format=xlsx`}
                                        className="w-full flex items-center justify-between px-5 py-3 rounded-xl bg-success text-light hover:bg-successDark transition shadow-md"
                                        download
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">📥</span>
                                            <span className="font-semibold text-lg">
                                                {t('Download as Excel (.xlsx)')}
                                            </span>
                                        </div>
                                        <span className="text-green-100 text-sm">&rarr;</span>
                                    </a>

                                    <a
                                        href={`/owner/company/${company.id}/appointments/export?format=csv`}
                                        className="w-full flex items-center justify-between px-5 py-3 rounded-xl bg-primary text-light hover:bg-blue-700 transition shadow-md"
                                        download
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">📥</span>
                                            <span className="font-semibold text-lg">
                                                {t('Download as CSV a (.csv)')}
                                            </span>
                                        </div>
                                        <span className="text-blue-100 text-sm">&rarr;</span>
                                    </a>

                                    <a
                                        href={`/owner/company/${company.id}/appointments/exportToMove?format=csv`}
                                        className="w-full flex items-center justify-between px-5 py-3 rounded-xl bg-primary text-light hover:bg-blue-700 transition shadow-md"
                                        download
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">📥</span>
                                            <span className="font-semibold text-lg">
                                                {t('Download as CSV To Move (.csv)')}
                                            </span>
                                        </div>
                                        <span className="text-blue-100 text-sm">&rarr;</span>
                                    </a>
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <ImportExportDropdown companyId={company.id} t={t} />
                                    </div>
                                </div>
                            )}

                            <DropdownToggleButton
                                isOpen={openDropdownsServices[company.id] || false}
                                onClick={() => toggleDropdownServices(company.id)}
                                label={t('services')}
                            />

                            {openDropdownsServices[company.id] && (
                                <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 max-w-md mx-auto">
                                    <div className="flex items-center justify-between mb-4">
                                        <ActionButton
                                            onClick={() => openAddServiceForm(company)}
                                            icon={<FontAwesomeIcon icon={faPlusCircle} />}
                                            label={t('Add service')}
                                        />
                                    </div>

                                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {company.services.map((s) => (
                                            <li
                                                key={s.id}
                                                className="flex justify-between items-center py-3"
                                            >
                                                <div>
                                                    <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                                        {s.name}
                                                    </p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        €{parseFloat(s.price).toFixed(2)} -{' '}
                                                        {s.duration} {t('minutes')}
                                                    </p>
                                                    <p className="text-sm italic text-gray-500 dark:text-gray-400">
                                                        {s.description}
                                                    </p>
                                                </div>
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() => editServiceForm(company, s)}
                                                        className="p-2 rounded hover:bg-blue-100 dark:hover:bg-blue-700 text-blue-600 dark:text-blue-300 transition"
                                                        aria-label={t('edit_service')}
                                                        title={t('edit_service')}
                                                    >
                                                        <FontAwesomeIcon icon={faPen} size="lg" />
                                                    </button>
                                                    {/*<button*/}
                                                    {/*    onClick={() => deleteService(s.id)}*/}
                                                    {/*    className="p-2 rounded hover:bg-red-100 dark:hover:bg-red-700 text-red-600 dark:text-red-300 transition"*/}
                                                    {/*    aria-label={t("delete_service")}*/}
                                                    {/*    title={t("delete_service")}*/}
                                                    {/*>*/}
                                                    {/*    <FontAwesomeIcon icon={faTrash} size="lg" />*/}
                                                    {/*</button>*/}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        <div className="mt-2">
                            {/* Toggle button */}
                            <DropdownToggleButton
                                isOpen={openDropdowns[company.id]}
                                onClick={() => toggleDropdown(company.id)}
                                label={t('Options')}
                            />
                            {showQr && (
                                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
                                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg relative max-w-sm w-full text-center">
                                        <button
                                            onClick={() => setShowQr(false)}
                                            className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-lg"
                                        >
                                            &times;
                                        </button>

                                        <h3 className="text-xl font-semibold mb-4">
                                            {t('Share appointment link')}
                                        </h3>

                                        <QRCodeCanvas
                                            value={shareLink}
                                            size={180}
                                            className="mx-auto mb-4"
                                        />

                                        <div className="flex flex-col gap-2">
                                            {/* Kopieer knop */}
                                            <button
                                                onClick={() =>
                                                    navigator.clipboard.writeText(shareLink)
                                                }
                                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                                            >
                                                {t('Copy link')}
                                            </button>

                                            {/* Share knop */}
                                            {navigator.share && (
                                                <button
                                                    onClick={() =>
                                                        navigator.share({
                                                            title:
                                                                t('Book appointment at') +
                                                                ' ' +
                                                                company.name,
                                                            text: t(
                                                                'Schedule your appointment easily'
                                                            ),
                                                            url: shareLink,
                                                        })
                                                    }
                                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
                                                >
                                                    {t('Share link')}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Alleen zichtbaar als open */}
                            {openDropdowns[company.id] && (
                                <div className="flex flex-col gap-3 w-full mt-4 animate-fadeIn">
                                    <NavigationButton
                                        icon={<FontAwesomeIcon icon={faCalendar} size="lg" />}
                                        label={t('Appointments Calendar')}
                                        to={`/company/${company.id}/employees-dates-hours?companyId=${company.id}`}
                                    />
                                    <ActionButton
                                        onClick={() => openEditForm(company)}
                                        icon={<FontAwesomeIcon icon={faFileEdit} />}
                                        label={t('Edit company')}
                                    />
                                    <ActionButton
                                        onClick={() => showEmployees(company)}
                                        icon={<FontAwesomeIcon icon={faUsers} />}
                                        label={t('Show employees')}
                                    />
                                    <ActionButton
                                        onClick={() => goToCompanyWorkdays(company)}
                                        icon={<FontAwesomeIcon icon={faBuilding} />}
                                        label={t('Set company hours')}
                                    />
                                    <NavigationButton
                                        icon={<FontAwesomeIcon icon={faCalendarDays} size="lg" />}
                                        label={t('Closed days')}
                                        to={`/owner/company/${company.id}/closed-days`}
                                    />

                                    <ActionButton
                                        onClick={() => deleteCompany(company)}
                                        icon={<FontAwesomeIcon icon={faTrash} />}
                                        label={t('Delete company')}
                                        bgColor="bg-red-100"
                                        hoverColor="hover:bg-danger"
                                        textColor="text-red-800"
                                    />

                                    <ConfirmModal
                                        open={!!selectedCompany}
                                        title={t('Delete company')}
                                        message={t('Are you sure you want to delete')}
                                        confirmText={t('Yes, delete')}
                                        cancelText={t('Cancel')}
                                        onConfirm={confirmDeleteCompany} // ✅ HIER
                                        onCancel={() => setSelectedCompany(null)}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {serviceForm && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
                    <div
                        className={`w-full max-w-md rounded-lg shadow-lg p-6 relative overflow-y-auto max-h-[90vh] ${
                            service.deleted_at ? 'bg-red-100 border border-red-400' : 'bg-white'
                        }`}
                    >
                        <button
                            onClick={closeAddServiceForm}
                            className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-lg"
                            aria-label="Close"
                        >
                            &times;
                        </button>

                        <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">
                            {editingServiceId ? t('edit_service') : t('add_service')}
                        </h3>

                        {service.deleted_at && (
                            <p className="text-center text-red-600 font-medium mb-2">
                                Deze service is verwijderd
                            </p>
                        )}

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                saveService();
                            }}
                            className="space-y-4"
                        >
                            x
                            <InputField
                                label="Service naam"
                                name="name"
                                value={service.name}
                                onChange={(e) => setService({ ...service, name: e.target.value })}
                                placeholder="Service naam"
                                required
                            />
                            <InputField
                                label="Prijs (€)"
                                name="price"
                                type="number"
                                value={service.price}
                                onChange={(e) => setService({ ...service, price: e.target.value })}
                                placeholder="Prijs (€)"
                                required
                                className="appearance-none"
                                min="0"
                                step="0.01"
                            />
                            <InputField
                                label="Duur (minuten)"
                                name="duration"
                                type="number"
                                value={service.duration}
                                onChange={(e) =>
                                    setService({ ...service, duration: e.target.value })
                                }
                                placeholder="Duur (minuten)"
                                required
                                min="1"
                            />
                            <InputField
                                label="Beschrijving"
                                name="description"
                                value={service.description ?? ''}
                                onChange={(e) =>
                                    setService({ ...service, description: e.target.value })
                                }
                                placeholder="Service beschrijving"
                                required
                            />
                            <div className="flex items-center ml-auto space-x-2">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={!!service.status}
                                        onChange={() => toggleServiceStatus(service.id)}
                                    />
                                    <div
                                        className={`w-10 h-6 flex items-center rounded-full p-1 duration-300 ${service.status ? 'bg-green-500' : 'bg-gray-400'}`}
                                    >
                                        <div
                                            className={`w-4 h-4 bg-white rounded-full shadow-md transform duration-300 ${service.status ? 'translate-x-4' : 'translate-x-0'}`}
                                        ></div>
                                    </div>
                                </label>
                                <span
                                    className={`text-sm font-medium ${service.status ? 'text-green-500' : 'text-gray-500'}`}
                                >
                                    {service.status ? 'Actief' : 'Inactief'}
                                </span>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-primary hover:bg-success text-white font-semibold py-2 rounded transition-all"
                            >
                                {editingServiceId ? t('update') : t('add')}
                            </button>
                        </form>

                        {editingServiceId && (
                            <div className="mt-4 flex justify-between gap-2">
                                {service.deleted_at ? (
                                    <button
                                        onClick={() => restoreService(service.id)}
                                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded transition-all"
                                    >
                                        Herstellen
                                    </button>
                                ) : (
                                    // <button
                                    //     onClick={() => deleteService(service.id)}
                                    //     className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded transition-all"
                                    // >
                                    //     Verwijderen
                                    // </button>
                                    //
                                    <button
                                        onClick={() => forceDeleteService(service)}
                                        className="flex-1 bg-red-700 hover:bg-red-800 text-white py-2 rounded"
                                    >
                                        Permanent Verwijderen
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {showForm && editCompany && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-md w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <button onClick={closeForm} className="mb-4 text-blue-600">
                            ← {t('back')}
                        </button>

                        <h2 className="text-xl font-semibold mb-6">{t('edit_company')}</h2>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                updateCompany();
                            }}
                            className="space-y-4"
                        >
                            {['name', 'email', 'address', 'city', 'zip', 'phone', 'kind'].map(
                                (field) => (
                                    <div key={field}>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {t(field)}
                                        </label>

                                        <input
                                            name={field}
                                            value={companyFormData[field] || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border rounded-md text-gray-950"
                                        />
                                    </div>
                                )
                            )}

                            {/* FOTO */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('company_photo')}
                                </label>

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        setCompanyFormData({
                                            ...companyFormData,
                                            photo: e.target.files[0],
                                        })
                                    }
                                    className="w-full border rounded-md px-3 py-2"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2 rounded"
                            >
                                {t('save')}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmModal
                open={!!serviceToDelete}
                title={forceDelete ? t('Permanent delete service') : t('Delete service')}
                message={
                    forceDelete
                        ? t('This action cannot be undone. Are you sure?')
                        : t('Are you sure you want to delete this service?')
                }
                confirmText={forceDelete ? t('Yes, permanently delete') : t('Yes, delete')}
                cancelText={t('Cancel')}
                onConfirm={confirmDeleteService}
                onCancel={() => {
                    setServiceToDelete(null);
                    setForceDelete(false);
                }}
            />
        </div>
    );
}
