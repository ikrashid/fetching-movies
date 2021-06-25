import React, {useState, useEffect, useCallback} from 'react';

import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchMoviesHandler = useCallback(()=>{
    setIsLoading(true);
    fetch('https://swapi.dev/api/films')
    .then(response => {
      if(!response.ok){
        throw Error("Something went wrong!")
      }
      return response.json();
    }).then(data => {
      const transformedData = data.results.map(movieData => {
        return {
          id: movieData.episode_id,
          title: movieData.title,
          releaseDate: movieData.release_date,
          openingText: movieData.opening_crawl
        }
      })
      setMovies(transformedData); 
      setIsLoading(false);
    })
    .catch(error =>{
      setIsLoading(false);
      setError(error.message)
    } )
  }, [])

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]) //added as a dependency in case function changes if it uses an external state


  let content = <p>No Movies Here</p>;
  if(!isLoading && movies.length > 0){
    content = <MoviesList movies={movies} />
  }
  else if(!isLoading && movies.length === 0 && !error){
    content = <p>No Movies Here</p>
  }
  else if(!isLoading && error){
    content = <p>{error}</p>
  }
  else if(isLoading){
    content = <p>Loading...</p>
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {content}
      </section>
    </React.Fragment>
  );
}

export default App;
