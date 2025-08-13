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
        Schema::create('stock_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('item_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['in', 'out'])->comment('Transaction type: in or out');
            $table->integer('quantity')->comment('Transaction quantity');
            $table->text('notes')->nullable()->comment('Transaction notes');
            $table->string('supplier')->nullable()->comment('Supplier name for stock in');
            $table->string('destination')->nullable()->comment('Destination for stock out');
            $table->timestamp('transaction_date')->comment('Transaction date');
            $table->timestamps();
            
            $table->index(['item_id', 'type']);
            $table->index(['user_id', 'transaction_date']);
            $table->index(['type', 'transaction_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_transactions');
    }
};