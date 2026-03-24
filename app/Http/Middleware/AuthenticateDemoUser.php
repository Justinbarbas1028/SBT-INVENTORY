<?php

namespace App\Http\Middleware;

use App\Enums\Role;
use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateDemoUser
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        if ($user?->status?->value !== 'Active') {
            Auth::logout();
            $user = null;
        }

        if (! $user) {
            $fallbackUser = User::query()
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
                ->first();

            if ($fallbackUser) {
                Auth::login($fallbackUser);
            }
        }

        return $next($request);
    }
}
