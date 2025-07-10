import React from 'react';
import { Link } from "react-router-dom";
import './ToSee.css';

function ToSee({ tosee }) {
  return (
    <>
      <Link to="#">
        <div className="categoriesTitle">
          <h3>À voir</h3>
          {/* <h3><i className="bi bi-arrow-right"></i></h3> */}
        </div>
      </Link>

      <section className="toSee">
        {!tosee ? (
          <div className="loading-container">
            <img src="/loading.gif" alt="Chargement..." style={{ width: "50px" }} />
          </div>
        ) : tosee.length > 0 ? (
          tosee.map((item, index) => (
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
