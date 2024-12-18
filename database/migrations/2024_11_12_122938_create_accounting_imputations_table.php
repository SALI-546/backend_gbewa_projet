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
        Schema::create('accounting_imputations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('engagement_id');
            $table->string('account_code')->nullable(); // account_code
            $table->decimal('amount', 15, 2)->nullable(); // amount
            $table->string('order_number')->nullable(); // Numéro d'ordre
            $table->string('description')->nullable();
            $table->enum('signature', ['Visa Comptable', 'Visa Chef Comptable', 'Visa DAF', 'Visa DE'])->nullable();
            $table->timestamps();

            // Clé étrangère
            $table->foreign('engagement_id')->references('id')->on('engagements')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('accounting_imputations');
    }
};
