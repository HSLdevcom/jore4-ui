import { MapEditor, Toast } from '../pageObjects';
import { Direction, MapCreator } from './creators/map';
import { deleteRouteByLabel } from './test-utils';

if (!Cypress.env('SKIP_MAP_TESTS')) {
  describe('Verify that creating new route works', () => {
    let mapEditor: MapEditor;
    let mapCreator: MapCreator;
    let toast: Toast;

    beforeEach(() => {
      mapEditor = new MapEditor();
      mapCreator = new MapCreator();
      toast = new Toast();

      cy.mockLogin();
      cy.visit(
        '/routes?mapOpen=true&lng=24.93021804533524&ltd=60.164074274478054&z=15',
      );
      mapEditor.waitForMapToLoad();
    });

    const testRouteLabel = 'T-reitti 1';
    beforeEach(() => {
      deleteRouteByLabel(testRouteLabel);
    });

    after(() => {
      deleteRouteByLabel(testRouteLabel);
    });

    it(
      'Creates new route as expected',
      { scrollBehavior: 'bottom', defaultCommandTimeout: 10000 },
      () => {
        const routeName = 'Testireitti 1';
        mapCreator.createRoute({
          routeFormInfo: {
            finnishName: routeName,
            label: testRouteLabel,
            direction: Direction.AwayFromCity,
            line: '65',
          },
          startDate: '2022-01-01',
          endDate: '2022-12-01',
          routePoints: [
            { x: -10, y: 25, stopTestId: 'H1234_10' },
            { x: 25, y: 5, stopTestId: 'H1236_10' },
          ],
        });

        toast.checkRouteSubmitSuccess();

        cy.getByTestId('RouteStopsOverlay:mapOverlayHeader')
          .get('div')
          .contains(routeName)
          .should('exist');
      },
    );
  });
}
