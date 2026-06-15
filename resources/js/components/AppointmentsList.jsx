import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import FilterDropdown from '@/Components/FilterDropdown';

export default function AppointmentsList({ appointments }) {
    const { t } = useTranslation();
    const [filterType, setFilterType] = useState('all');
    const [filteredAppointments, setFilteredAppointments] = useState(appointments);

    const deleteAppointment = (appointment) => {
        if (!confirm(t('are_you_sure_delete_appointment'))) return;
        router.delete(`/admin/appointment/${appointment.id}`);
    };

    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
                },
                (error) => {
                    console.error('Error getting location:', error);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    }, []);

    useEffect(() => {
        const now = new Date();

        const getDateObject = (str) => {
            const date = new Date(str);
            return new Date(date.getFullYear(), date.getMonth(), date.getDate());
        };

        const filtered = appointments.filter((appointment) => {
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
    }, [filterType, appointments]);

    return (
        <div className="bg-amber-50 dark:bg-gray-900 text-left mb-28 mt-4 px-4 sm:px-6 lg:px-8">
            <FilterDropdown value={filterType} onChange={setFilterType} />

            <h1 className="text-2xl font-bold text-primary dark:text-white mb-6">
                {t('appointments')}
            </h1>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredAppointments.map((appointment) => (
                    <div
                        key={appointment.id}
                        className={`p-6 rounded-2xl shadow transition-all duration-200
                        ${appointment.accept ? 'bg-success/10 dark:bg-success/20 border border-success' : 'bg-white dark:bg-gray-800'}`}
                    >
                        <div className="space-y-1 text-sm text-gray-800 dark:text-gray-200">
                            <p>
                                <span className="font-semibold">{t('company')}:</span>{' '}
                                {appointment.company.name}
                            </p>
                            <p>
                                <span className="font-semibold">{t('user')}:</span>{' '}
                                {appointment.user.name}
                            </p>
                            <p>
                                <span className="font-semibold">{t('employee')}:</span>{' '}
                                {appointment.employee?.name ?? t('no_employee')}
                            </p>
                            <p>
                                <span className="font-semibold">{t('date')}:</span>{' '}
                                {appointment.date}
                            </p>
                            <p>
                                <span className="font-semibold">{t('day_of_week')}:</span>{' '}
                                {appointment.dayOfWeek}
                            </p>
                            {appointment.note && (
                                <p>
                                    <span className="font-semibold">{t('note')}:</span>{' '}
                                    {appointment.note}
                                </p>
                            )}
                        </div>
                        <div className="mt-4 text-right">
                            <button
                                onClick={() => deleteAppointment(appointment)}
                                className="text-danger hover:text-danger/80 transition"
                                title={t('delete_appointment')}
                            >
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
