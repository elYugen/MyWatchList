import { useState, useEffect } from "react";
import SeriesRandomPick from "../components/SeriesRandomPick/SeriesRandomPick";
import SeriesToSee from "../components/SeriesToSee/SeriesToSee";
import SeriesWatched from "../components/SeriesWatched/SeriesWatched";
import SeriesInProgress from "../components/SeriesInProgress/SeriesInProgress";

function Series() {
  const [seriesToSee, setSeriesToSee] = useState([]);

  const refreshSeries = async () => {
    const uuid = localStorage.getItem('watchlist_uuid');
    if (!uuid) return;

    try {
      const response = await fetch('http://localhost:8000/api/watchlist', {
        method: 'GET',
        headers: {
          'X-User-UUID': uuid
        }
      });

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des films");
      }

      const data = await response.json();
      const seriesOnly = data.filter(item => item.type === 'serie'  && item.statut === 'tosee');
      setSeriesToSee(seriesOnly);
    } catch (error) {
      console.error('Erreur API :', error);
    }
  };

  useEffect(() => {
    refreshSeries();
  }, []);

  return (
      <>
      <SeriesRandomPick onAdd={refreshSeries} />
      <div className="container">
        <SeriesToSee series={seriesToSee}/>
        <SeriesInProgress />
        <SeriesWatched />
      </div>
      </>
  );
};

export default Series;