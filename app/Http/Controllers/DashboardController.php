<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\StockTransaction;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the dashboard.
     */
    public function index()
    {
        $totalItems = Item::count();
        $lowStockItems = Item::where('stock_quantity', '<=', 10)->count();
        $todayTransactions = StockTransaction::whereDate('transaction_date', today())->count();
        $totalStockValue = Item::sum(\DB::raw('stock_quantity * COALESCE(price, 0)'));

        $recentTransactions = StockTransaction::with(['item', 'user'])
            ->latest('transaction_date')
            ->limit(10)
            ->get();

        $lowStockItemsList = Item::where('stock_quantity', '<=', 10)
            ->orderBy('stock_quantity')
            ->limit(10)
            ->get();

        // Monthly transaction data for chart
        $monthlyData = StockTransaction::selectRaw("
                CAST(strftime('%m', transaction_date) AS INTEGER) as month,
                type,
                COUNT(*) as count
            ")
            ->whereYear('transaction_date', now()->year)
            ->groupBy('month', 'type')
            ->orderBy('month')
            ->get()
            ->groupBy('month');

        $chartData = [];
        for ($i = 1; $i <= 12; $i++) {
            $monthData = $monthlyData->get($i);
            $chartData[] = [
                'month' => Carbon::create()->month($i)->format('M'),
                'stock_in' => $monthData ? $monthData->where('type', 'in')->first()->count ?? 0 : 0,
                'stock_out' => $monthData ? $monthData->where('type', 'out')->first()->count ?? 0 : 0,
            ];
        }

        return Inertia::render('dashboard', [
            'stats' => [
                'total_items' => $totalItems,
                'low_stock_items' => $lowStockItems,
                'today_transactions' => $todayTransactions,
                'total_stock_value' => $totalStockValue,
            ],
            'recent_transactions' => $recentTransactions,
            'low_stock_items' => $lowStockItemsList,
            'chart_data' => $chartData,
        ]);
    }
}