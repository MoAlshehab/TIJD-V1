import { useRef, useState } from 'react';
import { router } from '@inertiajs/react';

export default function ImportExportDropdown({
    companyId,
    t,
}) {
    const fileInputRef = useRef();
    const [loading, setLoading] = useState(false);

    /*
    |--------------------------------------------------------------------------
    | Import
    |--------------------------------------------------------------------------
    */
    const handleFileChange = (event) => {
        const file = event.target.files[0];

        if (!file) {
            return;
        }

        const formData = new FormData();

        formData.append('file', file);

        setLoading(true);

        router.post(
            `/owner/company/${companyId}/appointments/import`,
            formData,
            {
                preserveScroll: true,
                forceFormData: true,

                onSuccess: () => {
                    if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                    }
                },

                onFinish: () => {
                    setLoading(false);
                },
            }
        );
    };

    /*
    |--------------------------------------------------------------------------
    | PDF downloaden
    |--------------------------------------------------------------------------
    */
    const downloadPdf = (period) => {
        window.location.href =
            `/owner/appointments/pdf?period=${period}`;
    };

    const pdfButtonClass = `
        inline-flex
        items-center
        justify-between
        w-full
        px-5
        py-3
        rounded-xl
        shadow-md
        font-semibold
        text-white
        bg-red-500
        hover:bg-red-600
        transition
    `;

    return (
        <div className="flex flex-col gap-4">

            {/* PDF Vandaag */}
            <button
                type="button"
                onClick={() => downloadPdf('day')}
                className={pdfButtonClass}
            >
                <span>
                    📄 {t('PDF Today')}
                </span>

                <span>→</span>
            </button>

            {/* PDF Deze week */}
            <button
                type="button"
                onClick={() => downloadPdf('week')}
                className={pdfButtonClass}
            >
                <span>
                    📄 {t('PDF This week')}
                </span>

                <span>→</span>
            </button>

            {/* PDF Deze maand */}
            <button
                type="button"
                onClick={() => downloadPdf('month')}
                className={pdfButtonClass}
            >
                <span>
                    📄 {t('PDF This month')}
                </span>

                <span>→</span>
            </button>

            {/* PDF Afgelopen 3 maanden */}
            <button
                type="button"
                onClick={() =>
                    downloadPdf('last3months')
                }
                className={pdfButtonClass}
            >
                <span>
                    📄 {t('PDF Last 3 months')}
                </span>

                <span>→</span>
            </button>

            {/* PDF Afgelopen 6 maanden */}
            <button
                type="button"
                onClick={() =>
                    downloadPdf('last6months')
                }
                className={pdfButtonClass}
            >
                <span>
                    📄 {t('PDF Last 6 months')}
                </span>

                <span>→</span>
            </button>

            {/* Import */}
            <button
                type="button"
                onClick={() =>
                    fileInputRef.current?.click()
                }
                disabled={loading}
                className={`
                    inline-flex
                    items-center
                    justify-center
                    w-full
                    px-5
                    py-3
                    rounded-xl
                    shadow-md
                    font-semibold
                    text-white
                    transition

                    ${
                        loading
                            ? 'bg-gray-400'
                            : 'bg-accent hover:bg-accentDark'
                    }
                `}
            >
                📤{' '}

                {loading
                    ? t('Importing...')
                    : t(
                        'Import appointments (Excel or CSV)'
                    )}
            </button>

            <input
                type="file"
                accept=".xlsx,.xls,.csv"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
            />
        </div>
    );
}