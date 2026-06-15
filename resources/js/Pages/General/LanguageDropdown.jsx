import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';

const LANGUAGES = {
    nl: { name: 'Nederlands', flag: '🇳🇱' },
    en: { name: 'English', flag: '🇬🇧' },
    ar: { name: 'العربية', flag: '🇸🇦' },
};

export default function LanguageDropdown() {
    const { i18n } = useTranslation();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => setOpen((prev) => !prev);
    const changeLanguage = (langCode) => {
        i18n.changeLanguage(langCode);
        localStorage.setItem('lang', langCode); // <-- Sla taal op
        setIsLangOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative ml-auto" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-primaryDark"
            >
                <FontAwesomeIcon icon={faGlobe} />
                <span>{LANGUAGES[i18n.language]?.flag}</span>
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded shadow z-50">
                    {Object.entries(LANGUAGES).map(([code, { name, flag }]) => (
                        <button
                            key={code}
                            onClick={() => changeLanguage(code)}
                            className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                                i18n.language === code
                                    ? 'font-bold text-blue-600 dark:text-blue-400'
                                    : 'text-gray-800 dark:text-gray-200'
                            }`}
                        >
                            <span className="mr-2">{flag}</span>
                            {name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
