import { RouteDirectionEnum } from '@hsl/jore4-test-db-manager';
import { Map, Toast } from '../pageObjects';
import { MapItemCreator } from '../pageObjects/MapItemCreator';
import { RouteStopsOverlay } from '../pageObjects/RouteStopsOverlay';
import { deleteRouteByLabel } from './utils/db-utils';

describe('Route creation', () => {
  let mapCreator: MapItemCreator;
  let map: Map;
  let toast: Toast;
  let routeStopsOverlay: RouteStopsOverlay;

  beforeEach(() => {
    mapCreator = new MapItemCreator();
    map = new Map();
    toast = new Toast();
    routeStopsOverlay = new RouteStopsOverlay();
    cy.setupTests();
    cy.mockLogin();

    cy.visit(
      '/routes?mapOpen=true&lng=24.93021804533524&lat=60.164074274478054&z=15',
    );
    map.waitForMapToLoad();
  });

  const testRouteLabel1 = 'T-reitti 1';
  const testRouteLabel2 = 'T-reitti 2';
  const testRouteLabel3 = 'T-reitti 3';

  // TODO: These stops (H1234, 1236) are currently coming from seed data and
  // stops used by tests will be populated with test-db-manager in the future

  const testStop1 = {
    testId: 'Map::Stops::stopMarker::H1234_Standard',
    label: 'H1234',
  };
  const testStop2 = {
    testId: 'Map::Stops::stopMarker::H1236_Standard',
    label: 'H1236',
  };

  beforeEach(() => {
    deleteRouteByLabel(testRouteLabel1);
    deleteRouteByLabel(testRouteLabel2);
    deleteRouteByLabel(testRouteLabel3);
  });

  after(() => {
    deleteRouteByLabel(testRouteLabel1);
    deleteRouteByLabel(testRouteLabel2);
    deleteRouteByLabel(testRouteLabel3);
  });

  it(
    'Should create new route',
    { scrollBehavior: 'bottom', defaultCommandTimeout: 10000 },
    () => {
      const routeName = 'Testireitti 1';

      mapCreator.createRoute({
        routeFormInfo: {
          finnishName: routeName,
          label: testRouteLabel1,
          direction: RouteDirectionEnum.Outbound,
          line: '65',
        },
        validityStartISODate: '2022-01-01',
        validityEndISODate: '2022-12-01',
        routePoints: [
          {
            rightOffset: -10,
            downOffset: 25,
            mapMarkerTestId: testStop1.testId,
          },
          {
            rightOffset: 35,
            downOffset: -20,
            mapMarkerTestId: testStop2.testId,
          },
        ],
      });

      mapCreator.gqlRouteShouldBeCreatedSuccessfully();

      toast.checkRouteSubmitSuccess();

      routeStopsOverlay.routeShouldExist(routeName);
    },
  );

  it(
    'Should create a new route and leave out one stop',
    { scrollBehavior: 'bottom', defaultCommandTimeout: 10000 },
    () => {
      const routeName = 'Testireitti 2';
      const omittedStopsLabels = ['H1235'];
      mapCreator.createRoute({
        routeFormInfo: {
          finnishName: routeName,
          label: testRouteLabel2,
          direction: RouteDirectionEnum.Outbound,
          line: '65',
        },
        validityStartISODate: '2022-01-01',
        validityEndISODate: '2022-12-01',
        routePoints: [
          {
            rightOffset: -10,
            downOffset: 25,
            mapMarkerTestId: testStop1.testId,
          },
          {
            rightOffset: 35,
            downOffset: -20,
            mapMarkerTestId: testStop2.testId,
          },
        ],
        omittedStops: omittedStopsLabels,
      });

      mapCreator.gqlRouteShouldBeCreatedSuccessfully();

      toast.checkRouteSubmitSuccess();

      routeStopsOverlay.routeShouldExist(routeName);

      routeStopsOverlay.stopsShouldNotBeIncludedInRoute(omittedStopsLabels);
    },
  );

  it(
    'Should not let the user create a route with only one stop',
    { scrollBehavior: 'bottom', defaultCommandTimeout: 10000 },
    () => {
      const routeName = 'Testireitti 3';
      const omittedStopsLabels = ['H1235', 'H1234'];
      mapCreator.createRoute({
        routeFormInfo: {
          finnishName: routeName,
          label: testRouteLabel3,
          direction: RouteDirectionEnum.Outbound,
          line: '65',
        },
        validityStartISODate: '2022-01-01',
        validityEndISODate: '2022-12-01',
        routePoints: [
          {
            rightOffset: -10,
            downOffset: 25,
            mapMarkerTestId: testStop1.testId,
          },
          {
            rightOffset: 35,
            downOffset: -20,
            mapMarkerTestId: testStop2.testId,
          },
        ],
        omittedStops: omittedStopsLabels,
      });

      toast.checkRouteSubmitFailure();
    },
  );
});
