import { useState, useEffect } from "react";

const OMDB_API_KEY = '4aeee27e'; 

const useRandomMovie = () => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRandomMovie = async () => {
      setLoading(true);
      try {
        // mots clés pour des recherches varié
        const searchTerms = ['star', 'love', 'war', 'life', 'dark', 'light', 'day', 'night', 'man', 'woman'];
        const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];

        // requete à l'api de films avec OMDb
        const response = await fetch(
          `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(randomTerm)}&type=movie`
        );

        if (!response.ok) throw new Error("Erreur lors du chargement des films");

        const data = await response.json();

        if (!data.Search || data.Search.length === 0) throw new Error("Liste vide");

        // selection d'un film aléatoire parmi les résultats
        const randomItem = data.Search[Math.floor(Math.random() * data.Search.length)];

        // récupérer les détails du film sélectionné
        const detailsResponse = await fetch(
          `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${randomItem.imdbID}&plot=short`
        );

        if (!detailsResponse.ok) throw new Error("Erreur lors du chargement des détails du film");

        const detailsData = await detailsResponse.json();

        const randomMovie = {
          title: detailsData.Title,
          image: detailsData.Poster !== "N/A" ? detailsData.Poster : "default-image-url.jpg",
          synopsis: detailsData.Plot,
          release_date: detailsData.Released,
          imdb_id: detailsData.imdbID,
        };

        setMovie(randomMovie);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRandomMovie();
  }, []);

  return { movie, loading, error };
};

export default useRandomMovie;
