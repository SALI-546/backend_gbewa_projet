<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAccountingImputationEntriesTable extends Migration
{
    public function up()
    {
        Schema::create('accounting_imputation_entries', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('accounting_imputation_id');
            $table->string('account_type'); // 'Débit' ou 'Crédit'
            $table->string('account_number');
            $table->string('amount_type'); // 'Débit' ou 'Crédit'
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
