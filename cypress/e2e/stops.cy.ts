import { MapEditor, Toast } from '../pageObjects';
import { StopForm } from '../pageObjects/StopForm';
import { Direction, MapCreator } from './creators/map';
import { deleteRouteByLabel, deleteStopByLabel } from './test-utils';

const testStopLabel1 = 'T1111';
const testStopLabel2 = 'T2222';
const testStopLabel3 = 'ManuallyPositionedStop';
const testRouteLabel = 'T-reitti pysäkit';

const clearDatabase = () => {
  deleteRouteByLabel(testRouteLabel);
  deleteStopByLabel(testStopLabel1);
  deleteStopByLabel(testStopLabel2);
  deleteStopByLabel(testStopLabel3);
};

if (!Cypress.env('SKIP_MAP_TESTS')) {
  describe('Stop tests', () => {
    let mapEditor: MapEditor;
    let stopForm: StopForm;
    let mapCreator: MapCreator;
    let toast: Toast;
    beforeEach(() => {
      mapCreator = new MapCreator();
      mapEditor = new MapEditor();
      stopForm = new StopForm();
      toast = new Toast();
      cy.mockLogin();
      cy.visit(
        '/routes?mapOpen=true&lng=24.93021804533524&ltd=60.164074274478054&z=15',
      );
      mapEditor.waitForMapToLoad();
      clearDatabase();
    });

    after(() => {
      clearDatabase();
    });

    it(
      'Creates two stops on different sides of the road and includes them correcetly to different directioned routes',
      { scrollBehavior: 'bottom', defaultCommandTimeout: 10000 },
      () => {
        // Create first stop
        mapCreator.createStop({
          stopFormInfo: { label: testStopLabel1 },
          stopPoint: { x: 25, y: 25, stopTestId: 'H1234_10' },
          startDate: '2022-01-01',
        });

        toast.checkStopSubmitSuccess();
        // Wait for the first modal form to get removed from DOM
        stopForm.getLabelInput().should('not.exist');

        // Create second stop
        mapCreator.createStop({
          stopFormInfo: { label: testStopLabel2 },
          stopPoint: { x: 25, y: 0, stopTestId: 'H1234_10' },
          startDate: '2022-01-01',
        });

        toast.checkStopSubmitSuccess();
        cy.getByTestId(`${testStopLabel1}_10`).should('exist');
        cy.getByTestId(`${testStopLabel2}_10`).should('exist');

        // Create route which should include only the first stop
        mapCreator.createRoute({
          routeFormInfo: {
            finnishName: 'Testireitti pysäkit',
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
        cy.getByTestId(`stopRow::${testStopLabel1}`).should('exist');
        cy.getByTestId(`stopRow::${testStopLabel2}`).should('not.exist');

        // Create route which should include only the second stop
        mapCreator.createRoute({
          routeFormInfo: {
            finnishName: 'Testireitti pysäkit 2',
            label: testRouteLabel,
            direction: Direction.TowardsCity,
            line: '65',
          },
          startDate: '2022-01-01',
          endDate: '2022-12-01',
          routePoints: [
            { x: 25, y: 5, stopTestId: 'H1236_10' },
            { x: -10, y: 25, stopTestId: 'H1234_10' },
          ],
        });

        toast.checkRouteSubmitSuccess();
        cy.getByTestId(`stopRow::${testStopLabel2}`).should('exist');
        cy.getByTestId(`stopRow::${testStopLabel1}`).should('not.exist');
      },
    );
    it(
      'Places stop correctly by using manually typed latitude and longitude',
      { scrollBehavior: 'bottom', defaultCommandTimeout: 10000 },
      () => {
        // Create stop
        mapCreator.createStop({
          stopFormInfo: {
            label: testStopLabel3,
            latitude: '60.16526404337536',
            longitude: '24.93255208284283',
          },
          // X and Y far away from the upcoming route
          stopPoint: { x: 600, y: 600, stopTestId: 'H1234_10' },
          startDate: '2022-01-01',
        });
        cy.getByTestId(`${testStopLabel3}_10`).should('exist');

        mapCreator.createRoute({
          routeFormInfo: {
            finnishName: 'Testireitti pysäkit manual',
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
        cy.getByTestId(`stopRow::${testStopLabel3}`).should('exist');
      },
    );
  });
}
