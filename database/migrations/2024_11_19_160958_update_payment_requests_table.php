<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Exécute les migrations.
     */
    public function up(): void
    {
        // Vérifier si la table 'payment_requests' n'existe pas déjà
        if (!Schema::hasTable('payment_requests')) {
            // Créer la table 'payment_requests'
            Schema::create('payment_requests', function (Blueprint $table) {
                $table->engine = 'InnoDB';
                $table->bigIncrements('id'); // Clé primaire
                $table->unsignedBigInteger('project_id'); // Référence au projet
                $table->unsignedBigInteger('followed_by_id'); // Référence à l'utilisateur
                $table->string('order_number');
                $table->timestamp('date')->nullable();
                $table->string('operation');
                $table->string('beneficiary');
                $table->text('invoice_details');
                $table->string('budget_line');
                $table->timestamps();

                // Clés étrangères
                $table->foreign('project_id')
                      ->references('id')
                      ->on('projects')
                      ->onDelete('cascade')
                      ->onUpdate('cascade');

                $table->foreign('followed_by_id')
                      ->references('id')
                      ->on('users')
                      ->onDelete('cascade')
                      ->onUpdate('cascade');
            });
        } else {
            // Si la table existe déjà, apporter des modifications si nécessaire
            Schema::table('payment_requests', function (Blueprint $table) {
                // Par exemple, ajouter une colonne :
                // $table->string('nouvelle_colonne')->nullable();
            });
        }
    }

    /**
     * Annule les migrations.
     */
    public function down(): void
    {
        // Supprimer la table 'payment_requests' lors du rollback
        Schema::dropIfExists('payment_requests');
    }
};
