import React, { useState } from 'react';
import useAnimeSearch from "../../hooks/useAnimeSearch"
import './AnimeSearchBar.css';

function AnimeSearchBar({ onAnimeAdded, storageKey }) {
  const [query, setQuery] = useState('');
  const { results, loading, error } = useAnimeSearch(query);
  const [isBoxVisible, setIsBoxVisible] = useState(false);

  const handleAddToLocalStorage = (anime) => {
    const storedAnimes = JSON.parse(localStorage.getItem(storageKey)) || [];
    const newAnime = {
      mal_id: anime.mal_id,
      name: anime.title,
      image: anime.image || 'default-image-url.jpg',
      total_episodes: anime.episodes || 0,
      season: '',
      episode: '1',
      type: 'anime',
    };

    // pour éviter les doublons
    if (!storedAnimes.some(item => item.mal_id === newAnime.mal_id)) {
      localStorage.setItem(storageKey, JSON.stringify([...storedAnimes, newAnime]));
    }

    setIsBoxVisible(false);

    if (onAnimeAdded) {
      onAnimeAdded();
    }
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
          <div key={anime.mal_id} className="resultItem" onClick={() => handleAddToLocalStorage(anime)}>
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