<?php

namespace Database\Factories;

use App\Models\Item;
use App\Models\StockTransaction;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\StockTransaction>
 */
class StockTransactionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type = $this->faker->randomElement(['in', 'out']);
        $suppliers = ['PT. Sukses Jaya', 'CV. Maju Bersama', 'Toko Makmur', 'UD. Berkah', 'PT. Global Trading'];
        $destinations = ['Toko Cabang A', 'Toko Cabang B', 'Customer Retail', 'Export', 'Internal Use'];
        
        return [
            'item_id' => Item::factory(),
            'user_id' => User::factory(),
            'type' => $type,
            'quantity' => $this->faker->numberBetween(1, 50),
            'notes' => $this->faker->optional(0.6)->sentence(),
            'supplier' => $type === 'in' ? $this->faker->randomElement($suppliers) : null,
            'destination' => $type === 'out' ? $this->faker->randomElement($destinations) : null,
            'transaction_date' => $this->faker->dateTimeBetween('-30 days', 'now'),
        ];
    }

    /**
     * Indicate that this is a stock in transaction.
     */
    public function stockIn(): static
    {
        $suppliers = ['PT. Sukses Jaya', 'CV. Maju Bersama', 'Toko Makmur', 'UD. Berkah', 'PT. Global Trading'];
        
        return $this->state(fn (array $attributes) => [
            'type' => 'in',
            'supplier' => $this->faker->randomElement($suppliers),
            'destination' => null,
        ]);
    }

    /**
     * Indicate that this is a stock out transaction.
     */
    public function stockOut(): static
    {
        $destinations = ['Toko Cabang A', 'Toko Cabang B', 'Customer Retail', 'Export', 'Internal Use'];
        
        return $this->state(fn (array $attributes) => [
            'type' => 'out',
            'supplier' => null,
            'destination' => $this->faker->randomElement($destinations),
        ]);
    }
}