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
        Schema::create('work_days', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('employee_id'); // Verwijst naar users.id
            $table->string('day_of_week'); // Bijvoorbeeld: Monday, Tuesday
            $table->time('start_time');
            $table->time('end_time');
            $table->timestamps();

            // Foreign key naar users-tabel
            $table->foreign('employee_id')->references('id')->on('users')->onDelete('cascade');

            // Zorgt dat een werknemer niet twee keer op dezelfde dag een werkdag heeft
            $table->unique(['employee_id', 'day_of_week']);

            // Index voor betere query-prestaties
            $table->index('employee_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('work_days');
    }
};
