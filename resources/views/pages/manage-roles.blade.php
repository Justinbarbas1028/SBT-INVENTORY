@extends('layouts.app')

@section('title', 'Manage Roles')

@section('content')
    <div class="space-y-6">
        <section class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 class="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Manage Roles &amp; Accounts</h1>
                <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">Create accounts, adjust roles, and archive users while preserving at least one Super Admin.</p>
            </div>
            @if ($editUser)
                <a href="{{ route('users.index') }}" class="btn btn-secondary">Cancel Edit</a>
            @endif
        </section>

        <section class="panel max-w-3xl p-6">
            <div>
                <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">{{ $editUser ? 'Edit Account' : 'New Employee Account' }}</h2>
                <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">{{ $editUser ? 'Update the selected account details.' : 'Create a new account and assign the appropriate role.' }}</p>
            </div>

            <form method="POST" action="{{ $editUser ? route('users.update', $editUser) : route('users.store') }}" class="mt-6 grid gap-4 md:grid-cols-2">
                @csrf
                @if ($editUser)
                    @method('PATCH')
                @endif

                <div>
                    <label class="label">Full Name</label>
                    <input type="text" name="name" value="{{ old('name', $editUser?->name) }}" class="input-field" required>
                </div>

                <div>
                    <label class="label">Email Address</label>
                    <input type="email" name="email" value="{{ old('email', $editUser?->email) }}" class="input-field" required>
                </div>

                <div>
                    <label class="label">Employee Number</label>
                    <input type="text" name="employee_number" value="{{ old('employee_number', $editUser?->employee_number) }}" class="input-field" required>
                </div>

                <div>
                    <label class="label">Role</label>
                    <select name="role" class="input-field">
                        @foreach ($roles as $role)
                            <option value="{{ $role }}" @selected(old('role', $editUser?->role?->value ?? 'Employee') === $role)>{{ $role }}</option>
                        @endforeach
                    </select>
                </div>

                <div class="md:col-span-2">
                    <button type="submit" class="btn btn-primary w-full justify-center">
                        <x-icon name="{{ $editUser ? 'edit' : 'plus' }}" class="h-4 w-4" />
                        {{ $editUser ? 'Update Account' : 'Create Account' }}
                    </button>
                </div>
            </form>
        </section>

        <section class="panel overflow-hidden">
            <div class="overflow-x-auto">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Employee Info</th>
                            <th>Role</th>
                            <th class="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($users as $user)
                            @php
                                $tone = match ($user->role->value) {
                                    'Super Admin' => 'violet',
                                    'Admin' => 'teal',
                                    default => 'slate',
                                };
                            @endphp
                            <tr>
                                <td>
                                    <div class="flex flex-col">
                                        <span class="font-semibold text-slate-900 dark:text-slate-100">{{ $user->name }}</span>
                                        <span class="text-sm text-slate-500 dark:text-slate-400">{{ $user->email }} &middot; {{ $user->employee_number }}</span>
                                    </div>
                                </td>
                                <td>
                                    <x-pill :tone="$tone">{{ $user->role->value }}</x-pill>
                                </td>
                                <td>
                                    <div class="flex justify-end gap-2">
                                        <a href="{{ route('users.index', ['edit' => $user->id]) }}" class="btn btn-secondary">
                                            <x-icon name="edit" class="h-4 w-4" />
                                            Edit
                                        </a>

                                        <form method="POST" action="{{ route('users.archive', $user) }}">
                                            @csrf
                                            @method('PATCH')
                                            <button type="submit" class="btn btn-danger" data-confirm="Archive {{ $user->name }}?">
                                                <x-icon name="archive" class="h-4 w-4" />
                                                Archive
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </section>
    </div>
@endsection
