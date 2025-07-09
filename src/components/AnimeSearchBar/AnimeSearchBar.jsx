import React, { useState } from 'react';
import useAnimeSearch from "../../hooks/useAnimeSearch"
import './AnimeSearchBar.css';

function AnimeSearchBar({ onAnimeAdded, statut }) {
  const [query, setQuery] = useState('');
  const { results, loading, error } = useAnimeSearch(query);
  const [isBoxVisible, setIsBoxVisible] = useState(false);

  const handleAddToDatabase = (anime) => {
      const newAnime = {
        mal_id: anime.mal_id,
        name: anime.title,
        image: anime.image || 'default-image-url.jpg',
        total_episodes: anime.episodes || 0,
        season: '',
        episode: 1,
        type: 'anime',
        statut: statut || 'tosee'
      };

      const uuid = localStorage.getItem('watchlist_uuid');
      if (!uuid) {
        console.error("UUID non trouvé dans le localStorage");
        return;
      }

      fetch('http://localhost:8000/api/watchlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-UUID': uuid
        },
        body: JSON.stringify(newAnime)
      })
        .then(res => {
          if (!res.ok) throw new Error("Erreur lors de l'enregistrement en base");
          return res.json();
        })
        .then(data => {
          console.log('Ajouté à la base :', data);
          if (onAnimeAdded) onAnimeAdded(); // recharge la liste
        })
        .catch(err => console.error('Erreur API:', err));

      setIsBoxVisible(false);
    };


  const toggleBoxVisibility = () => {
    setIsBoxVisible(!isBoxVisible);
  };

  return (
    <>
    <div className="searchContainer">
      <div className="searchBar">
        <input type="text" placeholder="Rechercher un anime..." value={query} onChange={(e) => { setQuery(e.target.value); setIsBoxVisible(true); }} onClick={toggleBoxVisibility} />
      </div>
      
      {isBoxVisible && (
        <div className="resultBox">
      {loading && <div className="loading"><img src="loading.gif" style={{width: "50px"}} alt="Chargement" /></div>}
      {error && <p>{error}</p>}

      <div className="resultList">
        {results.map((anime) => (
          <div key={anime.mal_id} className="resultItem" onClick={() => handleAddToDatabase(anime)}>
            <h3>{anime.title}</h3>
            <img src={anime.image} alt={anime.title} width="100" />
          </div>
        ))}
      </div>
      </div>
      )}
    </div>
    </>
  );
};

export default AnimeSearchBar;