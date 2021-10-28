import React, { FunctionComponent } from 'react';
import { useParams } from 'react-router-dom';
import { Main } from './components/Main';
import { Map } from './components/mapgl-map';
import { RoutesAndLinesPage } from './components/RoutesAndLinesPage'; // eslint-disable-line import/no-cycle

export enum Path {
  root = '/',
  routes = '/routes',
  mapgl = '/mapgl',
  exampleResource = '/example/:id',
  fallback = '*',
}

interface Route {
  _routerRoute: Path;
  _exact?: boolean; // When true, will only match if the path matches the location.pathname exactly.
  translationKey?: string;
  getLink: (...args: any) => string; // eslint-disable-line @typescript-eslint/no-explicit-any
  includeInNav?: boolean;
  component: React.ComponentType;
}

const ExampleResourceRoute: FunctionComponent = () => {
  const { id } = useParams<{ id: string }>();
  return React.createElement(
    'h2',
    null,
    `Example resource route. Resouce id: ${id}`,
  );
};

const FallbackRoute: FunctionComponent = () => {
  return React.createElement('p', null, `404, page not found`);
};

export const routes: Record<Path, Route> = {
  [Path.root]: {
    _routerRoute: Path.root,
    _exact: true,
    translationKey: 'routes.root',
    getLink: () => Path.root,
    component: Main,
    includeInNav: true,
  },
  [Path.routes]: {
    _routerRoute: Path.routes,
    _exact: true,
    translationKey: 'routes.routes',
    getLink: () => Path.routes,
    component: RoutesAndLinesPage,
    includeInNav: true,
  },
  [Path.mapgl]: {
    _routerRoute: Path.mapgl,
    _exact: true,
    translationKey: 'MapGL experiment',
    getLink: () => Path.mapgl,
    // @ts-expect-error Something wrong due to forwardRef used in Map component?
    component: Map,
    includeInNav: true,
  },
  [Path.exampleResource]: {
    _routerRoute: Path.exampleResource,
    getLink: (id: string) => Path.exampleResource.replace(':id', id),
    component: ExampleResourceRoute,
  },
  [Path.fallback]: {
    _routerRoute: Path.fallback,
    getLink: () => '404',
    component: FallbackRoute,
  },
};
