import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import './SeriesToSee.css';

function SeriesToSee({ series }) {
  return (
    <>
      <Link to="tosee">
        <div className="categoriesTitle">
          <h3>À voir</h3>
          <h3><i className="bi bi-arrow-right"></i></h3>
        </div>
      </Link>
      <section className="toSee">
        {series.length > 0 ? (
          series.map((serie, index) => (
            <div className="toSeeCard" key={index}>
              <div className="toSeeCardImage">
                <img src={serie.image} alt={serie.name} />
              </div>
              <div className="inProgressTitle">
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

export default SeriesToSee;