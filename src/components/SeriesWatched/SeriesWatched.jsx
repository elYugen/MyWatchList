import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import './SeriesWatched.css';

function SeriesWatched() {
const [itemsWatched, setItemsWatched] = useState([]);

  useEffect(() => {
    const loadItemsFromStorage = () => {
      const storedItems = JSON.parse(localStorage.getItem('ItemsWatched')) || [];
      const seriesOnly = storedItems.filter(item => item.type === 'serie');
      setItemsWatched(seriesOnly);
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