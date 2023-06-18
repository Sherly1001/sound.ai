import { ReactNode } from 'react';
import { Link as RLink } from 'react-router-dom';
import { Route, build } from '../routers/route';

export interface LinkProps<T = {}> {
  to: Route<T>;
  params?: T;
  children?: ReactNode;
}

export default function Link<T>({ to, params, children }: LinkProps<T>) {
  const path = build(to, params);
  return <RLink to={path}>{children}</RLink>;
}
