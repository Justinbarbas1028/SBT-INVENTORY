@extends('layouts.app')

@section('title', 'Request Item')

@section('content')
    @php
        $lineItems = old('line_items', [
            ['item_code' => $items->first()?->code, 'quantity' => 1],
        ]);
    @endphp

    <div class="mx-auto max-w-4xl space-y-6">
        <section>
            <h1 class="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Request Item Form</h1>
            <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">Submit a borrowing request with employee details and requested inventory items.</p>
        </section>

        <section class="panel p-6">
            <form method="POST" action="{{ route('borrow-requests.store') }}" class="space-y-6" data-repeater="borrow-items">
                @csrf

                <div class="grid gap-4 md:grid-cols-2">
                    <div>
                        <label class="label">Employee ID</label>
                        <input type="text" name="employee_number" value="{{ old('employee_number') }}" class="input-field" placeholder="Enter employee ID" required>
                    </div>

                    <div>
                        <label class="label">Employee Email</label>
                        <input type="email" name="employee_email" value="{{ old('employee_email') }}" class="input-field" placeholder="employee@company.com" required>
                    </div>
                </div>

                <div class="space-y-3">
                    <div class="flex items-center justify-between gap-3">
                        <div>
                            <h2 class="text-sm font-semibold text-slate-900 dark:text-slate-100">Items to Borrow</h2>
                            <p class="text-xs text-slate-500 dark:text-slate-400">Add one or more inventory items to the request.</p>
                        </div>
                        <button type="button" class="btn btn-secondary" data-repeater-add>
                            <x-icon name="plus" class="h-4 w-4" />
                            Add Item
                        </button>
                    </div>

                    <div class="space-y-3" data-repeater-items>
                        @foreach ($lineItems as $index => $lineItem)
                            <div class="grid gap-3 rounded-3xl border border-slate-100 bg-slate-50/80 p-4 md:grid-cols-[1fr_140px_auto] md:items-end dark:border-slate-800 dark:bg-slate-900/60" data-repeater-item>
                                <div>
                                    <label class="label">Item</label>
                                    <select name="line_items[{{ $index }}][item_code]" class="input-field" required>
                                        @foreach ($items as $item)
                                            <option value="{{ $item->code }}" @selected(($lineItem['item_code'] ?? '') === $item->code)>{{ $item->code }} - {{ $item->name }}</option>
                                        @endforeach
                                    </select>
                                </div>

                                <div>
                                    <label class="label">Quantity</label>
                                    <input type="number" min="1" name="line_items[{{ $index }}][quantity]" value="{{ $lineItem['quantity'] ?? 1 }}" class="input-field" required>
                                </div>

                                <button type="button" class="btn btn-danger h-11 justify-center" data-repeater-remove @disabled(count($lineItems) === 1)>
                                    <x-icon name="trash" class="h-4 w-4" />
                                </button>
                            </div>
                        @endforeach
                    </div>
                </div>

                <div class="border-t border-slate-100 pt-4 dark:border-slate-800">
                    <button type="submit" class="btn btn-primary w-full justify-center md:w-auto">
                        <x-icon name="send" class="h-4 w-4" />
                        Submit Request
                    </button>
                </div>
            </form>
        </section>
    </div>
@endsection

@push('scripts')
    <template id="borrow-repeater-template">
        <div class="grid gap-3 rounded-3xl border border-slate-100 bg-slate-50/80 p-4 md:grid-cols-[1fr_140px_auto] md:items-end dark:border-slate-800 dark:bg-slate-900/60" data-repeater-item>
            <div>
                <label class="label">Item</label>
                <select name="line_items[__INDEX__][item_code]" class="input-field" required>
                    @foreach ($items as $item)
                        <option value="{{ $item->code }}">{{ $item->code }} - {{ $item->name }}</option>
                    @endforeach
                </select>
            </div>

            <div>
                <label class="label">Quantity</label>
                <input type="number" min="1" name="line_items[__INDEX__][quantity]" value="1" class="input-field" required>
            </div>

            <button type="button" class="btn btn-danger h-11 justify-center" data-repeater-remove>
                <x-icon name="trash" class="h-4 w-4" />
            </button>
        </div>
    </template>
@endpush
