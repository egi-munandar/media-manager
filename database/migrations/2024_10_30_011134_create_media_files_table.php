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
        Schema::create('media_files', function (Blueprint $table) {
            $table->id();
            $table->string('title', 100);
            $table->text('file_name');
            $table->string('extension', 10)->nullable();
            $table->string('mime', 100)->nullable();
            $table->bigInteger('size')->nullable();
            $table->text('tags')->nullable();
            $table->text('thumbnail')->nullable();
            $table->text('share_location')->nullable();
            $table->boolean('exists')->default(true);
            $table->boolean('has_proxy')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('media_files');
    }
};
