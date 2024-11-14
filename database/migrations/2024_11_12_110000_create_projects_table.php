<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {   
        if (!Schema::hasTable('projects')) {
            Schema::create('projects', function (Blueprint $table) {
                $table->engine = 'InnoDB';
                $table->bigIncrements('id');
                $table->string('title');
                $table->text('description')->nullable();
                $table->string('image')->nullable();
                $table->text('attachments')->nullable();
                $table->text('members')->nullable();
                $table->text('beneficiaries')->nullable();
                $table->integer('order')->nullable();
                $table->string('status')->nullable();
                $table->string('intervention_zone', 191)->nullable();
                $table->date('start_date')->nullable();
                $table->date('end_date')->nullable();
                $table->unsignedBigInteger('user_id');
                $table->unsignedBigInteger('project_id')->nullable(); // Self-referencing FK
                $table->timestamps();
                $table->string('type')->default('programme');
                $table->unsignedBigInteger('strategic_axe_id')->nullable();
                $table->string('department', 191)->nullable();
                $table->string('village', 191)->nullable();
                $table->string('district', 191)->nullable();
                $table->unsignedBigInteger('result_id')->nullable();
                $table->text('lessons_learned')->nullable();

                // Indexes (primary auto-generated for `id`)
                $table->index('user_id');
                $table->index('project_id');
                $table->index('strategic_axe_id');
                $table->index('result_id');

                // Foreign Keys
                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade')->onUpdate('cascade');
                $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade')->onUpdate('cascade');
                $table->foreign('strategic_axe_id')->references('id')->on('strategic_axes')->onDelete('cascade')->onUpdate('cascade');
                $table->foreign('result_id')->references('id')->on('results')->onDelete('cascade');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
