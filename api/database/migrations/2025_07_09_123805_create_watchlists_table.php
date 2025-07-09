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
        Schema::create('watchlists', function (Blueprint $table) {
            $table->id();
            $table->string('uuid');
            $table->string('type'); // movie, serie, anime
            $table->string('name');
            $table->string('image')->nullable();
            $table->string('imdb_id')->nullable();
            $table->string('mal_id')->nullable();
            $table->string('year')->nullable();
            $table->string('season')->nullable();
            $table->integer('episode')->nullable();
            $table->integer('total_episodes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('watchlists');
    }
};
