import { chakra } from '@chakra-ui/react';
import Rounded from './Rounded';

export default chakra(Rounded, {
  baseStyle: {
    w: ['90vw', '80vw', '75vw', '70vw', '55vw'],
    h: ['60vh', '80vh'],
    top: ['20vh', '10vh'],
    margin: 'auto',
    position: 'relative',
  },
});

