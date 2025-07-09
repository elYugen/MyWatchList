import React, { useState, useEffect } from 'react';
import SeriesSearchBar from '../SeriesSearchBar/SeriesSearchBar';
import './SeriesInProgressPlaylist.css';
import { logUserAction } from '../../utils/logUserAction';

function SeriesInProgressPlaylist() {
  const [itemsInProgress, setItemsInProgress] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const seriesPerPage = 5;
  const maxPageWindow = 5;

  const loadItemsFromStorage = () => {
    const storedItems = JSON.parse(localStorage.getItem('ItemsInProgress')) || [];
    const seriesOnly = storedItems.filter(item => item.type === 'serie');
    setItemsInProgress(seriesOnly);
    logUserAction('LOAD_SERIE_LIST');
  };

  useEffect(() => {
    loadItemsFromStorage();
  }, []);

  const handleSeriesAdded = () => {
    loadItemsFromStorage();
    
  };

  const handleRemoveSeries = (name) => {
    const updatedSeries = itemsInProgress.filter((serie) => serie.name !== name);
    setItemsInProgress(updatedSeries);
    localStorage.setItem('ItemsInProgress', JSON.stringify(updatedSeries));
    logUserAction('REMOVE_SERIE', { name });
  };

  const handleMarkAsSeen = (serie) => {
    const watchedSeries = JSON.parse(localStorage.getItem('ItemsWatched')) || [];
    localStorage.setItem('ItemsWatched', JSON.stringify([...watchedSeries, serie]));
    handleRemoveSeries(serie.name);
    logUserAction('MOVE_SERIE', { serie });
  };

  const handleMarkInProgress = (name) => {
    localStorage.setItem('ItemsInProgress', JSON.stringify([...watchedItems, serie]));
    handleRemoveMovie(serie.name);
    console.log('série ajouter à la playlist en cours');
    
  };

  const indexOfLastSeries = currentPage * seriesPerPage;
  const indexOfFirstSeries = indexOfLastSeries - seriesPerPage;
  const currentSeries = itemsInProgress.slice(indexOfFirstSeries, indexOfLastSeries);
  const totalPages = Math.ceil(itemsInProgress.length / seriesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const startPage = Math.max(1, currentPage - Math.floor(maxPageWindow / 2));
  const endPage = Math.min(totalPages, startPage + maxPageWindow - 1);
  return (
    <>
    <SeriesSearchBar storageKey="ItemsInProgress" onSeriesAdded={handleSeriesAdded}/>
    {currentSeries.length > 0 ? (
        currentSeries.map((serie) => (
          <div className="anime-item" key={serie.name}>
            <img src={serie.image} alt={serie.name} className="anime-image" />
            <div className="anime-details">
              <h3>{serie.name}</h3>
              <div className="anime-actions">
                <button className="trash-button" onClick={() => handleRemoveSeries(serie.name)}>
                  <i className="bi bi-trash"></i>
                </button>
                <button className="seen-button" onClick={() => handleMarkInProgress(serie)}>
                  <i className="bi bi-check"></i>
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>Aucune serie en cours.</p>
      )}

      {/* Pagination */}
      {itemsInProgress.length > seriesPerPage && (
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

export default SeriesInProgressPlaylist;