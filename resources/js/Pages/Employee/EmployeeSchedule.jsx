import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faSave } from '@fortawesome/free-solid-svg-icons';

export default function EmployeeSchedule() {
    const { employee, work_days } = usePage().props;
    const [editingDay, setEditingDay] = useState(null);
    const [editData, setEditData] = useState({ start_time: '', end_time: '' });

    const startEdit = (day) => {
        setEditingDay(day.id);
        setEditData({
            start_time: day.start_time ?? '',
            end_time: day.end_time ?? '',
        });
    };

    const saveEdit = (id) => {
        router.put(`/owner/work-day/${id}`, editData, {
            preserveScroll: true,
            onSuccess: () => {
                setEditingDay(null);
                router.reload({ only: ['work_days'] });
            },
            onError: (errors) => {
                console.error('Update fout:', errors);
                alert('Kon werktijd niet bijwerken');
            },
        });
    };

    const deleteDay = (id) => {
        if (confirm('Weet je zeker dat je deze werktijd wilt verwijderen?')) {
            router.delete(`/owner/work-day/${id}`);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 ">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
                Werktijden van {employee.name}
            </h1>

            {work_days.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400">Geen werktijden gevonden.</p>
            ) : (
                <ul className="space-y-4">
                    {work_days.map((day) => (
                        <li
                            key={day.id}
                            className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 p-4 rounded"
                        >
                            <div className="text-gray-800 dark:text-gray-100 ">
                                <span className="capitalize font-medium">{day.day_of_week}</span>:
                                {editingDay === day.id ? (
                                    <span className="ml-2">
                                        <input
                                            type="time"
                                            value={editData.start_time}
                                            onChange={(e) =>
                                                setEditData({
                                                    ...editData,
                                                    start_time: e.target.value,
                                                })
                                            }
                                            className="border px-2 py-1 mx-1 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        />
                                        -
                                        <input
                                            type="time"
                                            value={editData.end_time}
                                            onChange={(e) =>
                                                setEditData({
                                                    ...editData,
                                                    end_time: e.target.value,
                                                })
                                            }
                                            className="border px-2 py-1 mx-1 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        />
                                    </span>
                                ) : (
                                    <span className="ml-2">
                                        {day.start_time} - {day.end_time}
                                    </span>
                                )}
                            </div>

                            <div className="flex gap-2">
                                {editingDay === day.id ? (
                                    <button
                                        onClick={() => saveEdit(day.id)}
                                        className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                                        title="Opslaan"
                                    >
                                        <FontAwesomeIcon icon={faSave} />
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => startEdit(day)}
                                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                        title="Bewerken"
                                    >
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                )}
                                <button
                                    onClick={() => deleteDay(day.id)}
                                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                    title="Verwijderen"
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
