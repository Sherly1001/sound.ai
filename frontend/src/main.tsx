import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { routers } from './routers/index.tsx';
import stores from './stores/index.tsx';
import { theme } from './theme.ts';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={stores}>
      <ChakraProvider theme={theme}>
        <RouterProvider router={routers} />
      </ChakraProvider>
    </Provider>
  </React.StrictMode>,
);
