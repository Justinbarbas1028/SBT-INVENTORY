@extends('layouts.app')

@section('title', 'History')

@section('content')
    <div class="space-y-6">
        <section class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 class="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Transaction History</h1>
                <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">Review inventory movements across the system and export filtered results.</p>
            </div>
            <a href="{{ route('history.export', array_filter(['search' => $filters['search'] ?: null, 'type' => $filters['type'] !== 'All' ? $filters['type'] : null])) }}" class="btn btn-secondary">
                <x-icon name="download" class="h-4 w-4" />
                Export CSV
            </a>
        </section>

        <section class="panel overflow-hidden">
            <div class="border-b border-slate-100 p-4 dark:border-slate-800">
                <form method="GET" action="{{ route('history.index') }}" class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <select name="type" class="input-field max-w-xs">
                        <option value="All">All Types</option>
                        <option value="IN" @selected($filters['type'] === 'IN')>Check In (IN)</option>
                        <option value="OUT" @selected($filters['type'] === 'OUT')>Check Out (OUT)</option>
                    </select>

                    <div class="flex w-full max-w-sm items-center gap-3">
                        <label class="relative flex-1">
                            <x-icon name="search" class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input type="text" name="search" value="{{ $filters['search'] }}" placeholder="Search history..." class="input-field pl-11">
                        </label>
                        <button type="submit" class="btn btn-primary">Apply</button>
                    </div>
                </form>
            </div>

            <div class="overflow-x-auto">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Date</th>
                            <th>Item ID</th>
                            <th>Item Name</th>
                            <th>Employee ID</th>
                            <th>Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($transactions as $transaction)
                            <tr>
                                <td>
                                    <x-pill :tone="$transaction->type->value === 'IN' ? 'emerald' : 'amber'">
                                        <x-icon :name="$transaction->type->value === 'IN' ? 'arrow-down' : 'arrow-up'" class="h-3.5 w-3.5" />
                                        {{ $transaction->type->value }}
                                    </x-pill>
                                </td>
                                <td class="whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{{ optional($transaction->transacted_at)->format('M d, Y H:i') }}</td>
                                <td class="whitespace-nowrap font-mono text-xs text-slate-500 dark:text-slate-400">{{ $transaction->item?->code }}</td>
                                <td class="whitespace-nowrap font-semibold text-slate-900 dark:text-slate-100">{{ $transaction->item_name }}</td>
                                <td class="whitespace-nowrap font-mono text-xs text-slate-500 dark:text-slate-400">{{ $transaction->person_reference }}</td>
                                <td class="max-w-xs truncate text-sm text-slate-500 dark:text-slate-400" title="{{ $transaction->notes }}">{{ $transaction->notes ?: '-' }}</td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="6" class="px-6 py-10 text-center text-sm text-slate-500 dark:text-slate-400">No transactions found.</td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </section>
    </div>
@endsection
