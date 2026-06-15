import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import transitionEN from './Lang/en.json';
import transitionNL from './Lang/nl.json';
import transitionAR from './Lang/ar.json';
import transitionDU from './Lang/du.json';

const resources = {
    en: {
        translation: transitionEN,
    },
    nl: {
        translation: transitionNL,
    },
    ar: {
        translation: transitionAR,
    },
    du: {
        translation: transitionDU,
    },
};

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        lng: localStorage.getItem('lang') || 'nl',
        interpolation: {
            escapeValue: false,
        },
        react: {
            useSuspense: false,
        },
    });

export default i18n;
