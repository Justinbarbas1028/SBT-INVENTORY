@props([
    'tone' => 'slate',
])

@php
    $tones = [
        'slate' => 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
        'emerald' => 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
        'amber' => 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
        'indigo' => 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300',
        'rose' => 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
        'violet' => 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300',
        'sky' => 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
        'cyan' => 'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-300',
        'teal' => 'bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300',
        'orange' => 'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300',
    ];
@endphp

<span {{ $attributes->class(['inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold', $tones[$tone] ?? $tones['slate']]) }}>
    {{ $slot }}
</span>
