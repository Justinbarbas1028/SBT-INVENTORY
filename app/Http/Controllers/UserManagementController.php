<?php

namespace App\Http\Controllers;

use App\Enums\Role;
use App\Enums\UserStatus;
use App\Http\Requests\StoreManagedUserRequest;
use App\Http\Requests\UpdateManagedUserRequest;
use App\Models\User;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserManagementController extends Controller
{
    public function index(Request $request): View
    {
        $editUser = $request->integer('edit')
            ? User::query()->active()->find($request->integer('edit'))
            : null;

        return view('pages.manage-roles', [
            'users' => User::query()
                ->active()
                ->orderByRaw(
                    'case role
                        when ? then 1
                        when ? then 2
                        else 3
                    end',
                    [Role::SuperAdmin->value, Role::Admin->value],
                )
                ->orderBy('name')
                ->get(),
            'roles' => Role::values(),
            'editUser' => $editUser,
        ]);
    }

    public function store(StoreManagedUserRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $user = User::query()->create([
            'name' => trim($validated['name']),
            'email' => $validated['email'],
            'employee_number' => $validated['employee_number'],
            'role' => $validated['role'],
            'status' => UserStatus::Active->value,
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
        ]);

        return redirect()->route('users.index')->with('flash', [
            'type' => 'success',
            'message' => "Created account for {$user->name}.",
        ]);
    }

    public function update(UpdateManagedUserRequest $request, User $user): RedirectResponse
    {
        $validated = $request->validated();

        if (
            $user->role === Role::SuperAdmin &&
            $validated['role'] !== Role::SuperAdmin->value &&
            User::query()->active()->where('role', Role::SuperAdmin)->count() <= 1
        ) {
            return back()->with('flash', [
                'type' => 'error',
                'message' => 'At least one active Super Admin must remain assigned.',
            ]);
        }

        $user->update([
            'name' => trim($validated['name']),
            'email' => $validated['email'],
            'employee_number' => $validated['employee_number'],
            'role' => $validated['role'],
        ]);

        return redirect()->route('users.index')->with('flash', [
            'type' => 'success',
            'message' => "Updated {$user->name}.",
        ]);
    }

    public function archive(User $user, Request $request): RedirectResponse
    {
        if ($user->id === $request->user()?->id) {
            return back()->with('flash', [
                'type' => 'error',
                'message' => 'Archive a different account before switching away from the current one.',
            ]);
        }

        if (
            $user->role === Role::SuperAdmin &&
            User::query()->active()->where('role', Role::SuperAdmin)->count() <= 1
        ) {
            return back()->with('flash', [
                'type' => 'error',
                'message' => 'At least one active Super Admin must remain available.',
            ]);
        }

        $user->update([
            'status' => UserStatus::Archived->value,
            'archived_at' => now(),
        ]);

        return back()->with('flash', [
            'type' => 'success',
            'message' => "{$user->name} was archived.",
        ]);
    }
}
