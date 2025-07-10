import { useState, useEffect } from "react";
import useRandomSeries from "../../hooks/useRandomSeries";
import './SeriesRandomPick.css';

function SeriesRandomPick({ onAdd }) {

  const { series, loading, error } = useRandomSeries();

  const handleAddToDatabase = (serie) => {
    const newSerie = {
      imdb_id: serie.imdb_id,
      name: serie.title,
      image: serie.image || 'default-image-url.jpg',
      total_episodes: 1,
      season: 0,
      episode: 1,
      type: 'serie',
      release_date: serie.release_date,
      synopsis: serie.synopsis,
      statut: 'tosee'
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
        body: JSON.stringify(newSerie)
      })
        .then(res => {
          if (!res.ok) throw new Error("Erreur lors de l'enregistrement en base");
          return res.json();
        })
        .then(data => {
          console.log('Ajouté à la base :', data);
          alert('Série ajouté dans la playlist A voir');
          if (onAdd) onAdd(); 
        })
        .catch(err => console.error('Erreur API:', err));


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