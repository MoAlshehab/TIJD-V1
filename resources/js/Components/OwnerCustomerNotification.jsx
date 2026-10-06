import { useState } from 'react';
import { router } from '@inertiajs/react';

export default function OwnerCustomerNotification({ company }) {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [url, setUrl] = useState(
        `/companies/${company.id}/details`
    );

    const [sending, setSending] = useState(false);

    const sendNotification = (e) => {
        e.preventDefault();

        if (
            !company?.id ||
            !title.trim() ||
            !message.trim()
        ) {
            return;
        }

        setSending(true);

        router.post(
            `/owner/company/${company.id}/notifications/send`,
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
                },

                onFinish: () => {
                    setSending(false);
                },
            }
        );
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">

            <h2 className="text-2xl font-semibold mb-2">
                Klantenmelding
            </h2>

            <p className="text-gray-500 dark:text-gray-400 mb-6">
                Verstuur een pushmelding naar klanten die{' '}
                <strong>{company.name}</strong>{' '}
                als favoriet hebben.
            </p>

            <form
                onSubmit={sendNotification}
                className="space-y-5"
            >

                {/* Titel */}
                <div>
                    <label className="block mb-2 font-medium">
                        Titel
                    </label>

                    <input
                        type="text"
                        value={title}
                        onChange={(e) =>
                            setTitle(e.target.value)
                        }
                        maxLength={100}
                        placeholder="Bijvoorbeeld: Nieuwe aanbieding"
                        className="
                            w-full
                            p-3
                            border
                            rounded-lg
                            bg-white
                            dark:bg-gray-700
                            dark:border-gray-600
                            dark:text-white
                        "
                    />
                </div>

                {/* Bericht */}
                <div>
                    <label className="block mb-2 font-medium">
                        Bericht
                    </label>

                    <textarea
                        value={message}
                        onChange={(e) =>
                            setMessage(e.target.value)
                        }
                        rows={5}
                        maxLength={500}
                        placeholder="Schrijf hier je bericht..."
                        className="
                            w-full
                            p-3
                            border
                            rounded-lg
                            bg-white
                            dark:bg-gray-700
                            dark:border-gray-600
                            dark:text-white
                        "
                    />
                </div>

                {/* Link */}
                <div>
                    <label className="block mb-2 font-medium">
                        Link na klikken
                    </label>

                    <input
                        type="text"
                        value={url}
                        onChange={(e) =>
                            setUrl(e.target.value)
                        }
                        className="
                            w-full
                            p-3
                            border
                            rounded-lg
                            bg-white
                            dark:bg-gray-700
                            dark:border-gray-600
                            dark:text-white
                        "
                    />

                    <p className="text-sm text-gray-500 mt-1">
                        Standaard gaat de klant naar dit bedrijf.
                    </p>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={
                        sending ||
                        !title.trim() ||
                        !message.trim()
                    }
                    className="
                        w-full
                        bg-blue-600
                        hover:bg-blue-700
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                        text-white
                        px-5
                        py-3
                        rounded-lg
                        transition
                    "
                >
                    {sending
                        ? 'Versturen...'
                        : '🔔 Verstuur naar klanten'}
                </button>

            </form>
        </div>
    );
}