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
        // Création de la table 'users' avec toutes les colonnes nécessaires
        Schema::create('users', function (Blueprint $table) {
            $table->bigIncrements('id'); // id
            $table->string('name'); // name
            $table->string('email', 191)->unique(); // email
            $table->timestamp('email_verified_at')->nullable(); // email_verified_at
            $table->string('password')->nullable(); // password
            $table->string('password_reset_token', 191)->nullable(); // password_reset_token
            $table->rememberToken(); // remember_token
            $table->text('attachments')->nullable(); // attachments
            $table->string('status')->default('active'); // status
            $table->string('image', 191)->nullable(); // image
            $table->boolean('is_suspended')->default(false); // is_suspended
            $table->timestamps(); // created_at et updated_at
        });

        // Création de la table 'sessions' si nécessaire
        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('sessions');
    }
};
