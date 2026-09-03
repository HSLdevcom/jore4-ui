import compact from 'lodash/compact';
import {
  FC,
  PropsWithChildren,
  ReactElement,
  useEffect,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  Navigate,
  Outlet,
  RouteObject,
  RouterProvider,
  createBrowserRouter,
  useLocation,
} from 'react-router';
import { getUserInfo } from '../api/user';
import { TaskListDisplay } from '../components/common/AsyncTaskList';
import { PageTitle } from '../components/common/Jore';
import { SearchResultPage } from '../components/common/Jore/RouteLineSearch/SearchResultPage';
import { Navbar } from '../components/common/Navbar';
import { NavigationBlocker } from '../components/forms/common/NavigationBlocker';
import { LineChangeHistoryPage } from '../components/LinesAndRoutes/Lines/ChangeHistory/LineChangeHistoryPage';
import { CreateNewLinePage } from '../components/LinesAndRoutes/Lines/Create/CreateNewLinePage';
import { LineDetailsPage } from '../components/LinesAndRoutes/Lines/Details/LineDetailsPage';
import { LineDraftsPage } from '../components/LinesAndRoutes/Lines/Drafts/LineDraftsPage';
import { EditLinePage } from '../components/LinesAndRoutes/Lines/Edit/EditLinePage';
import { RoutesAndLinesMainPage } from '../components/LinesAndRoutes/MainPage/RoutesAndLinesMainPage';
import { EditRoutePage } from '../components/LinesAndRoutes/Routes/EditRoute/EditRoutePage';
import { RouteVersionsPage } from '../components/LinesAndRoutes/Routes/RouteVersions';
import { MainPage } from '../components/main/MainPage';
import { MapPage } from '../components/map';
import {
  StopDetailsPage,
  StopSearchResultPage,
} from '../components/stop-registry';
import { StopAreaChangeHistoryPage } from '../components/stop-registry/StopAreas/ChangeHistory/StopAreaChangeHistoryPage';
import { StopAreaDetailsPage } from '../components/stop-registry/StopAreas/StopAreaDetails/StopAreaDetailsPage';
import { StopChangeHistoryPage } from '../components/stop-registry/stops/change-history';
import { StopVersionsPage } from '../components/stop-registry/stops/versions';
import { TerminalChangeHistoryPage } from '../components/stop-registry/terminals/change-history/TerminalChangeHistoryPage';
import { TerminalDetailsPage } from '../components/stop-registry/terminals/TerminalDetailsPage';
import {
  SubstituteDaySettingsPage,
  TimetablesMainPage,
  VehicleScheduleDetailsPage,
} from '../components/Timetables';
import { ImportTimetablesPage } from '../components/Timetables/Import/Import/ImportTimetablesPage';
import { PreviewTimetablesPage } from '../components/Timetables/Import/Preview/PreviewTimetablesPage';
import { TimetableVersionsPage } from '../components/Timetables/Versions';
import { joreConfig } from '../config';
import { selectUser, useAppSelector } from '../redux';
import { mapToShortDateTime } from '../time';
import { showDangerToast } from '../utils';
import { JoreErrorModal } from './Components/JoreErrorModal';
import { JoreLoader } from './Components/JoreLoader';
import { Spinner } from './Components/Spinner';
import { Path, PathValue } from './routeDetails';

const FallbackRoute: FC = () => {
  return (
    <div className="flex flex-col items-center">
      <PageTitle.H1>404</PageTitle.H1>
      <p>page not found</p>
    </div>
  );
};

const RedirectToStopSearch: FC = () => {
  const { hash, search, state } = useLocation();

  return (
    <Navigate
      replace
      state={state}
      to={{
        hash,
        pathname: Path.stopSearch,
        search,
      }}
    />
  );
};

export const ProtectedRoute: FC<PropsWithChildren> = ({ children }) => {
  const { userInfo } = useAppSelector(selectUser);
  const { t } = useTranslation();
  const [isLoading, setLoading] = useState(!userInfo);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        await getUserInfo();
      } catch {
        showDangerToast(t(($) => $.errors.unauthorized));
      } finally {
        setLoading(false);
      }
    };
    if (!userInfo) {
      fetchUser();
    }
  }, [userInfo, t]);

  if (isLoading) {
    return <Spinner className="m-16 flex justify-center" showSpinner />;
  }

  if (!userInfo) {
    return <Navigate to="/" />;
  }

  return children;
};

const Layout: FC = () => {
  return (
    <NavigationBlocker>
      <Outlet />
      <JoreLoader />
      <JoreErrorModal />
    </NavigationBlocker>
  );
};

const WithNavigation: FC<PropsWithChildren> = ({ children }) => (
  <>
    <Navbar />
    {children}
  </>
);

