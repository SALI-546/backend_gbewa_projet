<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterBudgetTrackingApprovalsTableChangeSignatureToText extends Migration
{
    public function up()
    {
        Schema::table('budget_tracking_approvals', function (Blueprint $table) {
            $table->text('signature')->change();
            // Si Option 2 :
            // $table->enum('signature_type', ['Visa Comptable', 'Visa Chef Comptable', 'Visa DAF', 'Visa DE'])->after('avis');
        });
    }

    public function down()
    {
        Schema::table('budget_tracking_approvals', function (Blueprint $table) {
            $table->enum('signature', ['Visa Comptable', 'Visa Chef Comptable', 'Visa DAF', 'Visa DE'])->change();
            // Si Option 2 :
            // $table->dropColumn('signature_type');
        });
    }
}
