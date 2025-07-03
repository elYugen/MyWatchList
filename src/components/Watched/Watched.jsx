import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import './Watched.css';

function Watched() {
const [itemsWatched, setItemsWatched] = useState([]);

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem('ItemsWatched')) || [];
    setItemsWatched(storedItems); 
  }, []);

  return (
    <>
      <Link to="#">
        <div className="categoriesTitle">
          <h3>Terminé</h3>
          {/* <h3><i className="bi bi-arrow-right"></i></h3> */}
        </div>
      </Link>
      <section className="watched">
        {itemsWatched.length > 0 ? (
          itemsWatched.map((item, index) => (
            <div className="watchedCard" key={index}>
              <div className="watchedCardImage">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="watchedTitle">
                <p>{item.name.length > 17 ? `${item.name.slice(0, 17)}...` : item.name}</p>
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

export default Watched;