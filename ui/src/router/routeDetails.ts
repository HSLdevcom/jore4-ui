import qs from 'qs';
import { QueryParameterName } from '../hooks/urlQuery/useUrlQuery';

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
  timetablesImport = '/timetables/import',
  timetablesImportPreview = '/timetables/import/preview',
  fallback = '*',
}

interface RouteDetail {
  getLink: (...args: ExplicitAny[]) => string;
  translationKey?: string;
  includeInNav?: boolean;
}

const getLineIdRouteLabelLink = (
  path: Path,
  lineId: UUID,
  routeLabel?: string,
) => {
  const searchQuery = routeLabel
    ? `?${qs.stringify({
        [QueryParameterName.RouteLabels]: routeLabel,
      })}`
    : '';

  return `${path.replace(':id', lineId)}${searchQuery}`;
};

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
        [QueryParameterName.ObservationDate]: observationIsoDate,
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
    getLink: (id: string, routeLabel?: string) =>
      getLineIdRouteLabelLink(Path.lineDetails, id, routeLabel),
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
    getLink: (id: string, routeLabel?: string) =>
      getLineIdRouteLabelLink(Path.lineTimetables, id, routeLabel),
    includeInNav: false,
  },
  [Path.timetablesImport]: {
    getLink: () => Path.timetablesImport,
    translationKey: 'timetables.import',
    includeInNav: false,
  },
  [Path.timetablesImportPreview]: {
    getLink: () => Path.timetablesImportPreview,
    translationKey: 'timetables.importPreview',
    includeInNav: false,
  },
  [Path.fallback]: {
    getLink: () => '404',
    translationKey: '404',
  },
};
