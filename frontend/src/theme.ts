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
      '::-webkit-scrollbar': {
        width: '1',
      },
      '::-webkit-scrollbar-track': {
        background: '#F2F2F2',
      },
      '::-webkit-scrollbar-thumb': {
        background: '#BDBDBD',
      },
      '::-webkit-scrollbar-thumb:hover': {
        background: '#6E6E6E',
      },
    }),
  },
});
