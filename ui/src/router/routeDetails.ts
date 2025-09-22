import { DateTime } from 'luxon';
import qs from 'qs';
import { QueryParameterName } from '../hooks/urlQuery';
import { TranslationKey } from '../i18n';

export const Path = {
  root: '/',

  // Main pages
  routes: '/routes',
  stopRegistry: '/stop-registry',
  timetables: '/timetables',
  map: '/map',

  // Routes and lines
  routesSearch: '/routes/search',
  editRoute: '/routes/:id/edit',
  createLine: '/lines/create',
  lineDetails: '/lines/:id',
  lineDrafts: '/lines/:label/drafts',
  editLine: '/lines/:id/edit',

  // Stop registry
  stopSearch: '/stop-registry/search',
  stopDetails: '/stop-registry/stops/:label',
  stopVersions: '/stop-registry/stops/:label/versions',
  // stopChangeHistory : '/stop-registry/stops/:label/history',
  terminalDetails: '/stop-registry/terminals/:privateCode',
  stopAreaDetails: '/stop-registry/stop-areas/:id',

  // Timetables
  timetablesSearch: '/timetables/search',
  lineTimetables: '/timetables/lines/:id',
  timetablesImport: '/timetables/import',
  timetablesImportPreview: '/timetables/import/preview',
  lineTimetableVersions: '/timetables/lines/:label/versions',
  substituteOperatingPeriodSettings: '/timetables/settings',

  fallback: '*',
} as const;

export type PathValue = (typeof Path)[keyof typeof Path];
type QueryParams = Partial<
  Readonly<
    Record<QueryParameterName, string | number | boolean | DateTime | undefined>
  >
>;
type GetLinkFn = (id?: string | null, queryParams?: QueryParams) => string;

function genVariableLinkGenerator(
  path: PathValue,
  idField: string = ':id',
): GetLinkFn {
  return (id?: string | null, queryParams?: QueryParams) => {
    if (!id) {
      return '/404';
    }

    const search = queryParams
      ? qs.stringify(queryParams, {
          filter: (_prefix, value) => {
            if (value instanceof DateTime) {
              return value.toISODate();
            }

            return value;
          },
          addQueryPrefix: true,
        })
      : '';
    const withId = id ? path.replace(idField, id) : path;
    return `${withId}${search}`;
  };
}

type NavigationRoute = {
  readonly getLink: GetLinkFn;
  readonly translationKey: TranslationKey; // Currently only needed if the route is included in navigation.
  readonly includeInNav: true;
};

type NonNavigationRoute = {
  readonly getLink: GetLinkFn;
  readonly translationKey?: never;
  readonly includeInNav?: false;
};

type RouteDetails = NavigationRoute | NonNavigationRoute;

export function isNavigationRoute(
  route: RouteDetails,
): route is NavigationRoute {
  return route.includeInNav === true;
}

export const routeDetails: Readonly<Record<PathValue, RouteDetails>> = {
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
  [Path.map]: {
    getLink: () => Path.map,
  },

  // Routes and lines
  [Path.routesSearch]: {
    getLink: () => Path.routesSearch,
    includeInNav: false,
  },
  [Path.editRoute]: {
    getLink: genVariableLinkGenerator(Path.editRoute),
    includeInNav: false,
  },
  [Path.createLine]: {
    getLink: () => Path.createLine,
    includeInNav: false,
  },
  [Path.lineDetails]: {
    getLink: genVariableLinkGenerator(Path.lineDetails),
    includeInNav: false,
  },
  [Path.lineDrafts]: {
    getLink: genVariableLinkGenerator(Path.lineDrafts, ':label'),
    includeInNav: false,
  },
  [Path.editLine]: {
    getLink: genVariableLinkGenerator(Path.editLine),
    includeInNav: false,
  },

  // Stop registry
  [Path.stopSearch]: {
    getLink: () => Path.stopSearch,
    includeInNav: false,
  },
  [Path.stopDetails]: {
    getLink: genVariableLinkGenerator(Path.stopDetails, ':label'),
    includeInNav: false,
  },
  [Path.stopVersions]: {
    getLink: genVariableLinkGenerator(Path.stopVersions, ':label'),
    includeInNav: false,
  },
  [Path.stopAreaDetails]: {
    getLink: genVariableLinkGenerator(Path.stopAreaDetails),
    includeInNav: false,
  },
  [Path.terminalDetails]: {
    getLink: genVariableLinkGenerator(Path.terminalDetails, ':privateCode'),
    includeInNav: false,
  },

  // Timetables
  [Path.timetablesSearch]: {
    getLink: () => Path.timetablesSearch,
    includeInNav: false,
  },
  [Path.lineTimetables]: {
    getLink: genVariableLinkGenerator(Path.lineTimetables),
    includeInNav: false,
  },
  [Path.timetablesImport]: {
    getLink: () => Path.timetablesImport,
    includeInNav: false,
  },
  [Path.timetablesImportPreview]: {
    getLink: () => Path.timetablesImportPreview,
    includeInNav: false,
  },
  [Path.lineTimetableVersions]: {
    getLink: genVariableLinkGenerator(Path.lineTimetableVersions, ':label'),
    includeInNav: false,
  },
  [Path.substituteOperatingPeriodSettings]: {
    getLink: () => Path.substituteOperatingPeriodSettings,
    includeInNav: false,
  },

  [Path.fallback]: {
    getLink: () => '404',
    includeInNav: false,
  },
} as const;
