<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\StockTransactionController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Items Management - Admin can do everything, Staff can only view
    Route::get('items', [ItemController::class, 'index'])->name('items.index');
    Route::get('items/{item}', [ItemController::class, 'show'])->name('items.show');
    
    // Admin only routes for items
    Route::middleware(['admin'])->group(function () {
        Route::get('items/create', [ItemController::class, 'create'])->name('items.create');
        Route::post('items', [ItemController::class, 'store'])->name('items.store');
        Route::get('items/{item}/edit', [ItemController::class, 'edit'])->name('items.edit');
        Route::put('items/{item}', [ItemController::class, 'update'])->name('items.update');
        Route::delete('items/{item}', [ItemController::class, 'destroy'])->name('items.destroy');
    });
    
    // Stock Transactions - Both roles can create and view
    Route::resource('stock-transactions', StockTransactionController::class)
        ->only(['index', 'create', 'store', 'show']);
    
    // Users Management (Admin only)
    Route::middleware(['admin'])->group(function () {
        Route::resource('users', UserController::class);
    });
    
    // Reports
    Route::prefix('reports')->name('reports.')->group(function () {
        Route::get('stock', [ReportController::class, 'index'])->name('stock');
        Route::get('transactions', [ReportController::class, 'show'])->name('transactions');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
