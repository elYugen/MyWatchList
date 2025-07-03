import { useState, useEffect } from "react";
import SeriesRandomPick from "../components/SeriesRandomPick/SeriesRandomPick";
import SeriesToSee from "../components/SeriesToSee/SeriesToSee";
import SeriesWatched from "../components/SeriesWatched/SeriesWatched";
import SeriesInProgress from "../components/SeriesInProgress/SeriesInProgress";

function Series() {
  const [seriesToSee, setSeriesToSee] = useState([]);

  const refreshSeries = () => {
    const storedItems = JSON.parse(localStorage.getItem('ItemsToSee')) || [];
    const seriesOnly = storedItems.filter(item => item.type === 'serie');
    setSeriesToSee(seriesOnly);
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