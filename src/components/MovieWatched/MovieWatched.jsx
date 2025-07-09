import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import './MovieWatched.css';

function MovieWatched() {
const [itemsWatched, setItemsWatched] = useState([]);

  useEffect(() => {
  const fetchItemsFromAPI = async () => {
    const uuid = localStorage.getItem('watchlist_uuid');
    if (!uuid) return;

    try {
      const response = await fetch('http://localhost:8000/api/watchlist', {
        method: 'GET',
        headers: {
          'X-User-UUID': uuid
        }
      });

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des films");
      }

      const data = await response.json();
      const movieOnly = data.filter(item => item.type === 'movie' && item.statut === 'watched');
      setItemsWatched(movieOnly);
    } catch (error) {
      console.error('Erreur API :', error);
    }
  };

    fetchItemsFromAPI();
  }, []);

  return (
    <>
      <Link to="watched">
        <div className="categoriesTitle">
          <h3>Terminé</h3>
          <h3><i className="bi bi-arrow-right"></i></h3>
        </div>
      </Link>
      <section className="watched">
        {itemsWatched.length > 0 ? (
          itemsWatched.map((movie, index) => (
            <div className="watchedCard" key={index}>
              <div className="watchedCardImage">
                <img src={movie.image} alt={movie.name} />
              </div>
              <div className="watchedTitle">
                <p>{movie.name.length > 17 ? `${movie.name.slice(0, 17)}...` : movie.name}</p>
              </div>
            </div>
          ))
        ) : (
          <p>Aucun contenu ajouté pour l'instant.</p>
        )}
      </section>
    </>
  );
};

export default MovieWatched;