import {
  faFloppyDisk,
  faGear,
  faList,
  faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';
import { facDashboard, facDeepLearning, facRighRect } from '../custom-icons';

import { Box, Button, Flex, Image, Text } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { routes } from '../routers';
import { build } from '../routers/route';
import { useStores } from '../stores';
import Link from './Link';

export default function Navbar() {
  const location = useLocation();

  const { userStore } = useStores();

  const onLogout = useCallback(() => {
    userStore.logout();
  }, [userStore]);

  const navLinks = [
    {
      to: routes.home,
      icon: facDashboard,
      name: 'Dashboard',
    },
    {
      to: routes.home.records,
      icon: faList,
      name: 'Records',
    },
    {
      to: routes.home.models,
      icon: facDeepLearning,
      name: 'Models',
    },
    {
      to: routes.home.devices,
      icon: faFloppyDisk,
      name: 'Devices',
    },
    {
      to: routes.home.settings,
      icon: faGear,
      name: 'Settings',
    },
  ];

  return (
    <Flex
      minW="240px"
      padding="1em"
      top="0"
      background="white"
      boxShadow="0px 0px 4px 0px #00000040"
      direction="column"
      userSelect="none"
      height={{ base: '100%', md: '100vh' }}
      position={{ md: 'sticky' }}
    >
      <Link to={routes.home}>
        <Image src="/logo.png" width="50%" margin="0 auto" />
      </Link>
      <Link to={routes.home}>
        <Text fontSize="4xl" textAlign="center" color="pink.600">
          Sound.AI
        </Text>
      </Link>
      <Box
        width="50%"
        margin="0 auto"
        height="1px"
        borderBottom="2px solid #EBEBEB"
        marginBottom="1em"
      />
      {navLinks.map((li, id) => (
        <Link to={li.to} key={id}>
          <Text
            color={
              build(li.to) == location.pathname ? 'red.600' : 'messenger.900'
            }
            fontSize="xl"
            marginBottom=".5em"
            position="relative"
            _hover={{
              color: build(li.to) != location.pathname ? 'messenger.400' : '',
            }}
          >
            <FontAwesomeIcon icon={li.icon} /> {li.name}
            {build(li.to) == location.pathname && (
              <Text
                as="span"
                position="absolute"
                top="50%"
                right="-1rem"
                transform="translateY(-50%)"
                pointerEvents="none"
              >
                <FontAwesomeIcon icon={facRighRect} />
              </Text>
            )}
          </Text>
        </Link>
      ))}
      <Button
        leftIcon={<FontAwesomeIcon icon={faRightFromBracket} />}
        marginTop="auto"
        color="messenger.900"
        _hover={{
          color: 'messenger.400',
        }}
        onClick={() => onLogout()}
      >
        Logout
      </Button>
    </Flex>
  );
}
