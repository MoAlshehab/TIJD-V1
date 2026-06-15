import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationPin, faTrash, faCalendarPlus } from '@fortawesome/free-solid-svg-icons';
import { router, usePage } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import FilterDropdown from '@/Components/FilterDropdown';
import { useToast } from '@/Components/Toast/ToastProvider';
import ConfirmModal from '@/components/ConfirmModal.jsx';

export default function MyAppointments() {
    const { t } = useTranslation();
    const { myappointments } = usePage().props;
    const [isAddingToCalendar, setIsAddingToCalendar] = useState(false);
    const [filterType, setFilterType] = useState('all');
    const [filteredAppointments, setFilteredAppointments] = useState(myappointments);
    const { showToast } = useToast();
    const [appointmentToDelete, setAppointmentToDelete] = useState(null);
    const deleteAppointment = () => {
        if (!appointmentToDelete) return;

        router.delete(`/appointment/${appointmentToDelete.id}/force-delete`, {
            preserveScroll: true,
            onSuccess: () => {
                showToast({
                    message: t('Appointment deleted successfully'),
                    type: 'success',
                });
                setAppointmentToDelete(null);
            },
            onError: () => {
                showToast({
                    message: t('Failed to delete appointment'),
                    type: 'error',
                });
            },
        });
    };

    const addToGoogleCalendar = (appointment) => {
        setIsAddingToCalendar(true);
        try {
            if (!appointment.date) {
                throw new Error(t('The appointment is missing a date and time.'));
            }

            const startDate = new Date(appointment.date.replace(' ', 'T'));
            if (isNaN(startDate.getTime())) {
                throw new Error(t('Invalid date and time value.'));
            }

            const endDate = new Date(startDate.getTime() + 30 * 60 * 1000); // 30 minutes

            const formatDate = (date) => date.toISOString().replace(/[-:]|\.\d{3}/g, '');

            const details = [
                `Company: ${appointment.company.name}`,
                `Employee: ${appointment.employee?.name ?? 'None assigned'}`,
                `Notes: ${appointment.note || 'No notes'}`,
                `Address: ${appointment.company.address}`,
            ].join('\n\n');

            const url = new URL('https://www.google.com/calendar/render');
            url.searchParams.append('action', 'TEMPLATE');
            url.searchParams.append('text', `Appointment at ${appointment.company.name}`);
            url.searchParams.append('dates', `${formatDate(startDate)}/${formatDate(endDate)}`);
            url.searchParams.append('details', details);
            url.searchParams.append('location', appointment.company.address);

            window.open(url.toString(), '_blank', 'noopener,noreferrer');
        } catch (error) {
            console.error('Error adding to calendar:', error);
            alert(t(`Error: ${error.message}`));
        } finally {
            setIsAddingToCalendar(false);
        }
    };

    useEffect(() => {
        const now = new Date();

        const getDateObject = (str) => {
            const date = new Date(str);
            return new Date(date.getFullYear(), date.getMonth(), date.getDate());
        };

        const filtered = myappointments.filter((appointment) => {
            const apptDate = getDateObject(appointment.date);

            if (filterType === 'day') {
                return apptDate.toDateString() === now.toDateString();
            }

            if (filterType === 'week') {
                const startOfWeek = new Date(now);
                startOfWeek.setDate(now.getDate() - now.getDay());
                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 6);
                return apptDate >= startOfWeek && apptDate <= endOfWeek;
            }

            if (filterType === 'month') {
                return (
                    apptDate.getMonth() === now.getMonth() &&
                    apptDate.getFullYear() === now.getFullYear()
                );
            }

            if (filterType === 'year') {
                return apptDate.getFullYear() === now.getFullYear();
            }

            return true;
        });

        setFilteredAppointments(filtered);
    }, [filterType, myappointments]);

    return (
        <div className="min-h-screen bg-light dark:bg-grayDark text-black dark:text-white mb-8 px-4">
            <h1 className="text-2xl font-bold mb-6 text-grayDark dark:text-white">
                {t('My Appointments')}
            </h1>

            <FilterDropdown value={filterType} onChange={setFilterType} />

            {filteredAppointments.length === 0 ? (
                <div className="text-center p-8 bg-light dark:bg-grayDark rounded-lg shadow">
                    <p className="text-gray-600 dark:text-gray-300">
                        {t("You don't have any appointments yet.")}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredAppointments.map((appointment) => {
                        const isCancelled = !!appointment.deleted_at;
                        return (
                            <div
                                key={appointment.id}
                                className={`p-6 rounded-lg shadow-md border-l-4 transition-all duration-300
                                 ${
                                     isCancelled
                                         ? 'bg-red-50 border-red-600 text-red-800 dark:bg-red-950 dark:text-red-300'
                                         : appointment.accept
                                           ? 'bg-white border-green-500 dark:bg-gray-800 dark:text-white'
                                           : 'bg-white border-yellow-500 dark:bg-gray-800 dark:text-white'
                                 }`}
                            >
                                <h2 className="text-xl font-semibold mb-2">
                                    {appointment.company.name}
                                </h2>

                                <div className="flex items-start mb-2">
                                    <FontAwesomeIcon icon={faLocationPin} className="mt-1 mr-2" />
                                    <a
                                        href={`https://maps.google.com/?q=${encodeURIComponent(appointment.company.address)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="underline text-blue-700 dark:text-blue-300"
                                    >
                                        {appointment.company.address}
                                    </a>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <h2 className="font-medium">
                                        {t('day')}: {appointment.dayOfWeek}
                                    </h2>
                                    <p>
                                        <span className="font-medium">{t('Date')}:</span>{' '}
                                        {new Date(appointment.date).toLocaleDateString(undefined, {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                    <p>
                                        <span className="font-medium">{t('time')}:</span>{' '}
                                        {new Date(appointment.date).toLocaleTimeString(undefined, {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: false,
                                        })}
                                    </p>
                                    <p>
                                        <span className="font-medium">{t('With')}:</span>{' '}
                                        {appointment.employee?.name ?? t('No employee assigned')}
                                    </p>
                                    {appointment.note && (
                                        <p>
                                            <span className="font-medium">{t('Notes')}:</span>{' '}
                                            {appointment.note}
                                        </p>
                                    )}
                                </div>

                                {isCancelled && (
                                    <div className="bg-red-100 dark:bg-red-800 p-3 rounded text-sm mt-2">
                                        <p className="font-semibold">{t('Cancelled by company')}</p>
                                        {appointment.deleted_reason && (
                                            <p className="italic mt-1">
                                                <strong>{t('Reason')}:</strong>{' '}
                                                {appointment.deleted_reason}
                                            </p>
                                        )}
                                    </div>
                                )}

                                <div className="flex justify-between items-center mt-4">
                                    {!appointment.accept && isCancelled && (
                                        <button
                                            onClick={() => setAppointmentToDelete(appointment)}
                                            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition"
                                            title={t('Delete appointment')}
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    )}

                                    {!isCancelled && (
                                        <button
                                            onClick={() => addToGoogleCalendar(appointment)}
                                            disabled={isAddingToCalendar}
                                            className="bg-primary hover:bg-primaryDark text-white py-2 px-4 rounded transition flex items-center"
                                            title={t('Add to calendar')}
                                        >
                                            {isAddingToCalendar ? (
                                                <span>{t('Processing...')}</span>
                                            ) : (
                                                <>
                                                    <FontAwesomeIcon
                                                        icon={faCalendarPlus}
                                                        className="mr-2"
                                                    />
                                                    <span>{t('Calendar')}</span>
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>

                                {!isCancelled && (
                                    <div className="mt-3 text-sm">
                                        {appointment.accept ? (
                                            <p className="text-green-600 dark:text-green-400 font-medium">
                                                ✓ {t('confirmed')}
                                            </p>
                                        ) : (
                                            <>
                                                <p className="text-yellow-600 dark:text-yellow-300">
                                                    {t('waiting_for_confirmation')}
                                                </p>
                                                <button
                                                    onClick={() =>
                                                        setAppointmentToDelete(appointment)
                                                    }
                                                    className="mt-2 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition"
                                                >
                                                    <FontAwesomeIcon icon={faTrash} /> {t('Delete')}
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    <ConfirmModal
                        open={!!appointmentToDelete}
                        title={t('Delete appointment')}
                        message={t('Are you sure you want to permanently delete this appointment?')}
                        confirmText={t('Yes, delete')}
                        cancelText={t('Cancel')}
                        onConfirm={deleteAppointment}
                        onCancel={() => setAppointmentToDelete(null)}
                    />
                </div>
            )}
        </div>
    );
}
