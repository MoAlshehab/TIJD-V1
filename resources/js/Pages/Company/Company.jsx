import { useTranslation } from 'react-i18next';
import CompanyForm from './CompanyForm.jsx';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import Button from '../../Components/Button.jsx';

export default function Company() {
    const { t } = useTranslation();
    const [isFormVisible, setIsFormVisible] = useState(false);

    const toggleForm = () => setIsFormVisible(!isFormVisible);

    return (
        <div className="min-h-screen bg-light dark:bg-grayDark text-black dark:text-white text-center">
            <div className="pt-4">
                <Button onClick={toggleForm}>
                    <FontAwesomeIcon icon={faAdd} className="mr-2" />
                    {isFormVisible ? t('Close') : t('Add Company')}
                </Button>
            </div>

            {/* Inline Company Form */}
            {isFormVisible && (
                <div className="mx-auto bg-white dark:bg-gray-800 p-6 max-w-2xl w-full rounded-md shadow-md text-left">
                    <CompanyForm />
                </div>
            )}
        </div>
    );
}
