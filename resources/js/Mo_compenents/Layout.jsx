import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import Navbar from '../Pages/Navbar';
import Footer from '../Pages/General/Footer.jsx';
import { ToastProvider, useToast } from '@/Components/Toast/ToastProvider';
import { useTranslation } from 'react-i18next';

function LayoutContent({ children }) {
    const { flash } = usePage().props;
    const { showToast } = useToast();
    const { t } = useTranslation(); // ✅ TOEVOEGEN

    useEffect(() => {
        if (flash?.success) {
            showToast({
                message: t(flash.success), // ✅ HIER
                type: 'success',
            });
        }

        if (flash?.warning) {
            showToast({
                message: t(flash.warning), // ✅ HIER
                type: 'warning',
            });
        }

        if (flash?.error) {
            showToast({
                message: t(flash.error), // ✅ HIER
                type: 'error',
            });
        }
    }, [flash]);

    return (
        <div className="min-h-screen flex flex-col bg-light dark:bg-grayDark text-black dark:text-white">
            <Navbar />
            <main className="flex-grow pt-16 pb-16">{children}</main>
            <Footer />
        </div>
    );
}

export default function Layout({ children }) {
    return (
        <ToastProvider>
            <LayoutContent>{children}</LayoutContent>
        </ToastProvider>
    );
}
