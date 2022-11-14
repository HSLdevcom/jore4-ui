import {
  ReusableComponentsVehicleModeEnum,
  ReusableComponentsVehicleSubmodeEnum,
  VehicleSubmodeOnInfraLinkInsertInput,
} from '@hsl/jore4-test-db-manager';
import { FilterPanel } from '../pageObjects/FilterPanel';
import { MapItemCreator } from '../pageObjects/MapItemCreator';
import { insertToDbHelper, removeFromDbHelper } from '../utils';
import { deleteStopsByLabel } from './utils';

const testStopLabels = ['T0001', 'TManual'];

const testInfraLinks = {
  1: 'c63b749f-5060-4710-8b07-ec9ac017cb5f',
  2: '7a42a581-2b23-4519-a04f-eee09ecb2bda',
};

const vehicleSubmodeOnInfrastructureLink: VehicleSubmodeOnInfraLinkInsertInput[] =
  [
    {
      infrastructure_link_id: testInfraLinks[1],
      vehicle_submode: ReusableComponentsVehicleSubmodeEnum.GenericBus,
    },
    {
      infrastructure_link_id: testInfraLinks[2],
      vehicle_submode: ReusableComponentsVehicleSubmodeEnum.GenericBus,
    },
  ];

const dbResources = {
  vehicleSubmodeOnInfrastructureLink,
};

const clearDatabase = () => {
  deleteStopsByLabel(testStopLabels);
  removeFromDbHelper(dbResources);
};

describe('Stop creation tests', () => {
  let mapItemCreator: MapItemCreator;
  let mapFilterPanel: FilterPanel;

  before(() => {
    cy.fixture('infraLinks/infraLinks.sql').then((infraLinksQuery) => {
      cy.task('executeRawDbQuery', { query: infraLinksQuery });
    });
  });

  beforeEach(() => {
    clearDatabase();
    insertToDbHelper(dbResources);

    mapItemCreator = new MapItemCreator();
    mapFilterPanel = new FilterPanel();

    cy.setupTests();
    cy.mockLogin();

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
        stopFormInfo: { label: testStopLabels[0] },
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
        `Map::Stops::stopMarker::${testStopLabels[0]}_Standard`,
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
          label: testStopLabels[1],
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
        `Map::Stops::stopMarker::${testStopLabels[1]}_Standard`,
      ).should('exist');
    },
  );
});
