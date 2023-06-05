import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  colors: {
    background: '#EAF0F9',
    white: '#FFFFFF',
    black: '#10172A',
    blue: '#6B97C8',
    darkBlue: '#4d78a8',
    red: '#C03764',
    gray: '#A3A3A3',
    holder: '#EAF0F9',
    holderText: '#90A0B7',
    link: '#0A4B65',
    linkLight: '#118fc2',
    magenta: '#BC388E',
  },

  styles: {
    global: (_props: any) => ({
      body: {
        bg: 'background',
      },
    }),
  },
});
