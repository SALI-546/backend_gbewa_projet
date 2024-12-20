<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterBudgetTrackingApprovalsTableFixSignatureColumns extends Migration
{
    public function up()
    {
        Schema::table('budget_tracking_approvals', function (Blueprint $table) {
            // Supprimer la colonne 'signature' existante
            $table->dropColumn('signature');

            // Ajouter la colonne 'signature_type'
            $table->enum('signature_type', ['Visa Comptable', 'Visa Chef Comptable', 'Visa DAF', 'Visa DE'])->after('avis');

            // Ajouter la colonne 'signature_image' pour stocker la signature numérique
            $table->text('signature_image')->nullable()->after('signature_type');

            // Ajouter la colonne 'observation' pour les commentaires des approbateurs
            $table->text('observation')->nullable()->after('signature_image');
        });
    }

    public function down()
    {
        Schema::table('budget_tracking_approvals', function (Blueprint $table) {
            // Supprimer les colonnes ajoutées
            $table->dropColumn(['signature_type', 'signature_image', 'observation']);

            // Recréer la colonne 'signature' avec l'ancien type enum
            $table->enum('signature', ['Visa Comptable', 'Visa Chef Comptable', 'Visa DAF', 'Visa DE'])->after('avis');
        });
    }
}
