@extends('layouts.app')

@section('title', 'Dashboard')

@section('content')
    <div class="space-y-8">
        <section>
            <h1 class="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Dashboard Overview</h1>
            <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">A quick read on stock levels, circulation, and recent inventory activity.</p>
        </section>

        <section class="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            @foreach ($stats as $stat)
                <article class="panel p-6">
                    <div class="flex items-center gap-4">
                        <div class="metric-icon metric-icon-{{ $stat['tone'] }}">
                            @php
                                $icon = match ($stat['label']) {
                                    'In Stock' => 'arrow-down',
                                    'Checked Out' => 'arrow-up',
                                    'Total Transactions' => 'history',
                                    default => 'package',
                                };
                            @endphp
                            <x-icon :name="$icon" class="h-6 w-6" />
                        </div>
                        <div>
                            <p class="text-sm font-medium text-slate-500 dark:text-slate-400">{{ $stat['label'] }}</p>
                            <p class="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{{ $stat['value'] }}</p>
                        </div>
                    </div>
                </article>
            @endforeach
        </section>

        <section class="grid gap-8 xl:grid-cols-2">
            <article class="panel p-6">
                <div class="flex items-center justify-between gap-4">
                    <div>
                        <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Recent Transactions</h2>
                        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Latest movements recorded across check-in and check-out.</p>
                    </div>
                    <a href="{{ route('history.index') }}" class="text-sm font-semibold text-emerald-600 transition hover:text-emerald-500 dark:text-emerald-300">View all</a>
                </div>

                <div class="mt-6 space-y-3">
                    @forelse ($recentTransactions as $transaction)
                        <div class="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-4 dark:border-slate-800 dark:bg-slate-900/60">
                            <div class="flex items-start justify-between gap-4">
                                <div>
                                    <p class="font-semibold text-slate-900 dark:text-slate-100">{{ $transaction->item_name }}</p>
                                    <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                        {{ $transaction->person_reference }}
                                        <span class="mx-1">&middot;</span>
                                        {{ optional($transaction->transacted_at)->format('M d, Y') }}
                                    </p>
                                </div>
                                <x-pill :tone="$transaction->type->value === 'IN' ? 'emerald' : 'amber'">
                                    <x-icon :name="$transaction->type->value === 'IN' ? 'arrow-down' : 'arrow-up'" class="h-3.5 w-3.5" />
                                    {{ $transaction->type->value }}
                                </x-pill>
                            </div>
                        </div>
                    @empty
                        <div class="rounded-2xl border border-dashed border-slate-200 px-6 py-10 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
                            No recent transactions yet.
                        </div>
                    @endforelse
                </div>
            </article>

            <article class="panel p-6">
                <div>
                    <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Inventory Status</h2>
                    <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Live ratio of available items versus checked-out assets.</p>
                </div>

                <div class="mt-6 rounded-3xl border border-dashed border-slate-200 bg-slate-50/80 p-6 dark:border-slate-800 dark:bg-slate-900/60">
                    @php
                        $total = max($inventoryBreakdown['total'], 1);
                        $inStockPercent = ($inventoryBreakdown['in_stock'] / $total) * 100;
                        $checkedOutPercent = ($inventoryBreakdown['checked_out'] / $total) * 100;
                    @endphp

                    <div class="space-y-5">
                        <div>
                            <div class="mb-2 flex items-center justify-between gap-3 text-sm">
                                <span class="font-medium text-slate-700 dark:text-slate-200">In Stock</span>
                                <span class="text-slate-500 dark:text-slate-400">{{ $inventoryBreakdown['in_stock'] }} / {{ $inventoryBreakdown['total'] }}</span>
                            </div>
                            <div class="h-3 rounded-full bg-slate-200 dark:bg-slate-800">
                                <div class="h-3 rounded-full bg-emerald-500" style="width: {{ $inStockPercent }}%"></div>
                            </div>
                        </div>

                        <div>
                            <div class="mb-2 flex items-center justify-between gap-3 text-sm">
                                <span class="font-medium text-slate-700 dark:text-slate-200">Checked Out</span>
                                <span class="text-slate-500 dark:text-slate-400">{{ $inventoryBreakdown['checked_out'] }} / {{ $inventoryBreakdown['total'] }}</span>
                            </div>
                            <div class="h-3 rounded-full bg-slate-200 dark:bg-slate-800">
                                <div class="h-3 rounded-full bg-amber-500" style="width: {{ $checkedOutPercent }}%"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        </section>
    </div>
@endsection
