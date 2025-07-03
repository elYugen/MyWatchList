import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import './InProgress.css';

function InProgress() {

  const [itemsInProgress, setItemsInProgress] = useState([]);

  useEffect(() => {
    const loadItemsFromStorage = () => {
      const storedItems = JSON.parse(localStorage.getItem('ItemsInProgress')) || [];
      setItemsInProgress(storedItems);
    };

    loadItemsFromStorage();
  }, []);

  return (
    <>
      <Link to="#">
        <div className="categoriesTitle">
          <h3>En cours de visionnage</h3>
          {/* <h3><i className="bi bi-arrow-right"></i></h3> */}
        </div>
      </Link>
      <section className="inProgress">
        {itemsInProgress.length > 0 ? (
          itemsInProgress.map((item, index) => (
            <div className="inProgressCard" key={index}>
              <div className="inProgressCardImage">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="inProgressTitle">
                <p>{item.name.length > 17 ? `${item.name.slice(0, 17)}...` : item.name}</p>
              </div>
              <div className="inProgressRecap">
                <p>Épisode {item.episode}</p>
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

export default InProgress;