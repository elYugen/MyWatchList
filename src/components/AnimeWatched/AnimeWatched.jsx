import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import './AnimeWatched.css';

function AnimeWatched() {
const [itemsWatched, setItemsWatched] = useState([]);

  useEffect(() => {
    const loadItemsFromStorage = () => {
      const storedItems = JSON.parse(localStorage.getItem('ItemsWatched')) || [];
      const animesOnly = storedItems.filter(item => item.type === 'anime');
      setItemsWatched(animesOnly);
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
          itemsWatched.map((anime, index) => (
            <div className="watchedCard" key={index}>
              <div className="watchedCardImage">
                <img src={anime.image} alt={anime.name} />
              </div>
              <div className="watchedTitle">
                <p>{anime.name.length > 17 ? `${anime.name.slice(0, 17)}...` : anime.name}</p>
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

export default AnimeWatched;