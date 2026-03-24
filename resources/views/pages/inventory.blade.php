@extends('layouts.app')

@section('title', 'Inventory')

@section('content')
    @php
        $toggleDirection = function (string $column) use ($filters): string {
            if (($filters['sort'] ?? 'code') !== $column) {
                return 'asc';
            }

            return ($filters['direction'] ?? 'asc') === 'asc' ? 'desc' : 'asc';
        };

        $sortLink = fn (string $column) => route('inventory.index', array_filter([
            'category' => $filters['category'] !== 'All' ? $filters['category'] : null,
            'search' => $filters['search'] ?: null,
            'sort' => $column,
            'direction' => $toggleDirection($column),
        ]));
    @endphp

    <div class="space-y-6">
        <section class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 class="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Inventory Management</h1>
                <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">Search, filter, export, and maintain inventory records from one table.</p>
            </div>

            <div class="flex flex-wrap gap-3">
                <a href="{{ route('inventory.export', array_filter(['category' => $filters['category'] !== 'All' ? $filters['category'] : null, 'search' => $filters['search'] ?: null])) }}" class="btn btn-secondary">
                    <x-icon name="download" class="h-4 w-4" />
                    Export All
                </a>
                <button type="button" class="btn btn-secondary" data-print-page>
                    <x-icon name="printer" class="h-4 w-4" />
                    Print
                </button>
            </div>
        </section>

        <section class="panel overflow-hidden">
            <div class="border-b border-slate-100 p-4 dark:border-slate-800">
                <form method="GET" action="{{ route('inventory.index') }}" class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div class="flex flex-wrap items-center gap-3">
                        <select name="category" class="input-field min-w-[12rem]">
                            <option value="All">All Categories</option>
                            @foreach ($categories as $category)
                                <option value="{{ $category }}" @selected($filters['category'] === $category)>{{ $category }}</option>
                            @endforeach
                        </select>

                        <button type="submit" class="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                            <x-icon name="filter" class="h-4 w-4" />
                        </button>
                    </div>

                    <div class="flex w-full max-w-sm items-center gap-3">
                        <label class="relative flex-1">
                            <x-icon name="search" class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input type="text" name="search" value="{{ $filters['search'] }}" placeholder="Search inventory..." class="input-field pl-11">
                        </label>
                        <button type="submit" class="btn btn-primary">Apply</button>
                    </div>
                </form>
            </div>

            <form method="POST" action="{{ route('inventory.bulk-update') }}" data-selection-form>
                @csrf

                <div class="selection-toolbar hidden" data-selection-toolbar>
                    <div class="flex items-center gap-2 text-sm font-semibold text-emerald-800 dark:text-emerald-200">
                        <x-icon name="check-circle" class="h-5 w-5" />
                        <span><span data-selected-count>0</span> items selected</span>
                    </div>
                    <div class="flex flex-wrap items-center gap-2">
                        <button type="submit" name="action" value="mark_in_stock" class="btn btn-secondary" data-confirm="Mark the selected items as In Stock?">
                            Mark In Stock
                        </button>
                        <button type="submit" name="action" value="mark_disposed" class="btn btn-secondary" data-confirm="Mark the selected items as Disposed?">
                            Mark Disposed
                        </button>
                        <button type="button" class="btn btn-primary" data-export-selected>
                            <x-icon name="download" class="h-4 w-4" />
                            Export Selected
                        </button>
                        <button type="submit" name="action" value="delete" class="btn btn-danger" data-confirm="Delete the selected items? This only works for items without transaction history.">
                            <x-icon name="trash" class="h-4 w-4" />
                            Delete
                        </button>
                    </div>
                </div>

                <div class="overflow-x-auto">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th class="w-12">
                                    <input type="checkbox" class="table-checkbox" data-select-all>
                                </th>
                                <th><a href="{{ $sortLink('code') }}" class="sort-link">Item ID</a></th>
                                <th><a href="{{ $sortLink('name') }}" class="sort-link">Name</a></th>
                                <th><a href="{{ $sortLink('category') }}" class="sort-link">Category</a></th>
                                <th><a href="{{ $sortLink('status') }}" class="sort-link">Status</a></th>
                                <th><a href="{{ $sortLink('assigned_reference') }}" class="sort-link">Employee ID</a></th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse ($items as $item)
                                @php
                                    $tone = match ($item->status->value) {
                                        'In Stock' => 'emerald',
                                        'Checked Out' => 'amber',
                                        default => 'slate',
                                    };
                                @endphp
                                <tr>
                                    <td>
                                        <input type="checkbox" name="selected_ids[]" value="{{ $item->id }}" class="table-checkbox" data-select-item>
                                    </td>
                                    <td class="font-mono text-xs font-semibold text-slate-500 dark:text-slate-400">{{ $item->code }}</td>
                                    <td class="font-semibold text-slate-900 dark:text-slate-100">{{ $item->name }}</td>
                                    <td>{{ $item->category->value }}</td>
                                    <td>
                                        <x-pill :tone="$tone">{{ $item->status->value }}</x-pill>
                                    </td>
                                    <td class="font-mono text-xs text-slate-500 dark:text-slate-400">{{ $item->assignedUser?->employee_number ?? $item->assigned_reference ?? '-' }}</td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="6" class="px-6 py-10 text-center text-sm text-slate-500 dark:text-slate-400">No items found.</td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </form>

            <form method="GET" action="{{ route('inventory.export') }}" class="hidden" data-selected-export-form>
                @if ($filters['category'] !== 'All')
                    <input type="hidden" name="category" value="{{ $filters['category'] }}">
                @endif
                @if ($filters['search'])
                    <input type="hidden" name="search" value="{{ $filters['search'] }}">
                @endif
                <div data-selected-export-inputs></div>
            </form>
        </section>
    </div>
@endsection
