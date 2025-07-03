import { useState, useEffect } from 'react';

const OMDB_API_KEY = '4aeee27e';

const useMovieSearch = (query) => {
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
          const response = await fetch(
            `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(query)}&type=movie`
          );
          if (!response.ok) {
            throw new Error('Erreur lors du chargement des films');
          }
          const data = await response.json();
          if (!data.Search) {
            setResults([]);
            setError('Aucun résultat trouvé');
            return;
          }
          const formattedResults = data.Search.map(movie => ({
            title: movie.Title,
            image: movie.Poster !== 'N/A' ? movie.Poster : null,
            year: movie.Year,
            imdbID: movie.imdbID
          }));
          setResults(formattedResults);
          setError(null);
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

export default useMovieSearch;
