import qs from 'qs';
import { QueryParameterName } from '../hooks/urlQuery/useUrlQuery';

export enum Path {
  root = '/',

  // Main pages
  routes = '/routes',
  stopRegistry = '/stop-registry',
  timetables = '/timetables',

  // Routes and lines
  routesSearch = '/routes/search',
  editRoute = '/routes/:id/edit',
  createLine = '/lines/create',
  lineDetails = '/lines/:id',
  lineDrafts = '/lines/:label/drafts',
  editLine = '/lines/:id/edit',

  // Stop registry
  // stopSearch = '/stop-registry/stops/search',
  stopDetails = '/stop-registry/stops/:id',
  // stopVersions = '/stop-registry/stops/:id/versions',
  // stopChangeHistory = '/stop-registry/stops/:id/history',
  // terminalDetails = '/stop-registry/terminals/:id',
  // stopAreaDetails = '/stop-registry/stop-areas/:id',

  // Timetables
  timetablesSearch = '/timetables/search',
  lineTimetables = '/timetables/lines/:id',
  timetablesImport = '/timetables/import',
  timetablesImportPreview = '/timetables/import/preview',
  lineTimetableVersions = '/timetables/lines/:label/versions',
  substituteOperatingPeriodSettings = '/timetables/settings',

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

  // Main pages.
  // Note: the order in which these are declared here controls the display order in navigation bar.
  [Path.stopRegistry]: {
    getLink: () => Path.stopRegistry,
    translationKey: 'stops.stops',
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

  // Routes and lines
  [Path.routesSearch]: {
    getLink: () => Path.routesSearch,
    translationKey: 'routes.routesSearchResult',
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

  // Stop registry
  [Path.stopDetails]: {
    getLink: (id: string) => Path.stopDetails.replace(':id', id),
    translationKey: 'stops.stop',
    includeInNav: false,
  },

  // Timetables
  [Path.timetablesSearch]: {
    getLink: () => Path.timetablesSearch,
    translationKey: 'routes.timetablesSearchResult',
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
    translationKey: 'import.importPreview',
  },
  [Path.lineTimetableVersions]: {
    getLink: (label: string) =>
      Path.lineTimetableVersions.replace(':label', label),
    includeInNav: false,
  },
  [Path.substituteOperatingPeriodSettings]: {
    getLink: () => Path.substituteOperatingPeriodSettings,
    translationKey: 'timetables.settings',
    includeInNav: false,
  },

  [Path.fallback]: {
    getLink: () => '404',
    translationKey: '404',
  },
};
