import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import './InProgress.css';

function InProgress() {

  const [itemsInProgress, setItemsInProgress] = useState([]);
  const uuid = localStorage.getItem('watchlist_uuid');
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    if (!uuid) return;

    const fetchData = async () => {
      try {
        setLoading(true); 

        const res = await fetch('http://localhost:8000/api/watchlist', {
          headers: { 'X-User-UUID': uuid }
        });

        if (!res.ok) throw new Error('Erreur lors de la requête');

        const data = await res.json();
        const filtered = data.filter(item => item.statut === 'inprogress');

        setItemsInProgress(filtered);
      } catch (error) {
        console.error('Erreur API :', error);
      } finally {
        setLoading(false); 
      }
    };

    fetchData();
  }, [uuid]);

  return (
    <>
      <Link to="#">
        <div className="categoriesTitle">
          <h3>En cours de visionnage</h3>
          {/* <h3><i className="bi bi-arrow-right"></i></h3> */}
        </div>
      </Link>
      <section className="inProgress">
        {loading ? (
          <div className="loading-container">
            <img src="/loading.gif" alt="Chargement..." style={{ width: "50px" }} />
          </div>
        ) : itemsInProgress.length > 0 ? (
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