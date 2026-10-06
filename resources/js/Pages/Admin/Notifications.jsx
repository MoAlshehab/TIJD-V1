import React from 'react';
import AdminPushNotification from '@/Components/AdminPushNotification';

export default function Notifications() {
    return (
        <div className="min-h-screen bg-light dark:bg-grayDark px-4 py-10">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-white">
                    Gebruikersmeldingen
                </h1>

                <AdminPushNotification />
            </div>
        </div>
    );
}