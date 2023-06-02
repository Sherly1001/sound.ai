import { createBrowserRouter } from 'react-router-dom';
import Login from './Login';
import NotFound from './Notfound';
import Root from './Root';

export const routers = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <NotFound />,
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
