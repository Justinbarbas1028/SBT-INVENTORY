<?php

namespace App\Http\Middleware;

use App\Enums\Role;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $allowedRoles = collect($roles)
            ->map(fn (string $role): ?Role => $this->normalizeRole($role))
            ->filter()
            ->all();

        $user = $request->user();

        abort_unless(
            $user && in_array($user->role, $allowedRoles, true),
            Response::HTTP_FORBIDDEN,
        );

        return $next($request);
    }

    private function normalizeRole(string $role): ?Role
    {
        return match (strtolower(str_replace([' ', '-', '_'], '', $role))) {
            'superadmin' => Role::SuperAdmin,
            'admin' => Role::Admin,
            'employee' => Role::Employee,
            default => Role::tryFrom($role),
        };
    }
}
