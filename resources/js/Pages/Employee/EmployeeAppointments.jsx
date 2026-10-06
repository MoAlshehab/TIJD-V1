// import React from 'react';
// import { usePage, router } from '@inertiajs/react';
// import { useTranslation } from 'react-i18next';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTrash } from '@fortawesome/free-solid-svg-icons';
// import { useToast } from '@/Components/Toast/ToastProvider';

// export default function EmployeeAppointments() {
//     const { t } = useTranslation();
//     const { appointments } = usePage().props;
//     const { showToast } = useToast();

//     const acceptAppointment = (id) => {
//         router.post(
//             `/api/appointment/${id}/accept`,
//             {},
//             {
//                 preserveScroll: true,
//             }
//         );
//     };
//     const appointmentDone = (id) => {
//         router.post(
//             `/api/appointment/${id}/done`,
//             {},
//             {
//                 preserveScroll: true,
//             }
//         );
//     };

//     const deleteAppointment = (appointment) => {
//         router.delete(`/appointment/${appointment.id}/force-delete`, {
//             preserveScroll: true,
//         });
//     };

//     if (!appointments || appointments.length === 0) {
//         return (
//             <div className="bg-amber-50 dark:bg-amber-900 text-center mb-28 p-8 text-gray-900 dark:text-amber-200 rounded-lg">
//                 <p className="text-lg font-medium">{t('No_appointments_yet.')}</p>
//             </div>
//         );
//     }

//     return (
//         <div className="bg-light dark:bg-grayDark text-left mb-28 p-4 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
//             {appointments.map((appointment) => (
//                 <div
//                     key={appointment.id}
//                     className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 transition hover:shadow-lg"
//                 >
//                     <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-3">
//                         {appointment.company?.name}
//                     </h2>

//                     <div className="space-y-1 text-sm">
//                         <p>
//                             <span className="font-semibold">{t('Client')}:</span>{' '}
//                             {appointment.user?.name}
//                         </p>
//                         <p>
//                             <span className="font-semibold">{t('Service')}:</span>{' '}
//                             {appointment.service?.name}
//                         </p>
//                         <p>
//                             <span className="font-semibold">{t('Date')}:</span> {appointment.date}
//                         </p>
//                         <p>
//                             <span className="font-semibold">{t('Hour')}:</span> {appointment.hour}
//                         </p>
//                     </div>

//                     {appointment.note && (
//                         <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-700 rounded text-sm">
//                             <span className="font-semibold">{t('note')}:</span> {appointment.note}
//                         </div>
//                     )}

//                     <div className="flex flex-wrap gap-3 items-center justify-between mt-6">
//                         {/* Delete */}
//                         <button
//                             onClick={() => deleteAppointment(appointment)}
//                             className="flex items-center gap-2 px-4 py-2 rounded-lg
//                                        bg-red-100 text-red-700 hover:bg-red-200
//                                        dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800
//                                        transition"
//                             title={t('Delete')}
//                         >
//                             <FontAwesomeIcon icon={faTrash} />
//                             <span className="text-sm font-medium">{t('Delete')}</span>
//                         </button>

//                         {/* Accept */}
//                         <label className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 cursor-pointer">
//                             <input
//                                 type="checkbox"
//                                 className="accent-green-600 w-4 h-4"
//                                 checked={!!appointment.accept}
//                                 onChange={() => acceptAppointment(appointment.id)}
//                             />
//                             {appointment.accept ? (
//                                 <span className="text-green-600 dark:text-green-400 font-medium">
//                                     ✓ {t('Accepted')}
//                                 </span>
//                             ) : (
//                                 <span className="text-gray-500 dark:text-gray-400">
//                                     {t('Not Accepted')}
//                                 </span>
//                             )}
//                         </label>
// {/* Done + PDF */}
// {appointment.accept && (
//     <div className="flex flex-col gap-2">

//         <label className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 cursor-pointer">
//             <input
//                 type="checkbox"
//                 className="accent-blue-600 w-4 h-4"
//                 checked={!!appointment.done}
//                 onChange={() =>
//                     appointmentDone(appointment.id)
//                 }
//             />

//             {appointment.done ? (
//                 <span className="text-green-600 dark:text-green-400 font-medium">
//                     ✓ {t('Done')}
//                 </span>
//             ) : (
//                 <span className="text-gray-500 dark:text-gray-400">
//                     {t('Not done')}
//                 </span>
//             )}
//         </label>

