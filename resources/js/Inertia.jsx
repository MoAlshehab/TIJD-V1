import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import Layout from './Components/Layout';
import './i18n.jsx';
import { ToastProvider } from './components/Toast/ToastProvider.jsx'; // ✅ Correct pad

createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });
        const page = pages[`./Pages/${name}.jsx`];

        page.default.layout = page.default.layout || ((page) => <Layout>{page}</Layout>);

        return page;
    },

    setup({ el, App, props }) {
        createRoot(el).render(
            <ToastProvider>
                <App {...props} />
            </ToastProvider>
        );
    },
});
