import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/Components/Toast/ToastProvider';

export default function ClosedDays() {
    const { t } = useTranslation();
    const { showToast } = useToast();

    // ✅ props veilig ophalen
    const { closedDays = [], company, flash = {}, errors = {} } = usePage().props;

    const [date, setDate] = useState('');
    const [reason, setReason] = useState('');

    /* =========================
       SLUIT DAG
    ========================= */
    const submit = (e) => {
        e.preventDefault();

        if (!date) {
            showToast({
                message: t('select_date'),
                type: 'warning',
            });
            return;
        }

        router.post(
            `/owner/company/${company.id}/closed-days`,
            { date, reason },
            {
                preserveScroll: true,
            }
        );
    };

    /* =========================
       OPEN DAG (VERWIJDER)
    ========================= */
    const remove = (id) => {
        router.delete(`/owner/company/${company.id}/closed-days/${id}`, {
            preserveScroll: true,
        });
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
                {/* HEADER */}
                <h1 className="text-xl font-bold mb-6">
                    {t('closed_days')} – {company.name}
                </h1>

                {/* FORM */}
                <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                    <div className="sm:col-span-1">
                        <label className="text-sm font-semibold block mb-1">{t('date')}</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full rounded border p-2 bg-gray-50 dark:bg-gray-800"
                            required
                        />
                        {errors?.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                    </div>

                    <div className="sm:col-span-2">
                        <label className="text-sm font-semibold block mb-1">{t('reason')}</label>
                        <input
                            type="text"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full rounded border p-2 bg-gray-50 dark:bg-gray-800"
                            placeholder={t('optional')}
                        />
                        {errors?.reason && (
                            <p className="text-red-500 text-sm mt-1">{errors.reason}</p>
                        )}
                    </div>

                    <div className="sm:col-span-3 flex justify-end">
                        <button
                            type="submit"
                            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                        >
                            {t('close_day')}
                        </button>
                    </div>
                </form>

                {/* LIST */}
                <div className="border-t pt-6">
                    <h2 className="font-semibold mb-4">{t('closed_days_list')}</h2>

                    {closedDays.length === 0 ? (
                        <p className="text-gray-500">{t('no_closed_days')}</p>
                    ) : (
                        <ul className="space-y-2">
                            {closedDays.map((d) => (
                                <li
                                    key={d.id}
                                    className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded p-3"
                                >
                                    <div>
                                        <p className="font-semibold">{d.date}</p>
                                        {d.reason && (
                                            <p className="text-sm text-gray-500">{d.reason}</p>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => remove(d.id)}
                                        className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                                    >
                                        {t('open_day')}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
