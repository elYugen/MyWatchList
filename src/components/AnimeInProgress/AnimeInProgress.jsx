import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import './AnimeInProgress.css';

function AnimeInProgress() {
const [itemsInProgress, setItemsInProgress] = useState([]);

  useEffect(() => {
  const fetchItemsFromAPI = async () => {
    const uuid = localStorage.getItem('watchlist_uuid');
    if (!uuid) return;

    try {
      const response = await fetch('https://api.watchlist.lleroy.fr/api/watchlist', {
        method: 'GET',
        headers: {
          'X-User-UUID': uuid
        }
      });

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des animés");
      }

      const data = await response.json();
      const animeOnly = data.filter(item => item.type === 'anime' && item.statut === 'inprogress');
      setItemsInProgress(animeOnly);
    } catch (error) {
      console.error('Erreur API :', error);
    }
  };

    fetchItemsFromAPI();
  }, []);

  return (
    <>
      <Link to="inprogress">
        <div className="categoriesTitle">
          <h3>En cours de visionnage</h3>
          <h3><i className="bi bi-arrow-right"></i></h3>
        </div>
      </Link>
      <section className="inProgress">
        {itemsInProgress.length > 0 ? (
          itemsInProgress.map((anime, index) => (
            <div className="inProgressCard" key={index}>
              <div className="inProgressCardImage">
                <img src={anime.image} alt={anime.name} />
              </div>
              <div className="inProgressTitle">
                <p>{anime.name.length > 17 ? `${anime.name.slice(0, 17)}...` : anime.name}</p>
              </div>
              <div className="inProgressRecap">
                <p>Épisode {anime.episode}</p>
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

export default AnimeInProgress;