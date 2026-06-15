import React from 'react';
import { usePage } from '@inertiajs/react';
import { format, parseISO } from 'date-fns';
import { useTranslation } from 'react-i18next';

const CompanyAppointments = () => {
    const {
        appointments,
        company,
        totalAppointments,
        totalPrice,
        donePrice,
        pendingPrice,
        totalDuration,
    } = usePage().props;

    const { t } = useTranslation();

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        try {
            return format(parseISO(dateString), 'dd MMM yyyy HH:mm');
        } catch {
            return dateString;
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-light dark:bg-grayDark min-h-screen text-gray-900 dark:text-gray-100">
            <h1 className="text-4xl font-extrabold text-center mb-10">
                {company.name} - {t('appointments')}
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
                <div className="bg-light dark:bg-grayDark shadow rounded-lg p-6 flex flex-col items-center">
                    <span className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                        {t('total_appointments')}
                    </span>
                    <span className="mt-2 text-3xl font-bold text-indigo-600">
                        {totalAppointments}
                    </span>
                </div>
                <div className="bg-light dark:bg-grayDark shadow rounded-lg p-6 flex flex-col items-center">
                    <span className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                        {t('total_price')}
                    </span>
                    <span className="mt-2 text-3xl font-bold text-indigo-600">
                        €{totalPrice.toFixed(2)}
                    </span>
                </div>
                <div className="bg-light dark:bg-grayDark shadow rounded-lg p-6 flex flex-col items-center">
                    <span className="text-xl font-semibold text-gray-700 dark:text-green-300">
                        {t('done_appointments_price')}
                    </span>
                    <span className="mt-2 text-3xl font-bold text-green-600">
                        €{donePrice.toFixed(2)}
                    </span>
                </div>
                <div className="bg-light dark:bg-grayDark shadow rounded-lg p-6 flex flex-col items-center">
                    <span className="text-xl font-semibold text-gray-700 dark:text-orange-300">
                        {t('pending_appointments_price')}
                    </span>
                    <span className="mt-2 text-3xl font-bold text-orange-500">
                        €{pendingPrice.toFixed(2)}
                    </span>
                </div>
                <div className="bg-light dark:bg-grayDark shadow rounded-lg p-6 flex flex-col items-center">
                    <span className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                        {t('total_duration')}
                    </span>
                    <span className="mt-2 text-3xl font-bold text-indigo-600">
                        {totalDuration} {t('minutes')}
                    </span>
                </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {appointments.data.length === 0 ? (
                    <p className="col-span-full text-center text-gray-500 dark:text-gray-400">
                        {t('no_appointments_found')}
                    </p>
                ) : (
                    appointments.data.map((appointment) => {
                        const isDeleted = appointment.deleted_at !== null;
                        const isDone = appointment.done === true || appointment.done === 1;

                        return (
                            <div
                                key={appointment.id}
                                className={`p-4 rounded shadow-md border
                                    ${isDeleted ? 'border-red-400 bg-red-50 dark:bg-red-900' : ''}
                                    ${isDone ? 'border-green-400 bg-green-50 dark:bg-green-900' : ''}
                                    ${!isDeleted && !isDone ? 'border-gray-200 bg-light dark:bg-grayDark' : ''}
                                `}
                            >
                                <p>
                                    <strong>{t('user')}:</strong> {appointment.user?.name || '-'}
                                </p>
                                <p>
                                    <strong>{t('service')}:</strong>{' '}
                                    {appointment.service?.name || '-'}
                                </p>
                                <p>
                                    <strong>{t('price')}:</strong>{' '}
                                    {appointment.service?.price
                                        ? `€${appointment.service.price}`
                                        : '-'}
                                </p>
                                <p>
                                    <strong>{t('duration')}:</strong>{' '}
                                    {appointment.service?.duration
                                        ? `${appointment.service.duration} ${t('minutes')}`
                                        : '-'}
                                </p>
                                <p>
                                    <strong>{t('employee')}:</strong>{' '}
                                    {appointment.employee?.name || '-'}
                                </p>
                                <p>
                                    <strong>{t('appointment_date')}:</strong>{' '}
                                    {formatDate(appointment.date)}
                                </p>
                                <p>
                                    <strong>{t('created_at')}:</strong>{' '}
                                    {formatDate(appointment.created_at)}
                                </p>
                                <p
                                    className={`${isDeleted ? 'text-red-600 font-semibold' : 'text-gray-600 dark:text-gray-300'}`}
                                >
                                    <strong>{t('status')}:</strong>{' '}
                                    {isDeleted
                                        ? `${t('deleted_on')} ${formatDate(appointment.deleted_at)}`
                                        : t('active')}
                                </p>
                                {isDone && (
                                    <p className="text-green-700 font-semibold mt-2">
                                        {t('appointment_done')} ✔️
                                    </p>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default CompanyAppointments;
