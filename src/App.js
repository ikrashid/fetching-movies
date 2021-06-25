import React, {useState, useEffect, useCallback} from 'react';

import MoviesList from './components/MoviesList';
import AddMovie from './components/AddMovie';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchMoviesHandler = useCallback(()=>{
    setIsLoading(true);
    fetch('https://react-http-iar252-default-rtdb.firebaseio.com/movies.json')
    .then(response => {
      if(!response.ok){
        throw Error("Something went wrong!")
      }
      return response.json();
    }).then(data => {
      const loadedMovies = [];
      for(const key in data){
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openText,
          releaseDate: data[key].releaseDate 
        })
      }
      setMovies(loadedMovies); 
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

  const addMovieHandler = (movie) =>{
    fetch('https://react-http-iar252-default-rtdb.firebaseio.com/movies.json', {
      method: 'POST',
      body: JSON.stringify(movie),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => response.json())
    .then(data => console.log(data));
  }

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
        <AddMovie onAddMovie={addMovieHandler}/>
      </section>
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
