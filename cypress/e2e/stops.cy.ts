import { MapItemCreator } from '../pageObjects/MapItemCreator';
import { deleteStopByLabel } from './utils/db-utils';

const testStopLabel1 = 'T0001';
const testStopLabel2 = 'TManual';

const clearDatabase = () => {
  deleteStopByLabel(testStopLabel1);
  deleteStopByLabel(testStopLabel2);
};

describe('Stop tests', () => {
  let mapIemCreator: MapItemCreator;
  beforeEach(() => {
    mapIemCreator = new MapItemCreator();
    cy.setupTests();
    cy.mockLogin();
    clearDatabase();
    cy.visit(
      '/routes?mapOpen=true&lng=24.93021804533524&lat=60.164074274478054&z=15',
    );
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
        validityStartISODate: '2022-01-01',
      });

      // TODO: Currently 'toast.checkStopSubmitSuccess()' doesn't work because
      // cypress on chrome can't find the toast messages for some reason. Find out why this is and add
      // assertion for the toast message
      cy.wait('@gqlInsertStop').its('response.statusCode').should('equal', 200);

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
          // Actual coordinates will be on Topeliuksenkatu
          latitude: '60.18083637150667',
          longitude: '24.9215054260969',
        },
        clickCoordinates: {
          x: 500,
          y: 300,
        },
        validityStartISODate: '2022-01-01',
      });

      // TODO: Currently 'toast.checkStopSubmitSuccess()' doesn't work because
      // cypress on chrome can't find the toast messages for some reason. Find out why this is and add
      // assertion for the toast message
      cy.wait('@gqlInsertStop').its('response.statusCode').should('equal', 200);
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
