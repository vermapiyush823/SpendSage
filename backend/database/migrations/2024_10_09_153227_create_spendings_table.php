<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create('spendings', function (Blueprint $table) {
            $table->id();
            $table->decimal('travel', 10, 2)->nullable();  // 10 digits with 2 decimals
            $table->decimal('food', 10, 2)->nullable();
            $table->decimal('shopping', 10, 2)->nullable();
            $table->decimal('personal', 10, 2)->nullable();
            $table->decimal('other', 10, 2)->nullable();
            $table->foreignId('user_id')->constrained();  // Foreign key for user
            $table->timestamps();
        });
    }


    public function down(): void
    {
        Schema::dropIfExists('spendings');
    }
};
