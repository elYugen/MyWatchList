import React, { useState, useEffect } from 'react';
import './AnimeWatchedPlaylist.css';
import AnimeSearchBar from '../AnimeSearchBar/AnimeSearchBar';

function AnimeWatchedPlaylist() {
  const [itemsWatched, setItemsWatched] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const animesPerPage = 5;
  const maxPageWindow = 5;

  const loadItemsFromStorage = () => {
    const storedItems = JSON.parse(localStorage.getItem('ItemsWatched')) || [];
    const animesOnly = storedItems.filter(item => item.type === 'anime');
    setItemsWatched(animesOnly);
  };

  useEffect(() => {
    loadItemsFromStorage();
  }, []);

  const handleAnimeAdded = () => {
    loadItemsFromStorage();
  };

  const handleRemoveAnime = (name) => {
    const updatedItems = itemsWatched.filter(item => item.name !== name);
    setItemsWatched(updatedItems);
    localStorage.setItem('ItemsWatched', JSON.stringify(updatedItems));
  };

  const indexOfLastAnime = currentPage * animesPerPage;
  const indexOfFirstAnime = indexOfLastAnime - animesPerPage;
  const currentAnimes = itemsWatched.slice(indexOfFirstAnime, indexOfLastAnime);
  const totalPages = Math.ceil(itemsWatched.length / animesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const startPage = Math.max(1, currentPage - Math.floor(maxPageWindow / 2));
  const endPage = Math.min(totalPages, startPage + maxPageWindow - 1);

  return (
    <>
    <AnimeSearchBar storageKey="ItemsWatched" onAnimeAdded={handleAnimeAdded}/>
    {currentAnimes.length > 0 ? (
        currentAnimes.map((anime) => (
          <div className="anime-item" key={anime.name}>
            <img src={anime.image} alt={anime.name} className="anime-image" />
            <div className="anime-details">
              <h3>{anime.name}</h3>
              <div className="anime-actions">
                <button className="trash-button" onClick={() => handleRemoveAnime(anime.name)}>
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>Aucun anime ajouté pour l'instant.</p>
      )}

      {/* Pagination */}
      {itemsWatched.length > animesPerPage && (
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

export default AnimeWatchedPlaylist;