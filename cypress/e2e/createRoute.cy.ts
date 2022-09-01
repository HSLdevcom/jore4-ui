import { RouteDirectionEnum } from '@hsl/jore4-test-db-manager';
import { Toast } from '../pageObjects';
import { deleteRouteByLabel } from './utils/db-utils';
import { MapItemCreator } from './utils/mapItemCreator';

// Currently these tests can't be run in CI so we skip them.
// TODO: Remove the if-statement after we can run map tests in CI
if (!Cypress.env('SKIP_MAP_TESTS')) {
  describe('Verify that creating new route works', () => {
    let mapCreator: MapItemCreator;
    let toast: Toast;

    beforeEach(() => {
      mapCreator = new MapItemCreator();
      toast = new Toast();

      cy.mockLogin();
      cy.visit(
        '/routes?mapOpen=true&lng=24.93021804533524&lat=60.164074274478054&z=15',
      );
    });

    const testRouteLabel = 'T-reitti 1';
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
              testId: 'Map::Stops::stopMarker::H1234_Standard',
            },
            {
              rightOffset: 35,
              downOffset: -20,
              testId: 'Map::Stops::stopMarker::H1236_Standard',
            },
          ],
        });

        toast.checkRouteSubmitSuccess();

        cy.getByTestId('RouteStopsOverlay::mapOverlayHeader')
          .get('div')
          .contains(routeName)
          .should('exist');
      },
    );
  });
}
