<?php

use App\Http\Controllers\ActingUserController;
use App\Http\Controllers\BorrowRequestController;
use App\Http\Controllers\BorrowRequestLogController;
use App\Http\Controllers\CheckInController;
use App\Http\Controllers\CheckOutController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HistoryController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\ItemRegistrationController;
use App\Http\Controllers\LogisticsController;
use App\Http\Controllers\UserManagementController;
use Illuminate\Support\Facades\Route;

Route::get('/', DashboardController::class)->name('dashboard');

Route::post('/acting-user', [ActingUserController::class, 'update'])->name('acting-user.update');

Route::get('/inventory', [InventoryController::class, 'index'])->name('inventory.index');
Route::post('/inventory/bulk', [InventoryController::class, 'bulkUpdate'])->name('inventory.bulk-update');
Route::get('/inventory/export', [InventoryController::class, 'export'])->name('inventory.export');

Route::get('/register-item', [ItemRegistrationController::class, 'create'])->name('items.create');
Route::post('/register-item', [ItemRegistrationController::class, 'store'])->name('items.store');

Route::get('/check-in', [CheckInController::class, 'create'])->name('check-in.create');
Route::post('/check-in', [CheckInController::class, 'store'])->name('check-in.store');

Route::get('/check-out', [CheckOutController::class, 'create'])->name('check-out.create');
Route::post('/check-out', [CheckOutController::class, 'store'])->name('check-out.store');

Route::get('/logistics', [LogisticsController::class, 'index'])->name('logistics.index');
Route::post('/logistics', [LogisticsController::class, 'store'])->name('logistics.store');
Route::patch('/logistics/{logisticsRequest}/advance', [LogisticsController::class, 'advance'])->name('logistics.advance');
Route::patch('/logistics/{logisticsRequest}/cancel', [LogisticsController::class, 'cancel'])->name('logistics.cancel');

Route::get('/history', [HistoryController::class, 'index'])->name('history.index');
Route::get('/history/export', [HistoryController::class, 'export'])->name('history.export');

Route::get('/request-item', [BorrowRequestController::class, 'create'])->name('borrow-requests.create');
Route::post('/request-item', [BorrowRequestController::class, 'store'])->name('borrow-requests.store');

Route::middleware('role:SuperAdmin')->group(function (): void {
    Route::get('/request-logs', [BorrowRequestLogController::class, 'index'])->name('borrow-request-logs.index');
    Route::patch('/request-logs/{borrowRequest}/review', [BorrowRequestLogController::class, 'review'])->name('borrow-request-logs.review');

    Route::get('/manage-roles', [UserManagementController::class, 'index'])->name('users.index');
    Route::post('/manage-roles', [UserManagementController::class, 'store'])->name('users.store');
    Route::patch('/manage-roles/{user}', [UserManagementController::class, 'update'])->name('users.update');
    Route::patch('/manage-roles/{user}/archive', [UserManagementController::class, 'archive'])->name('users.archive');
});
