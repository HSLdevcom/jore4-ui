/* eslint-disable no-underscore-dangle */
import React, { FunctionComponent } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { MainPage } from '../components/main/MainPage';
import { MapLoader, ModalMap } from '../components/map';
import { Navbar } from '../components/navbar';
import { CreateNewLinePage } from '../components/routes-and-lines/create-line/CreateNewLinePage';
import { EditLinePage } from '../components/routes-and-lines/edit-line/EditLinePage';
import { EditRoutePage } from '../components/routes-and-lines/edit-route/EditRoutePage';
import { LineDetailsPage } from '../components/routes-and-lines/line-details/LineDetailsPage';
import { LineDraftsPage } from '../components/routes-and-lines/line-drafts/LineDraftsPage';
import { RoutesAndLinesMainPage } from '../components/routes-and-lines/main/RoutesAndLinesMainPage';
import { SearchResultPage } from '../components/routes-and-lines/search/SearchResultPage';
import {
  SubstituteDaySettingsPage,
  TimetablesMainPage,
  VehicleScheduleDetailsPage,
} from '../components/timetables';
import { ImportTimetablesPage } from '../components/timetables/import/ImportTimetablesPage';
import { PreviewTimetablesPage } from '../components/timetables/import/PreviewTimetablesPage';
import { TimetableVersionsPage } from '../components/timetables/versions/TimetableVersionsPage';
import { Path } from './routeDetails';

const FallbackRoute: FunctionComponent = () => {
  return React.createElement('p', null, `404, page not found`);
};

export const Router: FunctionComponent = () => {
  interface Route {
    _routerRoute: Path;
    component: React.ComponentType;
  }

  const routes: Record<Path, Route> = {
    [Path.root]: {
      _routerRoute: Path.root,
      component: MainPage,
    },
    [Path.routes]: {
      _routerRoute: Path.routes,
      component: RoutesAndLinesMainPage,
    },
    [Path.timetables]: {
      _routerRoute: Path.timetables,
      component: TimetablesMainPage,
    },
    [Path.routesSearch]: {
      _routerRoute: Path.routesSearch,
      component: SearchResultPage,
    },
    [Path.timetablesSearch]: {
      _routerRoute: Path.timetablesSearch,
      component: SearchResultPage,
    },
    [Path.editRoute]: {
      _routerRoute: Path.editRoute,
      component: EditRoutePage,
    },
    [Path.createLine]: {
      _routerRoute: Path.createLine,
      component: CreateNewLinePage,
    },
    [Path.lineDetails]: {
      _routerRoute: Path.lineDetails,
      component: LineDetailsPage,
    },
    [Path.lineDrafts]: {
      _routerRoute: Path.lineDrafts,
      component: LineDraftsPage,
    },
    [Path.editLine]: {
      _routerRoute: Path.editLine,
      component: EditLinePage,
    },
    [Path.lineTimetables]: {
      _routerRoute: Path.lineTimetables,
      component: VehicleScheduleDetailsPage,
    },
    [Path.timetablesImport]: {
      _routerRoute: Path.timetablesImport,
      component: ImportTimetablesPage,
    },
    [Path.timetablesImportPreview]: {
      _routerRoute: Path.timetablesImportPreview,
      component: PreviewTimetablesPage,
    },
    [Path.lineTimetableVersions]: {
      _routerRoute: Path.lineTimetableVersions,
      component: TimetableVersionsPage,
    },
    [Path.substituteOperatingPeriodSettings]: {
      _routerRoute: Path.substituteOperatingPeriodSettings,
      component: SubstituteDaySettingsPage,
    },
    [Path.fallback]: {
      _routerRoute: Path.fallback,
      component: FallbackRoute,
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
            Component={route.component}
          />
        ))}
      </Routes>
      <ModalMap />
      <MapLoader />
    </BrowserRouter>
  );
};
