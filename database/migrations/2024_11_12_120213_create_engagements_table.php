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
        Schema::create('engagements', function (Blueprint $table) {
            $table->engine = 'InnoDB'; 
            $table->bigIncrements('id'); // id
            $table->unsignedBigInteger('project_id'); // Référence au projet
            $table->string('service_demandeur'); // Service demandeur
            $table->string('wbs')->nullable(); // WBS
            $table->string('motif_demande')->nullable(); // Motif demande
            $table->date('date')->nullable(); // Date
            $table->string('reference')->nullable(); // Référence
            $table->timestamps(); // created_at et updated_at

            // Indexes
            $table->index('project_id');

            // Foreign Keys
            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('engagements');
    }
};
