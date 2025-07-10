import { useState, useEffect } from "react";

const OMDB_API_KEY = '4aeee27e';

const useRandomPick = () => {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [type, setType] = useState(null); // "anime", "movie", "series"

  const fetchRandomAnime = async () => {
    const baseUrls = [
      "https://api.jikan.moe/v4/top/anime?type=ona",
      "https://api.jikan.moe/v4/top/anime?type=movie",
      "https://api.jikan.moe/v4/seasons/upcoming",
      "https://api.jikan.moe/v4/top/anime?sfw",
    ];

    const seasonalUrls = [];
    const seasons = ["winter", "spring", "summer", "fall"];
    for (let year = 2012; year <= 2025; year++) {
      for (let season of seasons) {
        seasonalUrls.push(`https://api.jikan.moe/v4/seasons/${year}/${season}?sfw`);
      }
    }

    const urls = [...baseUrls, ...seasonalUrls];
    const randomUrl = urls[Math.floor(Math.random() * urls.length)];
    const response = await fetch(randomUrl);
    if (!response.ok) throw new Error("Erreur chargement animé");

    const data = await response.json();
    const list = data.data;
    if (!Array.isArray(list) || list.length === 0) throw new Error("Liste vide");

    const randomItem = list[Math.floor(Math.random() * list.length)];

    return {
      type: "anime",
      title: randomItem.title,
      image: randomItem.images.jpg.large_image_url,
      synopsis: randomItem.synopsis,
      episodes: randomItem.episodes || 1,
      season: randomItem.season || "",
      mal_id: randomItem.mal_id,
    };
  };

  const fetchRandomOMDb = async (targetType = "movie") => {
    const searchTerms = ['star', 'love', 'war', 'life', 'dark', 'light', 'day', 'night', 'man', 'woman'];
    const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];

    const searchResponse = await fetch(`https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(randomTerm)}&type=${targetType}`);
    if (!searchResponse.ok) throw new Error("Erreur recherche OMDb");

    const data = await searchResponse.json();
    if (!data.Search || data.Search.length === 0) throw new Error("Aucun résultat OMDb");

    const randomResult = data.Search[Math.floor(Math.random() * data.Search.length)];
    const detailResponse = await fetch(`https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${randomResult.imdbID}&plot=short`);
    if (!detailResponse.ok) throw new Error("Erreur détail OMDb");

    const details = await detailResponse.json();

    return {
      type: targetType,
      title: details.Title,
      image: details.Poster !== "N/A" ? details.Poster : "default-image-url.jpg",
      synopsis: details.Plot,
      release_date: details.Released,
      imdb_id: details.imdbID,
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      // choix aléatoire du type
      const types = ['anime', 'movie', 'series'];
      const randomChoice = types[Math.floor(Math.random() * types.length)];

      try {
        let data;
        if (randomChoice === 'anime') {
          data = await fetchRandomAnime();
        } else {
          data = await fetchRandomOMDb(randomChoice);
        }

        setItem(data);
        setType(randomChoice);
      } catch (err) {
        setError(err.message || "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { item, type, loading, error };
};

export default useRandomPick;
