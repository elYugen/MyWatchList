import React, { useState } from 'react';
import useMovieSearch from "../../hooks/useMovieSearch"; 
import './MovieSearchBar.css';

function MovieSearchBar({ onMovieAdded, statut }) {
  const [query, setQuery] = useState('');
  const { results, loading, error } = useMovieSearch(query);
  const [isBoxVisible, setIsBoxVisible] = useState(false);

  const handleAddToLocalStorage = (movie) => {
    const newMovie = {
      imdb_id: movie.imdbID,
      name: movie.title,
      image: movie.image || 'default-image-url.jpg',
      year: movie.year,
      type: 'movie',
      episode: '1', 
      total_episodes: 1,
      statut: statut || 'tosee'
    };

    //console.log("statut envoyé :", newMovie.statut);

      const uuid = localStorage.getItem('watchlist_uuid');
      if (!uuid) {
        console.error("UUID non trouvé dans le localStorage");
        return;
      }

      fetch('https://api.watchlist.lleroy.fr/api/watchlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-UUID': uuid
        },
        body: JSON.stringify(newMovie)
      })
        .then(res => {
          if (!res.ok) throw new Error("Erreur lors de l'enregistrement en base");
          return res.json();
        })
        .then(data => {
          console.log('Ajouté à la base :', data);
          if (onMovieAdded) onMovieAdded(); // recharge la liste
        })
        .catch(err => console.error('Erreur API:', err));

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
