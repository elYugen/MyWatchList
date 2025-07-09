import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import './AnimeWatched.css';

function AnimeWatched() {
const [itemsWatched, setItemsWatched] = useState([]);

  useEffect(() => {
  const fetchItemsFromAPI = async () => {
    const uuid = localStorage.getItem('watchlist_uuid');
    if (!uuid) return;

    try {
      const response = await fetch('https://watchlist.lleroy.fr/api/watchlist', {
        method: 'GET',
        headers: {
          'X-User-UUID': uuid
        }
      });

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des animés");
      }

      const data = await response.json();
      const animeOnly = data.filter(item => item.type === 'anime' && item.statut === 'watched');
      setItemsWatched(animeOnly);
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