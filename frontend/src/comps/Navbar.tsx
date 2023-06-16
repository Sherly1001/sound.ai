import {
  faFloppyDisk,
  faGear,
  faList,
  faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';
import { facDashboard, facDeepLearning, facRighRect } from '../custom-icons';

import { Box, Button, Flex, Image, Text } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useLocation } from 'react-router-dom';
import { links } from '../utils/const';

export default function Navbar() {
  const location = useLocation();

  const navLinks = [
    {
      to: links.home(),
      icon: facDashboard,
      name: 'Dashboard',
    },
    {
      to: links.home.records(),
      icon: faList,
      name: 'Records',
    },
    {
      to: links.home.models(),
      icon: facDeepLearning,
      name: 'Models',
    },
    {
      to: links.home.devices(),
      icon: faFloppyDisk,
      name: 'Devices',
    },
    {
      to: links.home.settings(),
      icon: faGear,
      name: 'Settings',
    },
  ];

  return (
    <Flex
      minW="240px"
      height="100vh"
      padding="1em"
      top="0"
      position="sticky"
      background="white"
      boxShadow="0px 0px 4px 0px #00000040"
      direction="column"
      userSelect="none"
    >
      <Link to={links.home()}>
        <Image src="/logo.png" width="50%" margin="0 auto" />
      </Link>
      <Link to={links.home()}>
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
            color={li.to == location.pathname ? 'red.600' : 'messenger.900'}
            fontSize="xl"
            marginBottom=".5em"
            position="relative"
            _hover={{
              color: li.to != location.pathname ? 'messenger.400' : '',
            }}
          >
            <FontAwesomeIcon icon={li.icon} /> {li.name}
            {li.to == location.pathname && (
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
      >
        Logout
      </Button>
    </Flex>
  );
}
