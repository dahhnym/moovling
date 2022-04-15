import axios from "axios";
import { useEffect, useState } from "react";
import Movie from "./components/Movie";

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const getMovies = async () => {
    const movieData = await axios.get("https://yts-proxy.now.sh/list_movies.json");
    // console.log("movieData.data", movieData.data.data.movies)
    setMovies(movieData.data.data.movies);
    setLoading(false);
  }

  useEffect(() => {
    getMovies();
  },[])
  // console.log(movies)
  return (
    <div className="App">
      <h1>Hello</h1>
      <p>{loading ? "Loading..." : null}</p>
      {movies.map(movie => {
        return (
          <div key={movie.id}>
            <Movie id={movie.id} year={movie.year} title={movie.title} summary={movie.summary} poster={movie.medium_cover_image} />
          </div>
        )
      })}
    </div>
  );
}

export default App;
