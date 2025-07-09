import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import './SeriesWatched.css';

function SeriesWatched() {
const [itemsWatched, setItemsWatched] = useState([]);

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
        throw new Error("Erreur lors du chargement des séries");
      }

      const data = await response.json();
      const seriesOnly = data.filter(item => item.type === 'serie' && item.statut === 'watched');
      setItemsWatched(seriesOnly);
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
          itemsWatched.map((serie, index) => (
            <div className="watchedCard" key={index}>
              <div className="watchedCardImage">
                <img src={serie.image} alt={serie.name} />
              </div>
              <div className="watchedTitle">
                <p>{serie.name.length > 17 ? `${serie.name.slice(0, 17)}...` : serie.name}</p>
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

export default SeriesWatched;