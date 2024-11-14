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
        Schema::create('recap_forms', function (Blueprint $table) {
            $table->id(); // id
            $table->unsignedBigInteger('payment_request_id'); // payment_request_id
            $table->string('activite'); // activite
            $table->decimal('montant_presente_total', 15, 2); // montant_presente_total
            $table->decimal('montant_presente_eligible', 15, 2); // montant_presente_eligible
            $table->decimal('montant_sollicite', 15, 2); // montant_sollicite
            $table->timestamps(); // created_at et updated_at

            // Clé étrangère
            $table->foreign('payment_request_id')->references('id')->on('payment_requests')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recap_forms');
    }
};
