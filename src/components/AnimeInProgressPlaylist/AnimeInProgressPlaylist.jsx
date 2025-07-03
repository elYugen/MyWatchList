import React, { useState, useEffect } from 'react';
import AnimeSearchBar from '../AnimeSearchBar/AnimeSearchBar';
import './AnimeInProgressPlaylist.css';

function AnimeInProgressPlaylist() {
  const [itemsInProgress, setItemsInProgress] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const animesPerPage = 5;
  const maxPageWindow = 5;

  const loadItemsFromStorage = () => {
    const storedItems = JSON.parse(localStorage.getItem('ItemsInProgress')) || [];
    const animesOnly = storedItems.filter(item => item.type === 'anime');
    setItemsInProgress(animesOnly);
  };

  useEffect(() => {
    loadItemsFromStorage();
  }, []);

  const handleAnimeAdded = () => {
    loadItemsFromStorage();
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
    <AnimeSearchBar storageKey="ItemsInProgress" onAnimeAdded={handleAnimeAdded}/>
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