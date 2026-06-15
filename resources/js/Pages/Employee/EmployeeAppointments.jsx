import React from 'react';
import { usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useToast } from '@/Components/Toast/ToastProvider';

export default function EmployeeAppointments() {
    const { t } = useTranslation();
    const { appointments } = usePage().props;
    const { showToast } = useToast();

    const acceptAppointment = (id) => {
        router.post(
            `/api/appointment/${id}/accept`,
            {},
            {
                preserveScroll: true,
            }
        );
    };
    const appointmentDone = (id) => {
        router.post(
            `/api/appointment/${id}/done`,
            {},
            {
                preserveScroll: true,
            }
        );
    };

    const deleteAppointment = (appointment) => {
        router.delete(`/appointment/${appointment.id}/force-delete`, {
            preserveScroll: true,
        });
    };

    if (!appointments || appointments.length === 0) {
        return (
            <div className="bg-amber-50 dark:bg-amber-900 text-center mb-28 p-8 text-gray-900 dark:text-amber-200 rounded-lg">
                <p className="text-lg font-medium">{t('No_appointments_yet.')}</p>
            </div>
        );
    }

    return (
        <div className="bg-light dark:bg-grayDark text-left mb-28 p-4 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {appointments.map((appointment) => (
                <div
                    key={appointment.id}
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 transition hover:shadow-lg"
                >
                    <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-3">
                        {appointment.company?.name}
                    </h2>

                    <div className="space-y-1 text-sm">
                        <p>
                            <span className="font-semibold">{t('Client')}:</span>{' '}
                            {appointment.user?.name}
                        </p>
                        <p>
                            <span className="font-semibold">{t('Service')}:</span>{' '}
                            {appointment.service?.name}
                        </p>
                        <p>
                            <span className="font-semibold">{t('Date')}:</span> {appointment.date}
                        </p>
                        <p>
                            <span className="font-semibold">{t('Hour')}:</span> {appointment.hour}
                        </p>
                    </div>

                    {appointment.note && (
                        <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                            <span className="font-semibold">{t('note')}:</span> {appointment.note}
                        </div>
                    )}

                    <div className="flex flex-wrap gap-3 items-center justify-between mt-6">
                        {/* Delete */}
                        <button
                            onClick={() => deleteAppointment(appointment)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg
                                       bg-red-100 text-red-700 hover:bg-red-200
                                       dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800
                                       transition"
                            title={t('Delete')}
                        >
                            <FontAwesomeIcon icon={faTrash} />
                            <span className="text-sm font-medium">{t('Delete')}</span>
                        </button>

                        {/* Accept */}
                        <label className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 cursor-pointer">
                            <input
                                type="checkbox"
                                className="accent-green-600 w-4 h-4"
                                checked={!!appointment.accept}
                                onChange={() => acceptAppointment(appointment.id)}
                            />
                            {appointment.accept ? (
                                <span className="text-green-600 dark:text-green-400 font-medium">
                                    ✓ {t('Accepted')}
                                </span>
                            ) : (
                                <span className="text-gray-500 dark:text-gray-400">
                                    {t('Not Accepted')}
                                </span>
                            )}
                        </label>

                        {/* Done */}
                        {appointment.accept && (
                            <label className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="accent-blue-600 w-4 h-4"
                                    checked={!!appointment.done}
                                    onChange={() => appointmentDone(appointment.id)}
                                />
                                {appointment.done ? (
                                    <span className="text-green-600 dark:text-green-400 font-medium">
                                        ✓ {t('Done')}
                                    </span>
                                ) : (
                                    <span className="text-gray-500 dark:text-gray-400">
                                        {t('Not done')}
                                    </span>
                                )}
                            </label>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
