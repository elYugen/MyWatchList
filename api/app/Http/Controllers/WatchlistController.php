<?php

namespace App\Http\Controllers;

use App\Models\Watchlist;
use Illuminate\Http\Request;

class WatchlistController extends Controller
{
    public function store(Request $request) 
    {
        $uuid = $request->header('X-User-UUID');

        $request->validate([
            'type' => 'required|string',
            'name' => 'required|string',
            'image' => 'required|string',
            'year' => 'nullable|integer',
            'season' => 'nullable|integer',
            'episode' => 'nullable|integer',
            'total_episodes' => 'nullable|integer',
            'imdb_id' => 'nullable',
            'mal_id' => 'nullable',
            'statut' => 'required'
        ]);

        $item = Watchlist::create([
            'uuid' => $uuid,
            'type' => $request->type,
            'name' => $request->name,
            'image' => $request->image,
            'year' => $request->year,
            'season' => $request->season,
            'episode' => $request->episode,
            'total_episodes' => $request->total_episodes,
            'imdb_id' => $request->imdb_id,
            'mal_id' => $request->mal_id,
            'statut' => $request->statut
        ]);

        return response()->json([
            'success' => true,
            'message' => $item->name . ' ajouté avec succès',
            'item' => $item
        ], 201);

        $alreadyIn = Watchlist::where('uuid', $uuid)->where(function ($query) use ($request) {
            if($request->type === 'anime') {
                $query->where('mal_id', $request->mal_id);
            } else {
                $query->where('imdb_id', $request->imdb_id);
            }
        })->exists();

        if ($alreadyIn) {
            return response()->json(['error' => 'Élément déjà dans présent dans la liste à voir'], 409);
        }
    }

    public function index(Request $request)
    {

        $uuid = $request->header('X-User-UUID');

        $items = Watchlist::where('uuid', $uuid)->get();

        return response()->json($items);

    }

    public function destroy($id, Request $request)
    {
        $uuid = $request->header('X-User-UUID');

        $item = Watchlist::where('id', $id)->where('uuid', $uuid)->first();

        if (!$item) {
            return response()->json(['error' => 'Élément introuvable ou non autorisé'], 404);
        }

        $item->delete();

        return response()->json(['success' => true, 'message' => 'Élément supprimé avec succès']);
    }

    public function update(Request $request, $id)
    {
        $uuid = $request->header('X-User-UUID');

        $item = Watchlist::where('id', $id)->where('uuid', $uuid)->first();

        if (!$item) {
            return response()->json(['error' => 'Élément introuvable ou non autorisé'], 404);
        }

        $request->validate([
            'episode' => 'nullable|integer',
            'statut' => 'nullable|in:tosee,inprogress,watched'

        ]);

        $item->update($request->only(['episode', 'statut']));

        return response()->json(['success' => true, 'message' => 'Élément mis à jour avec succès', 'item' => $item]);
    }
}
