//
// import React, { useState } from "react";
// import { router } from "@inertiajs/react";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTrash } from '@fortawesome/free-solid-svg-icons';
// import { useTranslation } from 'react-i18next';
// import FilterDropdown from "@/Components/FilterDropdown";
//
// export default function CompanyAppointments({ companyappointments, auth }) {
//     const { t } = useTranslation();
//     const [filterType, setFilterType] = useState('all');
//
//     const acceptAppointment = (id) => {
//         router.post(`/api/appointment/${id}/accept`);
//     };
//
//     const [editingAppointment, setEditingAppointment] = useState(null);
//     const [editedPrice, setEditedPrice] = useState('');
//     const [editedDuration, setEditedDuration] = useState('');
//
//     const openEditModal = (appointment) => {
//         setEditingAppointment(appointment);
//         setEditedPrice(appointment.custom_price ?? appointment.service?.price ?? '');
//         setEditedDuration(appointment.custom_duration ?? appointment.service?.duration ?? '');
//     };
//
//     const closeEditModal = () => {
//         setEditingAppointment(null);
//         setEditedPrice('');
//         setEditedDuration('');
//     };
//
//     const submitEdit = () => {
//         router.post(`/api/appointment/${editingAppointment.id}/update-details`, {
//             custom_price: editedPrice,
//             custom_duration: editedDuration,
//         }, {
//             onSuccess: () => {
//                 closeEditModal();
//             },
//             preserveScroll: true,
//         });
//     };
//
//
//     const appointmentDone = (id) => {
//         router.post(`/api/appointment/${id}/done`);
//     };
//
//     const filterAppointments = (appointments, type) => {
//         const now = new Date();
//         return appointments.filter((a) => {
//             const appointmentDate = new Date(a.date);
//             switch (type) {
//                 case 'day':
//                     return appointmentDate.toDateString() === now.toDateString();
//                 case 'week': {
//                     const startOfWeek = new Date(now);
//                     startOfWeek.setDate(now.getDate() - now.getDay());
//                     const endOfWeek = new Date(startOfWeek);
//                     endOfWeek.setDate(startOfWeek.getDate() + 6);
//                     return appointmentDate >= startOfWeek && appointmentDate <= endOfWeek;
//                 }
//                 case 'month':
//                     return (
//                         appointmentDate.getMonth() === now.getMonth() &&
//                         appointmentDate.getFullYear() === now.getFullYear()
//                     );
//                 case 'year':
//                     return appointmentDate.getFullYear() === now.getFullYear();
//                 default:
//                     return true;
//             }
//         });
//     };
//
//     const filteredAppointments = filterAppointments(companyappointments.data, filterType);
//
//     const total = filteredAppointments.length;
//     const totalDone = filteredAppointments.filter(a => a.done).length;
//     const totalOpen = total - totalDone;
//
//     return (
//         <div className="bg-amber-50 dark:bg-gray-900 text-left mb-28 p-4 min-h-screen transition-colors">
//             {/* Verwijderde afspraken knop */}
//             <div className="mb-4">
//                 <button
//                     onClick={() => router.visit('/owner/deleted-appointments')}
//                     className="text-blue-600 dark:text-blue-400 hover:underline"
//                 >
//                     {t("Deleted appointments")}
//                 </button>
//             </div>
//
//             {/* Filter Dropdown */}
//             <FilterDropdown value={filterType} onChange={setFilterType} />
//
//             {/* Statistieken */}
//             <div className="mb-6 text-center text-gray-800 dark:text-gray-200">
//                 <h2 className="text-lg font-semibold">{t('Appointments Overview')}</h2>
//                 <p>
//                     {t('Total')}: {total} | ✅ {t('Done')}: {totalDone} | ⏳ {t('Open')}: {totalOpen}
//                 </p>
//             </div>
//
//             {total === 0 ? (
//                 <div className="text-center p-8 bg-white dark:bg-gray-800 rounded shadow">
//                     <p className="text-gray-600 dark:text-gray-300">{t("No_appointments_yet.")}</p>
//                 </div>
//             ) : (
//                 <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
//
//                     {filteredAppointments.map((appointment) => (
//                         <div
//                             key={appointment.id}
//                             className="bg-white dark:bg-gray-800 p-4 shadow-md rounded-md border border-gray-200 dark:border-gray-700 transition-colors"
//                         >
//                             {(auth.user?.owner || auth.user?.id === appointment.employee_id) && (
//                                 <button
//                                     onClick={() => openEditModal(appointment)}
//                                     className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-2"
//                                 >
//                                     ✏️ {t("Adjust price & duration")}
//                                 </button>
//                             )}
//
//                             <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-2">
//                                 {appointment.company?.name}
//                             </h2>
//                             <p className="text-lg font-medium text-gray-800 dark:text-gray-100">
//                                 {t("Client")}: {appointment.user?.name}
//                             </p>
//
//                             {appointment.employee && (
//                                 <p className="text-lg font-medium text-gray-800 dark:text-gray-100">
//                                     {t("Employee")}: {appointment.employee.name}
//                                 </p>
//                             )}
//
//                             <p className="text-lg font-medium text-gray-800 dark:text-gray-100">
//                                 {t("Date")}: {appointment.date}
//                             </p>
//
//                             {appointment.service && (
//                                 <p className="text-lg font-medium text-green-600 dark:text-green-400">
//                                     {t("Service")}: {appointment.service.name}
//                                 </p>
//                             )}
//
//                             {appointment.note && (
//                                 <p className="text-gray-600 dark:text-gray-300 mt-2">
//                                     {t("note")}: {appointment.note}
//                                 </p>
//                             )}
//
//                             {/* Acties */}
//                             <div className="flex justify-between items-center mt-4">
//                                 {/* Done checkbox alleen als accept true is */}
//                                 {appointment.accept && (auth.user?.owner || auth.user?.company_id) && (
//                                     <div className="form-check">
//                                         <label className="flex items-center space-x-2">
//                                             <input
//                                                 type="checkbox"
//                                                 className="form-checkbox text-green-600 dark:bg-gray-700 dark:border-gray-600"
//                                                 checked={!!appointment.done}
//                                                 onChange={() => appointmentDone(appointment.id)}
//                                             />
//                                             <span className={appointment.done
//                                                 ? "text-green-600 dark:text-green-400 font-medium"
//                                                 : "text-gray-500 dark:text-gray-400"}>
//                                                 {appointment.done ? `✓ ${t("Done")}` : t("Not done")}
//                                             </span>
//                                         </label>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//
//             )}
//         </div>
//     );
// }
import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import FilterDropdown from '@/Components/FilterDropdown';

