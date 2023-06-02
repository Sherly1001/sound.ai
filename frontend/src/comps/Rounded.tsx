import { Box, chakra } from '@chakra-ui/react';

export default chakra(Box, {
  baseStyle: {
    bg: 'white',
    w: ['90vw', '80vw', '75vw', '70vw', '55vw'],
    h: ['60vh', '80vh'],
    top: ['20vh', '10vh'],
    margin: 'auto',
    position: 'relative',
    boxShadow: '0px 0px 4px 0px #00000040',
    borderRadius: '8',
  },
});
