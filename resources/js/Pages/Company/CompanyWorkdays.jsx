// import { useForm } from '@inertiajs/react';
// import { useTranslation } from 'react-i18next';
// import Layout from "@/components/Layout";
//
//
//
// export default function CompanyWorkdays({ company, workdays = [] }) {
//     const { t } = useTranslation();
//     const defaultDays = [
//         t('Monday'),
//         t('Tuesday'),
//         t('Wednesday'),
//         t('Thursday'),
//         t('Friday'),
//         t('Saturday'),
//         t('Sunday'),
//     ];
//
//     const { data, setData, post, processing } = useForm({
//         workdays: defaultDays.map((day, i) => {
//             // Let op: als je backend dagen in het Engels verwacht, pas dan hier de matching aan.
//             const englishDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
//             const existing = workdays.find(w => w.day === englishDays[i]);
//             return {
//                 day,
//                 start_time: existing?.start_time || '',
//                 end_time: existing?.end_time || '',
//             };
//         }),
//     });
//
//     const handleSubmit = (e) => {
//         e.preventDefault();
//         post(`/owner/company/${company.id}/opening-hours`);
//     };
//
//     return (
//         <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow max-h-screen h-screen max-w-xl mx-auto flex flex-col">
//             <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
//                 {t('Set Opening Hours')}
//             </h2>
//             <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
//                 <div className="flex-grow overflow-y-auto mb-4 pr-2">
//                     {data.workdays.map((item, index) => (
//                         <div key={index} className="mb-6">
//                             <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
//                                 {item.day}
//                             </label>
//                             <div className="flex gap-3">
//                                 <input
//                                     type="time"
//                                     value={item.start_time}
//                                     onChange={(e) => {
//                                         const updated = [...data.workdays];
//                                         updated[index].start_time = e.target.value;
//                                         setData('workdays', updated);
//                                     }}
//                                     className="p-2 border border-gray-300 dark:border-gray-600 rounded w-1/2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
//                                 />
//                                 <input
//                                     type="time"
//                                     value={item.end_time}
//                                     onChange={(e) => {
//                                         const updated = [...data.workdays];
//                                         updated[index].end_time = e.target.value;
//                                         setData('workdays', updated);
//                                     }}
//                                     className="p-2 border border-gray-300 dark:border-gray-600 rounded w-1/2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
//                                 />
//                             </div>
//                         </div>
//                     ))}
//                     <button
//                         type="submit"
//                         disabled={processing}
//                         className="bg-primary text-white px-5 py-3 rounded hover:bg-primary/80 transition"
//                     >
//                         {t('Save')}
//                     </button>
//
//
//                 </div>
//             </form>
//         </div>
//     );
// }
// CompanyWorkdays.layout = page => <Layout>{page}</Layout>;
//

import { useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import Layout from '@/components/Layout';
import ToggleSwitch from '@/Components/ToggleSwitch';

export default function CompanyWorkdays({ company, workdays = [] }) {
    const { t } = useTranslation();

    const englishDays = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
    ];

    const { data, setData, post, processing } = useForm({
        workdays: englishDays.map((day) => {
            const existing = workdays.find((w) => w.day === day);
            return {
                day,
                open: !!existing,
                start_time: existing?.start_time || '',
                end_time: existing?.end_time || '',
            };
        }),
    });

    const toggleDay = (index) => {
        const updated = [...data.workdays];
        updated[index].open = !updated[index].open;

        if (!updated[index].open) {
            updated[index].start_time = '';
            updated[index].end_time = '';
        }

        setData('workdays', updated);
    };

    const updateTime = (index, field, value) => {
        const updated = [...data.workdays];
        updated[index][field] = value;
        setData('workdays', updated);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/owner/company/${company.id}/opening-hours`);
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
                {t('Opening hours')}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {data.workdays.map((item, index) => (
                    <div
                        key={item.day}
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                                   rounded-xl p-4 shadow-sm"
                    >
                        {/* Dag + toggle */}
                        <div className="flex items-center justify-between mb-4">
                            <span className="font-semibold text-gray-800 dark:text-gray-200">
                                {t(item.day)}
                            </span>

                            <ToggleSwitch
                                checked={item.open}
                                onChange={() => toggleDay(index)}
                                labelOn={t('Open')}
                            />
                        </div>

                        {/* Tijden */}
                        {item.open && (
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="w-full sm:w-1/2">
                                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                                        {t('From')}
                                    </label>
                                    <input
                                        type="time"
                                        value={item.start_time}
                                        onChange={(e) =>
                                            updateTime(index, 'start_time', e.target.value)
                                        }
                                        className="w-full border rounded-lg px-3 py-2
                                                   bg-white dark:bg-gray-900
                                                   text-gray-900 dark:text-gray-100"
                                    />
                                </div>

                                <div className="w-full sm:w-1/2">
                                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                                        {t('To')}
                                    </label>
                                    <input
                                        type="time"
                                        value={item.end_time}
                                        onChange={(e) =>
                                            updateTime(index, 'end_time', e.target.value)
                                        }
                                        className="w-full border rounded-lg px-3 py-2
                                                   bg-white dark:bg-gray-900
                                                   text-gray-900 dark:text-gray-100"
                                    />
                                </div>
                            </div>
                        )}

                        {!item.open && (
                            <p className="text-sm italic text-gray-400">{t('Closed')}</p>
                        )}
                    </div>
                ))}

                {/* Save button */}
                <div className="sticky bottom-0 bg-white dark:bg-gray-900 pt-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-primary hover:bg-primary/80
                                   text-white font-semibold py-3 rounded-xl transition"
                    >
                        {t('Save opening hours')}
                    </button>
                </div>
            </form>
        </div>
    );
}

CompanyWorkdays.layout = (page) => <Layout>{page}</Layout>;
