import axios from 'axios';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import ToggleSwitch from '@/Components/ToggleSwitch';

export default function PushNotificationSettings() {

    const getInitialNotifications = () => {
        return localStorage.getItem('notifications') === 'true';
    };

    const [notifications, setNotifications] =
        useState(getInitialNotifications);

    const [message, setMessage] = useState('');

    const urlBase64ToUint8Array = (base64String) => {
        const padding = '='.repeat(
            (4 - (base64String.length % 4)) % 4
        );

        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);

        return Uint8Array.from(
            [...rawData].map(
                (char) => char.charCodeAt(0)
            )
        );
    };

    const enableNotifications = async () => {
        try {
            if (!('serviceWorker' in navigator)) {
                throw new Error(
                    'Service Workers worden niet ondersteund.'
                );
            }

            if (!('PushManager' in window)) {
                throw new Error(
                    'Pushmeldingen worden niet ondersteund.'
                );
            }

            let permission = Notification.permission;

            if (permission === 'default') {
                permission =
                    await Notification.requestPermission();
            }

            if (permission !== 'granted') {
                throw new Error(
                    'Meldingen zijn niet toegestaan.'
                );
            }

            const registration =
                await navigator.serviceWorker.ready;

            let subscription =
                await registration.pushManager.getSubscription();

            if (!subscription) {
                const { data } =
                    await axios.get('/push/vapid-key');

                if (!data.publicKey) {
                    throw new Error(
                        'VAPID public key ontbreekt.'
                    );
                }

                subscription =
                    await registration.pushManager.subscribe({
                        userVisibleOnly: true,

                        applicationServerKey:
                            urlBase64ToUint8Array(
                                data.publicKey
                            ),
                    });
            }

            const json = subscription.toJSON();

            await axios.post('/push/subscribe', {
                endpoint: json.endpoint,
                keys: json.keys,
                contentEncoding: 'aes128gcm',
            });

            setMessage('Meldingen staan aan.');

        } catch (error) {
            console.error(error);

            setMessage(
                error.response?.data?.message ??
                error.message ??
                'Meldingen konden niet worden ingeschakeld.'
            );
        }
    };

    const disableNotifications = async () => {
        try {
            const registration =
                await navigator.serviceWorker.ready;

            const subscription =
                await registration.pushManager.getSubscription();

            if (subscription) {
                await axios.delete('/push/unsubscribe', {
                    data: {
                        endpoint: subscription.endpoint,
                    },
                });
            }

            setMessage('Meldingen staan uit.');

        } catch (error) {
            console.error(error);

            setMessage(
                'Meldingen konden niet worden uitgeschakeld.'
            );
        }
    };

    // ✅ PRECIES zoals je dark-mode switch
    const handleNotificationChange = async (event) => {

        const newValue = event.target.checked;

        // Switch DIRECT veranderen
        setNotifications(newValue);

        // Keuze bewaren
        localStorage.setItem(
            'notifications',
            newValue ? 'true' : 'false'
        );

        // Daarna pas Web Push regelen
        if (newValue) {
            await enableNotifications();
        } else {
            await disableNotifications();
        }
    };

    return (
        <div>
            <div className="flex items-center gap-4 justify-between">

                <div className="flex items-center gap-4">

                    <FontAwesomeIcon
                        icon={faBell}
                        size="2x"
                        className="text-yellow-500 dark:text-yellow-400"
                    />

                    <span className="text-xl font-medium">
                        Meldingen
                    </span>
                </div>

                <ToggleSwitch
                    checked={notifications}
                    onChange={handleNotificationChange}
                    labelOn="🔔"
                    labelOff="🔕"
                />

            </div>

            {message && (
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {message}
                </p>
            )}
        </div>
    );
}