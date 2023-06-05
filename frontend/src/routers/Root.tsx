import { Box, Flex } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Navbar from '../comps/Navbar';

export default function Root() {
  return (
    <Flex>
      <Navbar />
      <Box flex="1">
        <Outlet />
      </Box>
    </Flex>
  );
}
