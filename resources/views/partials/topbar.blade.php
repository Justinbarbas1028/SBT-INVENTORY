@php($currentUser = auth()->user())

<header class="border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur md:px-6 dark:border-slate-800 dark:bg-slate-950/85">
    <div class="flex items-center justify-between gap-4">
        <div class="flex min-w-0 flex-1 items-center gap-3">
            <button
                type="button"
                class="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-slate-700 md:hidden dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                data-sidebar-open
                aria-label="Open navigation"
            >
                <x-icon name="menu" class="h-5 w-5" />
            </button>

            <label class="hidden max-w-xl flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-500 sm:flex dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                <x-icon name="search" class="h-4 w-4 shrink-0" />
                <input type="text" value="" placeholder="Search..." class="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500">
            </label>
        </div>

        <div class="flex items-center gap-2 md:gap-4">
            <button
                type="button"
                class="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                data-theme-toggle
            >
                <x-icon name="moon" class="theme-icon-light h-4 w-4" />
                <x-icon name="sun" class="theme-icon-dark hidden h-4 w-4" />
                <span class="hidden lg:inline">Theme</span>
            </button>

            <button type="button" class="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                <x-icon name="bell" class="h-5 w-5" />
                <span class="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-rose-500"></span>
            </button>

            <div class="flex items-center gap-3 border-l border-slate-200 pl-3 dark:border-slate-800">
                <div class="hidden text-right sm:block">
                    <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">{{ $currentUser?->name }}</p>
                    <form method="POST" action="{{ route('acting-user.update') }}">
                        @csrf
                        <select name="user_id" class="w-full cursor-pointer bg-transparent text-xs text-slate-500 outline-none dark:text-slate-400" onchange="this.form.submit()">
                            @foreach ($availableUsers as $user)
                                <option value="{{ $user->id }}" @selected($currentUser?->is($user))>{{ $user->role->value }}</option>
                            @endforeach
                        </select>
                    </form>
                </div>
                <div class="hidden h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 sm:flex dark:bg-slate-900 dark:text-slate-300">
                    <x-icon name="user" class="h-5 w-5" />
                </div>
            </div>
        </div>
    </div>
</header>
