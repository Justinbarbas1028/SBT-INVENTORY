@extends('layouts.app')

@section('title', 'Logistics')

@section('content')
    @php
        $lineItems = old('line_items', [
            ['item_code' => $items->first()?->code, 'quantity' => 1],
        ]);
    @endphp

    <div class="space-y-6">
        <section class="hero-card">
            <div class="hero-orb hero-orb-right"></div>
            <div class="hero-orb hero-orb-left"></div>

            <div class="relative space-y-6">
                <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div class="max-w-2xl">
                        <div class="hero-tag">
                            <x-icon name="truck" class="h-4 w-4" />
                            Logistics
                        </div>
                        <h1 class="mt-4 text-3xl font-bold tracking-tight md:text-4xl">Move items cleanly from request to delivery.</h1>
                        <p class="mt-3 max-w-xl text-sm text-slate-300 md:text-base">Create logistics requests, keep routes organized, and advance each request from planning through delivery or return.</p>
                    </div>

                    <div class="grid w-full gap-3 sm:grid-cols-2 lg:w-auto lg:min-w-[30rem]">
                        <div class="hero-metric">
                            <div class="flex items-center justify-between text-slate-300">
                                <span class="metric-caption">Total</span>
                                <x-icon name="package" class="h-4 w-4" />
                            </div>
                            <p class="mt-3 text-3xl font-bold">{{ $counts['total'] }}</p>
                        </div>
                        <div class="hero-metric">
                            <div class="flex items-center justify-between text-slate-300">
                                <span class="metric-caption">Pending</span>
                                <x-icon name="clock" class="h-4 w-4" />
                            </div>
                            <p class="mt-3 text-3xl font-bold">{{ $counts['pending'] }}</p>
                        </div>
                        <div class="hero-metric">
                            <div class="flex items-center justify-between text-slate-300">
                                <span class="metric-caption">Prepared</span>
                                <x-icon name="arrow-right" class="h-4 w-4" />
                            </div>
                            <p class="mt-3 text-3xl font-bold">{{ $counts['approved'] }}</p>
                        </div>
                        <div class="hero-metric">
                            <div class="flex items-center justify-between text-slate-300">
                                <span class="metric-caption">Completed</span>
                                <x-icon name="badge-check" class="h-4 w-4" />
                            </div>
                            <p class="mt-3 text-3xl font-bold">{{ $counts['completed'] }}</p>
                        </div>
                    </div>
                </div>

                <div class="grid gap-3 md:grid-cols-5">
                    @foreach ([
                        ['label' => 'Requested', 'value' => $counts['pending'], 'icon' => 'clock'],
                        ['label' => 'Approved', 'value' => $counts['approved_only'], 'icon' => 'arrow-right'],
                        ['label' => 'Packed', 'value' => $counts['packed'], 'icon' => 'package'],
                        ['label' => 'In Transit', 'value' => $counts['in_transit'], 'icon' => 'truck'],
                        ['label' => 'Delivered / Returned', 'value' => $counts['completed'], 'icon' => 'badge-check'],
                    ] as $step)
                        <div class="rounded-2xl border border-white/10 bg-white/5 p-3">
                            <div class="flex items-center justify-between text-slate-300">
                                <span class="metric-caption">{{ $step['label'] }}</span>
                                <x-icon :name="$step['icon']" class="h-4 w-4" />
                            </div>
                            <p class="mt-2 text-2xl font-semibold">{{ $step['value'] }}</p>
                        </div>
                    @endforeach
                </div>
            </div>
        </section>

        <div class="grid gap-6 xl:grid-cols-[0.95fr_1.35fr]">
            <section class="panel p-6">
                <div class="mb-5 flex items-start justify-between gap-4">
                    <div>
                        <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Create Logistics Request</h2>
                        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Create a single request with one or more items on the same route.</p>
                    </div>
                    <x-pill tone="slate">
                        <x-icon name="plus" class="h-3.5 w-3.5" />
                        New
                    </x-pill>
                </div>

                <form method="POST" action="{{ route('logistics.store') }}" class="space-y-4" data-repeater="logistics-items">
                    @csrf

                    <div class="grid gap-4 md:grid-cols-2">
                        <div>
                            <label class="label">Type</label>
                            <select name="type" class="input-field" data-logistics-type>
                                @foreach ($types as $type)
                                    <option value="{{ $type }}" @selected(old('type', 'Outbound') === $type)>{{ $type }}</option>
                                @endforeach
                            </select>
                        </div>

                        <div>
                            <label class="label">Priority</label>
                            <select name="priority" class="input-field">
                                @foreach ($priorities as $priority)
                                    <option value="{{ $priority }}" @selected(old('priority', 'Medium') === $priority)>{{ $priority }}</option>
                                @endforeach
                            </select>
                        </div>

                        <div>
                            <label class="label">Origin</label>
                            <input type="text" name="origin" value="{{ old('origin', 'Main Warehouse') }}" class="input-field" data-logistics-origin>
                        </div>

                        <div>
                            <label class="label">Destination</label>
                            <input type="text" name="destination" value="{{ old('destination', 'Branch A') }}" class="input-field" data-logistics-destination>
                        </div>

                        <div>
                            <label class="label">Scheduled Date</label>
                            <input type="date" name="scheduled_date" value="{{ old('scheduled_date', now()->toDateString()) }}" class="input-field">
                        </div>

                        <div>
                            <label class="label">Handler</label>
                            <input type="text" name="handler" value="{{ old('handler', auth()->user()?->name ?? 'Logistics Desk') }}" class="input-field">
                        </div>
                    </div>

                    <div class="rounded-3xl border border-slate-100 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/60">
                        <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h3 class="text-sm font-semibold text-slate-900 dark:text-slate-100">Batch Items</h3>
                                <p class="text-xs text-slate-500 dark:text-slate-400">Add one or more items to include in this route.</p>
                            </div>
                            <button type="button" class="btn btn-secondary" data-repeater-add>
                                <x-icon name="plus" class="h-4 w-4" />
                                Add Item
                            </button>
                        </div>

                        <div class="space-y-3" data-repeater-items>
                            @foreach ($lineItems as $index => $lineItem)
                            <div class="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950" data-repeater-item>
                                    <div class="mb-3 flex items-start justify-between gap-3">
                                        <div>
                                            <p class="metric-caption text-slate-400">Item {{ $index + 1 }}</p>
                                            <p class="text-sm font-medium text-slate-700 dark:text-slate-200">Choose an inventory item and quantity.</p>
                                        </div>
                                        <button type="button" class="btn btn-danger" data-repeater-remove @disabled(count($lineItems) === 1)>
                                            <x-icon name="trash" class="h-4 w-4" />
                                            Remove
                                        </button>
                                    </div>

                                    <div class="grid gap-3 md:grid-cols-[1fr_9rem]">
                                        <div>
                                            <label class="label text-xs">Inventory Item</label>
                                            <select name="line_items[{{ $index }}][item_code]" class="input-field">
                                                <option value="">Select an inventory item</option>
                                                @foreach ($items as $item)
                                                    <option value="{{ $item->code }}" @selected(($lineItem['item_code'] ?? '') === $item->code)>{{ $item->code }} - {{ $item->name }}</option>
                                                @endforeach
                                            </select>
                                        </div>

                                        <div>
                                            <label class="label text-xs">Quantity</label>
                                            <input type="number" min="1" name="line_items[{{ $index }}][quantity]" value="{{ $lineItem['quantity'] ?? 1 }}" class="input-field">
                                        </div>
                                    </div>
                                </div>
                            @endforeach
                        </div>
                    </div>

                    <div>
                        <label class="label">Notes</label>
                        <textarea name="notes" rows="4" class="input-field min-h-28 resize-y" placeholder="Add route notes, delivery instructions, or return remarks...">{{ old('notes') }}</textarea>
                    </div>

                    <div class="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300">
                        Requested by <span class="font-semibold text-slate-900 dark:text-slate-100">{{ auth()->user()?->name ?? 'Unknown' }}</span>.
                        This request starts at <span class="font-semibold text-sky-600 dark:text-sky-300">Requested</span>.
                    </div>

                    <button type="submit" class="btn btn-primary w-full justify-center" @disabled($items->isEmpty())>
                        <x-icon name="truck" class="h-4 w-4" />
                        Create Logistics Request
                    </button>
                </form>
            </section>

            <section class="panel overflow-hidden">
                <div class="border-b border-slate-100 p-4 dark:border-slate-800">
                    <form method="GET" action="{{ route('logistics.index') }}" class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <label class="relative w-full lg:max-w-sm">
                            <x-icon name="search" class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input type="text" name="search" value="{{ $filters['search'] }}" placeholder="Search requests..." class="input-field pl-11">
                        </label>

                        <div class="flex items-center gap-3">
                            <select name="status" class="input-field">
                                <option value="All">All Statuses</option>
                                @foreach ($statuses as $status)
                                    <option value="{{ $status }}" @selected($filters['status'] === $status)>{{ $status }}</option>
                                @endforeach
                            </select>
                            <button type="submit" class="btn btn-primary">Apply</button>
                        </div>
                    </form>
                </div>

                <div class="overflow-x-auto">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Request</th>
                                <th>Items</th>
                                <th>Route</th>
                                <th>Schedule</th>
                                <th>Priority</th>
                                <th>Status</th>
                                <th class="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse ($requests as $request)
                                @php
                                    $priorityTone = match ($request->priority->value) {
                                        'High' => 'rose',
                                        'Medium' => 'indigo',
                                        default => 'slate',
                                    };

                                    $statusTone = match ($request->status->value) {
                                        'Requested' => 'slate',
                                        'Approved' => 'sky',
                                        'Packed' => 'violet',
                                        'In Transit' => 'amber',
                                        'Delivered' => 'emerald',
                                        'Returned' => 'orange',
                                        default => 'rose',
                                    };

                                    $nextLabel = match ($request->status->value) {
                                        'Requested' => 'Approve',
                                        'Approved' => 'Pack',
                                        'Packed' => 'Dispatch',
                                        'In Transit' => 'Confirm Delivery',
                                        default => null,
                                    };
                                @endphp
                                <tr>
                                    <td class="align-top">
                                        <div class="flex flex-col gap-1">
                                            <span class="font-mono text-xs text-slate-500 dark:text-slate-400">{{ $request->code }}</span>
                                            <span class="font-semibold text-slate-900 dark:text-slate-100">{{ $request->type->value }}</span>
                                            <span class="text-xs text-slate-500 dark:text-slate-400">Requested by {{ $request->requested_by_name }}</span>
                                            @if ($request->items->count() > 1)
                                                <x-pill tone="cyan" class="w-fit">Batch</x-pill>
                                            @endif
                                        </div>
                                    </td>
                                    <td class="align-top">
                                        <div class="flex flex-wrap gap-2">
                                            @foreach ($request->items as $item)
                                                <div class="rounded-2xl bg-slate-50 px-3 py-2 dark:bg-slate-900">
                                                    <p class="font-medium text-slate-900 dark:text-slate-100">{{ $item->item_name }}</p>
                                                    <p class="font-mono text-xs text-slate-500 dark:text-slate-400">{{ $item->item_code }} x {{ $item->quantity }}</p>
                                                </div>
                                            @endforeach
                                        </div>
                                    </td>
                                    <td class="align-top">
                                        <div class="flex flex-col">
                                            <span class="text-sm text-slate-900 dark:text-slate-100">{{ $request->origin }}</span>
                                            <span class="text-xs text-slate-500 dark:text-slate-400">{{ $request->destination }}</span>
                                        </div>
                                    </td>
                                    <td class="align-top">
                                        <div class="flex flex-col">
                                            <span class="text-sm text-slate-900 dark:text-slate-100">{{ optional($request->scheduled_date)->format('M d, Y') }}</span>
                                            <span class="text-xs text-slate-500 dark:text-slate-400">{{ $request->handler }}</span>
                                        </div>
                                    </td>
                                    <td class="align-top"><x-pill :tone="$priorityTone">{{ $request->priority->value }}</x-pill></td>
                                    <td class="align-top"><x-pill :tone="$statusTone">{{ $request->status->value }}</x-pill></td>
                                    <td class="align-top">
                                        <div class="flex flex-wrap justify-end gap-2">
                                            @if ($nextLabel)
                                                <form method="POST" action="{{ route('logistics.advance', $request) }}">
                                                    @csrf
                                                    @method('PATCH')
                                                    <button type="submit" class="btn btn-secondary" data-confirm="Advance {{ $request->code }} to the next logistics step?">
                                                        <x-icon name="badge-check" class="h-4 w-4" />
                                                        {{ $nextLabel }}
                                                    </button>
                                                </form>
                                            @endif

                                            @if (! $request->isTerminal())
                                                <form method="POST" action="{{ route('logistics.cancel', $request) }}">
                                                    @csrf
                                                    @method('PATCH')
                                                    <button type="submit" class="btn btn-danger" data-confirm="Cancel {{ $request->code }}?">
                                                        <x-icon name="x" class="h-4 w-4" />
                                                        Cancel
                                                    </button>
                                                </form>
                                            @endif
                                        </div>
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="7" class="px-6 py-10 text-center text-sm text-slate-500 dark:text-slate-400">No logistics requests found.</td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    </div>
@endsection

