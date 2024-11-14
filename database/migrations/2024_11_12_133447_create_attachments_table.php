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
        Schema::create('attachments', function (Blueprint $table) {
            $table->id(); // id
            $table->unsignedBigInteger('recap_form_id'); // recap_form_id
            $table->string('file_path'); // file_path
            $table->string('file_name'); // file_name
            $table->timestamps(); // created_at et updated_at

            // Clé étrangère
            $table->foreign('recap_form_id')->references('id')->on('recap_forms')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attachments');
    }
};
