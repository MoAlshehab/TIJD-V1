import React from 'react';
import { useTranslation } from 'react-i18next';

export default function WorkdaysPage({ company, workdays = [] }) {
    const { t } = useTranslation();

    const orderedDays = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
    ];

    const sortedWorkdays = orderedDays
        .map((day) => workdays.find((w) => w.day_of_week === day))
        .filter(Boolean);

    return (
        <div className="p-6 max-w-xl mx-auto">
            <div className="bg-white dark:bg-dark-surface rounded-lg p-6 shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">
                        {t('Opening hours')} – {company?.name}
                    </h2>

                    <button
                        onClick={() => window.history.back()}
                        className="text-gray-500 hover:text-red-500 font-semibold"
                    >
                        ← {t('Back')}
                    </button>
                </div>

                {sortedWorkdays.length === 0 ? (
                    <p className="text-gray-500 text-center">{t('No opening hours available')}</p>
                ) : (
                    <ul className="space-y-3">
                        {sortedWorkdays.map((day) => {
                            const isOpenWithTime = day.open && day.start_time && day.end_time;

                            return (
                                <li
                                    key={day.id}
                                    className="flex justify-between items-center border-b pb-2"
                                >
                                    <span className="font-medium text-gray-800 dark:text-gray-200">
                                        {t(day.day_of_week)}
                                    </span>

                                    {isOpenWithTime ? (
                                        <span className="text-gray-700 dark:text-gray-300">
                                            {day.start_time} – {day.end_time}
                                        </span>
                                    ) : (
                                        <span className="italic text-gray-400">{t('Closed')}</span>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
}
