import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from '@inertiajs/react';

import {
    faGlobe,
    faBorderStyle,
    faBuildingCircleCheck,
    faCalendar,
    faUser,
} from '@fortawesome/free-solid-svg-icons';
import ToggleSwitch from '@/Components/ToggleSwitch';

export default function Settings() {
    const { t, i18n } = useTranslation();
    const [isLangOpen, setIsLangOpen] = useState(false);

    // ✅ Dark mode initialiseren op basis van localStorage of browser voorkeur
    const getInitialTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) return savedTheme === 'dark';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    };

    const [darkMode, setDarkMode] = useState(getInitialTheme);

    useEffect(() => {
        const html = document.documentElement;
        if (darkMode) {
            html.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            html.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    const toggleLang = () => setIsLangOpen((prev) => !prev);

    const changeLanguage = (langCode) => {
        i18n.changeLanguage(langCode);
        localStorage.setItem('lang', langCode); // <-- Sla taal op
        setIsLangOpen(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-light dark:bg-grayDark px-4 py-10">
            <div className="w-full max-w-lg bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-gray-900 dark:text-gray-100 transition-colors">
                <h2 className="text-3xl font-semibold mb-6 text-center">{t('settings')}</h2>

                <div className="space-y-6">
                    {/* Language Selection */}
                    <div
                        className="flex items-center gap-4 justify-between cursor-pointer"
                        onClick={toggleLang}
                    >
                        <div className="flex items-center gap-4">
                            <FontAwesomeIcon
                                icon={faGlobe}
                                size="2x"
                                className="text-blue-600 dark:text-blue-400"
                            />
                            <span className="text-xl font-medium">{t('languages')}</span>
                        </div>
                        <button
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 focus:outline-none"
                            aria-expanded={isLangOpen}
                            aria-controls="language-options"
                        >
                            {isLangOpen ? '▲' : '▼'}
                        </button>
                    </div>

                    {isLangOpen && (
                        <div
                            id="language-options"
                            className="mt-3 flex flex-wrap gap-3 justify-start"
                        >
                            <button
                                onClick={() => changeLanguage('nl')}
                                className="px-4 py-2 rounded bg-blue-100 dark:bg-blue-700 hover:bg-blue-200 dark:hover:bg-blue-600 text-blue-800 dark:text-white transition"
                            >
                                Nederlands
                            </button>
                            <button
                                onClick={() => changeLanguage('en')}
                                className="px-4 py-2 rounded bg-blue-100 dark:bg-blue-700 hover:bg-blue-200 dark:hover:bg-blue-600 text-blue-800 dark:text-white transition"
                            >
                                English
                            </button>
                            <button
                                onClick={() => changeLanguage('ar')}
                                className="px-4 py-2 rounded bg-blue-100 dark:bg-blue-700 hover:bg-blue-200 dark:hover:bg-blue-600 text-blue-800 dark:text-white transition"
                            >
                                العربية
                            </button>
                            <button
                                onClick={() => changeLanguage('du')}
                                className="px-4 py-2 rounded bg-blue-100 dark:bg-blue-700 hover:bg-blue-200 dark:hover:bg-blue-600 text-blue-800 dark:text-white transition"
                            >
                                Deutsch
                            </button>
                        </div>
                    )}

                    {/* Dark Mode Toggle */}
                    <div className="flex items-center gap-4 justify-between">
                        <div className="flex items-center gap-4">
                            <FontAwesomeIcon
                                icon={faBorderStyle}
                                size="2x"
                                className="text-green-600 dark:text-green-400"
                            />
                            <span className="text-xl font-medium">{t('dark_mode')}</span>
                        </div>
                        <ToggleSwitch
                            checked={darkMode}
                            onChange={() => setDarkMode(!darkMode)}
                            labelOn="🌙"
                            labelOff="☀️"
                        />
                    </div>

                    {/* Companies Setting */}
                    <div className="flex items-center gap-4">
                        <FontAwesomeIcon
                            icon={faBuildingCircleCheck}
                            size="2x"
                            className="text-indigo-600 dark:text-indigo-400"
                        />
                        <span className="text-xl font-medium">{t('companies')}</span>
                    </div>

                    {/* Appointments Setting */}
                    <div className="flex items-center gap-4">
                        <FontAwesomeIcon
                            icon={faCalendar}
                            size="2x"
                            className="text-orange-600 dark:text-orange-400"
                        />
                        <span className="text-xl font-medium">{t('appointments')}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <FontAwesomeIcon
                            icon={faUser}
                            size="2x"
                            className="text-purple-600 dark:text-purple-400"
                        />
                        <Link href="/profile" className="text-xl font-medium hover:underline">
                            {t('profile')}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
