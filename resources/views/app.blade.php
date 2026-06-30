<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8" />
    <title>Tijd</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />

    <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" href="/favicon.ico">

    <link rel="manifest" href="/manifest.json">
    <meta name="theme-color" content="#111827">

    <link rel="apple-touch-icon" href="/icon-192.png">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">

    <script>
        if (
            localStorage.getItem('theme') === 'dark' ||
            (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
        ) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    </script>

    @inertiaHead
    <meta name="csrf-token" content="{{ csrf_token() }}">

    @viteReactRefresh
    @vite([
        'resources/sass/app.scss',
        'resources/js/Inertia.jsx',
    ])
</head>

<body class="bg-light text-dark dark:bg-dark dark:text-light">
    @inertia
</body>
</html>