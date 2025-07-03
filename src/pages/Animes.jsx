import { useState, useEffect } from "react";
import AnimeRandomPick from "../components/AnimeRandomPick/AnimeRandomPick";
import AnimeToSee from "../components/AnimeToSee/AnimeToSee";
import AnimeInProgress from "../components/AnimeInProgress/AnimeInProgress";
import AnimeWatched from "../components/AnimeWatched/AnimeWatched";

function Anime() {
  const [animesToSee, setAnimesToSee] = useState([]);

  const refreshAnimes = () => {
    const storedItems = JSON.parse(localStorage.getItem('ItemsToSee')) || [];
    const animesOnly = storedItems.filter(item => item.type === 'anime');
    setAnimesToSee(animesOnly);
  };

  useEffect(() => {
    refreshAnimes();
  }, []);

  return (
      <>
      <AnimeRandomPick onAdd={refreshAnimes} />
      <div className="container">
        <AnimeInProgress/>
        <AnimeToSee animes={animesToSee} />
        <AnimeWatched />
      </div>
      </>
  );
};

export default Anime;