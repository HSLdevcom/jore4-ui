export enum Path {
  root = '/',
  routes = '/routes',
  routesSearch = '/routes/search',
  editRoute = '/routes/:id/edit',
  createLine = '/lines/create',
  lineDetails = '/lines/:id',
  lineDrafts = '/lines/:label/drafts',
  editLine = '/lines/:id/edit',
  exampleResource = '/example/:id',
  fallback = '*',
}

interface RouteDetail {
  getLink: (...args: string[]) => string;
  translationKey?: string;
  includeInNav?: boolean;
}

export const routeDetails: Record<Path, RouteDetail> = {
  [Path.root]: {
    getLink: () => Path.root,
    translationKey: 'routes.root',
    includeInNav: true,
  },
  [Path.routes]: {
    getLink: () => Path.routes,
    translationKey: 'routes.routes',
    includeInNav: true,
  },
  [Path.routesSearch]: {
    getLink: () => Path.routesSearch,
    translationKey: 'routes.routesSearchResult',
    includeInNav: false,
  },
  [Path.editRoute]: {
    getLink: (id: string) => Path.editRoute.replace(':id', id),
    translationKey: 'routes.editRoute',
    includeInNav: false,
  },
  [Path.createLine]: {
    getLink: () => Path.createLine,
    translationKey: 'lines.createNew',
    includeInNav: false,
  },
  [Path.lineDetails]: {
    getLink: (id: string) => Path.lineDetails.replace(':id', id),
    translationKey: 'lines.lineDetails',
    includeInNav: false,
  },
  [Path.lineDrafts]: {
    getLink: (label: string) => Path.lineDrafts.replace(':label', label),
    translationKey: 'lines.lineDrafts',
    includeInNav: false,
  },
  [Path.editLine]: {
    getLink: (id: string) => Path.editLine.replace(':id', id),
    translationKey: 'lines.editLine',
    includeInNav: false,
  },
  [Path.exampleResource]: {
    getLink: (id: string) => Path.exampleResource.replace(':id', id),
  },
  [Path.fallback]: {
    getLink: () => '404',
    translationKey: '404',
  },
};
