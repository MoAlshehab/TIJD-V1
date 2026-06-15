import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";
import i18n from "laravel-react-i18n/vite";
import path from "path";

export default defineConfig({
    server: {
        host: "0.0.0.0",
        port: 5173,
        strictPort: true,
        hmr: {
            host: "192.168.2.33",
            protocol: "ws",
        },
    },

    plugins: [
        laravel({
            input: [
                "resources/sass/app.scss",
                "resources/js/app.js",
            ],
            refresh: true,
        }),
        react(),
        i18n(),
    ],

    resolve: {
        alias: {
            "@": path.resolve(__dirname, "resources/js"),
        },
    },
});
