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
  path: '/models/:id?',
  element: <Models />,
  sampleParams: {
    id: 'uuid',
  },
});

const devices = from(home, {
  path: '/devices/:id?',
  element: <Devices />,
  sampleParams: {
    id: 'uuid',
  },
});

const settings = from(home, {
  path: '/settings',
  element: <Settings />,
});

const login: Route = {
  path: '/login',
  element: <Login register={true} />,
};

const register: Route = {
  path: '/register',
  element: <Login />,
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

export const routers = createRouters(routes);
