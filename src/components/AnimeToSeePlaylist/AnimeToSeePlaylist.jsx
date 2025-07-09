import React, { useState, useEffect } from 'react';
import './AnimeToSeePlaylist.css';
import AnimeSearchBar from '../AnimeSearchBar/AnimeSearchBar';

function AnimeToSeePlaylist() {
  const [itemsToSee, setItemsToSee] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const animesPerPage = 5;
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
        throw new Error("Erreur lors du chargement des animes");
      }

      const data = await response.json();
      const animesOnly = data.filter(item => item.type === 'anime' && item.statut === 'tosee');
      setItemsToSee(animesOnly);
    } catch (error) {
      console.error('Erreur API :', error);
    }
  };

  useEffect(() => {
    fetchItemsFromAPI();
  }, []);

  const handleAnimeAdded = () => {
    fetchItemsFromAPI();
  };

  const handleRemoveAnime = async (id) => {
    const uuid = localStorage.getItem('watchlist_uuid');
    try {
      const response = await fetch(`http://localhost:8000/api/watchlist/${id}`, {
        method: 'DELETE',
        headers: {
          'X-User-UUID': uuid
        }
      });

      if (!response.ok) throw new Error("Erreur lors de la suppression");

      await fetchItemsFromAPI(); 
    } catch (error) {
      console.error('Erreur API suppression :', error);
    }
  };

  // déplacer dans ItemsInProgress
  const handleMoveToInProgress = async (anime) => {
    const uuid = localStorage.getItem('watchlist_uuid');
    try {
      const response = await fetch(`http://localhost:8000/api/watchlist/${anime.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-User-UUID': uuid
        },
        body: JSON.stringify({ statut: 'inprogress' })
      });

      if (!response.ok) throw new Error("Erreur lors du changement de statut");

      await fetchItemsFromAPI(); 
    } catch (error) {
      console.error('Erreur API mark as seen :', error);
    }
  };

  // pagination
  const totalPages = Math.ceil(itemsToSee.length / animesPerPage);

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

  const indexOfLastAnime = currentPage * animesPerPage;
  const indexOfFirstAnime = indexOfLastAnime - animesPerPage;
  const currentAnimes = itemsToSee.slice(indexOfFirstAnime, indexOfLastAnime);

  return (
    <>
    <AnimeSearchBar onAnimeAdded={handleAnimeAdded} statut="tosee"/>
      {currentAnimes.length > 0 ? (
        currentAnimes.map((anime) => (
          <div className="anime-item" key={anime.mal_id || anime.name}>
            <img src={anime.image} alt={anime.name} className="anime-image" />
            <div className="anime-details">
              <h3>{anime.name}</h3>
              <div className="anime-actions">
                <button className="trash-button" onClick={() => handleRemoveAnime(anime.id)}>
                  <i className="bi bi-trash"></i>
                </button>
                <button className="in-progress-button" onClick={() => handleMoveToInProgress(anime)}>
                  <i className="bi bi-eye"></i>
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>Aucun anime ajouté pour l'instant.</p>
      )}

      {itemsToSee.length > animesPerPage && (
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

export default AnimeToSeePlaylist;