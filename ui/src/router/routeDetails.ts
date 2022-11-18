import qs from 'qs';

export enum Path {
  root = '/',
  routes = '/routes',
  timetables = '/timetables',
  routesSearch = '/routes/search',
  timetablesSearch = '/timetables/search',
  editRoute = '/routes/:id/edit',
  createLine = '/lines/create',
  lineDetails = '/lines/:id',
  lineDrafts = '/lines/:label/drafts',
  editLine = '/lines/:id/edit',
  lineTimetables = '/timetables/lines/:id',
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
  [Path.timetables]: {
    getLink: () => Path.timetables,
    translationKey: 'timetables.timetables',
    includeInNav: true,
  },
  [Path.routesSearch]: {
    getLink: () => Path.routesSearch,
    translationKey: 'routes.routesSearchResult',
    includeInNav: false,
  },
  [Path.timetablesSearch]: {
    getLink: () => Path.timetablesSearch,
    translationKey: 'routes.timetablesSearchResult',
    includeInNav: false,
  },
  [Path.editRoute]: {
    getLink: (id: string, observationIsoDate: string) =>
      `${Path.editRoute.replace(':id', id)}?${qs.stringify({
        observationDate: observationIsoDate,
      })}`,
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
  [Path.lineTimetables]: {
    getLink: (id: string) => Path.lineTimetables.replace(':id', id),
    includeInNav: false,
  },
  [Path.fallback]: {
    getLink: () => '404',
    translationKey: '404',
  },
};
