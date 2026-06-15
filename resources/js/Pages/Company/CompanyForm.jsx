import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { router, usePage } from '@inertiajs/react';
import InputField from '@/components/InputField';
import Button from '@/Components/Button';
import { useToast } from '@/Components/Toast/ToastProvider';

const CompanyForm = () => {
    const [files, setFiles] = useState([]);
    const { t } = useTranslation();
    const { errors } = usePage().props;
    const { showToast } = useToast();

    const [company, setCompany] = useState({
        name: '',
        kind: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        zip: '',
        autaccept: 0,
    });

    // const addCompany = () => {
    //     router.post(`/owner/companies${company.id ? '/' + company.id : ''}`, {
    //         ...company,
    //         files,
    //     }, {
    //         onSuccess: () => window.location.reload(),
    //     });
    // };

    const addCompany = () => {
        router.post(
            `/owner/companies${company.id ? '/' + company.id : ''}`,
            {
                ...company,
                files,
            },
            {
                // ✅ Succesvol opgeslagen
                onSuccess: () => {
                    showToast({
                        message: t('company_added_successfully'),
                        type: 'success',
                    });

                    // (optioneel) form resetten
                    setCompany({
                        name: '',
                        kind: '',
                        email: '',
                        phone: '',
                        address: '',
                        city: '',
                        zip: '',
                        autaccept: 0,
                    });
                    setFiles([]);
                },

                // ❌ Fout bij opslaan
                onError: () => {
                    showToast({
                        message: t('something_went_wrong'),
                        type: 'error',
                    });
                },
            }
        );
    };

    const handleInputChange = (event) => {
        setCompany({ ...company, [event.target.name]: event.target.value });
    };

    const addFiles = (event) => {
        setFiles(event.target.files);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <div className="text-left max-h-screen overflow-y-auto p-4 mb-8  mt-0">
            {/*<h1 className="text-2xl font-bold mb-4">{t("enter_company_data")}</h1>*/}

            <form onSubmit={handleSubmit} className="m-5" encType="multipart/form-data">
                <InputField
                    label={t('name')}
                    name="name"
                    value={company.name}
                    onChange={handleInputChange}
                    error={errors.name}
                />

                <InputField
                    label={t('kind')}
                    name="kind"
                    value={company.kind}
                    onChange={handleInputChange}
                    error={errors.kind}
                />

                <InputField
                    label={t('email')}
                    name="email"
                    type="email"
                    value={company.email}
                    onChange={handleInputChange}
                    error={errors.email}
                />

                <InputField
                    label={t('phone_number')}
                    name="phone"
                    value={company.phone}
                    onChange={handleInputChange}
                    error={errors.phone}
                />

                <InputField
                    label={t('address')}
                    name="address"
                    value={company.address}
                    onChange={handleInputChange}
                    error={errors.address}
                />

                <InputField
                    label={t('city')}
                    name="city"
                    value={company.city}
                    onChange={handleInputChange}
                    error={errors.city}
                />

                <InputField
                    label={t('zip')}
                    name="zip"
                    value={company.zip}
                    onChange={handleInputChange}
                    error={errors.zip}
                />

                <div className="mb-4">
                    <input
                        type="file"
                        id="files"
                        name="file"
                        accept="image/*"
                        onChange={addFiles}
                        className="
            mt-2 block w-full text-sm text-gray-700
            border border-gray-300 rounded-lg
            focus:ring-primary focus:border-primary
            file:bg-primary file:text-white file:border-0
            file:py-2 file:px-4 file:rounded-lg
            cursor-pointer
        "
                    />
                </div>

                <div className="flex items-center space-x-2 mb-6">
                    <input
                        type="checkbox"
                        id="autaccept"
                        checked={company.autaccept === 1}
                        onChange={(e) =>
                            setCompany({ ...company, autaccept: e.target.checked ? 1 : 0 })
                        }
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="autaccept" className="text-sm text-gray-700 dark:text-gray-300">
                        {t('auto_accept_appointments')}
                    </label>
                </div>

                <Button onClick={addCompany} variant="success">
                    {t('save')}
                </Button>
            </form>
        </div>
    );
};

export default CompanyForm;
