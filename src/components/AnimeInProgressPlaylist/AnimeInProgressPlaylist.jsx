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

  const handleRemoveAnime = (name) => {
    const updatedAnimes = itemsInProgress.filter((anime) => anime.name !== name);
    setItemsInProgress(updatedAnimes);
    localStorage.setItem('ItemsInProgress', JSON.stringify(updatedAnimes));
  };

  const handleMarkAsSeen = (anime) => {
    const watchedAnimes = JSON.parse(localStorage.getItem('ItemsWatched')) || [];
    localStorage.setItem('ItemsWatched', JSON.stringify([...watchedAnimes, anime]));
    handleRemoveAnime(anime.name);
  };

  const handleEpisodeChange = (name, episode) => {
    const updatedAnimes = itemsInProgress.map((anime) => {
      if (anime.name === name) {
        return { ...anime, episode };
      }
      return anime;
    });
    setItemsInProgress(updatedAnimes);
    localStorage.setItem('ItemsInProgress', JSON.stringify(updatedAnimes));
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
                  <select id={`${anime.name}-episode`} value={anime.episode} onChange={(e) => handleEpisodeChange(anime.name, e.target.value)}>
                    {[...Array(anime.total_episodes).keys()].map((index) => (
                      <option key={index + 1} value={index + 1}>
                        Épisode {index + 1}
                      </option>
                    ))}
                  </select>
                </div>
                <button className="trash-button" onClick={() => handleRemoveAnime(anime.name)}>
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