@extends('layouts.app')

@section('title', 'Check In')

@section('content')
    <div class="mx-auto max-w-3xl space-y-6">
        <section>
            <h1 class="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Check In Item</h1>
            <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">Return an existing item to stock and record the transaction.</p>
        </section>

        <section class="panel p-6">
            <form method="POST" action="{{ route('check-in.store') }}" class="space-y-6" data-item-autofill="check-in">
                @csrf

                <div>
                    <label class="label">Item ID</label>
                    <div class="relative">
                        <x-icon name="search" class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input type="text" name="item_code" value="{{ old('item_code') }}" class="input-field pl-11" placeholder="Enter Item ID" required data-item-code-input>
                    </div>
                    <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">If the item exists, the remaining fields auto-fill from inventory.</p>
                    <p class="mt-2 hidden text-sm font-medium text-emerald-600 dark:text-emerald-300" data-item-found></p>
                </div>

                <div class="grid gap-6 md:grid-cols-2">
                    <div>
                        <label class="label">Item Name</label>
                        <input type="text" name="name" value="{{ old('name') }}" class="input-field" placeholder="e.g., Laptop ThinkPad" required data-item-name-input>
                    </div>
                    <div>
                        <label class="label">Category</label>
                        <select name="category" class="input-field" data-item-category-input>
                            @foreach ($categories as $category)
                                <option value="{{ $category }}" @selected(old('category', 'Other') === $category)>{{ $category }}</option>
                            @endforeach
                        </select>
                    </div>
                </div>

                <div>
                    <label class="label">Notes</label>
                    <textarea name="notes" rows="4" class="input-field min-h-28 resize-y" placeholder="Add any relevant notes about the item's condition or source...">{{ old('notes') }}</textarea>
                </div>

                <div class="border-t border-slate-100 pt-4 dark:border-slate-800">
                    <button type="submit" class="btn btn-primary w-full justify-center">
                        <x-icon name="arrow-down" class="h-4 w-4" />
                        Check In Item
                    </button>
                </div>
            </form>
        </section>
    </div>
@endsection

@push('scripts')
    <script type="application/json" id="check-in-lookup-data">@json($itemLookup)</script>
@endpush
