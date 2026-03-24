@php
    use App\Enums\Role;

    $currentUser = auth()->user();
    $navItems = [
        ['route' => 'dashboard', 'label' => 'Dashboard', 'icon' => 'dashboard', 'roles' => [Role::SuperAdmin, Role::Admin, Role::Employee]],
        ['route' => 'inventory.index', 'label' => 'Inventory', 'icon' => 'package', 'roles' => [Role::SuperAdmin, Role::Admin, Role::Employee]],
        ['route' => 'borrow-requests.create', 'label' => 'Request Item', 'icon' => 'clipboard', 'roles' => [Role::SuperAdmin, Role::Admin, Role::Employee]],
        ['route' => 'check-in.create', 'label' => 'Check In', 'icon' => 'arrow-down', 'roles' => [Role::SuperAdmin, Role::Admin, Role::Employee]],
        ['route' => 'check-out.create', 'label' => 'Check Out', 'icon' => 'arrow-up', 'roles' => [Role::SuperAdmin, Role::Admin, Role::Employee]],
        ['route' => 'logistics.index', 'label' => 'Logistics', 'icon' => 'truck', 'roles' => [Role::SuperAdmin, Role::Admin, Role::Employee]],
        ['route' => 'history.index', 'label' => 'History', 'icon' => 'history', 'roles' => [Role::SuperAdmin, Role::Admin, Role::Employee]],
        ['route' => 'borrow-request-logs.index', 'label' => 'Request Logs', 'icon' => 'file-text', 'roles' => [Role::SuperAdmin]],
        ['route' => 'users.index', 'label' => 'Manage Roles', 'icon' => 'users', 'roles' => [Role::SuperAdmin]],
    ];
@endphp

<aside class="app-sidebar" data-sidebar>
    <div class="flex h-16 items-center border-b border-white/10 px-4">
        <div class="flex items-center gap-3 min-w-0">
            <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 ring-1 ring-emerald-400/20">
                <img src="{{ asset('images/sbt-logo.png') }}" alt="SBT Inventory logo" class="h-8 w-8 object-contain">
            </div>
            <div class="min-w-0">
                <p class="truncate text-base font-bold tracking-tight text-white">SBT Inventory</p>
                <p class="text-[0.68rem] uppercase tracking-[0.28em] text-slate-400">Inventory Control</p>
            </div>
        </div>
    </div>

    <nav class="flex-1 space-y-2 overflow-y-auto px-4 py-4">
        @foreach ($navItems as $item)
            @continue(! in_array($currentUser?->role, $item['roles'], true))

            @php($active = request()->routeIs($item['route']))

            <a
                href="{{ route($item['route']) }}"
                class="sidebar-link {{ $active ? 'is-active' : '' }}"
            >
                <x-icon :name="$item['icon']" class="h-5 w-5" />
                <span>{{ $item['label'] }}</span>
            </a>
        @endforeach
    </nav>
</aside>
