import { MapEditor, Toast } from '../pageObjects';
import { MapHeader } from '../pageObjects/MapHeader';
import { RouteStopsTable } from '../pageObjects/RouteStopsTable';
import { StopTableRow } from '../pageObjects/StopTableRow';
import { ViaForm } from '../pageObjects/ViaForm';
import { Direction, MapCreator, Priority } from './creators/map';
import { deleteRouteByLabel } from './test-utils';

const testRouteLabel = 'T-reitti routeStopsTable';
const testRouteLabel2 = 'T-reitti routeStopsTable2';
const testRouteLabel3 = 'T-reitti routeStopsTable draft';
const testRouteLabel4 = 'T-reitti routeStopsTable via';

const clearDatabase = () => {
  deleteRouteByLabel(testRouteLabel);
  deleteRouteByLabel(testRouteLabel2);
  deleteRouteByLabel(testRouteLabel3);
  deleteRouteByLabel(testRouteLabel4);
};

if (!Cypress.env('SKIP_MAP_TESTS')) {
  describe('Verify that RouteStopsTable actions works', () => {
    let toast: Toast;
    let mapEditor: MapEditor;
    let mapCreator: MapCreator;
    let mapHeader: MapHeader;
    let routeStopsTable: RouteStopsTable;
    let stopTableRow: StopTableRow;
    let viaForm: ViaForm;

    beforeEach(() => {
      toast = new Toast();
      mapEditor = new MapEditor();
      mapCreator = new MapCreator();
      mapHeader = new MapHeader();
      routeStopsTable = new RouteStopsTable();
      stopTableRow = new StopTableRow();
      viaForm = new ViaForm();

      cy.mockLogin();
      cy.visit('lines/101f800c-39ed-4d85-8ece-187cd9fe1c5e?mapOpen=true');
      mapEditor.waitForMapToLoad();
      clearDatabase();
    });
    after(() => {
      clearDatabase();
    });

    it(
      'Removing stop from route should be displayed correctly',
      { scrollBehavior: 'bottom', defaultCommandTimeout: 10000 },
      () => {
        mapCreator.createRoute({
          routeFormInfo: {
            finnishName: 'Test routeStopsTable',
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

        mapHeader.close();
        routeStopsTable.routeRowShouldExist(testRouteLabel, 'outbound');

        routeStopsTable.expandRouteRow(testRouteLabel, 'outbound');
        stopTableRow.shouldExist('H1234');
        stopTableRow.openActionsMenu('H1234');
        stopTableRow.removeFromRoute();
        stopTableRow.shouldNotExist('H1234');

        routeStopsTable.toggleShowUnusedStops();

        stopTableRow.shouldExist('H1234');
        stopTableRow.openActionsMenu('H1234');
        stopTableRow.getOpenViaModalButton().should('be.disabled');
      },
    );
    it(
      'Should produce error message when attempting to remove second last stop from route',
      { scrollBehavior: 'bottom', defaultCommandTimeout: 10000 },
      () => {
        mapCreator.createRoute({
          routeFormInfo: {
            finnishName: 'Test routeStopsTable 2',
            label: testRouteLabel2,
            direction: Direction.AwayFromCity,
            line: '65',
          },
          startDate: '2022-01-01',
          endDate: '2022-12-01',
          routePoints: [
            { x: -10, y: 25, stopTestId: 'H1234_10' },
            { x: 25, y: 5, stopTestId: 'H1235_10' },
          ],
        });

        toast.checkRouteSubmitSuccess();

        mapHeader.close();
        routeStopsTable.routeRowShouldExist(testRouteLabel2, 'outbound');

        routeStopsTable.expandRouteRow(testRouteLabel2, 'outbound');
        stopTableRow.shouldExist('H1234');
        stopTableRow.openActionsMenu('H1234');
        stopTableRow.removeFromRoute();
        toast.checkAtLeastTwoStopsOnRouteErrorMessage();
      },
    );
    it(
      'List should not show draft route',
      { scrollBehavior: 'bottom', defaultCommandTimeout: 10000 },
      () => {
        mapCreator.createRoute({
          routeFormInfo: {
            finnishName: 'Test routeStopsTable draft',
            label: testRouteLabel3,
            direction: Direction.AwayFromCity,
            line: '65',
          },
          priority: Priority.Draft,
          startDate: '2022-01-01',
          endDate: '2022-12-01',
          routePoints: [
            { x: -10, y: 25, stopTestId: 'H1234_10' },
            { x: 25, y: 5, stopTestId: 'H1236_10' },
          ],
        });

        toast.checkRouteSubmitSuccess();

        mapHeader.close();
        routeStopsTable.routeRowShouldNotExist(testRouteLabel3, 'outbound');
        // TODO: after linedraftpage rework is on main, we can extend this test to check
        // that this route exists there
      },
    );
    it(
      'Via information should be shown correctly on modal and list view',
      { scrollBehavior: 'bottom', defaultCommandTimeout: 10000 },
      () => {
        mapCreator.createRoute({
          routeFormInfo: {
            finnishName: 'Test routeStopsTable via',
            label: testRouteLabel4,
            direction: Direction.AwayFromCity,
            line: '65',
          },
          priority: Priority.Standard,
          startDate: '2022-01-01',
          endDate: '2022-12-01',
          routePoints: [
            { x: -10, y: 25, stopTestId: 'H1234_10' },
            { x: 25, y: 5, stopTestId: 'H1236_10' },
          ],
        });

        toast.checkRouteSubmitSuccess();

        mapHeader.close();
        routeStopsTable.expandRouteRow(testRouteLabel4, 'outbound');
        stopTableRow.openActionsMenu('H1235');
        stopTableRow.openViaModal();
        stopTableRow.checkCreateViaModalButtonText();

        viaForm.fillViaInformation({
          finnishName: 'Keskipaikka',
          finnishShortName: 'Kesk.p.',
          swedishName: 'Mellanplats',
          swedishShortName: 'Mell.pl.',
        });
        toast.checkViaInformationSubmitSuccess();
        stopTableRow.shouldBeViaPlace('H1235');

        stopTableRow.openActionsMenu('H1235');
        stopTableRow.openViaModal();
        stopTableRow.checkEditViaModalButtonText();

        viaForm.getFinnishName().should('have.value', 'Keskipaikka');
        viaForm.getFinnishShortName().should('have.value', 'Kesk.p.');
        viaForm.getSwedishName().should('have.value', 'Mellanplats');
        viaForm.getSwedishShortName().should('have.value', 'Mell.pl.');

        viaForm.remove();
        toast.checkViaInformationRemoveSuccess();
        stopTableRow.shouldNotBeViaPlace('H1235');
      },
    );
  });
}
