import { usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
export default function DeletedAppointments() {
    const { appointments = [], flash } = usePage().props;
    const { t } = useTranslation();

    const handleRestore = (id) => {
        if (confirm(t('confirm_restore_appointment'))) {
            router.put(
                `/owner/appointments/${id}/restore`,
                {},
                {
                    onSuccess: () => {
                        console.log(t('appointment_restored'));
                    },
                    onError: (errors) => {
                        console.error(t('error_restoring'), errors);
                    },
                }
            );
        }
    };

    return (
        <div className="p-6 bg-white dark:bg-gray-900 min-h-screen">
            <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                {t('deleted_appointments')}
            </h1>

            {flash?.success && (
                <p className="text-green-600 dark:text-green-400 mb-4">{flash.success}</p>
            )}

            {appointments.length === 0 ? (
                <p className="text-gray-700 dark:text-gray-300">{t('no_deleted_appointments')}</p>
            ) : (
                <ul className="space-y-4">
                    {appointments.map((appointment) => (
                        <li
                            key={appointment.id}
                            className="p-4 border rounded bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                        >
                            <p className="text-gray-900 dark:text-gray-100">
                                <strong>{t('client')}:</strong> {appointment.user?.name}
                            </p>
                            <p className="text-gray-900 dark:text-gray-100">
                                <strong>{t('service')}:</strong> {appointment.service?.name}
                            </p>
                            <p className="text-gray-900 dark:text-gray-100">
                                <strong>{t('employee')}:</strong>{' '}
                                {appointment.employee?.name ?? t('none')}
                            </p>
                            <p className="text-gray-900 dark:text-gray-100">
                                <strong>{t('deletion_reason')}:</strong>{' '}
                                {appointment.deleted_reason ?? t('not_specified')}
                            </p>

                            <button
                                onClick={() => handleRestore(appointment.id)}
                                className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
                            >
                                {t('restore')}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
