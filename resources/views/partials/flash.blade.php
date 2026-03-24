@if (session('flash'))
    @php($flash = session('flash'))
    <div class="mb-6 rounded-2xl border px-4 py-3 text-sm {{ ($flash['type'] ?? 'success') === 'error' ? 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200' : 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200' }}">
        <div class="flex items-start gap-3">
            <x-icon :name="($flash['type'] ?? 'success') === 'error' ? 'alert-circle' : 'check-circle'" class="mt-0.5 h-5 w-5 shrink-0" />
            <span>{{ $flash['message'] ?? '' }}</span>
        </div>
    </div>
@endif

@if ($errors->any())
    <div class="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200">
        <div class="flex items-start gap-3">
            <x-icon name="alert-circle" class="mt-0.5 h-5 w-5 shrink-0" />
            <div class="space-y-1">
                <p class="font-semibold">Please fix the following:</p>
                <ul class="list-disc pl-4">
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        </div>
    </div>
@endif
