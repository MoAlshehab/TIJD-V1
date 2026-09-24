import axios from 'axios';
import { useState } from 'react';

export default function PushNotificationSettings() {
    const [loading, setLoading] = useState(false);
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
            [...rawData].map((char) => char.charCodeAt(0))
        );
    };

    const enableNotifications = async () => {
        try {
            setLoading(true);
            setMessage('');

            if (!('serviceWorker' in navigator)) {
                throw new Error(
                    'Deze browser ondersteunt geen Service Workers.'
                );
            }

            if (!('PushManager' in window)) {
                throw new Error(
                    'Deze browser ondersteunt geen pushmeldingen.'
                );
            }

            const permission =
                await Notification.requestPermission();

            if (permission !== 'granted') {
                throw new Error(
                    'Toestemming voor meldingen is niet gegeven.'
                );
            }

            const registration =
                await navigator.serviceWorker.ready;

            const { data } =
                await axios.get('/push/vapid-key');

            let subscription =
                await registration.pushManager.getSubscription();

            if (!subscription) {
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

            setMessage('Meldingen zijn ingeschakeld.');
        } catch (error) {
            console.error(error);

            setMessage(
                error.response?.data?.message ??
                error.message ??
                'Meldingen inschakelen is mislukt.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button
                type="button"
                onClick={enableNotifications}
                disabled={loading}
            >
                {loading
                    ? 'Even wachten...'
                    : '🔔 Meldingen inschakelen'}
            </button>

            {message && (
                <p>{message}</p>
            )}
        </div>
    );
}