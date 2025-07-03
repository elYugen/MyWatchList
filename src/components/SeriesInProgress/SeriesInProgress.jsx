import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import './SeriesInProgress.css';

function SeriesInProgress() {
const [itemsInProgress, setItemsInProgress] = useState([]);

  useEffect(() => {
    const loadItemsFromStorage = () => {
      const storedItems = JSON.parse(localStorage.getItem('ItemsInProgress')) || [];
      const seriesOnly = storedItems.filter(item => item.type === 'serie');
      setItemsInProgress(seriesOnly);
    };

    loadItemsFromStorage();
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
              <div className="inProgressRecap">
                <p>Épisode {serie.episode}</p>
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

export default SeriesInProgress;