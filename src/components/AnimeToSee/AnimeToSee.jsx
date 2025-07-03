import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import './AnimeToSee.css';

function AnimeToSee({ animes }) {

  return (
    <>
      <Link to="tosee">
        <div className="categoriesTitle">
          <h3>À voir</h3>
          <h3><i className="bi bi-arrow-right"></i></h3>
        </div>
      </Link>
      <section className="toSee">
        {animes.length > 0 ? (
          animes.map((anime, index) => (
            <div className="toSeeCard" key={index}>
              <div className="toSeeCardImage">
                <img src={anime.image} alt={anime.name} />
              </div>
              <div className="inProgressTitle">
                <p>{anime.name.length > 17 ? `${anime.name.slice(0, 17)}...` : anime.name}</p>
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

export default AnimeToSee;