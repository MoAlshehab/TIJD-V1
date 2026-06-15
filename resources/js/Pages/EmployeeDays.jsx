//
// import React, { useEffect, useState } from "react";
// import { usePage } from "@inertiajs/react";
// import { useTranslation } from "react-i18next";
// import { Inertia } from "@inertiajs/inertia";
// import SelectableCard from "@/Components/SelectableCard";
// // - import { useToast } from "react-toastify";
// import { useToast } from "@/Components/Toast/ToastProvider";
//
//
//
//
// const EmployeeDays = props => {
//     const { availableDates, employees, services, unavailableTimesPerEmployee } = usePage().props;
//     const { url } = usePage();
//     const queryParams = new URLSearchParams(url.split('?')[1]);
//     const companyId = queryParams.get('companyId');
//     const { showToast } = useToast();
//
//
//     const { t } = useTranslation();
//
//     const [selectedEmployee, setSelectedEmployee] = useState(null);
//     const [selectedEmployeeName, setSelectedEmployeeName] = useState(null);
//     const [selectedDate, setSelectedDate] = useState(null);
//     const [selectedHour, setSelectedHour] = useState("");
//     const [selectedService, setSelectedService] = useState(null);
//     const [selectedServiceName, setSelectedServiceName] = useState(null);
//     const [note, setNote] = useState("");
//
//     const [showDatesPopup, setShowDatesPopup] = useState(false);
//     const [showEmployeePopup, setShowEmployeePopup] = useState(false);
//     const [showHoursPopup, setShowHoursPopup] = useState(false);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [showServiceSelection, setShowServiceSelection] = useState(true);
//
//     const selectedEmployeeObject = employees.find(e => e.id === selectedEmployee);
//
//     useEffect(() => {
//         if ((!services || services.length === 0) && (!employees || employees.length === 0)) {
//             setShowDatesPopup(true);
//         } else if (!services || services.length === 0) {
//             setShowEmployeePopup(true);
//         } else if (!employees || employees.length === 0) {
//             setShowDatesPopup(true);
//         }
//     }, []);
//
//     const handleEmployeeClick = (id, name) => {
//         setSelectedEmployee(id);
//         setSelectedEmployeeName(name);
//         setSelectedDate(null);
//         setSelectedHour("");
//         setShowDatesPopup(true);
//     };
//
//     const handleDateClick = (date) => {
//         setSelectedDate(date);
//         setShowDatesPopup(false);
//         setShowHoursPopup(true);
//     };
//
//     const handleHourSelection = (hour) => {
//         setSelectedHour(hour);
//         setIsModalOpen(true);
//     };
//
//     const closeModal = () => {
//         setIsModalOpen(false);
//         setNote("");
//     };
//
//     const closePopups = () => {
//         setShowDatesPopup(false);
//         setShowHoursPopup(false);
//     };
//
//     const handleServiceClick = (serviceId, serviceName) => {
//         setSelectedService(serviceId);
//         setSelectedServiceName(serviceName);
//         setShowServiceSelection(false);
//
//         if (employees.length === 0) {
//             setSelectedEmployee(null);
//             setShowDatesPopup(true);
//         } else {
//             setShowEmployeePopup(true);
//         }
//     };
//     const saveAppointment = () => {
//         // ⚠️ Frontend check (gele toast)
//         if (!selectedDate || !selectedHour || !selectedService) {
//             showToast({
//                 message: t("select_date_time_service"),
//                 type: "warning",
//             });
//             return;
//         }
//
//         const formattedDateTime = `${selectedDate} ${selectedHour}:00`;
//
//         const appointmentData = {
//             employeeId: selectedEmployee,
//             serviceId: selectedService,
//             date: formattedDateTime,
//             note,
//             companyId,
//         };
//
//         Inertia.post(`/appointment/${companyId}`, appointmentData, {
//             preserveScroll: true,
//
//             // ❌ GEEN success-toast hier
//             onSuccess: () => {
//                 // Alleen UI sluiten
//                 closeModal();
//             },
//
//             // ❌ Rode toast bij echte error
//             onError: () => {
//                 showToast({
//                     message: t("error_creating_appointment"),
//                     type: "error",
//                 });
//             },
//         });
//     };
//
//     const generateAvailableHours = (employeeObj, selectedDate, unavailableTimes) => {
//         if (selectedEmployee === -1) {
//             const allHours = [];
//
//             for (const emp of employees) {
//                 const dayName = new Date(selectedDate).toLocaleDateString("nl-NL", {
//                     weekday: "long",
//                 }).toLowerCase();
//
//                 const workDay = emp.work_days?.find(day => day.day_of_week === dayName);
//                 if (!workDay) continue;
//
//                 const [sh, sm] = workDay.start_time.split(":").map(Number);
//                 const [eh, em] = workDay.end_time.split(":").map(Number);
//
//                 const current = new Date();
//                 current.setHours(sh, sm, 0, 0);
//
//                 const endTime = new Date();
//                 endTime.setHours(eh, em, 0, 0);
//
//                 const busyHoursForDate = unavailableTimes?.[emp.id]?.[selectedDate] || [];
//
//                 while (current <= endTime) {
//                     const h = current.getHours().toString().padStart(2, "0");
//                     const m = current.getMinutes().toString().padStart(2, "0");
//                     const time = `${h}:${m}`;
//
//                     const now = new Date();
//                     const currentDateStr = current.toISOString().split("T")[0];
//                     const isToday = selectedDate === currentDateStr;
//                     const isInPast = isToday && current <= now;
//
//                     const isAvailable = !busyHoursForDate.includes(time) && !isInPast;
//
//                     if (isAvailable) {
//                         allHours.push({
//                             time,
//                             employeeId: emp.id,
//                             employeeName: emp.name,
//                             isAvailable: true,
//                             isReserved: false,
//                             isPastToday: false,
//                         });
//                     }
//
//                     current.setMinutes(current.getMinutes() + 30);
//                 }
//             }
//
//             return allHours;
//         }
//
//         // default behavior if specific employee is selected
//         if (!employeeObj || !selectedDate) return [];
//
//         const dayName = new Date(selectedDate).toLocaleDateString("nl-NL", {
//             weekday: "long",
//         }).toLowerCase();
//
//         const workDay = employeeObj.work_days?.find(day => day.day_of_week === dayName);
//
//         if (!workDay) return [];
//
//         const [sh, sm] = workDay.start_time.split(":").map(Number);
//         const [eh, em] = workDay.end_time.split(":").map(Number);
//
//         const hours = [];
//         const current = new Date();
//         current.setHours(sh, sm, 0, 0);
//
//         const endTime = new Date();
//         endTime.setHours(eh, em, 0, 0);
//
//         const busyHoursForDate = unavailableTimes?.[employeeObj.id]?.[selectedDate] || [];
//
//         while (current <= endTime) {
//             const h = current.getHours().toString().padStart(2, "0");
//             const m = current.getMinutes().toString().padStart(2, "0");
//             const time = `${h}:${m}`;
//
//             const now = new Date();
//             const currentDateStr = current.toISOString().split("T")[0];
//             const isToday = selectedDate === currentDateStr;
//             const isInPast = isToday && current <= now;
//
//             hours.push({
//                 time,
//                 isAvailable: !busyHoursForDate.includes(time) && !isInPast,
//                 isReserved: busyHoursForDate.includes(time),
//                 isPastToday: isInPast,
//             });
//
//             current.setMinutes(current.getMinutes() + 30);
//         }
//
//         return hours;
//     };
//
//
//
//     const isDayFullyBooked = (date) => {
//         // Loop door alle medewerkers
//         for (const employee of employees) {
//             const availableHours = generateAvailableHours(
//                 employee,
//                 date,
//                 unavailableTimesPerEmployee
//             );
//
//             // Als er ook maar 1 beschikbaar uur is → NIET volledig vol
//             if (availableHours.some(h => h.isAvailable)) {
//                 return false;
//             }
//         }
//
//         // Geen enkele medewerker had een beschikbaar uur
//         return true;
//     };
//
//
//     return (
//         <div className="p-6 bg-white dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100 transition-colors duration-300">
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//                 {showServiceSelection && services.map((service) => (
//                     <SelectableCard
//                         key={service.id}
//                         id={service.id}
//                         selectedId={selectedService}
//                         onSelect={(id) => {
//                             if (service.status !== 0) handleServiceClick(id, service.name);
//                         }}
//                         disabled={service.status === 0}
//                         title={service.name}
//                         details={[
//                             `${t("price")}: € ${parseFloat(service.price).toFixed(2)}`,
//                             `${t("duration")}: ${service.duration} ${t("minutes")}`,
//                             `${t("description")}: ${service.description}`,
//                             ...(service.status === 0
//                                 ? [
//                                     <span key="unavailable" className="text-red-500 font-semibold">
//                     ❌ {t("not_available")}
//                 </span>
//                                 ]
//                                 : []),
//                         ]}
//                         lightColor={service.status === 0 ? "red" : "green"}
//                         darkColor={service.status === 0 ? "red" : "green"}
//                     />
//                 ))}
//             </div>
//
//             {(services.length === 0 || selectedService) && showEmployeePopup && (
//                 <section className="mb-8">
//                     <p className="text-lg font-bold mb-4">{t("employees")}:</p>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//                         <SelectableCard
//                             key="any"
//                             id={-1}
//                             selectedId={selectedEmployee}
//                             onSelect={() => handleEmployeeClick(-1, t("any_employee"))}
//                             title={t("any_employee")}
//                             lightColor="gray"
//                             darkColor="gray"
//                         />
//                         {employees.map((employee) => (
//                             <SelectableCard
//                                 key={employee.id}
//                                 id={employee.id}
//                                 selectedId={selectedEmployee}
//                                 onSelect={() => handleEmployeeClick(employee.id, employee.name)}
//                                 title={employee.name}
//                                 image={employee.media?.[0]?.original_url?.replace("localhost", "127.0.0.1:8000")}
//                                 lightColor="blue"
//                                 darkColor="blue"
//                             />
//                         ))}
//                     </div>
//                 </section>
//             )}
//
//             {showDatesPopup && (
//                 <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-start p-6 z-50">
//                     <div className="bg-white dark:bg-gray-800 rounded shadow-lg p-6 w-full h-full max-h-full max-w-none sm:max-w-lg sm:max-h-[80vh] overflow-y-auto">
//                         <h2 className="text-xl font-bold mb-4">
//                             {t("available_dates_for", { name: selectedEmployeeName })}
//                         </h2>
//                         <button onClick={closePopups} className="text-sm text-blue-600 dark:text-blue-400 mb-4">
//                             {t("back")}
//                         </button>
//                         <div className="grid grid-cols-2 gap-4">
//                             {availableDates.map((dateInfo, index) => {
//                                 const fullyBooked = isDayFullyBooked(dateInfo.date);
//
//                                 return (
//                                     <div
//                                         key={index}
//                                         onClick={() => {
//                                             if (fullyBooked) {
//                                                 showToast({
//                                                     message: t("fully_booked"),
//                                                     type: "warning",
//                                                 });
//                                                 return;
//                                             }
//
//                                             handleDateClick(dateInfo.date);
//                                         }}
//                                         className={`p-3 rounded transition text-center
//                 ${
//                                             fullyBooked
//                                                 ? "bg-red-300 dark:bg-red-700 text-white cursor-not-allowed opacity-70"
//                                                 : "bg-gray-100 dark:bg-gray-700 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-600"
//                                         }
//             `}
//                                     >
//                                         <div className="font-semibold">{dateInfo.date}</div>
//                                         <div className="text-sm opacity-80">{dateInfo.day}</div>
//                                     </div>
//                                 );
//                             })}
//
//                         </div>
//                     </div>
//                 </div>
//             )}
//
//             {showHoursPopup && (
//                 <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-start p-6 z-50">
//                     <div className="bg-white dark:bg-gray-800 rounded shadow-lg p-6 w-full h-full max-h-full max-w-none sm:max-w-xl sm:max-h-[80vh] overflow-y-auto">
//                         <h2 className="text-xl font-bold mb-4">
//                             {t("available_hours_for", { date: selectedDate })}
//                         </h2>
//                         <button onClick={closePopups} className="text-sm text-blue-600 dark:text-blue-400 mb-4">
//                             {t("back")}
//                         </button>
//                         <div className="grid grid-cols-3 gap-2">
//                             {generateAvailableHours(selectedEmployeeObject, selectedDate, unavailableTimesPerEmployee).map((hourInfo, index) => (
//                                 <div
//                                     key={index}
//                                     onClick={() => {
//                                         if (hourInfo.isAvailable && !hourInfo.isPastToday) {
//                                             if (selectedEmployee === -1 && hourInfo.employeeId) {
//                                                 setSelectedEmployee(hourInfo.employeeId);
//                                                 setSelectedEmployeeName(hourInfo.employeeName);
//                                             }
//                                             handleHourSelection(hourInfo.time);
//                                         }
//                                     }}
//                                     className={`p-2 rounded-md text-center ${
//                                         hourInfo.isPastToday
//                                             ? "bg-orange-500 text-white cursor-not-allowed"
//                                             : hourInfo.isAvailable
//                                                 ? "bg-green-200 cursor-pointer hover:bg-green-300 dark:bg-green-700 dark:hover:bg-green-600"
//                                                 : "bg-gray-300 cursor-not-allowed dark:bg-gray-600"
//                                     }`}
//                                 >
//                                     {hourInfo.time}
//                                     {!hourInfo.isAvailable && !hourInfo.isPastToday && (
//                                         <div className="text-xs text-gray-500 dark:text-gray-300 mt-1">{t("reserved")}</div>
//                                     )}
//                                     {hourInfo.isPastToday && (
//                                         <div className="text-xs text-white mt-1">{t("past")}</div>
//                                     )}
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             )}
//
//             {isModalOpen && (
//                 <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
//                     <div className="bg-white dark:bg-gray-800 rounded shadow-lg p-6 w-full h-full max-h-full max-w-none sm:max-w-md sm:max-h-auto sm:rounded-lg sm:h-auto overflow-y-auto">
//                         <h2 className="text-xl font-bold mb-4">{t("confirm_appointment")}</h2>
//                         <p className="mb-2">{t("employee")}: {selectedEmployeeName}</p>
//                         <p className="mb-2">{t("service")}: {selectedServiceName}</p>
//                         <p className="mb-2">{t("date")}: {selectedDate}</p>
//                         <p className="mb-4">{t("time")}: {selectedHour}</p>
//                         <textarea
//                             rows="4"
//                             className="w-full border rounded p-2 mb-4 bg-gray-100 dark:bg-gray-700 dark:text-gray-100"
//                             placeholder={t("add_note")}
//                             value={note}
//                             onChange={(e) => setNote(e.target.value)}
//                         />
//                         <div className="flex justify-end gap-4">
//                             <button
//                                 onClick={closeModal}
//                                 className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500"
//                             >
//                                 {t("cancel")}
//                             </button>
//                             <button
//                                 onClick={saveAppointment}
//                                 className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
//                             >
//                                 {t("save")}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };
//
// export default EmployeeDays;
//

