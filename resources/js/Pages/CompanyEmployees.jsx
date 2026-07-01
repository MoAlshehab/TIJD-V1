import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import { useToast } from '@/Components/Toast/ToastProvider';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faUserPlus, faCalendarAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import ConfirmModal from '@/Components/ConfirmModal.jsx';

export default function CompanyEmployees(props) {
    const { companyEmployees } = props;
    const employeesCount = companyEmployees.length;
    const { t } = useTranslation();
    const { showToast } = useToast();
    const [employeeAction, setEmployeeAction] = useState(null);
    // { type: 'link' | 'unlink', userId, companyId }

    const [showTitle, setShowTitle] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showWorkDaysModal, setShowWorkDaysModal] = useState(false);

    const [formData, setFormData] = useState({
        day_of_week: '',
        start_time: '',
        end_time: '',
    });

    const askLinkEmployee = (userId, companyId) => {
        setEmployeeAction({ type: 'link', userId, companyId });
    };

    const askUnlinkEmployee = (userId) => {
        setEmployeeAction({ type: 'unlink', userId });
    };

    const confirmEmployeeAction = () => {
        if (!employeeAction) return;

        if (employeeAction.type === 'link') {
            router.post(
                `/owner/user/${employeeAction.userId}/company/${employeeAction.companyId}`,
                {},
                {
                    preserveScroll: true,
                    onFinish: () => {
                        setEmployeeAction(null);
                    },
                }
            );
        }

        if (employeeAction.type === 'unlink') {
            router.delete(`/owner/user/${employeeAction.userId}/company`, {
                preserveScroll: true,
                onFinish: () => {
                    setEmployeeAction(null);
                },
            });
        }
    };

    const openModal = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setFormData({ day_of_week: '', start_time: '', end_time: '' });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        if (!selectedUser) return;

        router.post(
            '/owner/employee/availability',
            {
                employee_id: selectedUser.id,
                company_id: selectedUser.company_id,
                ...formData,
            },
            {
                onSuccess: () => {
                    closeModal();
                    if (showWorkDaysModal) {
                        // fetchWorkDays(selectedUser.id, selectedUser); // zorg dat dit ergens gedefinieerd is als je het gebruikt
                    }
                },
                onError: (errors) => {
                    console.error('Fout bij opslaan:', errors);
                    alert(t('error_saving'));
                },
            }
        );
    };

    useEffect(() => {
        const handleScroll = () => {
            setShowTitle(window.scrollY > 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="bg-amber-50 dark:bg-gray-900 text-center pb-10 min-h-screen">
            <div
                className={`fixed top-0 w-full z-10 transition-all duration-300 ${showTitle ? 'py-4 shadow-md bg-white dark:bg-gray-800' : 'py-2 bg-white dark:bg-gray-900'}`}
            >
                {showTitle && (
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-200">
                        {t('customers')}
                    </h1>
                )}
            </div>

            <div className="pt-16 px-4">
                <p className="text-lg font-semibold mb-6 text-gray-900 dark:text-gray-100">
                    {employeesCount} {t('employees')}
                </p>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {companyEmployees.map((employee) => (
                        <div
                            key={employee.id}
                            className="bg-white dark:bg-gray-800 p-6 shadow-md rounded-lg hover:shadow-lg transition-shadow"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                                        {employee.user.name}
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        {t('email_address')}: {employee.user.email}
                                    </p>
                                </div>

                                {employee.user.company_id ? (
                                    <button
                                        onClick={() => askUnlinkEmployee(employee.user.id)}
                                        className="p-2 rounded-full text-red-500 hover:bg-red-50"
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                ) : (
                                    <button
                                        onClick={() =>
                                            askLinkEmployee(employee.user.id, employee.company_id)
                                        }
                                        className="p-2 rounded-full text-primary hover:bg-blue-50"
                                    >
                                        <FontAwesomeIcon icon={faUserPlus} />
                                    </button>
                                )}
                            </div>
                            {employee.user.company_id && (
                                <div className="flex flex-col space-y-2">
                                    <button
                                        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                                        onClick={() => openModal(employee.user)}
                                    >
                                        <FontAwesomeIcon icon={faClock} />
                                        {t('add_time')}
                                    </button>

                                    <button
                                        className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                                        onClick={() =>
                                            router.visit(`/owner/${employee.user.id}/schedule`)
                                        }
                                    >
                                        <FontAwesomeIcon icon={faCalendarAlt} />
                                        {t('show_work_times')}
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Modal voor beschikbaarheid toevoegen */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md text-gray-900 dark:text-gray-100">
                            <h2 className="text-xl font-bold mb-4">
                                {t('add_availability_for')} {selectedUser?.name}
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 dark:text-gray-300 mb-1">
                                        {t('day_of_week')}
                                    </label>
                                    <select
                                        name="day_of_week"
                                        value={formData.day_of_week}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                                        required
                                    >
                                        <option value="">{t('select_day')}</option>
                                        <option value="maandag">{t('monday')}</option>
                                        <option value="dinsdag">{t('tuesday')}</option>
                                        <option value="woensdag">{t('wednesday')}</option>
                                        <option value="donderdag">{t('thursday')}</option>
                                        <option value="vrijdag">{t('friday')}</option>
                                        <option value="zaterdag">{t('saturday')}</option>
                                        <option value="zondag">{t('sunday')}</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 dark:text-gray-300 mb-1">
                                            {t('start_time')}
                                        </label>
                                        <input
                                            type="time"
                                            name="start_time"
                                            value={formData.start_time}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 dark:text-gray-300 mb-1">
                                            {t('end_time')}
                                        </label>
                                        <input
                                            type="time"
                                            name="end_time"
                                            value={formData.end_time}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={closeModal}
                                    className="px-4 py-2 bg-gray-300 dark:bg-gray-700 dark:text-gray-300 rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition"
                                >
                                    {t('cancel')}
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded transition"
                                >
                                    {t('save')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <ConfirmModal
                    open={!!employeeAction}
                    title={
                        employeeAction?.type === 'link' ? t('Add employee') : t('Remove employee')
                    }
                    message={
                        employeeAction?.type === 'link'
                            ? t('Are you sure you want to add this employee?')
                            : t('Are you sure you want to remove this employee?')
                    }
                    confirmText={t('Yes')}
                    cancelText={t('Cancel')}
                    onConfirm={confirmEmployeeAction}
                    onCancel={() => setEmployeeAction(null)}
                />
            </div>
        </div>
    );
}
