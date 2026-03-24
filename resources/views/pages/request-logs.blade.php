@extends('layouts.app')

@section('title', 'Request Logs')

@section('content')
    <div class="space-y-6">
        <section class="hero-card">
            <div class="hero-orb hero-orb-right"></div>
            <div class="hero-orb hero-orb-left"></div>

            <div class="relative space-y-6">
                <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div class="max-w-2xl">
                        <div class="hero-tag">
                            <x-icon name="file-text" class="h-4 w-4" />
                            Request Logs
                        </div>
                        <h1 class="mt-4 text-3xl font-bold tracking-tight md:text-4xl">Track employee item requests in one place.</h1>
                        <p class="mt-3 max-w-xl text-sm text-slate-300 md:text-base">Review submitted borrow requests, filter by status, and approve or reject requests with an auditable note.</p>
                    </div>

                    <div class="grid w-full gap-3 sm:grid-cols-2 lg:w-auto lg:min-w-[30rem]">
                        <div class="hero-metric">
                            <div class="flex items-center justify-between text-slate-300">
                                <span class="metric-caption">Total</span>
                                <x-icon name="file-text" class="h-4 w-4" />
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
                                <span class="metric-caption">Approved</span>
                                <x-icon name="badge-check" class="h-4 w-4" />
                            </div>
                            <p class="mt-3 text-3xl font-bold">{{ $counts['approved'] }}</p>
                        </div>
                        <div class="hero-metric">
                            <div class="flex items-center justify-between text-slate-300">
                                <span class="metric-caption">Denied</span>
                                <x-icon name="x" class="h-4 w-4" />
                            </div>
                            <p class="mt-3 text-3xl font-bold">{{ $counts['denied'] }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="panel overflow-hidden">
            <div class="border-b border-slate-100 p-4 dark:border-slate-800">
                <form method="GET" action="{{ route('borrow-request-logs.index') }}" class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <label class="relative w-full lg:max-w-sm">
                        <x-icon name="search" class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input type="text" name="search" value="{{ $filters['search'] }}" placeholder="Search request logs..." class="input-field pl-11">
                    </label>

                    <div class="flex items-center gap-3">
                        <select name="status" class="input-field">
                            <option value="All">All Statuses</option>
                            <option value="Pending" @selected($filters['status'] === 'Pending')>Pending</option>
                            <option value="Approved" @selected($filters['status'] === 'Approved')>Approved</option>
                            <option value="Denied" @selected($filters['status'] === 'Denied')>Denied</option>
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
                            <th>Employee</th>
                            <th>Items</th>
                            <th>Status</th>
                            <th>Created</th>
                            <th>Review / Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($requests as $request)
                            @php
                                $statusTone = match ($request->status->value) {
                                    'Approved' => 'emerald',
                                    'Denied' => 'rose',
                                    default => 'amber',
                                };
                            @endphp
                            <tr>
                                <td class="align-top">
                                    <div class="flex flex-col gap-1">
                                        <span class="font-mono text-xs text-slate-500 dark:text-slate-400">{{ $request->code }}</span>
                                        <span class="text-xs text-slate-500 dark:text-slate-400">{{ $request->items->count() }} item(s) requested</span>
                                    </div>
                                </td>
                                <td class="align-top">
                                    <div class="flex flex-col gap-1">
                                        <span class="font-semibold text-slate-900 dark:text-slate-100">{{ $request->requested_by_name }}</span>
                                        <span class="font-mono text-xs text-slate-500 dark:text-slate-400">{{ $request->employee_number }}</span>
                                        <span class="text-xs text-slate-500 dark:text-slate-400">{{ $request->employee_email }}</span>
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
                                    <x-pill :tone="$statusTone">{{ $request->status->value }}</x-pill>
                                </td>
                                <td class="align-top text-sm text-slate-500 dark:text-slate-400">
                                    {{ $request->created_at->format('M d, Y H:i') }}
                                </td>
                                <td class="align-top">
                                    @if ($request->reviewed_by_name)
                                        <div class="space-y-1 text-sm text-slate-500 dark:text-slate-400">
                                            <p class="font-semibold text-slate-900 dark:text-slate-100">{{ $request->reviewed_by_name }}</p>
                                            <p>{{ optional($request->reviewed_at)->format('M d, Y H:i') }}</p>
                                            @if ($request->review_note)
                                                <p title="{{ $request->review_note }}">{{ $request->review_note }}</p>
                                            @endif
                                        </div>
                                    @else
                                        <form method="POST" action="{{ route('borrow-request-logs.review', $request) }}" class="flex flex-wrap gap-2" data-review-form data-request-code="{{ $request->code }}">
                                            @csrf
                                            @method('PATCH')
                                            <input type="hidden" name="decision" value="">
                                            <input type="hidden" name="review_note" value="">

                                            <button type="button" class="btn btn-secondary" data-review-trigger="Approved">
                                                <x-icon name="badge-check" class="h-4 w-4" />
                                                Approve
                                            </button>
                                            <button type="button" class="btn btn-danger" data-review-trigger="Denied">
                                                <x-icon name="x" class="h-4 w-4" />
                                                Reject
                                            </button>
                                        </form>
                                    @endif
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="6" class="px-6 py-10 text-center text-sm text-slate-500 dark:text-slate-400">No request logs found.</td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </section>
    </div>
@endsection
