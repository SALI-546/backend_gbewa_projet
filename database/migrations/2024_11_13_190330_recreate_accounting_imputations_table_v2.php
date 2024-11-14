<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RecreateAccountingImputationsTableV2 extends Migration
{
    /**
     * Run the migrations.
     */
    // Dans create_accounting_imputation_entries_table.php

public function up()
{
    // Supprimer la table si elle existe déjà
    Schema::dropIfExists('accounting_imputation_entries');

    Schema::create('accounting_imputation_entries', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('accounting_imputation_id');
        $table->string('account_type');
        $table->string('account_number');
        $table->string('amount_type');
        $table->string('amount_placeholder')->nullable();
        $table->timestamps();

        // Clé étrangère
        $table->foreign('accounting_imputation_id')->references('id')->on('accounting_imputations')->onDelete('cascade');
    });
}

public function down()
{
    Schema::dropIfExists('accounting_imputation_entries');
}

}
