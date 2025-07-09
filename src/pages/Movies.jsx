import { useState, useEffect } from "react";
import MovieRandomPick from "../components/MovieRandomPick/MovieRandomPick";
import MovieToSee from "../components/MovieToSee/MovieToSee";
import MovieWatched from "../components/MovieWatched/MovieWatched";

function Movies() {
  const [moviesToSee, setMovieToSee] = useState([]);

  const refreshMovies = async () => {
    const uuid = localStorage.getItem('watchlist_uuid');
    if (!uuid) return;

    try {
      const response = await fetch('http://localhost:8000/api/watchlist', {
        method: 'GET',
        headers: {
          'X-User-UUID': uuid
        }
      });

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des films");
      }

      const data = await response.json();
      const moviesOnly = data.filter(item => item.type === 'movie' && item.statut === 'tosee');
      setMovieToSee(moviesOnly);
    } catch (error) {
      console.error('Erreur API :', error);
    }
  };

  useEffect(() => {
    refreshMovies();
  }, []);

  return (
      <>
      <MovieRandomPick onAdd={refreshMovies} />
      <div className="container">
        <MovieToSee movies={moviesToSee}/>
        <MovieWatched />
      </div>
      </>
  );
};

export default Movies;