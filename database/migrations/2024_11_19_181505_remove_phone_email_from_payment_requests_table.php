<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RemovePhoneEmailFromPaymentRequestsTable extends Migration
{
    /**
     * Exécute les migrations.
     */
    public function up(): void
    {
        Schema::table('payment_requests', function (Blueprint $table) {
            // Vérifier que les colonnes existent avant de les supprimer
            if (Schema::hasColumn('payment_requests', 'phone')) {
                $table->dropColumn('phone');
            }
            if (Schema::hasColumn('payment_requests', 'email')) {
                $table->dropColumn('email');
            }
        });
    }

    /**
     * Annule les migrations.
     */
    public function down(): void
    {
        Schema::table('payment_requests', function (Blueprint $table) {
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
        });
    }
}
