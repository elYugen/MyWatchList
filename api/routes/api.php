<?php

use App\Http\Controllers\WatchlistController;
use Illuminate\Support\Facades\Route;

// Route lié à la playlist "A voir"
Route::post('/watchlist', [WatchlistController::class, 'store']);
Route::get('/watchlist', [WatchlistController::class, 'index']);