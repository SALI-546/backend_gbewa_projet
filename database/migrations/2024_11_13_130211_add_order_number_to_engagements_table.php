<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddOrderNumberToEngagementsTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('engagements', function (Blueprint $table) {
            $table->string('order_number')->nullable()->after('project_id'); // Ajout de la colonne order_number
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('engagements', function (Blueprint $table) {
            $table->dropColumn('order_number'); // Suppression de la colonne order_number
        });
    }
}
