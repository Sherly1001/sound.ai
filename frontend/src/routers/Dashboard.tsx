import { Box } from '@chakra-ui/react';
import { useEffect } from 'react';

export default function Dashboard() {
  useEffect(() => {
    document.title = 'Dashboard';
  }, []);

  return <Box height="120vh"></Box>;
}
