import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  colors: {
    background: '#EAF0F9',
    white: '#FFFFFF',
    black: '#252733',
    blue: '#6B97C8',
    darkBlue: '#4d78a8',
    gray: '#A3A3A3',
    holder: '#EAF0F9',
    holderText: '#90A0B7',
  },

  styles: {
    global: (_props: any) => ({
      body: {
        bg: 'background',
      },
    }),
  },
});
