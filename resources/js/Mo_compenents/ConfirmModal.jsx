export default function ConfirmModal({
    open,
    title = 'Bevestigen',
    message,
    confirmText = 'Verwijderen',
    cancelText = 'Annuleren',
    onConfirm,
    onCancel,
}) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-md p-6">
                <h2 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">{title}</h2>

                <p className="text-gray-700 dark:text-gray-300 mb-6">{message}</p>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-600 hover:bg-gray-300"
                    >
                        {cancelText}
                    </button>

                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded bg-danger text-white hover:bg-danger/80"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
