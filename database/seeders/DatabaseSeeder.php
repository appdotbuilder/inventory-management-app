<?php

namespace Database\Seeders;

use App\Models\Item;
use App\Models\StockTransaction;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user
        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'role' => 'admin',
        ]);

        // Create staff users
        $staff1 = User::factory()->create([
            'name' => 'Staff User 1',
            'email' => 'staff1@example.com',
            'role' => 'staff',
        ]);

        $staff2 = User::factory()->create([
            'name' => 'Staff User 2',
            'email' => 'staff2@example.com',
            'role' => 'staff',
        ]);

        // Create items
        $items = Item::factory(50)->create();

        // Create some low stock items
        Item::factory(10)->lowStock()->create();

        // Create some out of stock items
        Item::factory(5)->outOfStock()->create();

        // Create stock transactions
        foreach ($items as $item) {
            // Create some stock in transactions
            $stockInTransactions = StockTransaction::factory(random_int(2, 5))
                ->stockIn()
                ->create([
                    'item_id' => $item->id,
                    'user_id' => $this->faker->randomElement([$admin->id, $staff1->id, $staff2->id]),
                ]);

            // Create some stock out transactions
            $stockOutTransactions = StockTransaction::factory(random_int(1, 3))
                ->stockOut()
                ->create([
                    'item_id' => $item->id,
                    'user_id' => $this->faker->randomElement([$admin->id, $staff1->id, $staff2->id]),
                ]);

            // Update item stock quantity based on transactions
            $totalIn = $stockInTransactions->sum('quantity');
            $totalOut = $stockOutTransactions->sum('quantity');
            
            $item->update([
                'stock_quantity' => max(0, $totalIn - $totalOut)
            ]);
        }
    }

    private \Faker\Generator $faker;

    public function __construct()
    {
        $this->faker = \Faker\Factory::create('id_ID');
    }
}
