import { useState, useEffect } from 'react';

const useAnimeSearch = (query) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await fetch(`https://api.jikan.moe/v4/anime?q=${query}`);
          if (!response.ok) {
            throw new Error('Trop de requête');
          }
          const data = await response.json();
          console.log(data);
          const formattedResults = data.data.map(anime => ({
            title: anime.title,
            image: anime.images && anime.images.jpg ? anime.images.jpg.image_url : null,
            episodes: anime.episodes || 1, 
            seasons: anime.seasons || 1, 
            mal_id: anime.mal_id 
          }));
          setResults(formattedResults);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return { results, loading, error };
};

export default useAnimeSearch;