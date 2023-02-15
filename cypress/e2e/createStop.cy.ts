import {
  Priority,
  ReusableComponentsVehicleModeEnum,
  ReusableComponentsVehicleSubmodeEnum,
  timingPlaces,
  VehicleSubmodeOnInfraLinkInsertInput,
} from '@hsl/jore4-test-db-manager';
import { ChangeValidityForm, ModalMap } from '../pageObjects';
import { FilterPanel } from '../pageObjects/FilterPanel';
import { insertToDbHelper, removeFromDbHelper } from '../utils';
import { deleteStopsByLabel } from './utils';
import { tags } from './utils/tags';

const testStopLabels = {
  testLabel1: 'T0001',
  manualCoordinatesLabel: 'TManual',
  endDateLabel: 'TEndDate',
  timingPlaceLabel: 'Timing place stop label',
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
  timingPlaces,
};

const clearDatabase = () => {
  deleteStopsByLabel(Object.values(testStopLabels));
  removeFromDbHelper(dbResources);
};

describe('Stop creation tests', () => {
  let modalMap: ModalMap;
  let mapFilterPanel: FilterPanel;
  let changeValidityForm: ChangeValidityForm;

  beforeEach(() => {
    clearDatabase();
    insertToDbHelper(dbResources);

    modalMap = new ModalMap();
    mapFilterPanel = new FilterPanel();
    changeValidityForm = new ChangeValidityForm();

    cy.setupTests();
    cy.mockLogin();

    modalMap.map.visit({
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    { tags: [tags.map, tags.stops, tags.sanity], scrollBehavior: 'bottom' },
    () => {
      modalMap.createStopAtLocation({
        stopFormInfo: {
          label: testStopLabels.testLabel1,
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    { tags: [tags.stops, tags.map], scrollBehavior: 'bottom' },
    () => {
      // Create stop
      modalMap.createStopAtLocation({
        stopFormInfo: {
          label: testStopLabels.manualCoordinatesLabel,
          // Actual coordinates will be on Topeliuksenkatu
          latitude: '60.18072918584129',
          longitude: '24.92131574451069',
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
      modalMap.map.visit({
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    { tags: [tags.stops, tags.map], scrollBehavior: 'bottom' },
    () => {
      modalMap.createStopAtLocation({
        stopFormInfo: {
          label: testStopLabels.endDateLabel,
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

      modalMap.map.stopPopUp.getEditButton().click();

      changeValidityForm.getEndDateInput().should('have.value', '2040-12-31');
    },
  );

  it(
    'Should create a stop with a hastus place on map',
    // Map opening seems to take time, so we increase the timeout

    {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      tags: [tags.stops, tags.map],
      scrollBehavior: 'bottom',
      defaultCommandTimeout: 10000,
    },
    () => {
      modalMap.createStopAtLocation({
        stopFormInfo: {
          label: testStopLabels.timingPlaceLabel,
          // seed timing places should always have label defined
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          timingPlace: timingPlaces[0].label!,
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
        `Map::Stops::stopMarker::${testStopLabels.timingPlaceLabel}_Standard`,
      ).click();

      modalMap.map.stopPopUp.getEditButton().click();

      modalMap.stopForm
        .getTimingPlaceDropdown()
        .should('contain', timingPlaces[0].label);
    },
  );
});
