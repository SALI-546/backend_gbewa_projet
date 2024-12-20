<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBudgetTrackingApprovalsTable extends Migration
{
    public function up()
    {
        Schema::create('budget_tracking_approvals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('budget_tracking_id')->constrained()->onDelete('cascade');
            $table->enum('avis', ['Favorable', 'Défavorable']);
            $table->enum('signature', ['Visa Comptable', 'Visa Chef Comptable', 'Visa DAF', 'Visa DE']);
            $table->timestamp('approved_at')->useCurrent();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('budget_tracking_approvals');
    }
}
