import { useState, useEffect } from "react";
import useRandomSeries from "../../hooks/useRandomSeries";
import './SeriesRandomPick.css';

function SeriesRandomPick({ onAdd }) {

  const { series, loading, error } = useRandomSeries();

  const handleAddToLocalStorage = (serie) => {
    const storedItems = JSON.parse(localStorage.getItem('ItemsToSee')) || [];

    const exists = storedItems.some(item => item.imdb_id === serie.imdb_id && item.type === 'serie');
    if (exists) {
      alert("Cette série est déjà dans la liste !");
      return;
    }

    const newSerie = {
      imdb_id: serie.imdb_id,
      name: serie.title,
      image: serie.image || 'default-image-url.jpg',
      total_episodes: 1,
      season: '0',
      episode: '1',
      type: 'serie',
      release_date: serie.release_date,
      synopsis: serie.synopsis,
    };

    localStorage.setItem('ItemsToSee', JSON.stringify([...storedItems, newSerie]));
    alert(`${series.title} a été ajouté à la liste "À voir" !`);

    if (onAdd) onAdd(); 
  };

  return (
    <>
      {loading && <div className="loading"><img src="loading.gif" style={{width: "50px"}} alt="Chargement" /></div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      {series && (
        <div className="randomPick" style={{ backgroundImage: `url(${series.image})` }}>
          <div className="randomPickBox">
            <h3>Recommandation Aléatoire</h3>
            <div className="randomPickInfo">
              <div className="randomPickInfoImage">
                <img src={series.image} alt={series.title} />
              </div>
              <div className="randomPickInfoTitle">
                <h2>{series.title}</h2>
                {/* <p>{truncateText(series.synopsis, 100)}</p> */}
                <button className="btn" onClick={() => handleAddToLocalStorage(series)}>À regarder</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SeriesRandomPick;