import { useState, useEffect } from "react";
import useRandomMovie from "../../hooks/useRandomMovie";
import './MovieRandomPick.css';

function MovieRandomPick({ onAdd }) {
  const { movie, loading, error } = useRandomMovie();

  const handleAddToLocalStorage = (movie) => {
    const storedItems = JSON.parse(localStorage.getItem('ItemsToSee')) || [];

    const exists = storedItems.some(item => item.imdb_id === movie.imdb_id && item.type === 'movie');
    if (exists) {
      alert("Ce film est déjà dans la liste !");
      return;
    }

    const newMovie = {
      imdb_id: movie.imdb_id,
      name: movie.title,
      image: movie.image || 'default-image-url.jpg',
      total_episodes: 1,
      season: '',
      episode: '1',
      type: 'movie',
      release_date: movie.release_date,
      synopsis: movie.synopsis,
    };

    localStorage.setItem('ItemsToSee', JSON.stringify([...storedItems, newMovie]));
    alert(`${movie.title} a été ajouté à la liste "À voir" !`);

    if (onAdd) onAdd(); 
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
                <button className="btn" onClick={() => handleAddToLocalStorage(movie)}>À regarder</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MovieRandomPick;
