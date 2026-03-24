<?php

namespace App\Providers;

use App\Enums\Role;
use App\Models\User;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Schema::defaultStringLength(191);

        View::composer('layouts.app', function ($view): void {
            $view->with('availableUsers', User::query()
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
                ->get());
        });
    }
}
