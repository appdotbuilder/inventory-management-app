<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('items', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique()->comment('Unique item code');
            $table->string('name')->comment('Item name');
            $table->text('description')->nullable()->comment('Item description');
            $table->string('category')->nullable()->comment('Item category');
            $table->string('unit')->default('pcs')->comment('Unit of measurement');
            $table->integer('stock_quantity')->default(0)->comment('Current stock quantity');
            $table->decimal('price', 12, 2)->nullable()->comment('Item price');
            $table->timestamps();
            
            $table->index('code');
            $table->index('name');
            $table->index('category');
            $table->index(['stock_quantity', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('items');
    }
};