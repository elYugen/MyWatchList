import React, { useState, useEffect } from 'react';
import AnimeSearchBar from '../AnimeSearchBar/AnimeSearchBar';
import './AnimeInProgressPlaylist.css';

function AnimeInProgressPlaylist() {
  const [itemsInProgress, setItemsInProgress] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const animesPerPage = 5;
  const maxPageWindow = 5;

  const fetchItemsFromAPI = async () => {
    const uuid = localStorage.getItem('watchlist_uuid');
    if (!uuid) return;

    try {
      const response = await fetch('https://watchlist.lleroy.fr/api/watchlist', {
        method: 'GET',
        headers: {
          'X-User-UUID': uuid
        }
      });

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des animes");
      }

      const data = await response.json();
      const animesOnly = data.filter(item => item.type === 'anime' && item.statut === 'inprogress');
      setItemsInProgress(animesOnly);
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
      const response = await fetch(`https://watchlist.lleroy.fr/api/watchlist/${id}`, {
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


const handleEpisodeChange = async (id, episode) => {
  const uuid = localStorage.getItem('watchlist_uuid');
  try {
    const response = await fetch(`https://watchlist.lleroy.fr/api/watchlist/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-User-UUID': uuid
      },
      body: JSON.stringify({ episode })
    });

    if (!response.ok) throw new Error("Erreur lors de la mise à jour");

    await fetchItemsFromAPI(); 
  } catch (error) {
    console.error('Erreur API mise à jour épisode :', error);
  }
};


  const handleMarkAsSeen = async (anime) => {
    const uuid = localStorage.getItem('watchlist_uuid');
    try {
      const response = await fetch(`https://watchlist.lleroy.fr/api/watchlist/${anime.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-User-UUID': uuid
        },
        body: JSON.stringify({ statut: 'watched' })
      });

      if (!response.ok) throw new Error("Erreur lors du changement de statut");

      await fetchItemsFromAPI(); 
    } catch (error) {
      console.error('Erreur API mark as seen :', error);
    }
  };


  const indexOfLastAnime = currentPage * animesPerPage;
  const indexOfFirstAnime = indexOfLastAnime - animesPerPage;
  const currentAnimes = itemsInProgress.slice(indexOfFirstAnime, indexOfLastAnime);
  const totalPages = Math.ceil(itemsInProgress.length / animesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const startPage = Math.max(1, currentPage - Math.floor(maxPageWindow / 2));
  const endPage = Math.min(totalPages, startPage + maxPageWindow - 1);
  return (
    <>
    <AnimeSearchBar statut="inprogress" onAnimeAdded={handleAnimeAdded}/>
    {currentAnimes.length > 0 ? (
        currentAnimes.map((anime) => (
          
          <div className="anime-item" key={anime.name}>
            <img src={anime.image} alt={anime.name} className="anime-image" />
            <div className="anime-details">
              <h3>{anime.name}</h3>
              <div className="anime-actions">
                <div className="anime-choice">
                  <label htmlFor={`${anime.name}-episode`}>Épisode : </label>
                  <select id={`${anime.name}-episode`} value={anime.episode} onChange={(e) => handleEpisodeChange(anime.id, e.target.value)}>
                    {[...Array(anime.total_episodes).keys()].map((index) => (
                      <option key={index + 1} value={index + 1}>
                        Épisode {index + 1}
                      </option>
                    ))}
                  </select>
                </div>
                <button className="trash-button" onClick={() => handleRemoveAnime(anime.id)}>
                  <i className="bi bi-trash"></i>
                </button>
                <button className="seen-button" onClick={() => handleMarkAsSeen(anime)}>
                  <i className="bi bi-check"></i>
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>Aucun anime en cours.</p>
      )}

      {/* Pagination */}
      {itemsInProgress.length > animesPerPage && (
        <div className="pagination">
          <button onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="prevBtn">
            <i className="bi bi-arrow-left"></i>
          </button>

          {Array.from({ length: (endPage - startPage + 1) }, (_, i) => startPage + i).map((page) => (
            <button key={page} onClick={() => handlePageChange(page)} className={`pagination-number ${currentPage === page ? 'active' : ''}`}>{page}</button>
          ))}

          <button onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="nextBtn">
            <i className="bi bi-arrow-right"></i>
          </button>
        </div>
      )}
    </>
  );
};

export default AnimeInProgressPlaylist;