import React, { useEffect, useMemo, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Inertia } from '@inertiajs/inertia';
import SelectableCard from '@/Components/SelectableCard';
import { useToast } from '@/Components/Toast/ToastProvider';

const EmployeeDays = (props) => {
    const {
        availableDates,
        employees,
        services,
        unavailableTimesPerEmployee,
        closedDays = [], // ✅ komt van backend
    } = usePage().props;

    const { url } = usePage();
    const queryParams = new URLSearchParams(url.split('?')[1]);
    const companyId = queryParams.get('companyId');

    const { showToast } = useToast();
    const { t } = useTranslation();

    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [selectedEmployeeName, setSelectedEmployeeName] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedHour, setSelectedHour] = useState('');
    const [selectedService, setSelectedService] = useState(null);
    const [selectedServiceName, setSelectedServiceName] = useState(null);
    const [note, setNote] = useState('');

    const [showDatesPopup, setShowDatesPopup] = useState(false);
    const [showEmployeePopup, setShowEmployeePopup] = useState(false);
    const [showHoursPopup, setShowHoursPopup] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showServiceSelection, setShowServiceSelection] = useState(true);

    const selectedEmployeeObject = employees.find((e) => e.id === selectedEmployee);

    /**
     * ✅ Helper: maak elke datum vergelijkbaar als YYYY-MM-DD
     * Ondersteunt: 2026-02-21, 21-02-2026, 21/02/2026
     */
    const normalizeDate = (value) => {
        if (!value) return null;
        const s = String(value).trim();

        // 2026-02-21
        if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

        // 21-02-2026
        if (/^\d{2}-\d{2}-\d{4}$/.test(s)) {
            const [dd, mm, yyyy] = s.split('-');
            return `${yyyy}-${mm}-${dd}`;
        }

        // 21/02/2026
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(s)) {
            const [dd, mm, yyyy] = s.split('/');
            return `${yyyy}-${mm}-${dd}`;
        }

        // "2026-02-21 10:00:00" → pak date
        if (/^\d{4}-\d{2}-\d{2}\s/.test(s)) {
            return s.split(' ')[0];
        }

        // fallback: Date parse
        const d = new Date(s);
        if (!isNaN(d.getTime())) {
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            return `${yyyy}-${mm}-${dd}`;
        }

        return null;
    };

    /**
     * ✅ closedDays kan zijn:
     * ["2026-02-21", ...]
     * of [{date:"2026-02-21"}, ...]
     * We maken een Set voor snelle check.
     */
    const closedDaySet = useMemo(() => {
        const list = Array.isArray(closedDays) ? closedDays : [];
        const normalized = list
            .map((x) => (typeof x === 'string' ? x : x?.date))
            .map(normalizeDate)
            .filter(Boolean);

        return new Set(normalized);
    }, [closedDays]);

    const isClosed = (dateStr) => {
        const n = normalizeDate(dateStr);
        return n ? closedDaySet.has(n) : false;
    };

    useEffect(() => {
        if ((!services || services.length === 0) && (!employees || employees.length === 0)) {
            setShowDatesPopup(true);
        } else if (!services || services.length === 0) {
            setShowEmployeePopup(true);
        } else if (!employees || employees.length === 0) {
            setShowDatesPopup(true);
        }
    }, []);

    const handleEmployeeClick = (id, name) => {
        setSelectedEmployee(id);
        setSelectedEmployeeName(name);
        setSelectedDate(null);
        setSelectedHour('');
        setShowDatesPopup(true);
    };

    const handleDateClick = (date) => {
        // ✅ harde blokkade
        if (isClosed(date)) {
            showToast({
                message: t('this_day_is_closed'),
                type: 'warning',
            });
            return;
        }

        setSelectedDate(date);
        setShowDatesPopup(false);
        setShowHoursPopup(true);
    };

    const handleHourSelection = (hour) => {
        setSelectedHour(hour);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setNote('');
    };

    const closePopups = () => {
        setShowDatesPopup(false);
        setShowHoursPopup(false);
    };

    const handleServiceClick = (serviceId, serviceName) => {
        setSelectedService(serviceId);
        setSelectedServiceName(serviceName);
        setShowServiceSelection(false);

        if (employees.length === 0) {
            setSelectedEmployee(null);
            setShowDatesPopup(true);
        } else {
            setShowEmployeePopup(true);
        }
    };

    const saveAppointment = () => {
        // ⚠️ Frontend check (gele toast)
        if (!selectedDate || !selectedHour || !selectedService) {
            showToast({
                message: t('select_date_time_service'),
                type: 'warning',
            });
            return;
        }

        // ✅ extra veiligheid: als selectedDate toch closed is
        if (isClosed(selectedDate)) {
            showToast({
                message: t('this_day_is_closed'),
                type: 'warning',
            });
            return;
        }

        const formattedDateTime = `${selectedDate} ${selectedHour}:00`;

        const appointmentData = {
            employeeId: selectedEmployee,
            serviceId: selectedService,
            date: formattedDateTime,
            note,
            companyId,
        };

        Inertia.post(`/appointment/${companyId}`, appointmentData, {
            preserveScroll: true,
            onSuccess: () => {
                closeModal();
            },
            onError: () => {
                showToast({
                    message: t('error_creating_appointment'),
                    type: 'error',
                });
            },
        });
    };

    const generateAvailableHours = (employeeObj, selectedDate, unavailableTimes) => {
        if (selectedEmployee === -1) {
            const allHours = [];

            for (const emp of employees) {
                const dayName = new Date(selectedDate)
                    .toLocaleDateString('nl-NL', { weekday: 'long' })
                    .toLowerCase();

                const workDay = emp.work_days?.find((day) => day.day_of_week === dayName);
                if (!workDay) continue;

                const [sh, sm] = workDay.start_time.split(':').map(Number);
                const [eh, em] = workDay.end_time.split(':').map(Number);

                const current = new Date();
                current.setHours(sh, sm, 0, 0);

                const endTime = new Date();
                endTime.setHours(eh, em, 0, 0);

                const busyHoursForDate = unavailableTimes?.[emp.id]?.[selectedDate] || [];

                while (current <= endTime) {
                    const h = current.getHours().toString().padStart(2, '0');
                    const m = current.getMinutes().toString().padStart(2, '0');
                    const time = `${h}:${m}`;

                    const now = new Date();
                    const currentDateStr = current.toISOString().split('T')[0];
                    const isToday = selectedDate === currentDateStr;
                    const isInPast = isToday && current <= now;

                    const isAvailable = !busyHoursForDate.includes(time) && !isInPast;

                    if (isAvailable) {
                        allHours.push({
                            time,
                            employeeId: emp.id,
                            employeeName: emp.name,
                            isAvailable: true,
                            isReserved: false,
                            isPastToday: false,
                        });
                    }

                    current.setMinutes(current.getMinutes() + 30);
                }
            }

            return allHours;
        }

        if (!employeeObj || !selectedDate) return [];

        const dayName = new Date(selectedDate)
            .toLocaleDateString('nl-NL', { weekday: 'long' })
            .toLowerCase();

        const workDay = employeeObj.work_days?.find((day) => day.day_of_week === dayName);
        if (!workDay) return [];

        const [sh, sm] = workDay.start_time.split(':').map(Number);
        const [eh, em] = workDay.end_time.split(':').map(Number);

        const hours = [];
        const current = new Date();
        current.setHours(sh, sm, 0, 0);

        const endTime = new Date();
        endTime.setHours(eh, em, 0, 0);

        const busyHoursForDate = unavailableTimes?.[employeeObj.id]?.[selectedDate] || [];

        while (current <= endTime) {
            const h = current.getHours().toString().padStart(2, '0');
            const m = current.getMinutes().toString().padStart(2, '0');
            const time = `${h}:${m}`;

            const now = new Date();
            const currentDateStr = current.toISOString().split('T')[0];
            const isToday = selectedDate === currentDateStr;
            const isInPast = isToday && current <= now;

            hours.push({
                time,
                isAvailable: !busyHoursForDate.includes(time) && !isInPast,
                isReserved: busyHoursForDate.includes(time),
                isPastToday: isInPast,
            });

            current.setMinutes(current.getMinutes() + 30);
        }

        return hours;
    };

    const isDayFullyBooked = (date) => {
        for (const employee of employees) {
            const availableHours = generateAvailableHours(
                employee,
                date,
                unavailableTimesPerEmployee
            );
            if (availableHours.some((h) => h.isAvailable)) {
                return false;
            }
        }
        return true;
    };

    return (
        <div className="p-6 bg-white dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100 transition-colors duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {showServiceSelection &&
                    services.map((service) => (
                        <SelectableCard
                            key={service.id}
                            id={service.id}
                            selectedId={selectedService}
                            onSelect={(id) => {
                                if (service.status !== 0) handleServiceClick(id, service.name);
                            }}
                            disabled={service.status === 0}
                            title={service.name}
                            details={[
                                `${t('price')}: € ${parseFloat(service.price).toFixed(2)}`,
                                `${t('duration')}: ${service.duration} ${t('minutes')}`,
                                `${t('description')}: ${service.description}`,
                                ...(service.status === 0
                                    ? [
                                          <span
                                              key="unavailable"
                                              className="text-red-500 font-semibold"
                                          >
                                              ❌ {t('not_available')}
                                          </span>,
                                      ]
                                    : []),
                            ]}
                            lightColor={service.status === 0 ? 'red' : 'green'}
                            darkColor={service.status === 0 ? 'red' : 'green'}
                        />
                    ))}
            </div>

            {(services.length === 0 || selectedService) && showEmployeePopup && (
                <section className="mb-8">
                    <p className="text-lg font-bold mb-4">{t('employees')}:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <SelectableCard
                            key="any"
                            id={-1}
                            selectedId={selectedEmployee}
                            onSelect={() => handleEmployeeClick(-1, t('any_employee'))}
                            title={t('any_employee')}
                            lightColor="gray"
                            darkColor="gray"
                        />
                        {employees.map((employee) => (
                            <SelectableCard
                                key={employee.id}
                                id={employee.id}
                                selectedId={selectedEmployee}
                                onSelect={() => handleEmployeeClick(employee.id, employee.name)}
                                title={employee.name}
                                image={employee.media?.[0]?.original_url?.replace(
                                    'localhost',
                                    '127.0.0.1:8000'
                                )}
                                lightColor="blue"
                                darkColor="blue"
                            />
                        ))}
                    </div>
                </section>
            )}

            {showDatesPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-start p-6 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded shadow-lg p-6 w-full h-full max-h-full max-w-none sm:max-w-lg sm:max-h-[80vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">
                            {t('available_dates_for', { name: selectedEmployeeName })}
                        </h2>
                        <button
                            onClick={closePopups}
                            className="text-sm text-blue-600 dark:text-blue-400 mb-4"
                        >
                            {t('back')}
                        </button>

                        <div className="grid grid-cols-2 gap-4">
                            {availableDates.map((dateInfo, index) => {
                                const fullyBooked = isDayFullyBooked(dateInfo.date);
                                const isClosedDay = isClosed(dateInfo.date); // ✅ HIER: genormaliseerd

                                return (
                                    // <div
                                    //     key={index}
                                    //     onClick={() => {
                                    //         if (isClosedDay) {
                                    //             showToast({
                                    //                 message: t("this_day_is_closed"),
                                    //                 type: "warning",
                                    //             });
                                    //             return;
                                    //         }
                                    //
                                    //         if (fullyBooked) {
                                    //             showToast({
                                    //                 message: t("fully_booked"),
                                    //                 type: "warning",
                                    //             });
                                    //             return;
                                    //         }
                                    //
                                    //         handleDateClick(dateInfo.date);
                                    //     }}
                                    //     className={`p-3 rounded transition text-center
                                    //         ${
                                    //         isClosedDay
                                    //             ? "bg-red-500 dark:bg-red-700 text-white cursor-not-allowed opacity-80"
                                    //             : fullyBooked
                                    //                 ? "bg-orange-400 dark:bg-orange-600 text-white cursor-not-allowed opacity-70"
                                    //                 : "bg-gray-100 dark:bg-gray-700 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-600"
                                    //     }
                                    //     `}
                                    // >
                                    //     <div className="font-semibold">{dateInfo.date}</div>
                                    //     <div className="text-sm opacity-80">{dateInfo.day}</div>
                                    //
                                    //     {isClosedDay && (
                                    //         <div className="text-xs font-bold mt-1">
                                    //             ❌ {t("closed")}
                                    //         </div>
                                    //     )}
                                    // </div>

                                    <div
                                        key={index}
                                        onClick={() => {
                                            if (isClosedDay) {
                                                showToast({
                                                    message: t('this_day_is_closed'),
                                                    type: 'warning',
                                                });
                                                return;
                                            }

                                            if (fullyBooked) {
                                                showToast({
                                                    message: t('fully_booked'),
                                                    type: 'warning',
                                                });
                                                return;
                                            }

                                            handleDateClick(dateInfo.date);
                                        }}
                                        className={`p-3 rounded transition text-center
        ${
            isClosedDay
                ? 'bg-red-500 dark:bg-red-700 text-white cursor-not-allowed opacity-80'
                : fullyBooked
                  ? 'bg-orange-400 dark:bg-orange-600 text-white cursor-not-allowed opacity-70'
                  : 'bg-gray-100 dark:bg-gray-700 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-600'
        }
    `}
                                    >
                                        <div className="font-semibold">{dateInfo.date}</div>
                                        <div className="text-sm opacity-80">{dateInfo.day}</div>

                                        {isClosedDay && (
                                            <div className="text-xs font-bold mt-1">
                                                ❌ {t('closed')}
                                            </div>
                                        )}

                                        {!isClosedDay && fullyBooked && (
                                            <div className="text-xs font-bold mt-1">
                                                ⛔ {t('fully_booked')}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {showHoursPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-start p-6 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded shadow-lg p-6 w-full h-full max-h-full max-w-none sm:max-w-xl sm:max-h-[80vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">
                            {t('available_hours_for', { date: selectedDate })}
                        </h2>
                        <button
                            onClick={closePopups}
                            className="text-sm text-blue-600 dark:text-blue-400 mb-4"
                        >
                            {t('back')}
                        </button>

                        <div className="grid grid-cols-3 gap-2">
                            {generateAvailableHours(
                                selectedEmployeeObject,
                                selectedDate,
                                unavailableTimesPerEmployee
                            ).map((hourInfo, index) => (
                                <div
                                    key={index}
                                    onClick={() => {
                                        if (hourInfo.isAvailable && !hourInfo.isPastToday) {
                                            if (selectedEmployee === -1 && hourInfo.employeeId) {
                                                setSelectedEmployee(hourInfo.employeeId);
                                                setSelectedEmployeeName(hourInfo.employeeName);
                                            }
                                            handleHourSelection(hourInfo.time);
                                        }
                                    }}
                                    className={`p-2 rounded-md text-center ${
                                        hourInfo.isPastToday
                                            ? 'bg-orange-500 text-white cursor-not-allowed'
                                            : hourInfo.isAvailable
                                              ? 'bg-green-200 cursor-pointer hover:bg-green-300 dark:bg-green-700 dark:hover:bg-green-600'
                                              : 'bg-gray-300 cursor-not-allowed dark:bg-gray-600'
                                    }`}
                                >
                                    {hourInfo.time}
                                    {!hourInfo.isAvailable && !hourInfo.isPastToday && (
                                        <div className="text-xs text-gray-500 dark:text-gray-300 mt-1">
                                            {t('reserved')}
                                        </div>
                                    )}
                                    {hourInfo.isPastToday && (
                                        <div className="text-xs text-white mt-1">{t('past')}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded shadow-lg p-6 w-full h-full max-h-full max-w-none sm:max-w-md sm:max-h-auto sm:rounded-lg sm:h-auto overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">{t('confirm_appointment')}</h2>
                        <p className="mb-2">
                            {t('employee')}: {selectedEmployeeName}
                        </p>
                        <p className="mb-2">
                            {t('service')}: {selectedServiceName}
                        </p>
                        <p className="mb-2">
                            {t('date')}: {selectedDate}
                        </p>
                        <p className="mb-4">
                            {t('time')}: {selectedHour}
                        </p>

                        <textarea
                            rows="4"
                            className="w-full border rounded p-2 mb-4 bg-gray-100 dark:bg-gray-700 dark:text-gray-100"
                            placeholder={t('add_note')}
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />

                        <div className="flex justify-end gap-4">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500"
                            >
                                {t('cancel')}
                            </button>
                            <button
                                onClick={saveAppointment}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                            >
                                {t('save')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeDays;
