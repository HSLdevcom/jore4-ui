/* eslint-disable no-underscore-dangle */
import React, { FunctionComponent } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
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
  TimetablesMainPage,
  VehicleScheduleDetailsPage,
} from '../components/timetables';
import { ImportTimetablesPage } from '../components/timetables/import/ImportTimetablesPage';
import { Main } from '../pages/Main';
import { Path } from './routeDetails';

export const Router: FunctionComponent = () => {
  interface Route {
    _routerRoute: Path;
    _exact?: boolean; // When true, will only match if the path matches the location.pathname exactly.
    component: React.ComponentType;
  }

  const FallbackRoute: FunctionComponent = () => {
    return React.createElement('p', null, `404, page not found`);
  };

  const routes: Record<Path, Route> = {
    [Path.root]: {
      _routerRoute: Path.root,
      _exact: true,
      component: Main,
    },
    [Path.routes]: {
      _routerRoute: Path.routes,
      _exact: true,
      component: RoutesAndLinesMainPage,
    },
    [Path.timetables]: {
      _routerRoute: Path.timetables,
      _exact: true,
      component: TimetablesMainPage,
    },
    [Path.routesSearch]: {
      _routerRoute: Path.routesSearch,
      _exact: true,
      component: SearchResultPage,
    },
    [Path.timetablesSearch]: {
      _routerRoute: Path.timetablesSearch,
      _exact: true,
      component: SearchResultPage,
    },
    [Path.editRoute]: {
      _routerRoute: Path.editRoute,
      _exact: true,
      component: EditRoutePage,
    },
    [Path.createLine]: {
      _routerRoute: Path.createLine,
      _exact: true,
      component: CreateNewLinePage,
    },
    [Path.lineDetails]: {
      _routerRoute: Path.lineDetails,
      _exact: true,
      component: LineDetailsPage,
    },
    [Path.lineDrafts]: {
      _routerRoute: Path.lineDrafts,
      _exact: true,
      component: LineDraftsPage,
    },
    [Path.editLine]: {
      _routerRoute: Path.editLine,
      _exact: true,
      component: EditLinePage,
    },
    [Path.lineTimetables]: {
      _routerRoute: Path.lineTimetables,
      _exact: true,
      component: VehicleScheduleDetailsPage,
    },
    [Path.timetablesImport]: {
      _routerRoute: Path.timetablesImport,
      _exact: true,
      component: ImportTimetablesPage,
    },
    [Path.fallback]: {
      _routerRoute: Path.fallback,
      component: FallbackRoute,
    },
  };

  return (
    <BrowserRouter>
      <Navbar />
      <Switch>
        {Object.values(routes).map((route) => (
          <Route
            key={route._routerRoute}
            path={route._routerRoute}
            exact={route._exact || false}
            component={route.component}
          />
        ))}
      </Switch>
      <ModalMap />
      <MapLoader />
    </BrowserRouter>
  );
};
