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
        Schema::create('payment_order_recap_forms', function (Blueprint $table) {
            $table->id(); // id
            $table->unsignedBigInteger('payment_order_id'); // payment_order_id
            $table->string('beneficiaire'); // beneficiaire
            $table->decimal('montant', 15, 2); // montant
            $table->string('objet_depense'); // objet_depense
            $table->string('ligne_budgetaire'); // ligne_budgetaire
            $table->timestamps(); // created_at et updated_at

            // Clé étrangère
            $table->foreign('payment_order_id')->references('id')->on('payment_orders')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_order_recap_forms');
    }
};
