import { useState } from 'react';
import OwnerCustomerNotification
    from '@/Components/OwnerCustomerNotification';

export default function Notifications({ companies = [] }) {
    const [selectedCompanyId, setSelectedCompanyId] =
        useState(
            companies.length > 0
                ? String(companies[0].id)
                : ''
        );

    const selectedCompany = companies.find(
        (company) =>
            String(company.id) ===
            String(selectedCompanyId)
    );

    return (
        <div className="
            min-h-screen
            bg-light
            dark:bg-grayDark
            text-gray-900
            dark:text-white
            px-4
            py-10
        ">
            <div className="max-w-2xl mx-auto">

                <h1 className="text-3xl font-semibold mb-2">
                    Klantenmeldingen
                </h1>

                <p className="
                    text-gray-500
                    dark:text-gray-400
                    mb-6
                ">
                    Stuur een pushmelding naar klanten
                    die jouw bedrijf als favoriet hebben.
                </p>

                {companies.length === 0 ? (
                    <div className="
                        bg-white
                        dark:bg-gray-800
                        rounded-xl
                        shadow-md
                        p-6
                    ">
                        Je hebt nog geen bedrijf.
                    </div>
                ) : (
                    <>
                        {/* Bedrijf kiezen */}
                        <div className="
                            bg-white
                            dark:bg-gray-800
                            rounded-xl
                            shadow-md
                            p-6
                            mb-6
                        ">
                            <label className="block mb-2 font-medium">
                                Kies bedrijf
                            </label>

                            <select
                                value={selectedCompanyId}
                                onChange={(e) =>
                                    setSelectedCompanyId(
                                        e.target.value
                                    )
                                }
                                className="
                                    w-full
                                    p-3
                                    border
                                    rounded-lg
                                    bg-white
                                    dark:bg-gray-700
                                    dark:border-gray-600
                                    dark:text-white
                                "
                            >
                                {companies.map((company) => (
                                    <option
                                        key={company.id}
                                        value={company.id}
                                    >
                                        {company.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Component */}
                        {selectedCompany && (
                            <OwnerCustomerNotification
                                key={selectedCompany.id}
                                company={selectedCompany}
                            />
                        )}
                    </>
                )}

            </div>
        </div>
    );
}