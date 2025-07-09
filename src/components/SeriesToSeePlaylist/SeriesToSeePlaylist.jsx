import React, { useState, useEffect } from 'react';
import SeriesSearchBar from '../SeriesSearchBar/SeriesSearchBar';
import './SeriesToSeePlaylist.css';

function SeriesToSeePlaylist() {
  const [itemsToSee, setItemsToSee] = useState([]);
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
      const seriesOnly = data.filter(item => item.type === 'serie' && item.statut === 'tosee');
      setItemsToSee(seriesOnly);
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

  const handleRemoveSeries = async (id) => {
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

  const handleMarkInProgress = async (anime) => {
    const uuid = localStorage.getItem('watchlist_uuid');
    try {
      const response = await fetch(`https://api.watchlist.lleroy.fr/api/watchlist/${anime.id}`, {
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
    <SeriesSearchBar onSeriesAdded={handleSerieAdded} statut="tosee" />
      {currentSeries.length > 0 ? (
        currentSeries.map((series) => (
          <div className="anime-item" key={series.imdb_id || series.name}>
            <img src={series.image} alt={series.name} className="anime-image" />
            <div className="anime-details">
              <h3>{series.name}</h3>
              <div className="anime-actions">
                <button className="trash-button" onClick={() => handleRemoveSeries(series.id)}>
                  <i className="bi bi-trash"></i>
                </button>
                <button className="in-progress-button" onClick={() => handleMarkInProgress(series)}>
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