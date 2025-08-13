<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\StockTransaction
 *
 * @property int $id
 * @property int $item_id
 * @property int $user_id
 * @property string $type
 * @property int $quantity
 * @property string|null $notes
 * @property string|null $supplier
 * @property string|null $destination
 * @property \Illuminate\Support\Carbon $transaction_date
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|StockTransaction newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|StockTransaction newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|StockTransaction query()
 * @method static \Illuminate\Database\Eloquent\Builder|StockTransaction whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockTransaction whereDestination($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockTransaction whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockTransaction whereItemId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockTransaction whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockTransaction whereQuantity($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockTransaction whereSupplier($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockTransaction whereTransactionDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockTransaction whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockTransaction whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockTransaction whereUserId($value)
 * @method static \Database\Factories\StockTransactionFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class StockTransaction extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'item_id',
        'user_id',
        'type',
        'quantity',
        'notes',
        'supplier',
        'destination',
        'transaction_date',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'quantity' => 'integer',
        'transaction_date' => 'datetime',
    ];

    /**
     * Get the item that owns the stock transaction.
     */
    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }

    /**
     * Get the user that owns the stock transaction.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope a query to only include stock in transactions.
     */
    public function scopeStockIn($query)
    {
        return $query->where('type', 'in');
    }

    /**
     * Scope a query to only include stock out transactions.
     */
    public function scopeStockOut($query)
    {
        return $query->where('type', 'out');
    }

    /**
     * Scope a query to filter transactions by date range.
     */
    public function scopeByDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('transaction_date', [$startDate, $endDate]);
    }
}