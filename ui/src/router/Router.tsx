/* eslint-disable no-underscore-dangle */
import React, { FC, PropsWithChildren, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { getUserInfo } from '../api/user';
import { PageTitle } from '../components/common';
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
import { TimetableVersionsPage } from '../components/timetables/versions/TimetableVersionsPage';
import { useAppSelector } from '../hooks';
import { selectUser } from '../redux';
import { Spinner } from '../uiComponents';
import { JoreErrorModal } from '../uiComponents/JoreErrorModal';
import { showDangerToast } from '../utils';
import { Path } from './routeDetails';

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

  return <>{children}</>;
};

export const Router: FC = () => {
  interface Route {
    _routerRoute: Path;
    protected?: boolean;
    element: React.ReactElement;
  }

  const routes: Record<Path, Route> = {
    [Path.root]: {
      _routerRoute: Path.root,
      element: <MainPage />,
    },

    // Main pages
    [Path.routes]: {
      _routerRoute: Path.routes,
      protected: true,
      element: <RoutesAndLinesMainPage />,
    },
    [Path.stopRegistry]: {
      _routerRoute: Path.stopRegistry,
      protected: true,
      element: <StopRegistryMainPage />,
    },
    [Path.timetables]: {
      _routerRoute: Path.timetables,
      protected: true,
      element: <TimetablesMainPage />,
    },

    // Route and lines
    [Path.routesSearch]: {
      _routerRoute: Path.routesSearch,
      protected: true,
      element: <SearchResultPage />,
    },
    [Path.editRoute]: {
      _routerRoute: Path.editRoute,
      protected: true,
      element: <EditRoutePage />,
    },
    [Path.createLine]: {
      _routerRoute: Path.createLine,
      protected: true,
      element: <CreateNewLinePage />,
    },
    [Path.lineDetails]: {
      _routerRoute: Path.lineDetails,
      protected: true,
      element: <LineDetailsPage />,
    },
    [Path.lineDrafts]: {
      _routerRoute: Path.lineDrafts,
      protected: true,
      element: <LineDraftsPage />,
    },
    [Path.editLine]: {
      _routerRoute: Path.editLine,
      protected: true,
      element: <EditLinePage />,
    },

    // Stop registry
    [Path.stopSearch]: {
      _routerRoute: Path.stopSearch,
      protected: true,
      element: <StopSearchResultPage />,
    },
    [Path.stopDetails]: {
      _routerRoute: Path.stopDetails,
      protected: true,
      element: <StopDetailsPage />,
    },
    [Path.stopVersions]: {
      _routerRoute: Path.stopVersions,
      protected: true,
      element: <StopVersionsPage />,
    },
    [Path.stopAreaDetails]: {
      _routerRoute: Path.stopAreaDetails,
      protected: true,
      element: <StopAreaDetailsPage />,
    },
    [Path.terminalDetails]: {
      _routerRoute: Path.terminalDetails,
      protected: true,
      element: <TerminalDetailsPage />,
    },

    // Timetables
    [Path.timetablesSearch]: {
      _routerRoute: Path.timetablesSearch,
      protected: true,
      element: <SearchResultPage />,
    },
    [Path.lineTimetables]: {
      _routerRoute: Path.lineTimetables,
      protected: true,
      element: <VehicleScheduleDetailsPage />,
    },
    [Path.timetablesImport]: {
      _routerRoute: Path.timetablesImport,
      protected: true,
      element: <ImportTimetablesPage />,
    },
    [Path.timetablesImportPreview]: {
      _routerRoute: Path.timetablesImportPreview,
      protected: true,
      element: <PreviewTimetablesPage />,
    },
    [Path.lineTimetableVersions]: {
      _routerRoute: Path.lineTimetableVersions,
      protected: true,
      element: <TimetableVersionsPage />,
    },
    [Path.substituteOperatingPeriodSettings]: {
      _routerRoute: Path.substituteOperatingPeriodSettings,
      protected: true,
      element: <SubstituteDaySettingsPage />,
    },

    [Path.fallback]: {
      _routerRoute: Path.fallback,
      protected: true,
      element: <FallbackRoute />,
    },
  };

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {Object.values(routes).map((route) => (
          <Route
            key={route._routerRoute}
            path={route._routerRoute}
            element={
              route.protected ? (
                <ProtectedRoute>{route.element}</ProtectedRoute>
              ) : (
                route.element
              )
            }
          />
        ))}
      </Routes>
      <ProtectedRoute>
        <MapModal />
        <MapLoader />
      </ProtectedRoute>
      <JoreLoader />
      <JoreErrorModal />
    </BrowserRouter>
  );
};
