import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import CompaniesList from '../../Components/CompaniesList.jsx';
import { usePage } from '@inertiajs/react';
import SearchInput from '@/Components/SearchInput';

export default function Home(props) {
    const { companies, favorites } = props;
    const { auth } = usePage().props;

    const { t } = useTranslation();

    const [searchTerm, setSearchTerm] = useState('');
    const [showTitle, setShowTitle] = useState(false);

    const filteredCompanies = companies.filter((company) => {
        const companyName = company.name?.toLowerCase() || '';
        const ownerName = company.owner?.name?.toLowerCase() || '';
        const term = searchTerm.toLowerCase();
        return companyName.includes(term) || ownerName.includes(term);
    });

    useEffect(() => {
        const handleScroll = () => {
            setShowTitle(window.scrollY > 100);
        };

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="bg-light dark:bg-grayDark  text-dark dark:text-dark-text text-center min-h-screen">
            <div className="fixed top-0 w-full bg-light dark:bg-grayDark z-10 p-2">
                {showTitle && (
                    <h1 className="text-2xl font-bold text-dark dark:text-dark-text">
                        {t('companies')}
                    </h1>
                )}
            </div>
            <div className="px-4 py-4">
                <SearchInput
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t('search_company_name_or_owner')}
                />

                {!!auth.user?.is_admin && (
                    <div className="m-5">
                        <a
                            type="download"
                            className="bg-transparent hover:bg-success text-success dark:text-success font-semibold hover:text-light py-2 px-4 border border-success dark:border-success hover:border-transparent rounded"
                            href={`/admin/allcompanies/export`}
                        >
                            {t('download')}
                        </a>
                    </div>
                )}

                <div className={showTitle ? 'mt-20' : 'mt-6'}>
                    {filteredCompanies.length === 0 ? (
                        <p className="text-dark dark:text-dark-text">{t('no_results_found')}</p>
                    ) : (
                        <CompaniesList companies={filteredCompanies} favorites={favorites} />
                    )}
                </div>
            </div>
        </div>
    );
}
