import React, { FunctionComponent } from 'react';
import { useParams } from 'react-router-dom';
import { CreateNewLinePage } from './components/CreateNewLinePage'; // eslint-disable-line import/no-cycle
import { Main } from './components/Main';
import { Map } from './components/map';
import { LineDetailsPage } from './components/routes-and-lines/LineDetailsPage';
import { RoutesAndLinesPage } from './components/RoutesAndLinesPage'; // eslint-disable-line import/no-cycle

export enum Path {
  root = '/',
  routes = '/routes',
  createLine = '/routes/createLine',
  lineDetails = '/lines/:id',
  map = '/map',
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
  [Path.createLine]: {
    _routerRoute: Path.createLine,
    _exact: true,
    translationKey: 'lines.createNew',
    getLink: () => Path.createLine,
    component: CreateNewLinePage,
    includeInNav: false,
  },
  [Path.lineDetails]: {
    _routerRoute: Path.lineDetails,
    _exact: true,
    translationKey: 'lines.lineDetails',
    getLink: (id: string) => Path.lineDetails.replace(':id', id),
    component: LineDetailsPage,
    includeInNav: false,
  },
  [Path.map]: {
    _routerRoute: Path.map,
    _exact: true,
    translationKey: 'map.map',
    getLink: () => Path.map,
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
