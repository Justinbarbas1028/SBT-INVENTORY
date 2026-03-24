<?php

use App\Enums\BorrowRequestStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('borrow_requests', function (Blueprint $table): void {
            $table->id();
            $table->string('code')->nullable()->unique();
            $table->string('employee_number');
            $table->string('employee_email');
            $table->string('requested_by_name');
            $table->foreignId('requested_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('status')->default(BorrowRequestStatus::Pending->value);
            $table->timestamp('reviewed_at')->nullable();
            $table->foreignId('reviewed_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('reviewed_by_name')->nullable();
            $table->text('review_note')->nullable();
            $table->timestamps();
        });

        Schema::create('borrow_request_items', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('borrow_request_id')->constrained('borrow_requests')->cascadeOnDelete();
            $table->foreignId('item_id')->nullable()->constrained('items')->nullOnDelete();
            $table->string('item_code');
            $table->string('item_name');
            $table->unsignedInteger('quantity')->default(1);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('borrow_request_items');
        Schema::dropIfExists('borrow_requests');
    }
};
