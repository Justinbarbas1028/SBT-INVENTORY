<?php

use App\Enums\LogisticsStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('logistics_requests', function (Blueprint $table): void {
            $table->id();
            $table->string('code')->nullable()->unique();
            $table->string('type');
            $table->string('origin');
            $table->string('destination');
            $table->foreignId('requested_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('requested_by_name');
            $table->string('handler');
            $table->string('priority');
            $table->string('status')->default(LogisticsStatus::Requested->value);
            $table->date('scheduled_date');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('logistics_request_items', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('logistics_request_id')->constrained('logistics_requests')->cascadeOnDelete();
            $table->foreignId('item_id')->nullable()->constrained('items')->nullOnDelete();
            $table->string('item_code');
            $table->string('item_name');
            $table->unsignedInteger('quantity')->default(1);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('logistics_request_items');
        Schema::dropIfExists('logistics_requests');
    }
};
