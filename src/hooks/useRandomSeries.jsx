import { useState, useEffect } from "react";

const OMDB_API_KEY = '4aeee27e'; 

const useRandomSeries = () => {
  const [series, setSeries] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRandomSeries = async () => {
      setLoading(true);
      try {
        // mots clés pour des recherches variées
        const searchTerms = ['star', 'love', 'war', 'life', 'dark', 'light', 'day', 'night', 'man', 'woman'];
        const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];

        // requête à l'API OMDb pour les séries
        const response = await fetch(
          `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(randomTerm)}&type=series`
        );

        if (!response.ok) throw new Error("Erreur lors du chargement des séries");

        const data = await response.json();

        if (!data.Search || data.Search.length === 0) throw new Error("Liste vide");

        // selection d'une série aléatoire parmi les résultats
        const randomItem = data.Search[Math.floor(Math.random() * data.Search.length)];

        // récupérer les détails de la série sélectionnée
        const detailsResponse = await fetch(
          `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${randomItem.imdbID}&plot=short`
        );

        if (!detailsResponse.ok) throw new Error("Erreur lors du chargement des détails de la série");

        const detailsData = await detailsResponse.json();

        const randomSeries = {
          title: detailsData.Title,
          image: detailsData.Poster !== "N/A" ? detailsData.Poster : "default-image-url.jpg",
          synopsis: detailsData.Plot,
          release_date: detailsData.Released,
          imdb_id: detailsData.imdbID,
          total_seasons: detailsData.totalSeasons || null,
        };

        setSeries(randomSeries);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRandomSeries();
  }, []);

  return { series, loading, error };
};

export default useRandomSeries;
