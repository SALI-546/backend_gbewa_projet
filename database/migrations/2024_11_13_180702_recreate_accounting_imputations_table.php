<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RecreateAccountingImputationsTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        // Supprimer la table existante
        Schema::dropIfExists('accounting_imputations');

        // Recréer la table avec le nouveau schéma
        Schema::create('accounting_imputations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('engagement_id');
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
    public function down()
    {
        // Supprimer la table lors du rollback
        Schema::dropIfExists('accounting_imputations');
    }
}
