import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import './ToSee.css';

function ToSee() {
  const [itemsToSee, setItemsToSee] = useState([]);
  const [loading, setLoading] = useState(true);
  const uuid = localStorage.getItem('watchlist_uuid');

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
        const filtered = data.filter(item => item.statut === 'tosee');

        setItemsToSee(filtered);
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
          <h3>À voir</h3>
        </div>
      </Link>

      <section className="toSee">
        {loading ? (
          <div className="loading-container">
            <img src="/loading.gif" alt="Chargement..." style={{ width: "50px" }} />
          </div>
        ) : itemsToSee.length > 0 ? (
          itemsToSee.map((item, index) => (
            <div className="toSeeCard" key={index}>
              <div className="toSeeCardImage">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="toSeeTitle">
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
}

export default ToSee;
