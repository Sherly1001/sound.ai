import { Box, Flex } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../comps/Header';
import Navbar from '../comps/Navbar';

export default function Root() {
  const mainRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const [headerOver, setHeaderOver] = useState(false);

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
        <Box ref={mainRef}>
          <Outlet />
        </Box>
      </Box>
    </Flex>
  );
}
