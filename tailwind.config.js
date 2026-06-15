module.exports = {
    darkMode: 'class', // dark mode via class
    content: [
        "./resources/**/*.js(x)",
    ],
    theme: {
        extend: {
            colors: {
                // primary: "#3B82F6",       // أزرق رئيسي
                primary: "#4169E1",       // أزرق رئيسي
                // primary: "#312e81",       // أزرق رئيسي
                secondary: "#7e812e",
                primaryDark: "#1E40AF",   // أزرق غامق (hover)
                accent: "#FCD34D",        // أصفر ذهبي ناعم
                light: "#F9FAFB",
                grayDark: "#111827",     // bg-gray-900

                // zeer licht grijs (achtergrond licht)
                dark: {                   // custom dark kleuren
                    background: '#121212',  // achtergrond donker
                    surface: '#1F2937',     // donkere surface, bv cards
                    text: '#E0E0E0',        // lichte tekst in dark mode
                    primary: '#00AEEF',
                },
                success: "#118f63",
                successDark: "#15803D",
                danger: "#EF4444",
                grayLight: "#E5E7EB",
                purpleSoft: "#6366F1",
            },

            keyframes: {
                slideIn: {
                    "0%": { opacity: 0, transform: "translateX(50px)" },
                    "100%": { opacity: 1, transform: "translateX(0)" },
                },
            },
            animation: {
                "slide-in": "slideIn 0.3s ease-out",
            },
            fontFamily: {
                sans: ['"Tajawal"', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
