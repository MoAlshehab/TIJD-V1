import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

export default function GlobalLoader() {
    const [loading, setLoading] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        const removeStart = router.on('start', () => {
            timerRef.current = setTimeout(() => {
                setLoading(true);
            }, 3000);
        });

        const removeFinish = router.on('finish', () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }

            setLoading(false);
        });

        return () => {
            removeStart();
            removeFinish();

            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    if (!loading) return null;

    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50">
            <div className="rounded-2xl bg-white px-7 py-6 text-center shadow-xl dark:bg-gray-800">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>

                <p className="mt-4 font-semibold text-gray-900 dark:text-white">
                    Laden...
                </p>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
                    Even geduld
                </p>
            </div>
        </div>
    );
}