import { Link, useMatch } from 'react-router-dom';
import styled from 'styled-components';
import { motion, useAnimation, useViewportScroll } from 'framer-motion';
import { useEffect, useState } from 'react';

const Nav = styled(motion.nav)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  width: 100%;
  height: 80px;
  color: #fff;
  box-sizing: border-box;
  padding: 1rem;
`;

const Col = styled.div`
  display: flex;
  margin-right: 50px;
  align-items: center;
`;

const Logo = styled(motion.svg)`
  width: 200px;
`;

const Items = styled.ul`
  display: flex;
  align-items: center;
`;

const Item = styled.li`
  margin-right: 20px;
  transition: color 0.3s ease-in-out;
  position: relative;
`;

const Underline = styled(motion.span)`
  width: 1.5rem;
  border-bottom: solid 2px #fff;
  position: absolute;
  left: 0;
  right: 0;
  bottom: -5px;
  margin: 0 auto;
`;

const Search = styled.span`
  color: white;
  display: flex;
  align-items: center;
  position: relative;
  svg {
    height: 25px;
  }
`;

const Input = styled(motion.input)`
  transform-origin: right center;
  position: absolute;
  left: -150px;
  padding: 0.5rem 0.3rem 0.5rem 1.5rem;
`;

const logoVariants = {
  normal: {
    fillOpacity: 1,
  },
  active: {
    fillOpacity: [0.5, 1, 0.5],
    transition: {
      repeat: Infinity,
    },
  },
};

const navVariants = {
  top: {
    backgroundColor: 'rgba(0,0,0,0)',
  },
  scroll: {
    backgroundColor: 'rgba(0,0,0,1)',
  },
};

const Header = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const homeMatch = useMatch('/');
  const tvMatch = useMatch('/tv');
  const inputAnimation = useAnimation();
  const navAnimation = useAnimation();
  const { scrollY } = useViewportScroll();

  const toggleSearch = () => {
    if (searchOpen) {
      inputAnimation.start({
        scaleX: 0,
      });
    } else {
      inputAnimation.start({ scaleX: 1 });
    }
    setSearchOpen((prev) => !prev);
  };

  useEffect(() => {
    scrollY.onChange(() => {
      if (scrollY.get() < 60) {
        navAnimation.start('top');
      } else {
        navAnimation.start('scroll');
      }
    });
  }, [scrollY, navAnimation]);

  return (
    <Nav variants={navVariants} animate={navAnimation} initial={'top'}>
      <Col>
        <Logo
          variants={logoVariants}
          initial="normal"
          whileHover="active"
          version="1.0"
          xmlns="http://www.w3.org/2000/svg"
          width="300.000000pt"
          height="87.000000pt"
          viewBox="0 0 300.000000 87.000000"
          preserveAspectRatio="xMidYMid meet"
        >
          <motion.g
            transform="translate(0.000000,87.000000) scale(0.050000,-0.050000)"
            fill="#fdd853"
            stroke="#000000"
          >
            <motion.path
              d="M3973 1607 c-29 -30 -14 -222 19 -235 107 -41 168 2 168 118 0 110
-119 184 -187 117z"
            />
            <motion.path
              d="M3624 1556 c-40 -40 -33 -934 7 -992 35 -49 132 -61 162 -19 33 45 2
993 -33 1015 -42 27 -107 25 -136 -4z"
            />
            <motion.path
              d="M5693 1366 c-8 -8 -114 -20 -235 -27 -347 -20 -382 -61 -374 -444 8
-328 30 -360 267 -372 150 -7 151 -8 145 -60 -6 -53 -7 -53 -202 -59 -217 -6
-269 -41 -215 -141 48 -90 501 -51 580 50 50 64 56 217 10 283 -29 40 -29 45
0 56 26 10 31 54 31 265 0 244 2 254 45 273 60 26 62 124 3 163 -22 15 -47 21
-55 13z m-225 -218 c27 -10 32 -50 32 -231 l0 -219 -105 6 -105 6 -6 213 c-5
191 -2 215 30 223 56 14 120 15 154 2z"
            />
            <motion.path
              d="M390 1341 c-176 -42 -186 -65 -192 -453 -5 -358 -3 -368 91 -368 104
0 113 27 111 323 -1 147 -2 279 -1 293 1 19 28 24 96 20 l95 -6 10 -310 10
-310 80 0 80 0 10 310 10 310 95 6 95 6 0 -298 c0 -332 7 -352 124 -340 l66 6
5 345 c6 342 5 346 -42 394 -84 84 -260 114 -379 64 -52 -22 -75 -22 -124 -1
-66 29 -147 32 -240 9z"
            />
            <motion.path
              d="M1530 1342 c-167 -43 -190 -94 -190 -424 0 -301 14 -337 151 -389
172 -66 379 -13 444 113 33 65 33 511 0 577 -51 101 -254 163 -405 123z m230
-410 l0 -228 -71 -13 c-143 -27 -149 -16 -149 240 l0 229 110 0 110 0 0 -228z"
            />
            <motion.path
              d="M2268 1340 c-149 -46 -168 -93 -168 -408 0 -325 9 -349 149 -403 174
-66 381 -14 446 113 33 65 33 511 0 577 -53 104 -276 167 -427 121z m242 -408
l0 -219 -56 -18 c-137 -46 -154 -20 -154 236 l0 231 105 -6 105 -6 0 -218z"
            />
            <motion.path
              d="M4506 1342 c-180 -46 -189 -70 -182 -492 l6 -320 66 -6 c117 -12 126
11 124 314 -1 150 -2 284 -1 298 1 19 30 24 106 20 l105 -6 2 -282 c2 -335 5
-348 93 -348 108 0 115 19 115 335 0 322 -21 404 -115 453 -74 38 -235 55
-319 34z"
            />
            <motion.path
              d="M2827 1308 c-12 -31 57 -505 96 -654 63 -246 406 -202 463 60 71 320
102 588 72 607 -87 56 -165 13 -184 -101 -98 -579 -91 -553 -139 -535 -17 7
-43 115 -73 308 -25 163 -55 308 -66 322 -30 37 -155 32 -169 -7z"
            />
            <motion.path
              d="M3960 966 c0 -398 13 -446 119 -446 89 0 94 24 82 420 l-11 370 -95
6 -95 6 0 -356z"
            />
          </motion.g>
        </Logo>
        <Items>
          <Item>
            <Link to="/">
              Home
              {homeMatch?.pathname === '/' && (
                <Underline layoutId="underline" />
              )}
            </Link>
          </Item>
          <Item>
            <Link to="tv">
              TV Shows
              {tvMatch?.pathname === '/tv' && (
                <Underline layoutId="underline" />
              )}
            </Link>
          </Item>
        </Items>
      </Col>
      <Col>
        <Search>
          <motion.svg
            onClick={toggleSearch}
            animate={{ x: searchOpen ? -180 : 0 }}
            transition={{ type: 'linear' }}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            ></path>
          </motion.svg>
          <Input
            animate={inputAnimation}
            initial={{ scaleX: 0 }}
            transition={{ type: 'linear' }}
            type="text"
            placeholder="Search for movies or tv shows"
          />
        </Search>
      </Col>
    </Nav>
  );
};

export default Header;
