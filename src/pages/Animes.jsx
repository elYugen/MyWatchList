import { useState, useEffect } from "react";
import AnimeRandomPick from "../components/AnimeRandomPick/AnimeRandomPick";
import AnimeToSee from "../components/AnimeToSee/AnimeToSee";
import AnimeInProgress from "../components/AnimeInProgress/AnimeInProgress";
import AnimeWatched from "../components/AnimeWatched/AnimeWatched";

function Anime() {
  const [animesToSee, setAnimesToSee] = useState([]);

  const refreshAnimes = async () => {
    const uuid = localStorage.getItem('watchlist_uuid');
    if (!uuid) return;

    try {
      const response = await fetch('https://watchlist.lleroy.fr/api/watchlist', {
        method: 'GET',
        headers: {
          'X-User-UUID': uuid
        }
      });

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des animes");
      }

      const data = await response.json();
      const animesOnly = data.filter(item => item.type === 'anime' && item.statut === 'tosee');
      setAnimesToSee(animesOnly);
    } catch (error) {
      console.error('Erreur API :', error);
    }
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