import { useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function ResetPassword({ token, email }) {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors } = useForm({
        token,
        email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/reset-password');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-light dark:bg-grayDark px-4">
            <form
                onSubmit={submit}
                className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 max-w-md w-full"
                noValidate
            >
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 text-center">
                    {t('reset_password')}
                </h2>

                <input type="hidden" value={data.token} />

                {/* E-mail */}
                <div className="mb-4">
                    <label
                        htmlFor="email"
                        className="block text-gray-700 dark:text-gray-200 font-medium mb-1"
                    >
                        {t('email')}
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition
                            bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                            ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                        required
                        autoComplete="email"
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                </div>

                {/* Password */}
                <div className="mb-4">
                    <label
                        htmlFor="password"
                        className="block text-gray-700 dark:text-gray-200 font-medium mb-1"
                    >
                        {t('new_password')}
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition
                            bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                            ${errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                        required
                        autoComplete="new-password"
                    />
                    {errors.password && (
                        <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                    )}
                </div>

                {/* Confirm Password */}
                <div className="mb-6">
                    <label
                        htmlFor="password_confirmation"
                        className="block text-gray-700 dark:text-gray-200 font-medium mb-1"
                    >
                        {t('confirm_password')}
                    </label>
                    <input
                        id="password_confirmation"
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition
                            bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                            ${errors.password_confirmation ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                        required
                        autoComplete="new-password"
                    />
                    {errors.password_confirmation && (
                        <p className="mt-1 text-sm text-red-500">{errors.password_confirmation}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                        text-white font-semibold py-2 rounded-md transition"
                >
                    {processing ? t('sending') : t('reset_password')}
                </button>
            </form>
        </div>
    );
}
