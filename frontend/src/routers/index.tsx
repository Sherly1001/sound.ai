import { createBrowserRouter } from 'react-router-dom';
import Dashboard from './Dashboard';
import Devices from './Devices';
import Login from './Login';
import Models from './Models';
import NotFound from './Notfound';
import Records from './Records';
import Root from './Root';
import Settings from './Settings';

export const routers = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <NotFound />,
    children: [
      {
        path: '/',
        element: <Dashboard />,
      },
      {
        path: '/records',
        element: <Records />,
      },
      {
        path: '/models',
        element: <Models />,
      },
      {
        path: '/devices',
        element: <Devices />,
      },
      {
        path: '/settings',
        element: <Settings />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Login register={true} />,
  },
]);
