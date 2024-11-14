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
        Schema::create('engagement_attachments', function (Blueprint $table) {
            $table->id(); // id
            $table->unsignedBigInteger('engagement_id'); // engagement_id
            $table->string('file_path'); // file_path
            $table->string('file_name'); // file_name
            $table->timestamps(); // created_at et updated_at

            // Clé étrangère
            $table->foreign('engagement_id')->references('id')->on('engagements')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('engagement_attachments');
    }
};
