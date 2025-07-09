import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import './SeriesInProgress.css';

function SeriesInProgress() {
const [itemsInProgress, setItemsInProgress] = useState([]);

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
        throw new Error("Erreur lors du chargement des séries");
      }

      const data = await response.json();
      const serieOnly = data.filter(item => item.type === 'serie' && item.statut === 'inprogress');
      setItemsInProgress(serieOnly);
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
          itemsInProgress.map((serie, index) => (
            <div className="inProgressCard" key={index}>
              <div className="inProgressCardImage">
                <img src={serie.image} alt={serie.name} />
              </div>
              <div className="inProgressTitle">
                <p>{serie.name.length > 17 ? `${serie.name.slice(0, 17)}...` : serie.name}</p>
              </div>
              {/* <div className="inProgressRecap">
                <p>Épisode {serie.episode}</p>
              </div> */}
            </div>
          ))
        ) : (
          <p>Aucun contenu ajouté pour l'instant.</p>
        )}
      </section>
    </>
  );
};

export default SeriesInProgress;