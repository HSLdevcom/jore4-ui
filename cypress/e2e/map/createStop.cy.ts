import {
  Priority,
  ReusableComponentsVehicleModeEnum,
  StopAreaInput,
  timingPlaces,
} from '@hsl/jore4-test-db-manager';
import { Tag } from '../../enums';
import {
  ChangeValidityForm,
  FilterPanel,
  MapModal,
  Navbar,
  StopDetailsPage,
  StopSearchBar,
  StopSearchResultsPage,
} from '../../pageObjects';
import { insertToDbHelper } from '../../utils';
import { InsertedStopRegistryIds, mapViewport } from '../utils';

const testStopLabels = {
  testLabel1: 'T0001',
  stopAreaPrivateCode: '123456',
  stopAreaName: 'Test area',
  manualCoordinatesLabel: 'T0002',
  endDateLabel: 'T0003',
  timingPlaceLabel: 'T0004',
};

const dbResources = { timingPlaces };

const stopAreaInput: Array<StopAreaInput> = [
  {
    StopArea: {
      name: { lang: 'fin', value: testStopLabels.stopAreaName },
      privateCode: { type: 'HSL', value: testStopLabels.stopAreaPrivateCode },
    },
    organisations: null,
  },
];

const mapModal = new MapModal();
const mapFilterPanel = new FilterPanel();
const changeValidityForm = new ChangeValidityForm();
const navbar = new Navbar();
const stopSearchBar = new StopSearchBar();
const stopSearchResultsPage = new StopSearchResultsPage();
const stopDetailsPage = new StopDetailsPage();

describe('Stop creation tests', mapViewport, () => {
  beforeEach(() => {
    cy.task('resetDbs');
    insertToDbHelper(dbResources);

    cy.task<InsertedStopRegistryIds>('insertStopRegistryData', {
      stopPlaces: stopAreaInput,
      stopPointsRequired: false,
    });

    cy.setupTests();
    cy.mockLogin();

    mapModal.map.visit({
      path: '/stops',
      zoom: 16,
      lat: 60.164074274478054,
      lng: 24.93021804533524,
    });
  });

  it(
    'Should create stop on map',
    { tags: [Tag.Map, Tag.Stops, Tag.Smoke], scrollBehavior: 'bottom' },
    () => {
      mapModal.createStopAtLocation({
        stopFormInfo: {
          label: testStopLabels.testLabel1,
          stopPlace: testStopLabels.stopAreaPrivateCode,
          validityStartISODate: '2022-01-01',
          priority: Priority.Standard,
        },
        clickRelativePoint: {
          xPercentage: 40,
          yPercentage: 55,
        },
      });

      mapModal.gqlStopShouldBeCreatedSuccessfully();

      mapModal.checkStopSubmitSuccessToast();

      mapFilterPanel.toggleShowStops(ReusableComponentsVehicleModeEnum.Bus);

      cy.getByTestId(
        `Map::Stops::stopMarker::${testStopLabels.testLabel1}_Standard`,
      ).should('exist');
    },
  );

  it(
    'Should place stop correctly by using manually typed latitude and longitude',
    { tags: [Tag.Stops, Tag.Map], scrollBehavior: 'bottom' },
    () => {
      // Create stop
      mapModal.createStopAtLocation({
        stopFormInfo: {
          label: testStopLabels.manualCoordinatesLabel,
          stopPlace: testStopLabels.stopAreaPrivateCode,
          // Actual coordinates will be on Topeliuksenkatu
          latitude: '60.18072918584129',
          longitude: '24.92131574451069',
          validityStartISODate: '2022-01-01',
          priority: Priority.Standard,
        },
        clickRelativePoint: {
          xPercentage: 40,
          yPercentage: 55,
        },
      });

      mapModal.gqlStopShouldBeCreatedSuccessfully();

      mapModal.checkStopSubmitSuccessToast();

      // Change map position to created stop location
      mapModal.map.visit({
        zoom: 16,
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
    { tags: [Tag.Stops, Tag.Map], scrollBehavior: 'bottom' },
    () => {
      mapModal.createStopAtLocation({
        stopFormInfo: {
          label: testStopLabels.endDateLabel,
          stopPlace: testStopLabels.stopAreaPrivateCode,
          validityStartISODate: '2022-01-01',
          validityEndISODate: '2040-12-31',
          priority: Priority.Standard,
        },
        clickRelativePoint: {
          xPercentage: 40,
          yPercentage: 55,
        },
      });

      mapModal.gqlStopShouldBeCreatedSuccessfully();

      mapModal.checkStopSubmitSuccessToast();

      mapFilterPanel.toggleShowStops(ReusableComponentsVehicleModeEnum.Bus);

      cy.getByTestId(
        `Map::Stops::stopMarker::${testStopLabels.endDateLabel}_Standard`,
      ).click();

      mapModal.map.stopPopUp.getEditButton().click();

      changeValidityForm.validityPeriodForm
        .getEndDateInput()
        .should('have.value', '2040-12-31');
    },
  );

  it(
    'Should create a stop with a hastus place on map',
    // Map opening seems to take time, so we increase the timeout
    {
      tags: [Tag.Stops, Tag.Map],
      scrollBehavior: 'bottom',
      defaultCommandTimeout: 10000,
    },
    () => {
      mapModal.createStopAtLocation({
        stopFormInfo: {
          label: testStopLabels.timingPlaceLabel,
          stopPlace: testStopLabels.stopAreaPrivateCode,
          // seed timing places should always have label defined
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          timingPlace: timingPlaces[0].label!,
          validityStartISODate: '2022-01-01',
          validityEndISODate: '2040-12-31',
          priority: Priority.Standard,
        },
        clickRelativePoint: {
          xPercentage: 40,
          yPercentage: 55,
        },
      });

      mapModal.gqlStopShouldBeCreatedSuccessfully();

      mapModal.checkStopSubmitSuccessToast();

      mapFilterPanel.toggleShowStops(ReusableComponentsVehicleModeEnum.Bus);

      cy.getByTestId(
        `Map::Stops::stopMarker::${testStopLabels.timingPlaceLabel}_Standard`,
      ).click();

      mapModal.map.stopPopUp.getEditButton().click();

      mapModal.stopForm
        .getTimingPlaceDropdown()
        .should('contain', timingPlaces[0].label);
    },
  );

  it(
    'Should create stop and have its stop registry details correctly',
    { tags: [Tag.Map, Tag.Stops, Tag.StopRegistry], scrollBehavior: 'bottom' },
    () => {
      mapModal.mapFooter.addStop();
      mapModal.map.clickRelativePoint(40, 55);

      mapModal.stopForm.fillFormForNewStop({
        label: 'T0001',
        stopPlace: testStopLabels.stopAreaPrivateCode,
        validityStartISODate: '2022-01-01',
        priority: Priority.Standard,
      });

      mapModal.stopForm.save();

      mapModal.checkStopSubmitSuccessToast();
      mapModal.getCloseButton().click();

      navbar.getStopsLink().click();

      stopSearchBar.getSearchInput().type('T0001{enter}');
      stopSearchResultsPage.getRowLinkByLabel('T0001').click();

      // NOTE: After adding the name inputs to stop creation flow, this will fail and
      // needs to be updated to the correct names
      stopDetailsPage.titleRow
        .names()
        .shouldHaveText(`${testStopLabels.stopAreaName}|-`);
    },
  );
});
