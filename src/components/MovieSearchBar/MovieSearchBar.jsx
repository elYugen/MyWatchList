import React, { useState } from 'react';
import useMovieSearch from "../../hooks/useMovieSearch"; 
import './MovieSearchBar.css';

function MovieSearchBar({ storageKey = "ItemsToSee", onMovieAdded }) {
  const [query, setQuery] = useState('');
  const { results, loading, error } = useMovieSearch(query);
  const [isBoxVisible, setIsBoxVisible] = useState(false);

  const handleAddToLocalStorage = (movie) => {
    const storedMovies = JSON.parse(localStorage.getItem(storageKey)) || [];
    const newMovie = {
      imdb_id: movie.imdbID,
      name: movie.title,
      image: movie.image || 'default-image-url.jpg',
      year: movie.year,
      type: 'movie',
      episode: '1', 
      total_episodes: 1,
    };

    // éviter les doublons
    if (!storedMovies.some(item => item.imdb_id === newMovie.imdb_id)) {
      localStorage.setItem(storageKey, JSON.stringify([...storedMovies, newMovie]));
      if (onMovieAdded) onMovieAdded();
    }

    setIsBoxVisible(false);
  };

  const toggleBoxVisibility = () => {
    setIsBoxVisible(!isBoxVisible);
  };

  return (
    <div className="searchContainer">
      <div className="searchBar">
        <input type="text" placeholder="Rechercher un film..." value={query} onChange={(e) => { setQuery(e.target.value); setIsBoxVisible(true); }} onClick={toggleBoxVisibility}/>
      </div>
      
      {isBoxVisible && (
        <div className="resultBox">
          {loading && <div className="loading"><img src="loading.gif" style={{width: "50px"}} alt="Chargement" /></div>}
          {error && <p>{error}</p>}

          <div className="resultList">
            {results.map((movie) => (
              <div key={movie.imdbID} className="resultItem" onClick={() => handleAddToLocalStorage(movie)}>
                <h3>{movie.title} <span style={{fontWeight: 'normal', color: '#888'}}>({movie.year})</span></h3>
                {movie.image && <img src={movie.image} alt={movie.title} width="100" />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieSearchBar;
