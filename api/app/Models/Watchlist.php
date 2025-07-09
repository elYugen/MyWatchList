<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Watchlist extends Model
{
    protected $table = "watchlists";

    protected $fillable = [
        'uuid',
        'type',
        'name',
        'type',
        'image',
        'imdb_id',
        'mal_id',
        'year',
        'season',
        'episode',
        'total_episodes',
    ];
}
