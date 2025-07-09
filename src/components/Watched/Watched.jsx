import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import './Watched.css';

function Watched() {

  const [itemsWatched, setItemsWatched] = useState([]);
  const uuid = localStorage.getItem('watchlist_uuid');
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    if (!uuid) return;

    const fetchData = async () => {
      try {
        setLoading(true); 

        const res = await fetch('https://watchlist.lleroy.fr/api/watchlist', {
          headers: { 'X-User-UUID': uuid }
        });

        if (!res.ok) throw new Error('Erreur lors de la requête');

        const data = await res.json();
        const filtered = data.filter(item => item.statut === 'watched');

        setItemsWatched(filtered);
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
          <h3>Terminé</h3>
          {/* <h3><i className="bi bi-arrow-right"></i></h3> */}
        </div>
      </Link>
      <section className="watched">
        {loading ? (
          <div className="loading-container">
            <img src="/loading.gif" alt="Chargement..." style={{ width: "50px" }} />
          </div>
        ) : itemsWatched.length > 0 ? (
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