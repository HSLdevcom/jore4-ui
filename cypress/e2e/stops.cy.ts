import { ReusableComponentsVehicleModeEnum } from '@hsl/jore4-test-db-manager';
import { FilterPanel } from '../pageObjects/FilterPanel';
import { MapItemCreator } from '../pageObjects/MapItemCreator';
import { deleteStopByLabel } from './utils';

const testStopLabel1 = 'T0001';
const testStopLabel2 = 'TManual';

const clearDatabase = () => {
  deleteStopByLabel(testStopLabel1);
  deleteStopByLabel(testStopLabel2);
};

describe('Stop tests', () => {
  let mapItemCreator: MapItemCreator;
  let mapFilterPanel: FilterPanel;
  beforeEach(() => {
    mapItemCreator = new MapItemCreator();
    mapFilterPanel = new FilterPanel();

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
      mapItemCreator.createStopAtLocation({
        stopFormInfo: { label: testStopLabel1 },
        clickRelativePoint: {
          xPercentage: 43.5,
          yPercentage: 53,
        },
        validityStartISODate: '2022-01-01',
      });

      // TODO: Currently 'toast.checkStopSubmitSuccess()' doesn't work because
      // cypress on chrome can't find the toast messages for some reason. Find out why this is and add
      // assertion for the toast message
      cy.wait('@gqlInsertStop').its('response.statusCode').should('equal', 200);

      mapFilterPanel.toggleShowStops(ReusableComponentsVehicleModeEnum.Bus);

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
      mapItemCreator.createStopAtLocation({
        stopFormInfo: {
          label: testStopLabel2,
          // Actual coordinates will be on Topeliuksenkatu
          latitude: '60.18083637150667',
          longitude: '24.9215054260969',
        },
        clickRelativePoint: {
          xPercentage: 50,
          yPercentage: 45,
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

      mapFilterPanel.toggleShowStops(ReusableComponentsVehicleModeEnum.Bus);

      cy.getByTestId(
        `Map::Stops::stopMarker::${testStopLabel2}_Standard`,
      ).should('exist');
    },
  );
});
