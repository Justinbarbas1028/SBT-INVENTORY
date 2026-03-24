@if (request()->routeIs('dashboard') || request()->routeIs('inventory.index') || request()->routeIs('logistics.index'))
    <div class="quick-actions" data-fab>
        <div class="quick-actions-panel hidden" data-fab-panel>
            <p class="px-2 pb-2 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-slate-400">Quick Actions</p>

            <a href="{{ route('check-in.create') }}" class="quick-action-link">
                <span class="quick-action-icon bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                    <x-icon name="arrow-down" class="h-4 w-4" />
                </span>
                <span>
                    <span class="block text-sm font-semibold text-slate-800 dark:text-slate-100">Check In</span>
                    <span class="block text-xs text-slate-500 dark:text-slate-400">Return an item to stock</span>
                </span>
            </a>

            <a href="{{ route('check-out.create') }}" class="quick-action-link">
                <span class="quick-action-icon bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                    <x-icon name="arrow-up" class="h-4 w-4" />
                </span>
                <span>
                    <span class="block text-sm font-semibold text-slate-800 dark:text-slate-100">Check Out</span>
                    <span class="block text-xs text-slate-500 dark:text-slate-400">Assign an item to someone</span>
                </span>
            </a>

            <a href="{{ route('items.create') }}" class="quick-action-link">
                <span class="quick-action-icon bg-cyan-100 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-300">
                    <x-icon name="package-plus" class="h-4 w-4" />
                </span>
                <span>
                    <span class="block text-sm font-semibold text-slate-800 dark:text-slate-100">Register Item</span>
                    <span class="block text-xs text-slate-500 dark:text-slate-400">Create a new inventory record</span>
                </span>
            </a>
        </div>

        <button type="button" class="quick-actions-toggle" data-fab-toggle aria-expanded="false" aria-label="Toggle quick actions">
            <x-icon name="plus" class="fab-icon-open h-5 w-5" />
            <x-icon name="x" class="fab-icon-close hidden h-5 w-5" />
        </button>
    </div>
@endif
