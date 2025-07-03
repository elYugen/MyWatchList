import React from 'react';
import useRandomAnime from "../../hooks/useRandomAnime";
import './AnimeRandomPick.css';

function AnimeRandomPick({ onAdd }) {
  const { anime, loading, error } = useRandomAnime();

  const handleAddToLocalStorage = (anime) => {
    const storedItems = JSON.parse(localStorage.getItem('ItemsToSee')) || [];

    const exists = storedItems.some(item => item.mal_id === anime.mal_id && item.type === 'anime');
    if (exists) {
      alert("Cet anime est déjà dans la liste !");
      return;
    }

    const newAnime = {
      mal_id: anime.mal_id,
      name: anime.title,
      image: anime.image || 'default-image-url.jpg',
      total_episodes: anime.episodes || 0,
      season: '',
      episodes: '1',
      type: 'anime',
    };

    localStorage.setItem('ItemsToSee', JSON.stringify([...storedItems, newAnime]));
    alert(`${anime.title} a été ajouté à la liste "À voir" !`);

    if (onAdd) onAdd(); 
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
                <button className="btn" onClick={() => handleAddToLocalStorage(anime)}>À regarder</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AnimeRandomPick;