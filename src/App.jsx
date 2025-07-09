import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './assets/css/styles.css'

import BugTracker from "./utils/BugTrackers";

import Layout from "./pages/Layout";
import Home from "./pages/Home";
import NoPage from "./pages/NoPage";
import Settings from "./pages/Settings";
import Animes from "./pages/Animes";
import AnimesToSee from "./pages/AnimesToSee";
import AnimesWatched from "./pages/AnimesWatched";
import AnimesInProgress from "./pages/AnimesInProgress";
import Movies from "./pages/Movies";
import MoviesToSee from "./pages/MoviesToSee";
import MoviesWatched from "./pages/MoviesWatched";
import Series from "./pages/Series";
import SeriesInProgress from "./pages/SeriesInProgress";
import SeriesWatched from "./pages/SeriesWatched";
import SeriesToSee from "./pages/SeriesToSee";

function App() {

  return (
    <>
    <BugTracker />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="*" element={<NoPage />} />
          <Route path="settings" element={<Settings />} />
          <Route path="anime" element={<Animes />} />
          <Route path="anime/tosee" element={<AnimesToSee />} />
          <Route path="anime/watched" element={<AnimesWatched />} />
          <Route path="anime/inprogress" element={<AnimesInProgress />} />
          <Route path="movie" element={<Movies />} />
          <Route path="movie/tosee" element={<MoviesToSee />} />
          <Route path="movie/watched" element={<MoviesWatched />} />
          <Route path="serie" element={<Series />} />
          <Route path="serie/tosee" element={<SeriesToSee/>} />
          <Route path="serie/watched" element={<SeriesWatched/>} />
          <Route path="serie/inprogress" element={<SeriesInProgress/>} />
        </Route>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
