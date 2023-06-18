import { ReactNode } from 'react';
import {
  NonIndexRouteObject,
  createBrowserRouter,
  createHashRouter,
  generatePath,
} from 'react-router-dom';

export interface Route<T = {}> {
  path: string;
  element: ReactNode;
  errorElement?: ReactNode;
  sampleParams?: T;
}

export function from<A = {}, B = {}>(base: Route<A>, child: Route<B>) {
  const { path, sampleParams, ...others } = child;

  const res: Route<A & B> = {
    path: `${base.path}${path}`.replace(/\/+/g, '/'),
    sampleParams:
      base.sampleParams || sampleParams
        ? Object.assign({}, base.sampleParams, sampleParams)
        : undefined,
    ...others,
  };

  return res;
}

export function build<T>(route: Route<T>, params?: T) {
  return generatePath(route.path, params as any);
}

export function createRoute<T>(route: Route<T>): NonIndexRouteObject {
  const { path, element, errorElement, sampleParams, ...rChildren } = route;

  const children = Object.values(rChildren as Record<string, Route>).map(
    createRoute,
  );

  return {
    path,
    element,
    errorElement,
    children,
  };
}

export function createRouters<T>(
  routes: Record<string, Route<T>>,
  isHashRouter = false,
) {
  const func = isHashRouter ? createHashRouter : createBrowserRouter;
  return func(Object.values(routes).map(createRoute));
}
