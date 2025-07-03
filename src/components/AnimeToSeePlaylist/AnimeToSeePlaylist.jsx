import React, { useState, useEffect } from 'react';
import './AnimeToSeePlaylist.css';
import AnimeSearchBar from '../AnimeSearchBar/AnimeSearchBar';

function AnimeToSeePlaylist() {
  const [itemsToSee, setItemsToSee] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const animesPerPage = 5;
  const maxPageWindow = 5;

  const loadItemsFromStorage = () => {
    const storedItems = JSON.parse(localStorage.getItem('ItemsToSee')) || [];
    const animesOnly = storedItems.filter(item => item.type === 'anime');
    setItemsToSee(animesOnly);
  };

  useEffect(() => {
    loadItemsFromStorage();
  }, []);

  const handleAnimeAdded = () => {
    loadItemsFromStorage();
  };

  const handleRemoveAnime = (name) => {
    const updatedItems = itemsToSee.filter(item => item.name !== name);
    setItemsToSee(updatedItems);

    // met à jour le localStorage "ItemsToSee" globalement (avec tous les types)
    const allItems = JSON.parse(localStorage.getItem('ItemsToSee')) || [];
    const filteredAllItems = allItems.filter(item => item.name !== name);
    localStorage.setItem('ItemsToSee', JSON.stringify(filteredAllItems));
  };

  // marquer comme vu (déplacer vers ItemsWatched)
  const handleMarkAsSeen = (anime) => {
    const watchedItems = JSON.parse(localStorage.getItem('ItemsWatched')) || [];
    localStorage.setItem('ItemsWatched', JSON.stringify([...watchedItems, anime]));
    handleRemoveAnime(anime.name);
  };

  // déplacer dans ItemsInProgress
  const handleMoveToInProgress = async (anime) => {
    try {
      const response = await fetch(`https://api.jikan.moe/v4/anime/${anime.mal_id}`);
      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);

      const data = await response.json();

      const newAnime = {
        mal_id: anime.mal_id,
        name: anime.name || data.data.title,
        image: data.data.images.jpg.image_url || 'default-image-url.jpg',
        total_episodes: data.data.episodes || 0,
        season: '', 
        episode: '1', 
        type: 'anime',
      };

      const inProgressItems = JSON.parse(localStorage.getItem('ItemsInProgress')) || [];
      localStorage.setItem('ItemsInProgress', JSON.stringify([...inProgressItems, newAnime]));

      handleRemoveAnime(anime.name);
      alert(`${anime.name} a été déplacé vers "Anime en cours" !`);
    } catch (error) {
      console.error('Erreur lors de la récupération des détails de l\'anime:', error);
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
    <AnimeSearchBar onAnimeAdded={handleAnimeAdded} storageKey="ItemsToSee" />
      {currentAnimes.length > 0 ? (
        currentAnimes.map((anime) => (
          <div className="anime-item" key={anime.mal_id || anime.name}>
            <img src={anime.image} alt={anime.name} className="anime-image" />
            <div className="anime-details">
              <h3>{anime.name}</h3>
              <div className="anime-actions">
                <button className="trash-button" onClick={() => handleRemoveAnime(anime.name)}>
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