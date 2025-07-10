import { useState, useEffect } from "react";
import InProgress from "../components/InProgress/InProgress";
import RandomPick from "../components/RandomPick/RandomPick";
import ToSee from "../components/ToSee/ToSee";
import Watched from "../components/Watched/Watched";

function Home() {

    const [toSee, setToSee] = useState([]);
  
    const refreshToSee = async () => {
      const uuid = localStorage.getItem('watchlist_uuid');
      if (!uuid) return;
  
      try {
        const response = await fetch('https://api.watchlist.lleroy.fr/api/watchlist', {
          method: 'GET',
          headers: {
            'X-User-UUID': uuid
          }
        });
  
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des animes");
        }
  
        const data = await response.json();
        const itemsToSee = data.filter(item => item.statut === 'tosee');
        setToSee(itemsToSee);
      } catch (error) {
        console.error('Erreur API :', error);
      }
    };
  
    useEffect(() => {
      refreshToSee();
    }, []);

  return (
      <>
      <RandomPick onAdd={refreshToSee}/>
      <div className="container">
        <InProgress />
        <ToSee />
        <Watched />
      </div>
      </>
  );
};

export default Home;