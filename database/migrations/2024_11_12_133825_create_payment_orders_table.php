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
        Schema::create('payment_orders', function (Blueprint $table) {
            $table->id(); // id
            $table->unsignedBigInteger('project_id'); // project_id
            $table->string('order_number')->unique(); // order_number
            $table->string('account'); // account
            $table->string('title'); // title
            $table->string('invoice_number'); // invoice_number
            $table->string('bill_of_lading_number'); // bill_of_lading_number
            $table->boolean('emetteur_signed')->default(false); // emetteur_signed
            $table->date('emetteur_signed_at')->nullable(); // emetteur_signed_at
            $table->boolean('controle_signed')->default(false); // controle_signed
            $table->date('controle_signed_at')->nullable(); // controle_signed_at
            $table->boolean('validation_signed')->default(false); // validation_signed
            $table->date('validation_signed_at')->nullable(); // validation_signed_at
            $table->timestamps(); // created_at et updated_at

            // Clé étrangère
            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_orders');
    }
};
