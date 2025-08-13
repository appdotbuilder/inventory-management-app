<?php

namespace Database\Factories;

use App\Models\Item;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Item>
 */
class ItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $categories = ['Elektronik', 'Pakaian', 'Makanan', 'Minuman', 'Alat Tulis', 'Peralatan', 'Aksesoris'];
        $units = ['pcs', 'kg', 'liter', 'meter', 'box', 'set', 'pack'];
        
        return [
            'code' => 'BRG' . str_pad((string) $this->faker->unique()->numberBetween(1, 9999), 4, '0', STR_PAD_LEFT),
            'name' => $this->faker->words(random_int(2, 4), true),
            'description' => $this->faker->optional(0.7)->sentence(),
            'category' => $this->faker->randomElement($categories),
            'unit' => $this->faker->randomElement($units),
            'stock_quantity' => $this->faker->numberBetween(0, 100),
            'price' => $this->faker->optional(0.8)->numberBetween(10000, 1000000),
        ];
    }

    /**
     * Indicate that the item has low stock.
     */
    public function lowStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'stock_quantity' => $this->faker->numberBetween(0, 5),
        ]);
    }

    /**
     * Indicate that the item is out of stock.
     */
    public function outOfStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'stock_quantity' => 0,
        ]);
    }
}