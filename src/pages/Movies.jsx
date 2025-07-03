import { useState, useEffect } from "react";
import MovieRandomPick from "../components/MovieRandomPick/MovieRandomPick";
import MovieToSee from "../components/MovieToSee/MovieToSee";
import MovieWatched from "../components/MovieWatched/MovieWatched";

function Movies() {
  const [moviesToSee, setMovieToSee] = useState([]);

  const refreshMovies = () => {
    const storedItems = JSON.parse(localStorage.getItem('ItemsToSee')) || [];
    const moviesOnly = storedItems.filter(item => item.type === 'movie');
    setMovieToSee(moviesOnly);
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