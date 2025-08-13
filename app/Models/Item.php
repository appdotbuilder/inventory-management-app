<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\Item
 *
 * @property int $id
 * @property string $code
 * @property string $name
 * @property string|null $description
 * @property string|null $category
 * @property string $unit
 * @property int $stock_quantity
 * @property string|null $price
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Item newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Item newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Item query()
 * @method static \Illuminate\Database\Eloquent\Builder|Item whereCategory($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Item whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Item whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Item whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Item whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Item whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Item wherePrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Item whereStockQuantity($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Item whereUnit($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Item whereUpdatedAt($value)
 * @method static \Database\Factories\ItemFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class Item extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'code',
        'name',
        'description',
        'category',
        'unit',
        'stock_quantity',
        'price',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'stock_quantity' => 'integer',
        'price' => 'decimal:2',
    ];

    /**
     * Get the stock transactions for the item.
     */
    public function stockTransactions(): HasMany
    {
        return $this->hasMany(StockTransaction::class);
    }

    /**
     * Get the recent stock transactions for the item.
     */
    public function recentTransactions(): HasMany
    {
        return $this->stockTransactions()->latest('transaction_date')->limit(10);
    }

    /**
     * Scope a query to search items by name or code.
     */
    public function scopeSearch($query, $search)
    {
        return $query->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
    }

    /**
     * Scope a query to filter items by category.
     */
    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }
}