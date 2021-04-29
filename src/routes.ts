import { Main } from 'components/Main';
import React from 'react';
import { useParams } from 'react-router-dom';

enum Path {
  root = '/',
  example = '/example',
  exampleResource = '/example/:id',
}

interface Route {
  _routerRoute: string;
  _exact?: boolean;
  getLink: (...args: any) => string; // eslint-disable-line @typescript-eslint/no-explicit-any
  includeInNav?: boolean;
  component: React.ComponentType;
}

function ExampleRoute() {
  return React.createElement('h2', null, 'Example route');
}

function ExampleResourceRoute() {
  const { id } = useParams<{ id: string }>();
  return React.createElement(
    'h2',
    null,
    `Example resource route. Resouce id: ${id}`,
  );
}

export const routes: Record<Path, Route> = {
  [Path.root]: {
    _routerRoute: Path.root,
    _exact: true,
    getLink: () => Path.root,
    component: Main,
  },
  [Path.example]: {
    _routerRoute: Path.example,
    _exact: true,
    getLink: () => Path.example,
    component: ExampleRoute,
  },
  [Path.exampleResource]: {
    _routerRoute: Path.exampleResource,
    getLink: (id: string) => Path.exampleResource.replace(':id', id),
    component: ExampleResourceRoute,
  },
};
