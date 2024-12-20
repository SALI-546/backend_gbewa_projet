<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RemoveAvisAndSignatureFromBudgetTrackingsTable extends Migration
{
    public function up()
    {
        Schema::table('budget_trackings', function (Blueprint $table) {
            $table->dropColumn(['avis', 'signature']);
        });
    }

    public function down()
    {
        Schema::table('budget_trackings', function (Blueprint $table) {
            $table->enum('avis', ['Favorable', 'Défavorable'])->nullable();
            $table->enum('signature', ['Visa Comptable', 'Visa Chef Comptable', 'Visa DAF', 'Visa DE'])->nullable();
        });
    }
}