export default function CompanyAppointments({ companyappointments, auth }) {
    const { t } = useTranslation();
    const [filterType, setFilterType] = useState('all');
    // console.log(companyappointments);
    const [editingAppointment, setEditingAppointment] = useState(null);
    const [editedPrice, setEditedPrice] = useState('');
    const [editedDuration, setEditedDuration] = useState('');

    const openEditModal = (appointment) => {
        setEditingAppointment(appointment);
        setEditedPrice(appointment.custom_price ?? appointment.service?.price ?? '');
        setEditedDuration(appointment.custom_duration ?? appointment.service?.duration ?? '');
    };

    const closeEditModal = () => {
        setEditingAppointment(null);
        setEditedPrice('');
        setEditedDuration('');
    };

    const submitEdit = () => {
        router.post(
            `/appointment/${editingAppointment.id}/update-details`,
            {
                custom_price: editedPrice,
                custom_duration: editedDuration,
            },
            {
                onSuccess: closeEditModal,
                preserveScroll: true,
            }
        );
    };

    const isPastAndNotDone = (appointment) => {
        const now = new Date();
        const appointmentDate = new Date(appointment.date);
        return !appointment.done && appointmentDate < now;
    };

    const acceptAppointment = (id) => {
        router.post(`/api/appointment/${id}/accept`);
    };

    const appointmentDone = (id) => {
        router.post(`/api/appointment/${id}/done`);
    };

    const filterAppointments = (appointments, type) => {
        const now = new Date();
        return appointments.filter((a) => {
            const appointmentDate = new Date(a.date);
            switch (type) {
                case 'day':
                    return appointmentDate.toDateString() === now.toDateString();
                case 'week': {
                    const startOfWeek = new Date(now);
                    startOfWeek.setDate(now.getDate() - now.getDay());
                    const endOfWeek = new Date(startOfWeek);
                    endOfWeek.setDate(startOfWeek.getDate() + 6);
                    return appointmentDate >= startOfWeek && appointmentDate <= endOfWeek;
                }
                case 'month':
                    return (
                        appointmentDate.getMonth() === now.getMonth() &&
                        appointmentDate.getFullYear() === now.getFullYear()
                    );
                case 'year':
                    return appointmentDate.getFullYear() === now.getFullYear();
                default:
                    return true;
            }
        });
    };

    const filteredAppointments = filterAppointments(companyappointments.data, filterType);
    const total = filteredAppointments.length;
    const totalDone = filteredAppointments.filter((a) => a.done).length;
    const totalOpen = total - totalDone;

    return (
        <div className="bg-amber-50 dark:bg-grayDark text-left mb-28 p-4 min-h-screen transition-colors">
            <div className="mb-4">
                <button
                    onClick={() => router.visit('/owner/deleted-appointments')}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                    {t('Deleted appointments')}
                </button>
            </div>

            <FilterDropdown value={filterType} onChange={setFilterType} />

            <div className="mb-6 text-center text-gray-800 dark:text-gray-200">
                <h2 className="text-lg font-semibold">{t('Appointments Overview')}</h2>
                <p>
                    {t('Total')}: {total} | ✅ {t('Done')}: {totalDone} | ⏳ {t('Open')}:{' '}
                    {totalOpen}
                </p>
            </div>

            {total === 0 ? (
                <div className="text-center p-8 bg-light dark:bg-grayDark rounded shadow">
                    <p className="text-gray-600 dark:text-gray-300">{t('No_appointments_yet.')}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredAppointments.map((appointment) => (
                        <div
                            key={appointment.id}
                            className={`p-4 shadow-md rounded-md border transition-colors
                             ${
                                 isPastAndNotDone(appointment)
                                     ? 'bg-orange-100 border-orange-400 dark:bg-orange-900 dark:border-orange-500'
                                     : 'bg-light border-gray-200 dark:bg-grayDark dark:border-gray-700'
                             }`}
                        >
                            {(auth.user?.owner || auth.user?.id === appointment.employee_id) && (
                                <button
                                    onClick={() => openEditModal(appointment)}
                                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-2"
                                >
                                    ✏️ {t('Adjust price & duration')}
                                </button>
                            )}

                            <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-2">
                                {appointment.company?.name}
                            </h2>
                            <p className="text-lg font-medium text-gray-800 dark:text-gray-100">
                                {t('Client')}: {appointment.user?.name}
                            </p>

                            {appointment.employee && (
                                <p className="text-lg font-medium text-gray-800 dark:text-gray-100">
                                    {t('Employee')}: {appointment.employee.name}
                                </p>
                            )}

                            <p className="text-lg font-medium text-gray-800 dark:text-gray-100">
                                {t('Date')}: {appointment.date}
                            </p>

                            {appointment.service && (
                                <div className="mt-2">
                                    <p className="text-lg font-medium text-green-600 dark:text-green-400">
                                        {t('Service')}: {appointment.service.name}
                                    </p>

                                    {/* Prijs tonen */}
                                    <p className="text-sm text-gray-800 dark:text-gray-200">
                                        {t('Price')}:
                                        {appointment.custom_price &&
                                        appointment.custom_price !== appointment.service.price ? (
                                            <>
                                                <span className="text-red-500 line-through ml-1">
                                                    €
                                                    {parseFloat(appointment.service.price).toFixed(
                                                        2
                                                    )}
                                                </span>
                                                <span className="text-green-600 font-semibold ml-2">
                                                    €
                                                    {parseFloat(appointment.custom_price).toFixed(
                                                        2
                                                    )}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="ml-2">
                                                €{parseFloat(appointment.service.price).toFixed(2)}
                                            </span>
                                        )}
                                    </p>

                                    {/* Duur tonen */}
                                    <p className="text-sm text-gray-800 dark:text-gray-200">
                                        {t('Duration')}:
                                        {appointment.custom_duration &&
                                        appointment.custom_duration !==
                                            appointment.service.duration ? (
                                            <>
                                                <span className="text-red-500 line-through ml-1">
                                                    {appointment.service.duration} {t('minutes')}
                                                </span>
                                                <span className="text-green-600 font-semibold ml-2">
                                                    {appointment.custom_duration} {t('minutes')}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="ml-2">
                                                {appointment.service.duration} {t('minutes')}
                                            </span>
                                        )}
                                    </p>
                                </div>
                            )}

                            {appointment.note && (
                                <p className="text-gray-600 dark:text-gray-300 mt-2">
                                    {t('note')}: {appointment.note}
                                </p>
                            )}

                            {appointment.accept && (auth.user?.owner || auth.user?.company_id) && (
                                <div className="form-check mt-4">
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            className="form-checkbox text-green-600 dark:bg-gray-700 dark:border-gray-600"
                                            checked={!!appointment.done}
                                            onChange={() => appointmentDone(appointment.id)}
                                        />
                                        <span
                                            className={
                                                appointment.done
                                                    ? 'text-green-600 dark:text-green-400 font-medium'
                                                    : 'text-gray-500 dark:text-gray-400'
                                            }
                                        >
                                            {appointment.done ? `✓ ${t('Done')}` : t('Not done')}
                                        </span>
                                    </label>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Modal voor prijs/duur aanpassen */}
            {editingAppointment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded shadow w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">{t('Adjust price & duration')}</h2>

                        <label className="block mb-2">{t('Price')} (€)</label>
                        <input
                            type="number"
                            step="0.01"
                            className="w-full p-2 mb-4 bg-gray-100 dark:bg-gray-700 rounded"
                            value={editedPrice}
                            onChange={(e) => setEditedPrice(e.target.value)}
                        />

                        <label className="block mb-2">
                            {t('Duration')} ({t('minutes')})
                        </label>
                        <input
                            type="number"
                            className="w-full p-2 mb-4 bg-gray-100 dark:bg-gray-700 rounded"
                            value={editedDuration}
                            onChange={(e) => setEditedDuration(e.target.value)}
                        />

                        <div className="flex justify-end gap-4">
                            <button
                                onClick={closeEditModal}
                                className="bg-gray-300 px-4 py-2 rounded"
                            >
                                {t('Cancel')}
                            </button>
                            <button
                                onClick={submitEdit}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                                {t('Save')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
