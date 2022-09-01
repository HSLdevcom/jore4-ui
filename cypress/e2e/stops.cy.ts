import { Toast } from '../pageObjects';
import { deleteStopByLabel } from './utils/db-utils';
import { MapItemCreator } from './utils/mapItemCreator';

const testStopLabel1 = 'T0001';
const testStopLabel2 = 'TManual';

const clearDatabase = () => {
  deleteStopByLabel(testStopLabel1);
  deleteStopByLabel(testStopLabel2);
};

// Currently these tests can't be run in CI so we skip them.
// TODO: Remove the if-statement after we can run map tests in CI
if (!Cypress.env('SKIP_MAP_TESTS')) {
  describe('Stop tests', () => {
    let mapIemCreator: MapItemCreator;
    let toast: Toast;
    beforeEach(() => {
      mapIemCreator = new MapItemCreator();
      toast = new Toast();
      cy.mockLogin();
      cy.visit(
        '/routes?mapOpen=true&lng=24.93021804533524&lat=60.164074274478054&z=15',
      );

      clearDatabase();
    });

    after(() => {
      clearDatabase();
    });

    it(
      'Should create stop on map',
      // Map opening seems to take time, so we increase the timeout
      { scrollBehavior: 'bottom', defaultCommandTimeout: 10000 },
      () => {
        mapIemCreator.createStopAtLocation({
          stopFormInfo: { label: testStopLabel1 },
          clickCoordinates: {
            x: 435,
            y: 334,
          },
          startISODate: '2022-01-01',
        });

        toast.checkStopSubmitSuccess();
        cy.getByTestId(
          `Map::Stops::stopMarker::${testStopLabel1}_Standard`,
        ).should('exist');
      },
    );

    it(
      'Should place stop correctly by using manually typed latitude and longitude',
      { scrollBehavior: 'bottom', defaultCommandTimeout: 10000 },
      () => {
        // Create stop
        mapIemCreator.createStopAtLocation({
          stopFormInfo: {
            label: testStopLabel2,
            // Actual coordinates will be on Topeliuksen katu
            latitude: '60.18083637150667',
            longitude: '24.9215054260969',
          },
          clickCoordinates: {
            x: 500,
            y: 300,
          },
          startISODate: '2022-01-01',
        });
        toast.checkStopSubmitSuccess();
        // Change map position to created stop location
        cy.visit(
          '/routes?lat=60.1805636468358&lng=24.918451016960763&z=15.008647482331973&mapOpen=true',
        );

        cy.getByTestId(
          `Map::Stops::stopMarker::${testStopLabel2}_Standard`,
        ).should('exist');
      },
    );
  });
}
