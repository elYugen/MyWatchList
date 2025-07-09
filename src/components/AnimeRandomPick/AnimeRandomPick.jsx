import React from 'react';
import useRandomAnime from "../../hooks/useRandomAnime";
import './AnimeRandomPick.css';

function AnimeRandomPick({ onAdd }) {
  const { anime, loading, error } = useRandomAnime();

  const handleAddToDatabase = (anime) => {
      const newAnime = {
        mal_id: anime.mal_id,
        name: anime.title,
        image: anime.image || 'default-image-url.jpg',
        total_episodes: anime.episodes || 0,
        season: '',
        episode: 1,
        type: 'anime',
        statut: 'tosee'
      };

      const uuid = localStorage.getItem('watchlist_uuid');
      if (!uuid) {
        console.error("UUID non trouvé dans le localStorage");
        return;
      }

      fetch('https://watchlist.lleroy.fr/api/watchlist', {
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
          alert('Animé ajouté dans la playlist A voir');
          if (onAdd) onAdd(); 
        })
        .catch(err => console.error('Erreur API:', err));


  };

  return (
    <>
    {loading && <div className="loading"><img src="loading.gif" style={{width: "50px"}} alt="Chargement" /></div>}
      { anime && (
        <div className="randomPick" style={{ backgroundImage: `url(${anime.image})` }}>
          <div className="randomPickBox">
            <h3>Recommandation Aléatoire</h3>
            <div className="randomPickInfo">
              <div className="randomPickInfoImage">
                <img src={anime.image} alt={anime.title} />
              </div>
              <div className="randomPickInfoTitle">
                <h2>{anime.title}</h2>
                {/* <p>{truncateText(anime.synopsis, 100)}</p> */}
                <button className="btn" onClick={() => handleAddToDatabase(anime)}>À regarder</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AnimeRandomPick;