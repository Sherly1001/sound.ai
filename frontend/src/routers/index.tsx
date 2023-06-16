import { createBrowserRouter } from 'react-router-dom';
import { links } from '../utils/const';
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
    path: links.home(),
    element: <Root />,
    errorElement: <NotFound />,
    children: [
      {
        path: links.home(),
        element: <Dashboard />,
      },
      {
        path: links.home.records(),
        element: <Records />,
      },
      {
        path: links.home.models(),
        element: <Models />,
      },
      {
        path: links.home.devices(),
        element: <Devices />,
      },
      {
        path: links.home.settings(),
        element: <Settings />,
      },
    ],
  },
  {
    path: links.login(),
    element: <Login />,
  },
  {
    path: links.register(),
    element: <Login register={true} />,
  },
]);