@push('scripts')
    <script type="application/json" id="logistics-type-defaults">@json($typeDefaults)</script>
    <template id="logistics-repeater-template">
        <div class="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950" data-repeater-item>
            <div class="mb-3 flex items-start justify-between gap-3">
                <div>
                    <p class="metric-caption text-slate-400">Item __NUMBER__</p>
                    <p class="text-sm font-medium text-slate-700 dark:text-slate-200">Choose an inventory item and quantity.</p>
                </div>
                <button type="button" class="btn btn-danger" data-repeater-remove>
                    <x-icon name="trash" class="h-4 w-4" />
                    Remove
                </button>
            </div>

            <div class="grid gap-3 md:grid-cols-[1fr_9rem]">
                <div>
                    <label class="label text-xs">Inventory Item</label>
                    <select name="line_items[__INDEX__][item_code]" class="input-field">
                        <option value="">Select an inventory item</option>
                        @foreach ($items as $item)
                            <option value="{{ $item->code }}">{{ $item->code }} - {{ $item->name }}</option>
                        @endforeach
                    </select>
                </div>

                <div>
                    <label class="label text-xs">Quantity</label>
                    <input type="number" min="1" name="line_items[__INDEX__][quantity]" value="1" class="input-field">
                </div>
            </div>
        </div>
    </template>
@endpush
