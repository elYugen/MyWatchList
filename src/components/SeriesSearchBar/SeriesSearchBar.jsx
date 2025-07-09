import React, { useState } from 'react';
import useSeriesSearch from "../../hooks/useSeriesSearch"; 
import './SeriesSearchBar.css';
import { logUserAction } from '../../utils/logUserAction';

function SeriesSearchBar({ storageKey = "ItemsToSee", onSeriesAdded }) {
  const [query, setQuery] = useState('');
  const { results, loading, error } = useSeriesSearch(query);
  const [isBoxVisible, setIsBoxVisible] = useState(false);

  const handleAddToLocalStorage = (serie) => {
    const storedSeries = JSON.parse(localStorage.getItem(storageKey)) || [];
    const newSeries = {
      imdb_id: serie.imdbID,
      name: serie.title,
      image: serie.image || 'default-image-url.jpg',
      year: serie.year,
      type: 'serie',
      episode: '1', 
      season: '0',
      total_episodes: 1,
    };

    // éviter les doublons
    if (!storedSeries.some(item => item.imdb_id === newSeries.imdb_id)) {
      localStorage.setItem(storageKey, JSON.stringify([...storedSeries, newSeries]));
      if (onSeriesAdded) onSeriesAdded();
    }

    console.log('série ajouté dans ma liste à voir !');
    logUserAction('ADD_SERIE');
    
    setIsBoxVisible(false);
  };

  const toggleBoxVisibility = () => {
    setIsBoxVisible(!isBoxVisible);
  };

  return (
    <div className="searchContainer">
      <div className="searchBar">
        <input type="text" placeholder="Rechercher une série..." value={query} onChange={(e) => { setQuery(e.target.value); setIsBoxVisible(true); }} onClick={toggleBoxVisibility}/>
      </div>
      
      {isBoxVisible && (
        <div className="resultBox">
          {loading && <div className="loading"><img src="loading.gif" style={{width: "50px"}} alt="Chargement" /></div>}
          {error && <p>{error}</p>}

          <div className="resultList">
            {results.map((serie) => (
              <div key={serie.imdbID} className="resultItem" onClick={() => handleAddToLocalStorage(serie)}>
                <h3>{serie.title} <span style={{fontWeight: 'normal', color: '#888'}}>({serie.year})</span></h3>
                {serie.image && <img src={serie.image} alt={serie.title} width="100" />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SeriesSearchBar;