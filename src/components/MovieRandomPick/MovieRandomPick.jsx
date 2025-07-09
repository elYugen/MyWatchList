import { useState, useEffect } from "react";
import useRandomMovie from "../../hooks/useRandomMovie";
import './MovieRandomPick.css';

function MovieRandomPick({ onAdd }) {
  const { movie, loading, error } = useRandomMovie();

const handleAddToDatabase = (movie) => {
  const newMovie = {
    imdb_id: movie.imdb_id,
    name: movie.title,
    image: movie.image || 'default-image-url.jpg',
    total_episodes: 1,
    season: '',
    episode: 1,
    type: 'movie',
    release_date: movie.release_date,
    synopsis: movie.synopsis,
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
    body: JSON.stringify(newMovie)
  })
    .then(res => {
      if (!res.ok) throw new Error("Erreur lors de l'enregistrement en base");
      return res.json();
    })
    .then(data => {
      console.log('Ajouté à la base :', data);
      alert(`${movie.title} a été ajouté à la playlist "À voir" !`);
      if (onAdd) onAdd(); // recharge la liste
    })
    .catch(err => {
      console.error('Erreur API:', err);
      alert("Erreur lors de l'ajout du film !");
    });
};

  return (
    <>
      {loading && <div className="loading"><img src="loading.gif" style={{width: "50px"}} alt="Chargement" /></div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      {movie && (
        <div className="randomPick" style={{ backgroundImage: `url(${movie.image})` }}>
          <div className="randomPickBox">
            <h3>Recommandation Aléatoire</h3>
            <div className="randomPickInfo">
              <div className="randomPickInfoImage">
                <img src={movie.image} alt={movie.title} />
              </div>
              <div className="randomPickInfoTitle">
                <h2>{movie.title}</h2>
                {/* <p>{truncateText(movie.synopsis, 100)}</p> */}
                <button className="btn" onClick={() => handleAddToDatabase(movie)}>À regarder</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MovieRandomPick;
