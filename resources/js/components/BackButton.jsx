import React from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const BackButton = () => {
    const { t } = useTranslation();

    const handleBack = () => {
        window.history.back();
    };

    return (
        <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/80 dark:bg-primary dark:hover:bg-primary/70 transition"
        >
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>{t('back')}</span>
        </button>
    );
};

export default BackButton;
