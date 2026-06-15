import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import AppointmentsList from '../../components/AppointmentsList.jsx';
import { Link, usePage, router } from '@inertiajs/react';

export default function Appointments(props) {
    const { appointments } = props;
    const { t, i18n } = useTranslation();
    const [showTitle, setShowTitle] = useState(false); // State om de titel te tonen/verbergen

    useEffect(() => {
        // Voeg een eventlistener toe voor scrollen
        const handleScroll = () => {
            if (window.scrollY > 100) {
                // Toon de titel als de gebruiker 100 pixels naar beneden scrollt
                setShowTitle(true);
            } else {
                setShowTitle(false);
            }
        };

        // Registreer de eventlistener wanneer de component wordt gemonteerd
        window.addEventListener('scroll', handleScroll);

        // Verwijder de eventlistener wanneer de component wordt gedemonteerd
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    const { auth } = usePage().props;

    return (
        <div className="bg-amber-50 text-center">
            <div className="fixed top-0 w-full bg-white z-10">
                {showTitle && ( // Toon de titel alleen als showTitle true is
                    <h1 className="text-2xl font-bold"> {t('appointments')}</h1>
                )}
            </div>
            {!!auth.user?.is_admin ? (
                <Link href="/admin/AppointmentArchive" className="text-red-200">
                    {t('archive')}
                </Link>
            ) : (
                ''
            )}
            {/*<div>*/}
            {/*    <a type="download" className={'btn btn-success btn-sm float-right mb-10'}*/}
            {/*        href={`/admin/allapointments/export`}>Download</a></div>*/}
            <AppointmentsList appointments={appointments} />
        </div>
    );
}
