import {
  Priority,
  ReusableComponentsVehicleModeEnum,
  ReusableComponentsVehicleSubmodeEnum,
  VehicleSubmodeOnInfraLinkInsertInput,
} from '@hsl/jore4-test-db-manager';
import { ConfirmSaveForm, Map } from '../pageObjects';
import { FilterPanel } from '../pageObjects/FilterPanel';
import { ModalMap } from '../pageObjects/ModalMap';
import { insertToDbHelper, removeFromDbHelper } from '../utils';
import { deleteStopsByLabel } from './utils';

const testStopLabels = {
  testLabel1: 'T0001',
  manualCoordinatesLabel: 'TManual',
  endDateLabel: 'TEndDate',
};

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
  deleteStopsByLabel(Object.values(testStopLabels));
  removeFromDbHelper(dbResources);
};

describe('Stop creation tests', () => {
  let modalMap: ModalMap;
  let mapFilterPanel: FilterPanel;
  let map: Map;
  let confirmSaveForm: ConfirmSaveForm;

  before(() => {
    cy.fixture('infraLinks/infraLinks.sql').then((infraLinksQuery) => {
      cy.task('executeRawDbQuery', { query: infraLinksQuery });
    });
  });

  beforeEach(() => {
    clearDatabase();
    insertToDbHelper(dbResources);

    modalMap = new ModalMap();
    mapFilterPanel = new FilterPanel();
    map = new Map();
    confirmSaveForm = new ConfirmSaveForm();

    cy.setupTests();
    cy.mockLogin();

    map.visit({
      zoom: 15,
      lat: 60.164074274478054,
      lng: 24.93021804533524,
    });
  });

  after(() => {
    clearDatabase();
  });

  it(
    'Should create stop on map',
    // Map opening seems to take time, so we increase the timeout
    { scrollBehavior: 'bottom', defaultCommandTimeout: 10000 },
    () => {
      modalMap.createStopAtLocation({
        stopFormInfo: { label: testStopLabels.testLabel1 },
        confirmSaveFormInfo: {
          validityStartISODate: '2022-01-01',
          priority: Priority.Standard,
        },
        clickRelativePoint: {
          xPercentage: 43.5,
          yPercentage: 53,
        },
      });

      modalMap.gqlStopShouldBeCreatedSuccessfully();

      modalMap.checkStopSubmitSuccessToast();

      mapFilterPanel.toggleShowStops(ReusableComponentsVehicleModeEnum.Bus);

      cy.getByTestId(
        `Map::Stops::stopMarker::${testStopLabels.testLabel1}_Standard`,
      ).should('exist');
    },
  );

  it(
    'Should place stop correctly by using manually typed latitude and longitude',
    { scrollBehavior: 'bottom', defaultCommandTimeout: 10000 },
    () => {
      // Create stop
      modalMap.createStopAtLocation({
        stopFormInfo: {
          label: testStopLabels.manualCoordinatesLabel,
          // Actual coordinates will be on Topeliuksenkatu
          latitude: '60.18083637150667',
          longitude: '24.9215054260969',
        },
        confirmSaveFormInfo: {
          validityStartISODate: '2022-01-01',
          priority: Priority.Standard,
        },
        clickRelativePoint: {
          xPercentage: 50,
          yPercentage: 45,
        },
      });

      modalMap.gqlStopShouldBeCreatedSuccessfully();

      modalMap.checkStopSubmitSuccessToast();

      // Change map position to created stop location
      map.visit({
        zoom: 15,
        lat: 60.1805636468358,
        lng: 24.918451016960763,
      });

      mapFilterPanel.toggleShowStops(ReusableComponentsVehicleModeEnum.Bus);

      cy.getByTestId(
        `Map::Stops::stopMarker::${testStopLabels.manualCoordinatesLabel}_Standard`,
      ).should('exist');
    },
  );

  it(
    'Should create stop with end time on map',
    // Map opening seems to take time, so we increase the timeout
    { scrollBehavior: 'bottom', defaultCommandTimeout: 10000 },
    () => {
      modalMap.createStopAtLocation({
        stopFormInfo: { label: testStopLabels.endDateLabel },
        confirmSaveFormInfo: {
          validityStartISODate: '2022-01-01',
          validityEndISODate: '2040-12-31',
          priority: Priority.Standard,
        },
        clickRelativePoint: {
          xPercentage: 43.5,
          yPercentage: 53,
        },
      });

      modalMap.gqlStopShouldBeCreatedSuccessfully();

      modalMap.checkStopSubmitSuccessToast();

      mapFilterPanel.toggleShowStops(ReusableComponentsVehicleModeEnum.Bus);

      cy.getByTestId(
        `Map::Stops::stopMarker::${testStopLabels.endDateLabel}_Standard`,
      ).click();

      map.stopPopUp.getEditButton().click();

      confirmSaveForm.getEndDateInput().should('have.value', '2040-12-31');
    },
  );
});
