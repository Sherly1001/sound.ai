import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  colors: {
    background: '#EAF0F9',
    white: '#FFFFFF',
    black: '#10172A',
  },

  styles: {
    global: (_props: any) => ({
      body: {
        bg: 'background',
      },
    }),
  },
});
