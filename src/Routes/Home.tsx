import { useQuery } from 'react-query';
import { getMovies, IGetMoviesResult } from '../api';
import styled from 'styled-components';
import { makeImagePath, useWindowDimensions } from '../utils';
import { motion, AnimatePresence, useViewportScroll } from 'framer-motion';
import { useState } from 'react';
import { PathMatch, useMatch, useNavigate } from 'react-router-dom';

const Wrapper = styled.div`
  height: 200vh;
  background-color: ${(props) => props.theme.black.veryDark};
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgphoto: string }>`
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: center;
  padding: 4rem;
  background-image: linear-gradient(rgba(65, 3, 236, 0.5), rgba(0, 0, 0, 0.5)),
    url(${(props) => props.bgphoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const Overview = styled.p`
  font-size: 1.2rem;
  line-height: 1.5rem;
  width: 50%;
`;

const SlidersContainer = styled.div`
  position: relative;
  top: -100px;
  grid-template-rows: repeat(3, 1fr);
`;

const Slider = styled.div`
  position: relative;
  grid-row: 1 / 2;
  button {
    border: none;
    background: linear-gradient(to right, transparent, rgba(0, 0, 0, 0.5));
    width: 100px;
    height: 200px;
    color: #fff;
    position: absolute;
    right: 0;
    &:hover {
      cursor: pointer;
      background: linear-gradient(to right, transparent, rgba(0, 0, 0, 0.8));
    }
  }
  button:first-child {
    left: 0;
    z-index: 99;
    background: linear-gradient(to left, transparent, rgba(0, 0, 0, 0.5));
    &:hover {
      background: linear-gradient(to left, transparent, rgba(0, 0, 0, 0.8));
    }
  }
`;

const SecondSlider = styled(Slider)`
  position: relative;
  grid-row: 2/ 3;
  top: 200px;
`;

const ThirdSlider = styled(Slider)`
  position: relative;
  grid-row: 3 / 4;
  top: 400px;
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  width: 100%;
  position: absolute;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
  &:hover {
    cursor: pointer;
  }
`;

const Info = styled(motion.div)`
  padding: 20px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
  }
`;

const Overlay = styled(motion.div)<{ height: number }>`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const MovieCard = styled(motion.div)`
  position: absolute;
  width: 40%;
  max-width: 600px;
  height: 600px;
  background-color: ${(props) => props.theme.black.lighter};
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 1rem;
  overflow: hidden;
`;

const Poster = styled.img`
  width: 100%;
  height: 400px;
  background-size: cover;
  background-position: center center;
`;

const MovieCardTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  font-size: 1.2rem;
  position: relative;
  top: -50px;
  margin-left: 1.5rem;
`;

const MovieCardOverview = styled.p`
  padding: 1rem;
  color: ${(props) => props.theme.white.lighter};
`;

const Category = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
  margin: 1rem;
`;

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    zIndex: 99,
    scale: 1.2,
    y: -50,
    transition: {
      type: 'tween',
      delay: 0.3,
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.3,
    },
  },
};

const offset = 6;
const firstCategory = 'Now Playing';
const secondCategory = 'Top Rated Movies';
const thirdCategory = 'Upcoming Movies';

const Home = () => {
  const navigate = useNavigate();
  const bigMovieMatch: PathMatch<string> | null = useMatch('/movies/:movieId');
  const { scrollY } = useViewportScroll();

  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ['movies', 'nowPlaying'],
    () => getMovies(firstCategory),
  );
  const { data: topRatedMovieData, isLoading: isLoading_topRated } =
    useQuery<IGetMoviesResult>(['movies', 'topRated'], () =>
      getMovies(secondCategory),
    );
  const { data: upcomingMovieData, isLoading: isLoading_upcoming } =
    useQuery<IGetMoviesResult>(['movies', 'upcoming'], () =>
      getMovies(thirdCategory),
    );

  const [firstCategIndex, setFirstCategIndex] = useState(0);
  const [firstCategLeaving, setFirstCategLeaving] = useState(false);
  const [secondCategIndex, setSecondCategIndex] = useState(0);
  const [secondCategLeaving, setSecondCategLeaving] = useState(false);
  const [thirdCategIndex, setThirdCategIndex] = useState(0);
  const [thirdCategLeaving, setThirdCategLeaving] = useState(false);

  const toggleFirstCategLeaving = () => setFirstCategLeaving((prev) => !prev);
  const toggleSecondCategLeaving = () => setSecondCategLeaving((prev) => !prev);
  const toggleThirdCategLeaving = () => setThirdCategLeaving((prev) => !prev);

  const increaseIndex = (event: React.MouseEvent<HTMLButtonElement>) => {
    const buttonName = event.currentTarget.name;
    if (buttonName === 'firstNext') {
      if (typeof data?.results?.length === 'number') {
        if (firstCategLeaving) return;
        toggleFirstCategLeaving();
        const totalMovies = data.results.length - 1;
        const maxIndex = Math.floor(totalMovies / offset) - 1;
        setFirstCategIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      }
    } else if (buttonName === 'secondNext') {
      if (typeof topRatedMovieData?.results?.length === 'number') {
        if (secondCategLeaving) return;
        toggleSecondCategLeaving();
        const totalMovies = topRatedMovieData.results.length - 1;
        const maxIndex = Math.floor(totalMovies / offset) - 1;
        setSecondCategIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      }
    } else {
      if (typeof upcomingMovieData?.results?.length === 'number') {
        if (thirdCategLeaving) return;
        toggleThirdCategLeaving();
        const totalMovies = upcomingMovieData.results.length - 1;
        const maxIndex = Math.floor(totalMovies / offset) - 1;
        setThirdCategIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      }
    }
  };

  const decreaseIndex = (event: React.MouseEvent<HTMLButtonElement>) => {
    const buttonName = event.currentTarget.name;
    if (buttonName === 'firstPrev') {
      if (typeof data?.results?.length === 'number') {
        if (firstCategLeaving) return;
        toggleFirstCategLeaving();
        const totalMovies = data?.results?.length - 1;
        const maxIndex = Math.floor(totalMovies / offset) - 1;
        setFirstCategIndex((prev) => (prev === maxIndex ? 0 : prev - 1));
      }
    } else if (buttonName === 'secondPrev') {
      if (typeof topRatedMovieData?.results?.length === 'number') {
        if (secondCategLeaving) return;
        toggleSecondCategLeaving();
        const totalMovies = topRatedMovieData?.results?.length - 1;
        const maxIndex = Math.floor(totalMovies / offset) - 1;
        setSecondCategIndex((prev) => (prev === maxIndex ? 0 : prev - 1));
      }
    } else {
      if (typeof upcomingMovieData?.results?.length === 'number') {
        if (thirdCategLeaving) return;
        toggleThirdCategLeaving();
        const totalMovies = upcomingMovieData?.results?.length - 1;
        const maxIndex = Math.floor(totalMovies / offset) - 1;
        setThirdCategIndex((prev) => (prev === maxIndex ? 0 : prev - 1));
      }
    }
  };

  const onBoxClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };
  const onOverlayClick = () => navigate('/');

  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data?.results.find(
      (movie) => movie.id + '' === bigMovieMatch.params.movieId,
    );

  const width = useWindowDimensions();

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bgphoto={makeImagePath(data?.results[0].backdrop_path || '')}>
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <SlidersContainer>
            {isLoading ? (
              <Loader></Loader>
            ) : (
              <>
                <Category>{firstCategory}</Category>
                <Slider>
                  <button name="firstPrev" onClick={decreaseIndex}>
                    &larr;
                  </button>
                  <AnimatePresence
                    initial={false}
                    onExitComplete={toggleFirstCategLeaving}
                  >
                    <Row
                      initial={{ x: width }}
                      animate={{ x: 0 }}
                      exit={{ x: -width - 5 }}
                      transition={{ type: 'tween', duration: 1 }}
                      key={firstCategIndex}
                    >
                      {data?.results
                        .slice(1)
                        .slice(
                          offset * firstCategIndex,
                          offset * firstCategIndex + offset,
                        )
                        .map((movie) => (
                          <Box
                            layoutId={movie.id + ''}
                            key={movie.id}
                            variants={boxVariants}
                            onClick={() => onBoxClicked(movie.id)}
                            initial="normal"
                            whileHover="hover"
                            transition={{ type: 'tween' }}
                            bgphoto={makeImagePath(movie.backdrop_path)}
                          >
                            <Info variants={infoVariants}>
                              <h4>{movie.title}</h4>
                            </Info>
                          </Box>
                        ))}
                    </Row>
                  </AnimatePresence>
                  <button name="firstNext" onClick={increaseIndex}>
                    &rarr;
                  </button>
                </Slider>
                <AnimatePresence>
                  {bigMovieMatch ? (
                    <>
                      <Overlay
                        onClick={onOverlayClick}
                        height={window.innerHeight}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      ></Overlay>
                      <MovieCard
                        layoutId={bigMovieMatch.params.movieId}
                        style={{ top: scrollY.get() + 100 }}
                      >
                        {clickedMovie && (
                          <>
                            <Poster
                              style={{
                                backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                                  clickedMovie.poster_path,
                                )})`,
                              }}
                              alt=""
                            />
                            <MovieCardTitle>
                              {clickedMovie.title}
                            </MovieCardTitle>
                            <MovieCardOverview>
                              {clickedMovie.overview}
                            </MovieCardOverview>
                          </>
                        )}
                      </MovieCard>
                    </>
                  ) : null}
                </AnimatePresence>
              </>
            )}

            {isLoading_topRated ? (
              <Loader>Loading...</Loader>
            ) : (
              <>
                <SecondSlider>
                  <button name="secondPrev" onClick={decreaseIndex}>
                    &larr;
                  </button>
                  <Category>{secondCategory}</Category>
                  <AnimatePresence
                    initial={false}
                    onExitComplete={toggleSecondCategLeaving}
                  >
                    <Row
                      initial={{ x: width }}
                      animate={{ x: 0 }}
                      exit={{ x: -width - 5 }}
                      transition={{ type: 'tween', duration: 1 }}
                      key={secondCategIndex}
                    >
                      {topRatedMovieData?.results
                        .slice(1)
                        .slice(
                          offset * secondCategIndex,
                          offset * secondCategIndex + offset,
                        )
                        .map((movie) => (
                          <Box
                            layoutId={movie.id + ''}
                            key={movie.id}
                            variants={boxVariants}
                            onClick={() => onBoxClicked(movie.id)}
                            initial="normal"
                            whileHover="hover"
                            transition={{ type: 'tween' }}
                            bgphoto={makeImagePath(movie.backdrop_path)}
                          >
                            <Info variants={infoVariants}>
                              <h4>{movie.title}</h4>
                            </Info>
                          </Box>
                        ))}
                    </Row>
                  </AnimatePresence>
                  <button name="secondNext" onClick={increaseIndex}>
                    &rarr;
                  </button>
                </SecondSlider>
                <AnimatePresence>
                  {bigMovieMatch ? (
                    <>
                      <Overlay
                        onClick={onOverlayClick}
                        height={window.innerHeight}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      ></Overlay>
                      <MovieCard
                        layoutId={bigMovieMatch.params.movieId}
                        style={{ top: scrollY.get() + 100 }}
                      >
                        {clickedMovie && (
                          <>
                            <Poster
                              style={{
                                backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                                  clickedMovie.poster_path,
                                )})`,
                              }}
                              alt=""
                            />
                            <MovieCardTitle>
                              {clickedMovie.title}
                            </MovieCardTitle>
                            <MovieCardOverview>
                              {clickedMovie.overview}
                            </MovieCardOverview>
                          </>
                        )}
                      </MovieCard>
                    </>
                  ) : null}
                </AnimatePresence>
              </>
            )}
            {isLoading_upcoming ? (
              <Loader></Loader>
            ) : (
              <>
                <ThirdSlider>
                  <button name="thirdPrev" onClick={decreaseIndex}>
                    &larr;
                  </button>
                  <Category>{thirdCategory}</Category>
                  <AnimatePresence
                    initial={false}
                    onExitComplete={toggleThirdCategLeaving}
                  >
                    <Row
                      initial={{ x: width }}
                      animate={{ x: 0 }}
                      exit={{ x: -width - 5 }}
                      transition={{ type: 'tween', duration: 1 }}
                      key={thirdCategIndex}
                    >
                      {upcomingMovieData?.results
                        .slice(1)
                        .slice(
                          offset * thirdCategIndex,
                          offset * thirdCategIndex + offset,
                        )
                        .map((movie) => (
                          <Box
                            layoutId={movie.id + ''}
                            key={movie.id}
                            variants={boxVariants}
                            onClick={() => onBoxClicked(movie.id)}
                            initial="normal"
                            whileHover="hover"
                            transition={{ type: 'tween' }}
                            bgphoto={makeImagePath(movie.backdrop_path)}
                          >
                            <Info variants={infoVariants}>
                              <h4>{movie.title}</h4>
                            </Info>
                          </Box>
                        ))}
                    </Row>
                  </AnimatePresence>
                  <button name="thirdNext" onClick={increaseIndex}>
                    &rarr;
                  </button>
                </ThirdSlider>
                <AnimatePresence>
                  {bigMovieMatch ? (
                    <>
                      <Overlay
                        onClick={onOverlayClick}
                        height={window.innerHeight}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      ></Overlay>
                      <MovieCard
                        layoutId={bigMovieMatch.params.movieId}
                        style={{ top: scrollY.get() + 100 }}
                      >
                        {clickedMovie && (
                          <>
                            <Poster
                              style={{
                                backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                                  clickedMovie.poster_path,
                                )})`,
                              }}
                              alt=""
                            />
                            <MovieCardTitle>
                              {clickedMovie.title}
                            </MovieCardTitle>
                            <MovieCardOverview>
                              {clickedMovie.overview}
                            </MovieCardOverview>
                          </>
                        )}
                      </MovieCard>
                    </>
                  ) : null}
                </AnimatePresence>
              </>
            )}
          </SlidersContainer>
        </>
      )}
    </Wrapper>
  );
};

export default Home;
