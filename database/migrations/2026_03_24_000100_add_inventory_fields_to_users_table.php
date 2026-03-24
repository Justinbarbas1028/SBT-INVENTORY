<?php

use App\Enums\Role;
use App\Enums\UserStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->string('employee_number')->nullable()->unique()->after('email');
            $table->string('role')->default(Role::Employee->value)->after('employee_number');
            $table->string('status')->default(UserStatus::Active->value)->after('role');
            $table->timestamp('archived_at')->nullable()->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->dropColumn(['employee_number', 'role', 'status', 'archived_at']);
        });
    }
};
