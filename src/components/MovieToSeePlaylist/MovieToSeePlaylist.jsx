import React, { useState, useEffect } from 'react';
import MovieSearchBar from '../MovieSearchBar/MovieSearchBar';
import './MovieToSeePlaylist.css';

function MovieToSeePlaylist() {
  const [itemsToSee, setItemsToSee] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 5;
  const maxPageWindow = 5;

  const fetchItemsFromAPI = async () => {
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
      const moviesOnly = data.filter(item => item.type === 'movie');
      setItemsToSee(moviesOnly);
    } catch (error) {
      console.error('Erreur API :', error);
    }
  };

  useEffect(() => {
    fetchItemsFromAPI();
  }, []);

  const handleMovieAdded = () => {
    fetchItemsFromAPI();
  };

  const handleRemoveMovie = (name) => {
    const updatedItems = itemsToSee.filter(item => item.name !== name);
    setItemsToSee(updatedItems);

    // met à jour le localStorage "ItemsToSee" globalement (avec tous les types)
    const allItems = JSON.parse(localStorage.getItem('ItemsToSee')) || [];
    const filteredAllItems = allItems.filter(item => item.name !== name);
    localStorage.setItem('ItemsToSee', JSON.stringify(filteredAllItems));
  };

  // marquer comme vu (déplacer vers ItemsWatched)
  const handleMarkAsSeen = (movie) => {
    const watchedItems = JSON.parse(localStorage.getItem('ItemsWatched')) || [];
    localStorage.setItem('ItemsWatched', JSON.stringify([...watchedItems, movie]));
    handleRemoveMovie(movie.name);
  };


  // pagination
  const totalPages = Math.ceil(itemsToSee.length / moviesPerPage);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const halfWindow = Math.floor(maxPageWindow / 2);
  let startPage = Math.max(1, currentPage - halfWindow);
  let endPage = startPage + maxPageWindow - 1;
  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxPageWindow + 1);
  }

  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = itemsToSee.slice(indexOfFirstMovie, indexOfLastMovie);

  return (
    <>
    <MovieSearchBar onMovieAdded={handleMovieAdded} statut="tosee" />
      {currentMovies.length > 0 ? (
        currentMovies.map((movie) => (
          <div className="anime-item" key={movie.imdb_id || movie.name}>
            <img src={movie.image} alt={movie.name} className="anime-image" />
            <div className="anime-details">
              <h3>{movie.name}</h3>
              <div className="anime-actions">
                <button className="trash-button" onClick={() => handleRemoveMovie(movie.name)}>
                  <i className="bi bi-trash"></i>
                </button>
                <button className="seen-button" onClick={() => handleMarkAsSeen(movie)}>
                  <i className="bi bi-check"></i>
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>Aucun film ajouté pour l'instant.</p>
      )}

      {itemsToSee.length > moviesPerPage && (
        <div className="pagination">
          <button onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="prevBtn">
            <i className="bi bi-arrow-left"></i>
          </button>

          {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(page => (
            <button key={page} onClick={() => handlePageChange(page)} className={`pagination-number ${currentPage === page ? 'active' : ''}`}>{page}
            </button>
          ))}

          <button onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="nextBtn">
            <i className="bi bi-arrow-right"></i>
          </button>
        </div>
      )}
    </>
  );
};

export default MovieToSeePlaylist;