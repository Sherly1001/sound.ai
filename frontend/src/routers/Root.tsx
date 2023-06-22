import { Box, Flex } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../comps/Header';
import Navbar from '../comps/Navbar';
import { useStores } from '../stores';

export default function Root() {
  const mainRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const [headerOver, setHeaderOver] = useState(false);

  const location = useLocation();
  const { historyStore } = useStores();

  useEffect(() => {
    historyStore.push(location.pathname);
  }, [location]);

  useEffect(() => {
    const scroll = () => {
      if (!mainRef.current || !headerRef.current) return;

      setHeaderOver(
        Math.round(mainRef.current.getBoundingClientRect().top) <
          Math.round(headerRef.current.getBoundingClientRect().bottom),
      );
    };

    window.addEventListener('scroll', scroll);

    return () => {
      window.removeEventListener('scroll', scroll);
    };
  }, [mainRef.current, headerRef.current]);

  useEffect(() => {
    if (!headerOver) {
      window.scroll(0, 0);
    }
  }, [headerOver]);

  return (
    <Flex>
      <Navbar />
      <Box flex="1">
        <Header ref={headerRef} headerOver={headerOver} />
        <Box
          ref={mainRef}
          width={['100%', null, null, null, '95%', '90%']}
          margin="auto"
        >
          <Outlet />
        </Box>
      </Box>
    </Flex>
  );
}
