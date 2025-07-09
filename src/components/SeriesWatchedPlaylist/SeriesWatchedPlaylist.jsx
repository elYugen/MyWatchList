import React, { useState, useEffect } from 'react';
import SeriesSearchBar from '../SeriesSearchBar/SeriesSearchBar';
import './SeriesWatchedPlaylist.css';

function SeriesWatchedPlaylist() {
  const [itemsWatched, setItemsWatched] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const seriesPerPage = 5;
  const maxPageWindow = 5;

  const fetchItemsFromAPI = async () => {
    const uuid = localStorage.getItem('watchlist_uuid');
    if (!uuid) return;

    try {
      const response = await fetch('https://api.watchlist.lleroy.fr/api/watchlist', {
        method: 'GET',
        headers: {
          'X-User-UUID': uuid
        }
      });

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des films");
      }

      const data = await response.json();
      const seriesOnly = data.filter(item => item.type === 'serie' && item.statut === 'watched');
      setItemsWatched(seriesOnly);
    } catch (error) {
      console.error('Erreur API :', error);
    }
  };

  useEffect(() => {
    fetchItemsFromAPI();
  }, []);

  const handleSerieAdded = () => {
    fetchItemsFromAPI();
  };

  const handleRemoveSerie = async (id) => {
    const uuid = localStorage.getItem('watchlist_uuid');
    try {
      const response = await fetch(`https://api.watchlist.lleroy.fr/api/watchlist/${id}`, {
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
    <SeriesSearchBar statut="watched" onSeriesAdded={handleSerieAdded}/>
    {currentSeries.length > 0 ? (
        currentSeries.map((serie) => (
          <div className="anime-item" key={serie.name}>
            <img src={serie.image} alt={serie.name} className="anime-image" />
            <div className="anime-details">
              <h3>{serie.name}</h3>
              <div className="anime-actions">
                <button className="trash-button" onClick={() => handleRemoveSerie(serie.id)}>
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