const WithFooter: FC<PropsWithChildren> = ({ children }) => {
  const { t } = useTranslation();

  if (!joreConfig.gitHash && !joreConfig.buildTime) {
    return (
      <>
        {children}
        <footer className="hidden" />
      </>
    );
  }

  return (
    <>
      {children}
      <footer className="mt-6 flex justify-center">
        <p>
          {t(($) => $.version, {
            gitHash: joreConfig.gitHash,
            buildTime: mapToShortDateTime(joreConfig.buildTime),
          })}
        </p>
      </footer>
    </>
  );
};

const WithTaskList: FC<PropsWithChildren> = ({ children }) => (
  <>
    {children}
    <TaskListDisplay />
  </>
);

type SimpleJoreRoute = {
  readonly path: PathValue;
  readonly protected?: boolean;
  readonly index?: boolean;
  readonly hideNav?: boolean;
  readonly hideFooter?: boolean;
  readonly hideTaskList?: boolean;
  readonly element: ReactElement;
};

const joreRoutes: ReadonlyArray<SimpleJoreRoute> = [
  {
    path: Path.root,
    index: true,
    element: <MainPage />,
  },

  // Main pages
  {
    path: Path.routes,
    protected: true,
    element: <RoutesAndLinesMainPage />,
  },
  {
    path: Path.stopRegistry,
    protected: true,
    element: <RedirectToStopSearch />,
  },
  {
    path: Path.timetables,
    protected: true,
    element: <TimetablesMainPage />,
  },
  {
    path: Path.map,
    protected: true,
    hideNav: true,
    hideFooter: true,
    hideTaskList: true,
    element: <MapPage />,
  },

  // Route and lines
  {
    path: Path.routesSearch,
    protected: true,
    element: <SearchResultPage />,
  },
  {
    path: Path.editRoute,
    protected: true,
    element: <EditRoutePage />,
  },
  {
    path: Path.routeVersions,
    protected: true,
    element: <RouteVersionsPage />,
  },
  {
    path: Path.createLine,
    protected: true,
    element: <CreateNewLinePage />,
  },
  {
    path: Path.lineDetails,
    protected: true,
    element: <LineDetailsPage />,
  },
  {
    path: Path.lineDrafts,
    protected: true,
    element: <LineDraftsPage />,
  },
  {
    path: Path.lineChangeHistory,
    protected: true,
    element: <LineChangeHistoryPage />,
  },
  {
    path: Path.editLine,
    protected: true,
    element: <EditLinePage />,
  },

  // Stop registry
  {
    path: Path.stopSearch,
    protected: true,
    element: <StopSearchResultPage />,
  },
  {
    path: Path.stopDetails,
    protected: true,
    element: <StopDetailsPage />,
  },
  {
    path: Path.stopVersions,
    protected: true,
    element: <StopVersionsPage />,
  },
  {
    path: Path.stopChangeHistory,
    protected: true,
    element: <StopChangeHistoryPage />,
  },
  {
    path: Path.stopAreaDetails,
    protected: true,
    element: <StopAreaDetailsPage />,
  },
  {
    path: Path.stopAreaChangeHistory,
    protected: true,
    element: <StopAreaChangeHistoryPage />,
  },
  {
    path: Path.terminalDetails,
    protected: true,
    element: <TerminalDetailsPage />,
  },
  {
    path: Path.terminalChangeHistory,
    protected: true,
    element: <TerminalChangeHistoryPage />,
  },

  // Timetables
  {
    path: Path.timetablesSearch,
    protected: true,
    element: <SearchResultPage />,
  },
  {
    path: Path.lineTimetables,
    protected: true,
    element: <VehicleScheduleDetailsPage />,
  },
  {
    path: Path.timetablesImport,
    protected: true,
    element: <ImportTimetablesPage />,
  },
  {
    path: Path.timetablesImportPreview,
    protected: true,
    element: <PreviewTimetablesPage />,
  },
  {
    path: Path.lineTimetableVersions,
    protected: true,
    element: <TimetableVersionsPage />,
  },
  {
    path: Path.substituteOperatingPeriodSettings,
    protected: true,
    element: <SubstituteDaySettingsPage />,
  },

  {
    path: Path.fallback,
    protected: true,
    element: <FallbackRoute />,
  },
];

function simpleRoutesToRouteObjects(): RouteObject[] {
  return [
    {
      path: '/',
      element: <Layout />,
      children: joreRoutes.map((route) => {
        const element = compact([
          route.protected ? ProtectedRoute : null,
          route.hideNav ? null : WithNavigation,
          route.hideTaskList ? null : WithTaskList,
          route.hideFooter ? null : WithFooter,
        ]).reduce(
          (children, Wrapper) => <Wrapper>{children}</Wrapper>,
          route.element,
        );

        return {
          path: route.path,
          index: route.index,
          element,
        };
      }),
    },
  ];
}

// No routing when Netx.js tries to do SSR.
const router = global?.document
  ? createBrowserRouter(simpleRoutesToRouteObjects())
  : null;

export const Router: FC = () => {
  if (router === null) {
    return null;
  }

  return <RouterProvider router={router} />;
};
