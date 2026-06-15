import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import UsersList from './UsersList.jsx';
import { Link, usePage, router } from '@inertiajs/react';

import MyCompany from '../MyCompany.jsx';
export default function Users(props) {
    const { users, usersCount } = props;
    const { t, i18n } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const filteredUsers = users.filter((user) =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
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
    // TODO : ik ga dit misschien in de Admin file verplatssen
    return (
        <div className="bg-light dark:bg-grayDark text-center">
            <div className="fixed top-0 w-full bg-white z-10">
                {showTitle && ( // Toon de titel alleen als showTitle true is
                    <h1 className="text-2xl font-bold"> {t('users')}</h1>
                )}
            </div>
            <h1>Users page</h1>
            <p>
                {usersCount} {t('users')}
            </p>
            <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                placeholder="Email"
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            {!!auth.user?.is_admin ? (
                <Link href="/admin/users/archived" className="text-blue-600 hover:underline">
                    {t('archive')}
                </Link>
            ) : (
                ''
            )}
            <UsersList users={filteredUsers} />
        </div>
    );
}
