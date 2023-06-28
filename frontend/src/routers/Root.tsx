import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Text,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { routes } from '.';
import Header from '../comps/Header';
import Navbar from '../comps/Navbar';
import { useStores } from '../stores';
import { build } from './route';

export default function Root() {
  const mainRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const [navOpen, setNavOpen] = useState(false);
  const [headerOver, setHeaderOver] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { historyStore, userStore } = useStores();

  useEffect(() => {
    historyStore.push(location.pathname);
  }, [location]);

  useEffect(() => {
    if (!userStore.user) {
      navigate(build(routes.login));
    }
  }, [userStore]);

  useEffect(() => {
    let lastScroll = 0;
    const scroll = () => {
      if (!mainRef.current || !headerRef.current) return;

      const mainTop = Math.round(mainRef.current.getBoundingClientRect().top);
      const headerBottom = Math.round(
        headerRef.current.getBoundingClientRect().bottom,
      );

      const headerPadding = Number(
        getComputedStyle(headerRef.current).paddingBottom.replace('px', ''),
      );

      let add = 0;
      if (lastScroll <= window.scrollY) {
        add = headerPadding;
      }

      lastScroll = window.scrollY;

      setHeaderOver(mainTop < headerBottom + add);
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

  const username = 'Username';

  return (
    <Flex>
      <Drawer
        isOpen={navOpen}
        onClose={() => setNavOpen(false)}
        placement="left"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>
            <DrawerCloseButton />
            <Text fontSize="2xl" fontWeight="bold" color="black">
              Hello, {username}
            </Text>
          </DrawerHeader>
          <DrawerBody padding={0} margin={0}>
            <Navbar />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <Box display={{ base: 'none', md: 'block' }}>
        <Navbar />
      </Box>
      <Box flex="1">
        <Header
          ref={headerRef}
          headerOver={headerOver}
          toggleNav={() => setNavOpen(!navOpen)}
        />
        <Box
          ref={mainRef}
          width={{ base: '100vw', md: '100%', lg: '95%', xl: '90%' }}
          paddingBottom={{ base: '8', md: 'unset' }}
          margin="auto"
          overflow="auto"
        >
          <Outlet />
        </Box>
      </Box>
    </Flex>
  );
}
