import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { router } from '@inertiajs/react';
import React, { useState } from 'react';
import FilterDropdown from '@/Components/FilterDropdown';

export default function NewCompanyAppointments({ companyappointments }) {
    const { t } = useTranslation();
    const [deletingId, setDeletingId] = useState(null);
    const [deleteReason, setDeleteReason] = useState('');
    const [filterType, setFilterType] = useState('all');

    const acceptAppointment = (id) => router.post(`/api/appointment/${id}/accept`);
    const appointmentDone = (id) => router.post(`/api/appointment/${id}/done`);

    const confirmDelete = (id) => {
        if (!deleteReason.trim()) {
            alert(t('You must provide a reason.'));
            return;
        }

        router.post(`/owner/appointment/${id}/delete-with-reason`, { reason: deleteReason });
        setDeletingId(null);
        setDeleteReason('');
    };

    const filterAppointments = (appointments) => {
        const now = new Date();

        return appointments.filter((appointment) => {
            const date = new Date(appointment.date);

            switch (filterType) {
                case 'day':
                    return (
                        date.getDate() === now.getDate() &&
                        date.getMonth() === now.getMonth() &&
                        date.getFullYear() === now.getFullYear()
                    );
                case 'week': {
                    const firstDayOfWeek = new Date(now);
                    firstDayOfWeek.setDate(now.getDate() - now.getDay());
                    const lastDayOfWeek = new Date(firstDayOfWeek);
                    lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
                    return date >= firstDayOfWeek && date <= lastDayOfWeek;
                }
                case 'month':
                    return (
                        date.getMonth() === now.getMonth() &&
                        date.getFullYear() === now.getFullYear()
                    );
                case 'year':
                    return date.getFullYear() === now.getFullYear();
                default:
                    return true;
            }
        });
    };

    return (
        <div className="min-h-screen bg-light dark:bg-grayDark text-black dark:text-white">
            <FilterDropdown value={filterType} onChange={setFilterType} />

            {companyappointments.data.length === 0 ? (
                <div className="text-center p-8">
                    <p>{t('No_appointments_yet.')}</p>
                </div>
            ) : (
                <div className=" grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filterAppointments(companyappointments.data).map((appointment) => (
                        <div
                            key={appointment.id}
                            className="bg-white dark:bg-gray-800 p-4 shadow-md rounded-md relative"
                        >
                            <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-300 mb-2">
                                {appointment.company?.name}
                            </h2>
                            <p className="text-lg font-medium">
                                {t('Client')}: {appointment.user?.name}
                            </p>

                            {appointment.employee && (
                                <p className="text-lg font-medium">
                                    {t('Employee')}: {appointment.employee?.name}
                                </p>
                            )}

                            <p className="text-lg font-medium">
                                {t('Date')}: {appointment.date}
                            </p>

                            {appointment.service && (
                                <p className="text-lg font-medium text-green-600 dark:text-green-400">
                                    {t('Service')}: {appointment.service.name}
                                </p>
                            )}

                            {appointment.note && (
                                <p className="text-gray-600 dark:text-gray-300 mt-2">
                                    {t('note')}: {appointment.note}
                                </p>
                            )}

                            <div className="flex justify-between items-center mt-4">
                                <button
                                    onClick={() => setDeletingId(appointment.id)}
                                    className="bg-danger text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-200"
                                >
                                    <FontAwesomeIcon icon={faTrash} size="lg" />
                                </button>

                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        className="form-checkbox mr-2"
                                        checked={!!appointment.accept}
                                        onChange={() => acceptAppointment(appointment.id)}
                                    />
                                    <label className="form-check-label">
                                        {appointment.accept ? (
                                            <span className="text-success">✓ {t('Accepted')}</span>
                                        ) : (
                                            <span className="text-gray-500 dark:text-gray-400">
                                                {t('Not Accepted')}
                                            </span>
                                        )}
                                    </label>
                                </div>

                                {appointment.accept && (
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-checkbox mr-2"
                                            checked={!!appointment.done}
                                            onChange={() => appointmentDone(appointment.id)}
                                        />
                                        <label className="form-check-label">
                                            {appointment.done ? (
                                                <span className="text-success">✓ {t('Done')}</span>
                                            ) : (
                                                <span className="text-gray-500 dark:text-gray-400">
                                                    {t('Not done')}
                                                </span>
                                            )}
                                        </label>
                                    </div>
                                )}
                            </div>

                            {deletingId === appointment.id && (
                                <div className="mt-4">
                                    <textarea
                                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white"
                                        rows="3"
                                        placeholder={t('Enter reason for deletion')}
                                        value={deleteReason}
                                        onChange={(e) => setDeleteReason(e.target.value)}
                                    />
                                    <div className="flex gap-2 mt-2">
                                        <button
                                            onClick={() => confirmDelete(appointment.id)}
                                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                                        >
                                            {t('Confirm delete')}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setDeletingId(null);
                                                setDeleteReason('');
                                            }}
                                            className="bg-gray-300 dark:bg-gray-600 text-black dark:text-white px-4 py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
                                        >
                                            {t('Cancel')}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
//  de naam is verandert