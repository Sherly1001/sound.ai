import { ReactNode } from 'react';
import { Link as RLink } from 'react-router-dom';
import { Route, build } from '../routers/route';

export interface LinkProps<T = {}> {
  to: Route<T>;
  params?: T;
  queries?: Record<string, any>;
  disable?: boolean;
  children?: ReactNode;
}

export default function Link<T>({
  to,
  params,
  queries,
  disable = false,
  children,
}: LinkProps<T>) {
  const path = build(to, params, queries);
  return disable ? <>{children}</> : <RLink to={path}>{children}</RLink>;
}
