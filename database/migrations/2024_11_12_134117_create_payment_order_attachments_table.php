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
        Schema::create('payment_order_attachments', function (Blueprint $table) {
            $table->id(); // id
            $table->unsignedBigInteger('payment_order_recap_form_id'); // payment_order_recap_form_id
            $table->string('file_path'); // file_path
            $table->string('file_name'); // file_name
            $table->timestamps(); // created_at et updated_at

            // Clé étrangère
            $table->foreign('payment_order_recap_form_id')->references('id')->on('payment_order_recap_forms')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_order_attachments');
    }
};