//         {/* PDF alleen tonen als afspraak voltooid is */}
//                             {appointment.done &&
//                                 appointment.receipt_pdf_path && (
//                               <a
//                                 href={`/appointment/${appointment.id}/receipt`}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="
//                                     inline-flex
//                                     items-center
//                                     justify-center
//                                     gap-2
//                                     bg-blue-600
//                                     hover:bg-blue-700
//                                     text-white
//                                     px-4
//                                     py-2
//                                     rounded-lg
//                                     transition
//                                 "
//                             >
//                                 📄 PDF downloaden
//                             </a>
//                                 )}
//                         </div>
//                     )}
//                   </div>
//                 </div>
//             ))}
//         </div>
//     );
// }

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

    /*
    |--------------------------------------------------------------------------
    | Afspraak accepteren
    |--------------------------------------------------------------------------
    */
    const acceptAppointment = (id) => {
        router.post(
            `/api/appointment/${id}/accept`,
            {},
            {
                preserveScroll: true,
            }
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Afspraak voltooien
    |--------------------------------------------------------------------------
    */
    const appointmentDone = (id) => {
        router.post(
            `/api/appointment/${id}/done`,
            {},
            {
                preserveScroll: true,
            }
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Afspraak verwijderen
    |--------------------------------------------------------------------------
    */
    const deleteAppointment = (appointment) => {
        router.delete(
            `/appointment/${appointment.id}/force-delete`,
            {
                preserveScroll: true,
            }
        );
    };

    /*
    |--------------------------------------------------------------------------
    | PDF downloaden
    |--------------------------------------------------------------------------
    |
    | Mobiel:
    | - opent native share menu
    | - gebruiker kan "Bewaar in Bestanden" kiezen
    |
    | Desktop:
    | - normale directe download
    |--------------------------------------------------------------------------
    */
    const downloadAppointmentPdf = async (appointment) => {
        try {
            const response = await fetch(
                `/appointment/${appointment.id}/receipt`,
                {
                    method: 'GET',
                    credentials: 'same-origin',
                    headers: {
                        Accept: 'application/pdf',
                    },
                }
            );

            if (!response.ok) {
                throw new Error(
                    `PDF downloaden mislukt: ${response.status}`
                );
            }

            const contentType =
                response.headers.get('content-type') || '';

            if (!contentType.includes('application/pdf')) {
                throw new Error(
                    'De server heeft geen PDF teruggegeven.'
                );
            }

            const blob = await response.blob();

            const filename =
                `afspraak-${appointment.id}.pdf`;

            /*
            |--------------------------------------------------------------------------
            | Controleer of gebruiker mobiel/tablet gebruikt
            |--------------------------------------------------------------------------
            */
            const isMobile =
                /Android|iPhone|iPad|iPod/i.test(
                    navigator.userAgent
                );

            /*
            |--------------------------------------------------------------------------
            | Mobiel → native share menu
            |--------------------------------------------------------------------------
            */
            if (isMobile) {
                const file = new File(
                    [blob],
                    filename,
                    {
                        type: 'application/pdf',
                    }
                );

                if (
                    typeof navigator.share === 'function' &&
                    typeof navigator.canShare === 'function' &&
                    navigator.canShare({
                        files: [file],
                    })
                ) {
                    try {
                        await navigator.share({
                            title: 'Afspraak PDF',
                            files: [file],
                        });

                        return;
                    } catch (shareError) {
                        /*
                         * Gebruiker heeft deelmenu zelf gesloten.
                         */
                        if (
                            shareError?.name === 'AbortError'
                        ) {
                            return;
                        }

                        console.error(
                            'PDF delen mislukt:',
                            shareError
                        );
                    }
                }
            }

            /*
            |--------------------------------------------------------------------------
            | Desktop / fallback
            |--------------------------------------------------------------------------
            */
            const url =
                URL.createObjectURL(blob);

            const link =
                document.createElement('a');

            link.href = url;
            link.download = filename;
            link.style.display = 'none';

            document.body.appendChild(link);

            link.click();

            link.remove();

            setTimeout(() => {
                URL.revokeObjectURL(url);
            }, 3000);

        } catch (error) {
            console.error(
                'PDF downloaden mislukt:',
                error
            );

            if (showToast) {
                showToast(
                    'PDF kon niet worden gedownload',
                    'error'
                );
            }
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Geen afspraken
    |--------------------------------------------------------------------------
    */
    if (!appointments || appointments.length === 0) {
        return (
            <div className="
                bg-amber-50
                dark:bg-amber-900
                text-center
                mb-28
                p-8
                text-gray-900
                dark:text-amber-200
                rounded-lg
            ">
                <p className="text-lg font-medium">
                    {t('No_appointments_yet.')}
                </p>
            </div>
        );
    }

    return (
        <div className="
            bg-light
            dark:bg-grayDark
            text-left
            mb-28
            p-4
            grid
            grid-cols-1
            gap-6
            md:grid-cols-2
            lg:grid-cols-3
        ">
            {appointments.map((appointment) => (
                <div
                    key={appointment.id}
                    className="
                        bg-white
                        dark:bg-gray-800
                        p-6
                        rounded-xl
                        shadow-md
                        border
                        border-gray-200
                        dark:border-gray-700
                        transition
                        hover:shadow-lg
                    "
                >
                    {/* Bedrijfsnaam */}
                    <h2 className="
                        text-xl
                        font-bold
                        text-blue-600
                        dark:text-blue-400
                        mb-3
                    ">
                        {appointment.company?.name}
                    </h2>

                    {/* Afspraakgegevens */}
                    <div className="space-y-1 text-sm">

                        <p>
                            <span className="font-semibold">
                                {t('Client')}:
                            </span>{' '}
                            {appointment.user?.name}
                        </p>

                        <p>
                            <span className="font-semibold">
                                {t('Service')}:
                            </span>{' '}
                            {appointment.service?.name}
                        </p>

                        <p>
                            <span className="font-semibold">
                                {t('Date')}:
                            </span>{' '}
                            {appointment.date}
                        </p>

                        <p>
                            <span className="font-semibold">
                                {t('Hour')}:
                            </span>{' '}
                            {appointment.hour}
                        </p>

                        {/* Prijs */}
                        {appointment.service && (
                            <p>
                                <span className="font-semibold">
                                    {t('Price')}:
                                </span>{' '}

                                €
                                {parseFloat(
                                    appointment.custom_price ??
                                    appointment.service?.price ??
                                    0
                                ).toFixed(2)}
                            </p>
                        )}

                    </div>

                    {/* Notitie */}
                    {appointment.note && (
                        <div className="
                            mt-3
                            p-3
                            bg-gray-100
                            dark:bg-gray-700
                            rounded
                            text-sm
                        ">
                            <span className="font-semibold">
                                {t('note')}:
                            </span>{' '}

                            {appointment.note}
                        </div>
                    )}

                    {/* Acties */}
                    <div className="
                        flex
                        flex-wrap
                        gap-3
                        items-center
                        justify-between
                        mt-6
                    ">

                        {/* Verwijderen */}
                        <button
                            type="button"
                            onClick={() =>
                                deleteAppointment(
                                    appointment
                                )
                            }
                            className="
                                flex
                                items-center
                                gap-2
                                px-4
                                py-2
                                rounded-lg
                                bg-red-100
                                text-red-700
                                hover:bg-red-200
                                dark:bg-red-900
                                dark:text-red-300
                                dark:hover:bg-red-800
                                transition
                            "
                            title={t('Delete')}
                        >
                            <FontAwesomeIcon
                                icon={faTrash}
                            />

                            <span className="text-sm font-medium">
                                {t('Delete')}
                            </span>
                        </button>

                        {/* Accept
                            Alleen zichtbaar zolang afspraak
                            NIET voltooid is
                        */}
                        {!appointment.done && (
                            <label className="
                                flex
                                items-center
                                gap-3
                                px-4
                                py-2
                                rounded-lg
                                bg-gray-100
                                dark:bg-gray-700
                                cursor-pointer
                            ">
                                <input
                                    type="checkbox"
                                    className="
                                        accent-green-600
                                        w-4
                                        h-4
                                    "
                                    checked={
                                        !!appointment.accept
                                    }
                                    onChange={() =>
                                        acceptAppointment(
                                            appointment.id
                                        )
                                    }
                                />

                                {appointment.accept ? (
                                    <span className="
                                        text-green-600
                                        dark:text-green-400
                                        font-medium
                                    ">
                                        ✓ {t('Accepted')}
                                    </span>
                                ) : (
                                    <span className="
                                        text-gray-500
                                        dark:text-gray-400
                                    ">
                                        {t('Not Accepted')}
                                    </span>
                                )}
                            </label>
                        )}

                        {/* Done
                            Alleen zichtbaar:
                            - geaccepteerd
                            - nog niet voltooid
                        */}
                        {appointment.accept &&
                            !appointment.done && (
                                <label className="
                                    flex
                                    items-center
                                    gap-3
                                    px-4
                                    py-2
                                    rounded-lg
                                    bg-gray-100
                                    dark:bg-gray-700
                                    cursor-pointer
                                ">
                                    <input
                                        type="checkbox"
                                        className="
                                            accent-blue-600
                                            w-4
                                            h-4
                                        "
                                        checked={
                                            !!appointment.done
                                        }
                                        onChange={() =>
                                            appointmentDone(
                                                appointment.id
                                            )
                                        }
                                    />

                                    <span className="
                                        text-gray-500
                                        dark:text-gray-400
                                    ">
                                        {t('Not done')}
                                    </span>
                                </label>
                            )}

                        {/* Voltooid */}
                        {appointment.done && (
                            <div className="
                                flex
                                flex-col
                                gap-2
                            ">

                                <span className="
                                    text-green-600
                                    dark:text-green-400
                                    font-medium
                                ">
                                    ✓ {t('Done')}
                                </span>

                                {/* PDF */}
                                {appointment.receipt_pdf_path && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            downloadAppointmentPdf(
                                                appointment
                                            )
                                        }
                                        className="
                                            inline-flex
                                            items-center
                                            justify-center
                                            gap-2
                                            bg-blue-600
                                            hover:bg-blue-700
                                            text-white
                                            px-4
                                            py-2
                                            rounded-lg
                                            transition
                                        "
                                    >
                                        📄 PDF downloaden
                                    </button>
                                )}

                            </div>
                        )}

                    </div>
                </div>
            ))}
        </div>
    );
}