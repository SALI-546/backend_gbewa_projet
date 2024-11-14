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
            $table->id(); // id
            $table->unsignedBigInteger('engagement_id'); // engagement_id
            $table->string('account_code'); // account_code
            $table->decimal('amount', 15, 2); // amount
            $table->string('description'); // description
            $table->enum('signature', ['Visa Comptable', 'Visa Chef Comptable', 'Visa DAF', 'Visa DE']); // signature
            $table->timestamps(); // created_at et updated_at

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
