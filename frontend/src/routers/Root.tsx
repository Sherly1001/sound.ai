import { Box } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';

export default function Root() {
  return (
    <Box background="background">
      <Outlet />
    </Box>
  );
}
