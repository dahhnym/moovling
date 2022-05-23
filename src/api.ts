const API_KEY = 'ba70c390de4655e9260f08d4ffa9a63f';
const BASE_PATH = 'https://api.themoviedb.org/3';

export interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export function getMovies(category: string) {
  let selectedCategory = '';

  if (category.includes('Now')) {
    selectedCategory = 'now_playing';
  } else if (category.includes('Top')) {
    selectedCategory = 'top_rated';
  } else {
    selectedCategory = 'upcoming';
  }

  return fetch(
    `${BASE_PATH}/movie/${selectedCategory}?api_key=${API_KEY}&language=en-US&page=1`,
  ).then((response) => response.json());
}
