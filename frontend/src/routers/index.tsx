import { HASH_ROUTE } from '../utils/const';
import Dashboard from './Dashboard';
import Devices from './Devices';
import Login from './Login';
import Models from './Models';
import NotFound from './Notfound';
import Records from './Records';
import Root from './Root';
import Settings from './Settings';
import { Route, createRouters, from } from './route';

const home: Route = {
  path: '/',
  element: <Root />,
  errorElement: <NotFound />,
};

const dashboard = from(home, {
  path: '/',
  element: <Dashboard />,
});

const records = from(home, {
  path: '/records/:id?',
  element: <Records />,
  sampleParams: {
    id: 'uuid',
  },
});

const models = from(home, {
  path: '/models',
  element: <Models />,
});

const devices = from(home, {
  path: '/devices',
  element: <Devices />,
});

const settings = from(home, {
  path: '/settings',
  element: <Settings />,
});

const login: Route = {
  path: '/login',
  element: <Login />,
};

const register: Route = {
  path: '/register',
  element: <Login register={true} />,
};

export const routes = {
  home: Object.assign(home, {
    dashboard,
    records,
    models,
    devices,
    settings,
  }),
  login,
  register,
};

export const routers = createRouters(routes, HASH_ROUTE);
