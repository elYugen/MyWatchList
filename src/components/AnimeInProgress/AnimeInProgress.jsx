import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import './AnimeInProgress.css';

function AnimeInProgress() {
const [itemsInProgress, setItemsInProgress] = useState([]);

  useEffect(() => {
    const loadItemsFromStorage = () => {
      const storedItems = JSON.parse(localStorage.getItem('ItemsInProgress')) || [];
      const animesOnly = storedItems.filter(item => item.type === 'anime');
      setItemsInProgress(animesOnly);
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