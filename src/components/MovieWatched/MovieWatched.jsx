import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import './MovieWatched.css';

function MovieWatched() {
const [itemsWatched, setItemsWatched] = useState([]);

  useEffect(() => {
    const loadItemsFromStorage = () => {
      const storedItems = JSON.parse(localStorage.getItem('ItemsWatched')) || [];
      const moviesOnly = storedItems.filter(item => item.type === 'movie');
      setItemsWatched(moviesOnly);
    };

    loadItemsFromStorage();
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