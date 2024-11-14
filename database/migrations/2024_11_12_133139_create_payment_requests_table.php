<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
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
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
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
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_requests');
    }
};