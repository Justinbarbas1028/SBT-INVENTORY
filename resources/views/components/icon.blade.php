@props([
    'name',
    'class' => 'h-5 w-5',
])

<svg {{ $attributes->merge(['class' => $class, 'viewBox' => '0 0 24 24', 'fill' => 'none', 'stroke' => 'currentColor', 'stroke-width' => '1.8', 'stroke-linecap' => 'round', 'stroke-linejoin' => 'round']) }}>
    @switch($name)
        @case('dashboard')
            <rect x="3" y="3" width="7" height="8" rx="1.5" />
            <rect x="14" y="3" width="7" height="5" rx="1.5" />
            <rect x="14" y="12" width="7" height="9" rx="1.5" />
            <rect x="3" y="15" width="7" height="6" rx="1.5" />
            @break

        @case('package')
        @case('package-plus')
            <path d="M12 3 19 7v10l-7 4-7-4V7l7-4Z" />
            <path d="M12 3v18" />
            <path d="m5 7 7 4 7-4" />
            @if ($name === 'package-plus')
                <path d="M12 8v6" />
                <path d="M9 11h6" />
            @endif
            @break

        @case('arrow-down')
            <path d="M12 4v12" />
            <path d="m7 11 5 5 5-5" />
            <path d="M5 20h14" />
            @break

        @case('arrow-up')
            <path d="M12 20V8" />
            <path d="m7 13 5-5 5 5" />
            <path d="M5 4h14" />
            @break

        @case('history')
        @case('clock')
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
            @break

        @case('users')
            <path d="M16 19v-1a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v1" />
            <circle cx="10" cy="8" r="3" />
            <path d="M20 19v-1a3 3 0 0 0-2-2.82" />
            <path d="M16 5.5a3 3 0 0 1 0 5.82" />
            @break

        @case('truck')
            <path d="M3 7h11v8H3z" />
            <path d="M14 10h3l3 3v2h-6" />
            <circle cx="7.5" cy="18" r="1.5" />
            <circle cx="17.5" cy="18" r="1.5" />
            @break

        @case('clipboard')
            <rect x="6" y="5" width="12" height="16" rx="2" />
            <path d="M9 5.5h6v-1a1.5 1.5 0 0 0-1.5-1.5h-3A1.5 1.5 0 0 0 9 4.5v1Z" />
            <path d="M9 11h6" />
            <path d="M9 15h6" />
            @break

        @case('file-text')
            <path d="M7 3h7l5 5v13H7z" />
            <path d="M14 3v5h5" />
            <path d="M10 13h6" />
            <path d="M10 17h6" />
            @break

        @case('menu')
            <path d="M4 7h16" />
            <path d="M4 12h16" />
            <path d="M4 17h16" />
            @break

        @case('bell')
            <path d="M15 17H5l1.5-2.5V10a5.5 5.5 0 1 1 11 0v4.5L19 17h-4" />
            <path d="M10 20a2 2 0 0 0 4 0" />
            @break

        @case('search')
            <circle cx="11" cy="11" r="6" />
            <path d="m20 20-4.35-4.35" />
            @break

        @case('moon')
            <path d="M20 14.5A7.5 7.5 0 1 1 9.5 4 6 6 0 0 0 20 14.5Z" />
            @break

        @case('sun')
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2.5" />
            <path d="M12 19.5V22" />
            <path d="m4.93 4.93 1.77 1.77" />
            <path d="m17.3 17.3 1.77 1.77" />
            <path d="M2 12h2.5" />
            <path d="M19.5 12H22" />
            <path d="m4.93 19.07 1.77-1.77" />
            <path d="m17.3 6.7 1.77-1.77" />
            @break

        @case('download')
            <path d="M12 4v10" />
            <path d="m7 11 5 5 5-5" />
            <path d="M5 20h14" />
            @break

        @case('printer')
            <path d="M7 9V4h10v5" />
            <rect x="5" y="9" width="14" height="8" rx="2" />
            <path d="M7 14h10v6H7z" />
            @break

        @case('filter')
            <path d="M4 6h16l-6 7v5l-4-2v-3L4 6Z" />
            @break

        @case('trash')
            <path d="M4 7h16" />
            <path d="M10 11v6" />
            <path d="M14 11v6" />
            <path d="M6 7l1 12h10l1-12" />
            <path d="M9 4h6l1 3H8l1-3Z" />
            @break

        @case('check-circle')
        @case('badge-check')
            <circle cx="12" cy="12" r="9" />
            <path d="m8.5 12.5 2.2 2.2 4.8-5.2" />
            @break

        @case('alert-circle')
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v5" />
            <circle cx="12" cy="16.5" r="0.75" fill="currentColor" stroke="none" />
            @break

        @case('qr')
            <path d="M4 4h6v6H4z" />
            <path d="M14 4h6v6h-6z" />
            <path d="M4 14h6v6H4z" />
            <path d="M16 14v2" />
            <path d="M14 18h2" />
            <path d="M18 16h2v4h-4" />
            @break

        @case('plus')
            <path d="M12 5v14" />
            <path d="M5 12h14" />
            @break

        @case('x')
            <path d="m6 6 12 12" />
            <path d="m18 6-12 12" />
            @break

        @case('arrow-right')
            <path d="M5 12h14" />
            <path d="m13 7 5 5-5 5" />
            @break

        @case('archive')
            <rect x="4" y="5" width="16" height="4" rx="1.5" />
            <path d="M6 9h12v10H6z" />
            <path d="M10 13h4" />
            @break

        @case('edit')
            <path d="m4 20 4-.8L18.5 8.7a1.8 1.8 0 0 0 0-2.5l-.7-.7a1.8 1.8 0 0 0-2.5 0L4.8 16 4 20Z" />
            <path d="m13.5 7 3.5 3.5" />
            @break

        @case('send')
            <path d="M4 11.5 20 4l-5.5 16-2.5-6-8-2.5Z" />
            <path d="M12 14 20 4" />
            @break

        @case('key')
            <circle cx="8" cy="14" r="3" />
            <path d="M11 14h9" />
            <path d="M17 14v-2" />
            <path d="M20 14v-2" />
            @break

        @case('tag')
            <path d="M11 3H5a2 2 0 0 0-2 2v6l8 8 10-10-8-6Z" />
            <circle cx="7.5" cy="7.5" r="1" />
            @break

        @case('user')
            <circle cx="12" cy="8" r="3.5" />
            <path d="M5 20a7 7 0 0 1 14 0" />
            @break

        @default
            <circle cx="12" cy="12" r="8" />
    @endswitch
</svg>
