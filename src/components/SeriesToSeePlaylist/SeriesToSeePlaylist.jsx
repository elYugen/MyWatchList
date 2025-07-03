import React, { useState, useEffect } from 'react';
import SeriesSearchBar from '../SeriesSearchBar/SeriesSearchBar';
import './SeriesToSeePlaylist.css';

function SeriesToSeePlaylist() {
  const [itemsToSee, setItemsToSee] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const seriesPerPage = 5;
  const maxPageWindow = 5;

  const loadItemsFromStorage = () => {
    const storedItems = JSON.parse(localStorage.getItem('ItemsToSee')) || [];
    const seriesOnly = storedItems.filter(item => item.type === 'serie');
    setItemsToSee(seriesOnly);
  };

  useEffect(() => {
    loadItemsFromStorage();
  }, []);

  const handleSerieAdded = () => {
    loadItemsFromStorage();
  };

  const handleRemoveSerie = (name) => {
    const updatedItems = itemsToSee.filter(item => item.name !== name);
    setItemsToSee(updatedItems);

    // met à jour le localStorage "ItemsToSee" globalement (avec tous les types)
    const allItems = JSON.parse(localStorage.getItem('ItemsToSee')) || [];
    const filteredAllItems = allItems.filter(item => item.name !== name);
    localStorage.setItem('ItemsToSee', JSON.stringify(filteredAllItems));
  };

  // marquer comme vu (déplacer vers ItemsWatched)
  const handleMarkAsSeen = (serie) => {
    const watchedItems = JSON.parse(localStorage.getItem('ItemsWatched')) || [];
    localStorage.setItem('ItemsWatched', JSON.stringify([...watchedItems, serie]));
    handleRemoveSerie(serie.name);
  };

  const handleMoveToInProgress = (series) => {
    const newSeries = {
      imdb_id: series.imdbID,
      name: series.title,
      image: series.image || 'default-image-url.jpg',
      total_seasons: series.totalSeasons || 1,
      season: '1',
      episode: '1',
      type: 'series',
      year: series.year,
    };

    const inProgressItems = JSON.parse(localStorage.getItem('ItemsInProgress')) || [];

    if (!inProgressItems.some(item => item.imdb_id === newSeries.imdb_id && item.type === 'series')) {
      localStorage.setItem('ItemsInProgress', JSON.stringify([...inProgressItems, newSeries]));
      handleRemoveSerie(series.name);
      alert(`${series.title} a été déplacée vers "Séries en cours" !`);
    } else {
      alert("Cette série est déjà dans la liste 'En cours' !");
    }
  };


  // pagination
  const totalPages = Math.ceil(itemsToSee.length / seriesPerPage);

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

  const indexOfLastSeries = currentPage * seriesPerPage;
  const indexOfFirstSeries = indexOfLastSeries - seriesPerPage;
  const currentSeries = itemsToSee.slice(indexOfFirstSeries, indexOfLastSeries);

  return (
    <>
    <SeriesSearchBar onSeriesAdded={handleSerieAdded} storageKey="ItemsToSee" />
      {currentSeries.length > 0 ? (
        currentSeries.map((series) => (
          <div className="anime-item" key={series.imdb_id || series.name}>
            <img src={series.image} alt={series.name} className="anime-image" />
            <div className="anime-details">
              <h3>{series.name}</h3>
              <div className="anime-actions">
                <button className="trash-button" onClick={() => handleRemoveSerie(series.name)}>
                  <i className="bi bi-trash"></i>
                </button>
                <button className="in-progress-button" onClick={() => handleMoveToInProgress(series)}>
                  <i className="bi bi-eye"></i>
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>Aucune série ajouté pour l'instant.</p>
      )}

      {itemsToSee.length > seriesPerPage && (
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

export default SeriesToSeePlaylist;