import React, { useState } from 'react';
import useSeriesSearch from "../../hooks/useSeriesSearch"; 
import './SeriesSearchBar.css';

function SeriesSearchBar({ onSeriesAdded, statut }) {
  const [query, setQuery] = useState('');
  const { results, loading, error } = useSeriesSearch(query);
  const [isBoxVisible, setIsBoxVisible] = useState(false);

  const handleAddToDatabase = (serie) => {
    const newSeries = {
      imdb_id: serie.imdbID,
      name: serie.title,
      image: serie.image || 'default-image-url.jpg',
      year: serie.year,
      type: 'serie',
      episode: 1, 
      season: 0,
      total_episodes: 1,
      statut: statut || 'tosee'
    };

      const uuid = localStorage.getItem('watchlist_uuid');
      if (!uuid) {
        console.error("UUID non trouvé dans le localStorage");
        return;
      }

      fetch('https://api.watchlist.lleroy.fr/api/watchlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-UUID': uuid
        },
        body: JSON.stringify(newSeries)
      })
        .then(res => {
          if (!res.ok) throw new Error("Erreur lors de l'enregistrement en base");
          return res.json();
        })
        .then(data => {
          console.log('Ajouté à la base :', data);
          if (onSeriesAdded) onSeriesAdded(); // recharge la liste
        })
        .catch(err => console.error('Erreur API:', err));

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
              <div key={serie.imdbID} className="resultItem" onClick={() => handleAddToDatabase(serie)}>
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