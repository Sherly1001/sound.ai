import { Box, Button, Flex, Image, Text } from '@chakra-ui/react';
import {
  faFloppyDisk,
  faGear,
  faList,
  faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useLocation } from 'react-router-dom';
import { facDashboard } from '../custom-icons/dashboard';
import { facDeepLearning } from '../custom-icons/deep-learing';
import { facRighRect } from '../custom-icons/right-rect';

export default function Navbar() {
  const location = useLocation();

  const links = [
    {
      to: '/',
      icon: facDashboard,
      name: 'Dashboard',
    },
    {
      to: '/records',
      icon: faList,
      name: 'Records',
    },
    {
      to: '/models',
      icon: facDeepLearning,
      name: 'Models',
    },
    {
      to: '/devices',
      icon: faFloppyDisk,
      name: 'Devices',
    },
    {
      to: '/settings',
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
      <Link to="/">
        <Image src="/logo.png" width="50%" margin="0 auto" />
      </Link>
      <Link to="/">
        <Text fontSize="4xl" textAlign="center" color="magenta">
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
      {links.map((li, id) => (
        <Link to={li.to} key={id}>
          <Text
            color={li.to == location.pathname ? 'red' : 'link'}
            fontSize="xl"
            marginBottom=".5em"
            position="relative"
            _hover={{
              color: li.to != location.pathname ? 'linkLight' : '',
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
        color="link"
        _hover={{
          color: 'linkLight',
        }}
      >
        Logout
      </Button>
    </Flex>
  );
}
