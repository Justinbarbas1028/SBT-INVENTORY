@extends('layouts.app')

@section('title', 'Register Item')

@section('content')
    @php
        $initialCode = old('code', $suggestedCode);
        $initialName = old('name', '');
        $initialCategory = old('category', 'Other');
    @endphp

    <div class="space-y-6">
        <section class="hero-card">
            <div class="hero-orb hero-orb-right"></div>
            <div class="hero-orb hero-orb-left"></div>

            <div class="relative space-y-6">
                <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div class="max-w-2xl">
                        <div class="hero-tag">
                            <x-icon name="package-plus" class="h-4 w-4" />
                            Register Item
                        </div>
                        <h1 class="mt-4 text-3xl font-bold tracking-tight md:text-4xl">Create a new inventory record.</h1>
                        <p class="mt-3 max-w-xl text-sm text-slate-300 md:text-base">Add a new asset to the system before it moves through check-in, check-out, or logistics.</p>
                    </div>

                    <div class="grid w-full gap-3 sm:grid-cols-3 lg:w-auto lg:min-w-[30rem]">
                        <div class="hero-metric">
                            <div class="flex items-center justify-between text-slate-300">
                                <span class="metric-caption">Total Items</span>
                                <x-icon name="package" class="h-4 w-4" />
                            </div>
                            <p class="mt-3 text-3xl font-bold">{{ $totalItems }}</p>
                        </div>
                        <div class="hero-metric">
                            <div class="flex items-center justify-between text-slate-300">
                                <span class="metric-caption">In Stock</span>
                                <x-icon name="check-circle" class="h-4 w-4" />
                            </div>
                            <p class="mt-3 text-3xl font-bold">{{ $inStockCount }}</p>
                        </div>
                        <div class="hero-metric">
                            <div class="flex items-center justify-between text-slate-300">
                                <span class="metric-caption">Next ID</span>
                                <x-icon name="tag" class="h-4 w-4" />
                            </div>
                            <p class="mt-3 text-2xl font-bold" data-register-preview-code>{{ $initialCode }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <div class="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <section class="panel p-6">
                <div>
                    <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">New Item Details</h2>
                    <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">The item will be created with an initial status of In Stock.</p>
                </div>

                <form method="POST" action="{{ route('items.store') }}" class="mt-6 space-y-5" data-register-preview>
                    @csrf

                    <div class="grid gap-4 md:grid-cols-2">
                        <div>
                            <label class="label">Item ID</label>
                            <input type="text" name="code" value="{{ $initialCode }}" class="input-field font-mono" placeholder="ITM-004" data-register-code>
                            <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">Auto-filled with the next available inventory number.</p>
                        </div>

                        <div>
                            <label class="label">Category</label>
                            <select name="category" class="input-field" data-register-category>
                                @foreach ($categories as $category)
                                    <option value="{{ $category }}" @selected($initialCategory === $category)>{{ $category }}</option>
                                @endforeach
                            </select>
                        </div>
                    </div>

                    <div>
                        <label class="label">Item Name</label>
                        <input type="text" name="name" value="{{ $initialName }}" class="input-field" placeholder="e.g., Laptop ThinkPad" required data-register-name>
                    </div>

                    <div class="rounded-3xl border border-slate-100 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/60">
                        <div class="flex items-start justify-between gap-4">
                            <div>
                                <label class="label mb-0">Generated QR Code</label>
                                <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">This value is stored with the item and used by scan-ready workflows later.</p>
                            </div>
                            <x-icon name="qr" class="h-5 w-5 text-slate-400" />
                        </div>
                        <div class="mt-3 rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-3 font-mono text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200" data-register-preview-qr>
                            QR-{{ $initialCode }}
                        </div>
                    </div>

                    <div>
                        <label class="label">Notes</label>
                        <textarea name="notes" rows="4" class="input-field min-h-28 resize-y" placeholder="Add item condition, supplier details, or other references...">{{ old('notes') }}</textarea>
                    </div>

                    <div class="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300">
                        Registered by <span class="font-semibold text-slate-900 dark:text-slate-100">{{ auth()->user()?->name ?? 'Unknown' }}</span>.
                        The new item starts at <span class="font-semibold text-emerald-600 dark:text-emerald-300">In Stock</span> and is ready for use.
                    </div>

                    <button type="submit" class="btn btn-primary w-full justify-center">
                        <x-icon name="package-plus" class="h-4 w-4" />
                        Register Item
                    </button>
                </form>
            </section>

            <aside class="space-y-6">
                <section class="panel p-6">
                    <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Preview</h2>
                    <div class="mt-4 rounded-3xl border border-slate-100 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-900/60">
                        <div class="flex items-start justify-between gap-4">
                            <div>
                                <p class="metric-caption text-slate-400">Item</p>
                                <p class="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100" data-register-preview-name>{{ $initialName ?: 'New Item' }}</p>
                                <p class="text-sm font-mono text-slate-500 dark:text-slate-400" data-register-preview-code-secondary>{{ $initialCode }}</p>
                            </div>
                            <x-pill tone="emerald">In Stock</x-pill>
                        </div>

                        <div class="mt-4 space-y-3 text-sm">
                            <div class="preview-row">
                                <span>Category</span>
                                <span data-register-preview-category>{{ $initialCategory }}</span>
                            </div>
                            <div class="preview-row">
                                <span>QR Code</span>
                                <span class="font-mono" data-register-preview-qr-secondary>QR-{{ $initialCode }}</span>
                            </div>
                            <div class="preview-row">
                                <span>Last Updated</span>
                                <span>{{ now()->format('M d, Y') }}</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="rounded-3xl border border-dashed border-slate-200 bg-slate-50/80 p-6 dark:border-slate-800 dark:bg-slate-900/60">
                    <div class="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
                        <x-icon name="qr" class="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                        Registration Flow
                    </div>
                    <ol class="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                        <li>1. Enter the item details and confirm the inventory number.</li>
                        <li>2. Save the item to add it to stock and transaction history.</li>
                        <li>3. Use check in, check out, or logistics once the item exists.</li>
                    </ol>
                </section>
            </aside>
        </div>
    </div>
@endsection
