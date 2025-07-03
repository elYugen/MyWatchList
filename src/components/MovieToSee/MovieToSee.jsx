import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import './MovieToSee.css';

function MovieToSee({ movies }) {
  return (
    <>
      <Link to="tosee">
        <div className="categoriesTitle">
          <h3>À voir</h3>
          <h3><i className="bi bi-arrow-right"></i></h3>
        </div>
      </Link>
      <section className="toSee">
        {movies.length > 0 ? (
          movies.map((movie, index) => (
            <div className="toSeeCard" key={index}>
              <div className="toSeeCardImage">
                <img src={movie.image} alt={movie.name} />
              </div>
              <div className="inProgressTitle">
                <p>{movie.name.length > 17 ? `${movie.name.slice(0, 17)}...` : movie.name}</p>
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

export default MovieToSee;