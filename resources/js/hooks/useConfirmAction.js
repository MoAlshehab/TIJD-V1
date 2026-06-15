import { useState } from 'react';
import { router } from '@inertiajs/react';

export default function useConfirmAction({ t, showToast }) {
    const [action, setAction] = useState(null);

    const openConfirm = (config) => {
        setAction(config);
    };

    const confirm = () => {
        if (!action) return;

        const { url, method = 'post', successMessage, errorMessage } = action;

        router[method](
            url,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    showToast({ message: successMessage, type: 'success' });
                },
                onError: () => {
                    showToast({ message: errorMessage, type: 'error' });
                },
            }
        );

        setAction(null);
    };

    const cancel = () => setAction(null);

    return {
        action,
        openConfirm,
        confirm,
        cancel,
    };
}
