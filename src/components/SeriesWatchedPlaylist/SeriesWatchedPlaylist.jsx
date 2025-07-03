import React, { useState, useEffect } from 'react';
import SeriesSearchBar from '../SeriesSearchBar/SeriesSearchBar';
import './SeriesWatchedPlaylist.css';

function SeriesWatchedPlaylist() {
  const [itemsWatched, setItemsWatched] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const seriesPerPage = 5;
  const maxPageWindow = 5;

  const loadItemsFromStorage = () => {
    const storedItems = JSON.parse(localStorage.getItem('ItemsWatched')) || [];
    const seriesOnly = storedItems.filter(item => item.type === 'serie');
    setItemsWatched(seriesOnly);
  };

  useEffect(() => {
    loadItemsFromStorage();
  }, []);

  const handleSerieAdded = () => {
    loadItemsFromStorage();
  };

  const handleRemoveSerie = (name) => {
    const updatedItems = itemsWatched.filter(item => item.name !== name);
    setItemsWatched(updatedItems);
    localStorage.setItem('ItemsWatched', JSON.stringify(updatedItems));
  };

  const indexOfLastSeries = currentPage * seriesPerPage;
  const indexOfFirstSeries = indexOfLastSeries - seriesPerPage;
  const currentSeries = itemsWatched.slice(indexOfFirstSeries, indexOfLastSeries);
  const totalPages = Math.ceil(itemsWatched.length / seriesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const startPage = Math.max(1, currentPage - Math.floor(maxPageWindow / 2));
  const endPage = Math.min(totalPages, startPage + maxPageWindow - 1);

  return (
    <>
    <SeriesSearchBar storageKey="ItemsWatched" onSeriesAdded={handleSerieAdded}/>
    {currentSeries.length > 0 ? (
        currentSeries.map((serie) => (
          <div className="anime-item" key={serie.name}>
            <img src={serie.image} alt={serie.name} className="anime-image" />
            <div className="anime-details">
              <h3>{serie.name}</h3>
              <div className="anime-actions">
                <button className="trash-button" onClick={() => handleRemoveSerie(serie.name)}>
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>Aucun film ajouté pour l'instant.</p>
      )}

      {/* Pagination */}
      {itemsWatched.length > seriesPerPage && (
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

export default SeriesWatchedPlaylist;