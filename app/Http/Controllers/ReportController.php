<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\StockTransaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    /**
     * Display stock report.
     */
    public function index(Request $request)
    {
        $query = Item::query();

        if ($request->has('category') && $request->category) {
            $query->byCategory($request->category);
        }

        if ($request->has('search') && $request->search) {
            $query->search($request->search);
        }

        $items = $query->orderBy('name')->get();
        $categories = Item::distinct()->pluck('category')->filter()->values();

        $totalValue = $items->sum(function ($item) {
            return $item->stock_quantity * ($item->price ?? 0);
        });

        return Inertia::render('reports/stock', [
            'items' => $items,
            'categories' => $categories,
            'filters' => $request->only(['category', 'search']),
            'total_value' => $totalValue,
        ]);
    }

    /**
     * Show transaction report.
     */
    public function show(Request $request)
    {
        $query = StockTransaction::with(['item', 'user']);

        if ($request->has('type') && $request->type) {
            $query->where('type', $request->type);
        }

        if ($request->has('start_date') && $request->start_date) {
            $query->where('transaction_date', '>=', $request->start_date);
        }

        if ($request->has('end_date') && $request->end_date) {
            $query->where('transaction_date', '<=', $request->end_date);
        }

        if ($request->has('item_id') && $request->item_id) {
            $query->where('item_id', $request->item_id);
        }

        $transactions = $query->orderBy('transaction_date', 'desc')->get();
        $items = Item::orderBy('name')->get(['id', 'name', 'code']);

        $summary = [
            'total_transactions' => $transactions->count(),
            'stock_in_total' => $transactions->where('type', 'in')->sum('quantity'),
            'stock_out_total' => $transactions->where('type', 'out')->sum('quantity'),
        ];

        return Inertia::render('reports/transactions', [
            'transactions' => $transactions,
            'items' => $items,
            'filters' => $request->only(['type', 'start_date', 'end_date', 'item_id']),
            'summary' => $summary,
        ]);
    }
}