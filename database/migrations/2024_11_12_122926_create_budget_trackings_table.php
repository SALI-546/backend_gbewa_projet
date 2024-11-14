<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBudgetTrackingsTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('budget_trackings', function (Blueprint $table) {
            $table->id(); // id
            $table->unsignedBigInteger('engagement_id'); // engagement_id
            $table->string('budget_line')->nullable(); // budget_line
            $table->decimal('amount_allocated', 15, 2)->nullable(); // amount_allocated
            $table->decimal('amount_spent', 15, 2)->nullable(); // amount_spent
            $table->decimal('amount_approved', 15, 2)->nullable(); // amount_approved
            $table->decimal('old_balance', 15, 2)->nullable(); // old_balance
            $table->decimal('new_balance', 15, 2)->nullable(); // new_balance
            $table->string('fournisseurs_prestataire')->nullable(); // fournisseurs_prestataire
            $table->enum('avis', ['Favorable', 'Défavorable'])->nullable(); // avis
            $table->enum('moyens_de_paiement', ['Caisse', 'Chèque', 'Virement'])->nullable(); // moyens_de_paiement
            $table->enum('signature', ['Visa Comptable', 'Visa Chef Comptable', 'Visa DAF', 'Visa DE'])->nullable(); // signature
            $table->timestamps(); // created_at et updated_at

            // Clé étrangère
            $table->foreign('engagement_id')->references('id')->on('engagements')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('budget_trackings');
    }
}
