import PropTypes from "prop-types"

const Movie = ({id, year, title, summary, poster}) => {
  return (
    <>
      <h3>Movie</h3>
      <img src={poster} alt={title} />
      <ul>
        <li>ID: {id}</li>
        <li>Release Year: {year}</li>
        <li>Title: {title}</li>
        <li>Summary: {summary}</li>
      </ul>
    </>
  )
}

Movie.propTypes = {
  id: PropTypes.number.isRequired,
  year: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  summary: PropTypes.string.isRequired,
  poster: PropTypes.string.isRequired
}

export default Movie;