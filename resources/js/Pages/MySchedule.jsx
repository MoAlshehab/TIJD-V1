import React from 'react';
import { usePage } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

export default function MySchedule() {
    const { t } = useTranslation();
    const { user, work_days } = usePage().props;

    return (
        <div className=" bg-light dark:bg-grayDark">
            <div className="max-w-2xl mx-auto p-6 bg-light dark:bg-grayDark  rounded-lg shadow">
                <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                    {t('My_schedule')} - {user.name}
                </h1>

                {work_days.length === 0 ? (
                    <div className="text-gray-500 dark:text-gray-400 flex flex-col items-center">
                        <FontAwesomeIcon icon={faCalendarAlt} size="2x" className="mb-2" />
                        <p>{t('No_working_hours_set')}</p>
                    </div>
                ) : (
                    <ul className="space-y-4">
                        {work_days.map((day) => (
                            <li
                                key={day.id}
                                className="flex justify-between bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-4 rounded"
                            >
                                <span className="capitalize">{t(day.day_of_week)}</span>
                                <span>
                                    {day.start_time} - {day.end_time}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
