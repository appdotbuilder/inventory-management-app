<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreStockTransactionRequest;
use App\Models\Item;
use App\Models\StockTransaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StockTransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = StockTransaction::with(['item', 'user']);

        if ($request->has('type') && $request->type) {
            $query->where('type', $request->type);
        }

        if ($request->has('start_date') && $request->has('end_date')) {
            $query->byDateRange($request->start_date, $request->end_date);
        }

        if ($request->has('item_id') && $request->item_id) {
            $query->where('item_id', $request->item_id);
        }

        $transactions = $query->latest('transaction_date')->paginate(15)->withQueryString();
        $items = Item::orderBy('name')->get(['id', 'name', 'code']);

        return Inertia::render('stock-transactions/index', [
            'transactions' => $transactions,
            'items' => $items,
            'filters' => $request->only(['type', 'start_date', 'end_date', 'item_id']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $items = Item::orderBy('name')->get(['id', 'name', 'code', 'stock_quantity']);

        return Inertia::render('stock-transactions/create', [
            'items' => $items,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreStockTransactionRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = auth()->id();

        $item = Item::findOrFail($data['item_id']);

        // Check if stock out quantity is valid
        if ($data['type'] === 'out' && $data['quantity'] > $item->stock_quantity) {
            return back()->withErrors([
                'quantity' => 'Jumlah keluar melebihi stok tersedia (' . $item->stock_quantity . ').'
            ]);
        }

        $transaction = StockTransaction::create($data);

        // Update item stock quantity
        if ($data['type'] === 'in') {
            $item->increment('stock_quantity', $data['quantity']);
        } else {
            $item->decrement('stock_quantity', $data['quantity']);
        }

        return redirect()->route('stock-transactions.index')
            ->with('success', 'Transaksi stok berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(StockTransaction $stockTransaction)
    {
        $stockTransaction->load(['item', 'user']);

        return Inertia::render('stock-transactions/show', [
            'transaction' => $stockTransaction,
        ]);
    }
}