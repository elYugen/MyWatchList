import React from 'react';
import './RandomPick.css';
import useRandomPick from "../../hooks/useRandomPick";

function RandomPick({ onAdd }) {
  const { item, type, loading, error } = useRandomPick();

  const handleAddToDatabase = (entry) => {
    const uuid = localStorage.getItem('watchlist_uuid');
    if (!uuid) {
      console.error("UUID non trouvé dans le localStorage");
      return;
    }

    // Structure adaptée selon le type
    const newItem = {
      imdb_id: entry.imdb_id || null,
      mal_id: entry.mal_id || null,
      name: entry.title,
      image: entry.image || 'default-image-url.jpg',
      total_episodes: entry.episodes || 1,
      season: entry.season || 0,
      episode: 1,
      type: type, // 'anime', 'movie' ou 'series'
      release_date: entry.release_date || null,
      synopsis: entry.synopsis || '',
      statut: 'tosee',
    };

    fetch('https://api.watchlist.lleroy.fr/api/watchlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-UUID': uuid
      },
      body: JSON.stringify(newItem)
    })
      .then(res => {
        if (!res.ok) throw new Error("Erreur lors de l'enregistrement en base");
        return res.json();
      })
      .then(data => {
        console.log('Ajouté à la base :', data);
        alert(`${entry.title} a été ajouté dans la playlist À voir`);
        if (onAdd) onAdd(); 
      })
      .catch(err => {
        console.error('Erreur API:', err);
        alert("Erreur lors de l'ajout à la liste !");
      });
  };

  return (
    <>
      {loading && <div className="loading"><img src="loading.gif" style={{ width: "50px" }} alt="Chargement" /></div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      {item && (
        <div className="randomPick" style={{ backgroundImage: `url(${item.image})` }}>
          <div className="randomPickBox">
            <h3>Recommandation Aléatoire</h3>
            <div className="randomPickInfo">
              <div className="randomPickInfoImage">
                <img src={item.image} alt={item.title} />
              </div>
              <div className="randomPickInfoTitle">
                <h2>{item.title}</h2>
                {/* <p>{truncateText(item.synopsis, 100)}</p> */}
                <button className="btn" onClick={() => handleAddToDatabase(item)}>À regarder</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default RandomPick;
