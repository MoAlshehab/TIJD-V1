import { useRef, useState } from 'react';
import { router } from '@inertiajs/react';

export default function ImportExportDropdown({ companyId, t }) {
    const fileInputRef = useRef();
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setLoading(true);

        router.post(`/owner/company/${companyId}/appointments/import`, formData, {
            preserveScroll: true,
            forceFormData: true, // ✅ belangrijk voor file upload
            onSuccess: () => {
                toast.success(t('Import successful')); // gebruik jouw toast systeem
                fileInputRef.current.value = ''; // reset file input
            },
            onError: () => {
                toast.error(t('Import failed'));
            },
            onFinish: () => {
                setLoading(false);
            },
        });
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Import knop */}
            <button
                onClick={() => fileInputRef.current.click()}
                disabled={loading}
                className={`inline-flex items-center justify-center px-5 py-3 rounded-xl shadow-md font-semibold text-white transition
                    ${loading ? 'bg-gray-400' : 'bg-accent hover:bg-accentDark'}`}
            >
                📤 {loading ? t('Importing...') : t('Import appointments (Excel or CSV)')}
            </button>

            <input
                type="file"
                accept=".xlsx,.xls,.csv" // ✅ Excel & CSV
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
            />
        </div>
    );
}
