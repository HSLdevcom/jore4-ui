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
} from 'react-router';
import { getUserInfo } from '../api/user';
import { PageTitle } from '../components/common';
import { NavigationBlocker } from '../components/forms/common/NavigationBlocker';
import { MainPage } from '../components/main/MainPage';
import { MapLoader, MapModal } from '../components/map';
import { JoreLoader } from '../components/map/JoreLoader';
import { Navbar } from '../components/navbar';
import { CreateNewLinePage } from '../components/routes-and-lines/create-line/CreateNewLinePage';
import { EditLinePage } from '../components/routes-and-lines/edit-line/EditLinePage';
import { EditRoutePage } from '../components/routes-and-lines/edit-route/EditRoutePage';
import { LineDetailsPage } from '../components/routes-and-lines/line-details/LineDetailsPage';
import { LineDraftsPage } from '../components/routes-and-lines/line-drafts/LineDraftsPage';
import { RoutesAndLinesMainPage } from '../components/routes-and-lines/main/RoutesAndLinesMainPage';
import { SearchResultPage } from '../components/routes-and-lines/search/SearchResultPage';
import {
  StopDetailsPage,
  StopRegistryMainPage,
  StopSearchResultPage,
} from '../components/stop-registry';
import { StopAreaDetailsPage } from '../components/stop-registry/stop-areas/stop-area-details/StopAreaDetailsPage';
import { StopVersionsPage } from '../components/stop-registry/stops/versions';
import { TerminalDetailsPage } from '../components/stop-registry/terminals/TerminalDetailsPage';
import {
  SubstituteDaySettingsPage,
  TimetablesMainPage,
  VehicleScheduleDetailsPage,
} from '../components/timetables';
import { ImportTimetablesPage } from '../components/timetables/import/ImportTimetablesPage';
import { PreviewTimetablesPage } from '../components/timetables/import/PreviewTimetablesPage';
import { TimetableVersionsPage } from '../components/timetables/versions';
import { useAppSelector } from '../hooks';
import { selectUser } from '../redux';
import { Spinner } from '../uiComponents';
import { JoreErrorModal } from '../uiComponents/JoreErrorModal';
import { showDangerToast } from '../utils';
import { Path, PathValue } from './routeDetails';

const FallbackRoute: FC = () => {
  return (
    <div className="flex flex-col items-center">
      <PageTitle.H1>404</PageTitle.H1>
      <p>page not found</p>
    </div>
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
        showDangerToast(t('errors.unauthorized'));
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
      <Navbar />
      <Outlet />
      <ProtectedRoute>
        <MapModal />
        <MapLoader />
      </ProtectedRoute>
      <JoreLoader />
      <JoreErrorModal />
    </NavigationBlocker>
  );
};

type SimpleJoreRoute = {
  readonly path: PathValue;
  readonly protected?: boolean;
  readonly index?: boolean;
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
    element: <StopRegistryMainPage />,
  },
  {
    path: Path.timetables,
    protected: true,
    element: <TimetablesMainPage />,
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
    path: Path.stopAreaDetails,
    protected: true,
    element: <StopAreaDetailsPage />,
  },
  {
    path: Path.terminalDetails,
    protected: true,
    element: <TerminalDetailsPage />,
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
      children: joreRoutes.map((route) => ({
        path: route.path,
        index: route.index,
        element: route.protected ? (
          <ProtectedRoute>{route.element}</ProtectedRoute>
        ) : (
          route.element
        ),
      })),
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
