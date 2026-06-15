import React from 'react';
import { useTranslation } from 'react-i18next';

const FilterDropdown = ({ value, onChange }) => {
    const { t } = useTranslation();

    return (
        <div className="mb-6">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="px-4 py-2 rounded bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-600"
            >
                <option value="all">{t('all')}</option>
                <option value="day">{t('today')}</option>
                <option value="week">{t('this_week')}</option>
                <option value="month">{t('this_month')}</option>
                <option value="year">{t('this_year')}</option>
            </select>
        </div>
    );
};

export default FilterDropdown;
