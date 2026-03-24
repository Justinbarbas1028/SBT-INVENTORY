<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="h-full">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>@yield('title', 'SBT Inventory')</title>

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700,800" rel="stylesheet" />

        <script>
            (() => {
                const theme = localStorage.getItem('sbt-inventory-theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const mode = theme === 'light' || theme === 'dark' ? theme : (prefersDark ? 'dark' : 'light');
                document.documentElement.classList.toggle('dark', mode === 'dark');
                document.documentElement.style.colorScheme = mode;
            })();
        </script>

        @vite(['resources/css/app.css', 'resources/js/app.js'])
        @stack('head')
    </head>
    <body class="app-shell min-h-full">
        <div class="app-backdrop hidden" data-sidebar-backdrop></div>

        <div class="app-frame">
            @include('partials.sidebar')

            <div class="flex min-w-0 flex-1 flex-col">
                @include('partials.topbar')

                <main class="app-main">
                    <div class="page-shell">
                        @include('partials.flash')
                        @yield('content')
                    </div>
                </main>
            </div>
        </div>

        @include('partials.quick-actions')

        @stack('scripts')
    </body>
</html>
