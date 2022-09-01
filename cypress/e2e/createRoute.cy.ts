import { RouteDirectionEnum } from '@hsl/jore4-test-db-manager';
import { Map } from '../pageObjects';
import { deleteRouteByLabel } from './utils/db-utils';
import { MapItemCreator } from './utils/MapItemCreator';

describe('Should create new route', () => {
  let mapCreator: MapItemCreator;
  let map: Map;

  beforeEach(() => {
    mapCreator = new MapItemCreator();
    map = new Map();
    cy.setupTests();
    cy.mockLogin();

    cy.visit(
      '/routes?mapOpen=true&lng=24.93021804533524&lat=60.164074274478054&z=15',
    );
    map.waitForMapToLoad();
  });

  const testRouteLabel = 'T-reitti 1';

  // TODO: These stops (H1234, 1236) are currently coming from seed data and
  // stops used by tests will be populated with test-db-manager in the future
  const testStopId1 = 'Map::Stops::stopMarker::H1234_Standard';
  const testStopId2 = 'Map::Stops::stopMarker::H1236_Standard';

  beforeEach(() => {
    deleteRouteByLabel(testRouteLabel);
  });

  after(() => {
    deleteRouteByLabel(testRouteLabel);
  });

  it(
    'Should create new route',
    { scrollBehavior: 'bottom', defaultCommandTimeout: 10000 },
    () => {
      const routeName = 'Testireitti 1';
      mapCreator.createRoute({
        routeFormInfo: {
          finnishName: routeName,
          label: testRouteLabel,
          direction: RouteDirectionEnum.Outbound,
          line: '65',
        },
        startISODate: '2022-01-01',
        endISODate: '2022-12-01',
        routePoints: [
          {
            rightOffset: -10,
            downOffset: 25,
            testId: testStopId1,
          },
          {
            rightOffset: 35,
            downOffset: -20,
            testId: testStopId2,
          },
        ],
      });

      // waiting for the success toast is not reliable, thus waiting for the graphql request success instead
      // TODO: find out why cypress chrome can't find toast messages.
      cy.wait('@gqlInsertRouteOne')
        .its('response.statusCode')
        .should('equal', 200);

      cy.getByTestId('RouteStopsOverlay::mapOverlayHeader')
        .get('div')
        .contains(routeName)
        .should('exist');
    },
  );
});
