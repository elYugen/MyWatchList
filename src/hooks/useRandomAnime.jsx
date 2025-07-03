import { useState, useEffect } from "react";

const useRandomAnime = () => {
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const generateAllUrls = () => {
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

    return [...baseUrls, ...seasonalUrls];
  };

  useEffect(() => {
    const fetchRandomAnime = async () => {
      setLoading(true);
      try {
        const urls = generateAllUrls();
        const randomUrl = urls[Math.floor(Math.random() * urls.length)];
        const response = await fetch(randomUrl);

        if (!response.ok) throw new Error("Erreur lors du chargement des animés");

        const data = await response.json();
        const list = data.data;

        if (!Array.isArray(list) || list.length === 0) throw new Error("Liste vide");

        const randomItem = list[Math.floor(Math.random() * list.length)];

        const randomAnime = {
          title: randomItem.title,
          image: randomItem.images.jpg.large_image_url,
          synopsis: randomItem.synopsis,
          episodes: randomItem.episodes || 1,
          season: randomItem.season || "",
          mal_id: randomItem.mal_id,
        };

        setAnime(randomAnime);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRandomAnime();
  }, []);

  return { anime, loading, error };
};

export default useRandomAnime;
