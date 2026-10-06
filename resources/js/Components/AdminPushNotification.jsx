import { useState } from 'react';
import { router } from '@inertiajs/react';

export default function AdminPushNotification() {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [url, setUrl] = useState('/');
    const [sending, setSending] = useState(false);

    const sendNotification = (e) => {
        e.preventDefault();

        if (!title.trim() || !message.trim()) {
            return;
        }

        setSending(true);

        router.post(
            '/admin/push/send',
            {
                title,
                message,
                url,
            },
            {
                preserveScroll: true,

                onSuccess: () => {
                    setTitle('');
                    setMessage('');
                    setUrl('/');
                },

                onFinish: () => {
                    setSending(false);
                },
            }
        );
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-5">
                Pushmelding versturen
            </h2>

            <form
                onSubmit={sendNotification}
                className="space-y-4"
            >
                <div>
                    <label className="block mb-1 font-medium">
                        Titel
                    </label>

                    <input
                        type="text"
                        value={title}
                        onChange={(e) =>
                            setTitle(e.target.value)
                        }
                        maxLength={100}
                        className="w-full border rounded-md p-2
                                   dark:bg-gray-700
                                   dark:border-gray-600"
                        placeholder="Bijvoorbeeld: Nieuwe update"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">
                        Bericht
                    </label>

                    <textarea
                        value={message}
                        onChange={(e) =>
                            setMessage(e.target.value)
                        }
                        maxLength={500}
                        rows={4}
                        className="w-full border rounded-md p-2
                                   dark:bg-gray-700
                                   dark:border-gray-600"
                        placeholder="Schrijf hier je melding..."
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">
                        Link na openen
                    </label>

                    <input
                        type="text"
                        value={url}
                        onChange={(e) =>
                            setUrl(e.target.value)
                        }
                        className="w-full border rounded-md p-2
                                   dark:bg-gray-700
                                   dark:border-gray-600"
                        placeholder="/"
                    />
                </div>

                <button
                    type="submit"
                    disabled={
                        sending ||
                        !title.trim() ||
                        !message.trim()
                    }
                    className="bg-blue-600 hover:bg-blue-700
                               disabled:opacity-50
                               text-white px-5 py-2
                               rounded-md transition"
                >
                    {sending
                        ? 'Versturen...'
                        : '🔔 Verstuur naar alle gebruikers'}
                </button>

                <button
                    type="button"
                    onClick={() => {
                        router.post('/admin/push/send-owners', {
                            title,
                            message,
                            url,
                        });
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-md"
                >
                    🔔 Verstuur naar alle owners
                </button>
            </form>
        </div>
    );
}