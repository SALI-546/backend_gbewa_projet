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
        Schema::create('engagement_operations', function (Blueprint $table) {
            $table->id(); // id
            $table->unsignedBigInteger('engagement_id'); // engagement_id
            $table->string('designation'); // designation
            $table->integer('quantite'); // quantite
            $table->integer('nombre'); // nombre
            $table->decimal('pu', 15, 2); // pu
            $table->decimal('montant', 15, 2); // montant
            $table->text('observations')->nullable(); // observations
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
        Schema::dropIfExists('engagement_operations');
    }
};
