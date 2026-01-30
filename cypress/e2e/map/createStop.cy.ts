import {
  Priority,
  ReusableComponentsVehicleModeEnum,
  StopAreaInput,
  StopRegistryGeoJsonType,
  timingPlaces,
} from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';
import { Tag } from '../../enums';
import {
  FilterPanel,
  MapFooter,
  MapObservationDateControl,
  MapObservationDateFiltersOverlay,
  MapPage,
  Navbar,
  StopDetailsPage,
  StopSearchBar,
  StopSearchResultsPage,
  ValidityPeriodForm,
} from '../../pageObjects';
import { insertToDbHelper } from '../../utils';
import { InsertedStopRegistryIds } from '../utils';

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
      privateCode: {
        type: 'HSL/TEST',
        value: testStopLabels.stopAreaPrivateCode,
      },
      geometry: {
        coordinates: [24.93021804533524, 60.164074274478054],
        type: StopRegistryGeoJsonType.Point,
      },
    },
    organisations: null,
  },
];

const rootOpts: Cypress.SuiteConfigOverrides = {
  tags: [Tag.Stops, Tag.Map],
  scrollBehavior: 'bottom',
};
describe('Stop creation tests', rootOpts, () => {
  beforeEach(() => {
    cy.task('resetDbs');
    insertToDbHelper(dbResources);

    cy.task<InsertedStopRegistryIds>('insertStopRegistryData', {
      stopPlaces: stopAreaInput,
      stopPointsRequired: false,
    });

    cy.setupTests();
    cy.mockLogin();

    MapPage.map.visit({
      zoom: 16,
      lat: 60.164074274478054,
      lng: 24.93021804533524,
    });
  });

  it('Should create stop on map', { tags: [Tag.Smoke] }, () => {
    MapPage.createStopAtLocation({
      stopFormInfo: {
        publicCode: testStopLabels.testLabel1,
        stopPlace: testStopLabels.stopAreaPrivateCode,
        validityStartISODate: '2022-01-01',
        priority: Priority.Standard,
        reasonForChange: 'Initial creation',
      },
      clickRelativePoint: {
        xPercentage: 40,
        yPercentage: 55,
      },
    });

    MapPage.gqlStopShouldBeCreatedSuccessfully();

    MapPage.checkStopSubmitSuccessToast();

    FilterPanel.toggleShowStops(ReusableComponentsVehicleModeEnum.Bus);

    cy.getByTestId(
      `Map::Stops::stopMarker::${testStopLabels.testLabel1}_Standard`,
    ).should('exist');
  });

  it(
    'Should create stop and change observation date',
    { tags: [Tag.Map, Tag.Stops, Tag.Smoke], scrollBehavior: 'bottom' },
    () => {
      MapObservationDateControl.setObservationDate('2030-01-01');

      MapPage.createStopAtLocation({
        stopFormInfo: {
          publicCode: testStopLabels.testLabel1,
          stopPlace: testStopLabels.stopAreaPrivateCode,
          validityStartISODate: '2030-01-01',
          priority: Priority.Standard,
          reasonForChange: 'Initial creation',
        },
        clickRelativePoint: {
          xPercentage: 40,
          yPercentage: 55,
        },
      });

      MapPage.gqlStopShouldBeCreatedSuccessfully();

      MapObservationDateFiltersOverlay.observationDateControl
        .getObservationDateInput()
        .should('have.value', '2030-01-01');

      FilterPanel.toggleShowStops(ReusableComponentsVehicleModeEnum.Bus);

      cy.getByTestId(
        `Map::Stops::stopMarker::${testStopLabels.testLabel1}_Standard`,
      ).should('exist');
    },
  );

  it(
    'should cancel creating a new stop',
    { tags: [Tag.Stops, Tag.Map], scrollBehavior: 'bottom' },
    () => {
      MapPage.map.waitForLoadToComplete();

      MapFooter.addStop();
      MapFooter.getMapFooter().should('not.exist');

      MapFooter.cancelAddMode();
      MapFooter.getMapFooter().shouldBeVisible();
    },
  );

  it(
    'Should place stop correctly by using manually typed latitude and longitude',
    { tags: [Tag.Stops, Tag.Map], scrollBehavior: 'bottom' },
    () => {
      // Create stop
      MapPage.createStopAtLocation({
        stopFormInfo: {
          publicCode: testStopLabels.manualCoordinatesLabel,
          stopPlace: testStopLabels.stopAreaPrivateCode,
          // Actual coordinates will be on Topeliuksenkatu
          latitude: '60.18072918584129',
          longitude: '24.92131574451069',
          validityStartISODate: '2022-01-01',
          priority: Priority.Standard,
          reasonForChange: 'Initial creation',
        },
        clickRelativePoint: {
          xPercentage: 40,
          yPercentage: 55,
        },
      });

      MapPage.gqlStopShouldBeCreatedSuccessfully();

      MapPage.checkStopSubmitSuccessToast();

      // Change map position to created stop location
      MapPage.map.visit({
        zoom: 16,
        lat: 60.1805636468358,
        lng: 24.918451016960763,
      });

      FilterPanel.toggleShowStops(ReusableComponentsVehicleModeEnum.Bus);

      cy.getByTestId(
        `Map::Stops::stopMarker::${testStopLabels.manualCoordinatesLabel}_Standard`,
      ).should('exist');
    },
  );

  it(
    'Should create stop with end time on map',
    { tags: [Tag.Stops, Tag.Map], scrollBehavior: 'bottom' },
    () => {
      MapPage.createStopAtLocation({
        stopFormInfo: {
          publicCode: testStopLabels.endDateLabel,
          stopPlace: testStopLabels.stopAreaPrivateCode,
          validityStartISODate: '2022-01-01',
          validityEndISODate: '2040-12-31',
          priority: Priority.Standard,
          reasonForChange: 'Initial creation',
        },
        clickRelativePoint: {
          xPercentage: 40,
          yPercentage: 55,
        },
      });

      MapPage.gqlStopShouldBeCreatedSuccessfully();
      MapPage.checkStopSubmitSuccessToast();
      MapPage.map.stopPopUp.getCloseButton().click();

      FilterPanel.toggleShowStops(ReusableComponentsVehicleModeEnum.Bus);

      cy.getByTestId(
        `Map::Stops::stopMarker::${testStopLabels.endDateLabel}_Standard`,
      ).click();

      MapPage.map.stopPopUp.getEditButton().click();

      ValidityPeriodForm.getEndDateInput().should('have.value', '2040-12-31');
    },
  );

  it(
    'Should create a stop with a hastus place on map',
    // Map opening seems to take time, so we increase the timeout
    {
      defaultCommandTimeout: 10000,
    },
    () => {
      MapPage.createStopAtLocation({
        stopFormInfo: {
          publicCode: testStopLabels.timingPlaceLabel,
          stopPlace: testStopLabels.stopAreaPrivateCode,
          // seed timing places should always have label defined
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          timingPlace: timingPlaces[0].label!,
          validityStartISODate: '2022-01-01',
          validityEndISODate: '2040-12-31',
          priority: Priority.Standard,
          reasonForChange: 'Initial creation',
        },
        clickRelativePoint: {
          xPercentage: 40,
          yPercentage: 55,
        },
      });

      MapPage.gqlStopShouldBeCreatedSuccessfully();
      MapPage.checkStopSubmitSuccessToast();
      MapPage.map.stopPopUp.getCloseButton().click();

      FilterPanel.toggleShowStops(ReusableComponentsVehicleModeEnum.Bus);

      cy.getByTestId(
        `Map::Stops::stopMarker::${testStopLabels.timingPlaceLabel}_Standard`,
      ).click();

      MapPage.map.stopPopUp.getEditButton().click();

      MapPage.stopForm
        .getTimingPlaceDropdown()
        .should('contain', timingPlaces[0].label);
    },
  );

  it(
    'Should create stop and have its stop registry details correctly',
    { tags: [Tag.StopRegistry] },
    () => {
      MapFooter.addStop();
      MapPage.map.clickRelativePoint(40, 55);

      MapPage.stopForm.fillFormForNewStop({
        publicCode: 'T0001',
        stopPlace: testStopLabels.stopAreaPrivateCode,
        validityStartISODate: '2022-01-01',
        priority: Priority.Standard,
        reasonForChange: 'Initial creation',
      });

      MapPage.stopForm.save();

      MapPage.checkStopSubmitSuccessToast();
      MapPage.getCloseButton().click();

      Navbar.getStopsLink().click();

      StopSearchBar.getSearchInput().type('T0001{enter}');
      StopSearchResultsPage.getRowLinkByLabel('T0001').click();

      // NOTE: After adding the name inputs to stop creation flow, this will fail and
      // needs to be updated to the correct names
      StopDetailsPage.titleRow
        .names()
        .shouldHaveText(`${testStopLabels.stopAreaName}|-`);
      StopDetailsPage.basicDetails.viewCard
        .getPrivateCode()
        .should(($field) => expect($field.get(0).innerText).to.match(/7\d{6}/));
    },
  );

  it(
    'Should create stop for preselected StopArea',
    { tags: [Tag.Map, Tag.Stops, Tag.Smoke], scrollBehavior: 'bottom' },
    () => {
      FilterPanel.toggleShowStops(ReusableComponentsVehicleModeEnum.Bus);
      MapPage.map.waitForLoadToComplete();

      MapPage.map.getStopAreaById(testStopLabels.stopAreaPrivateCode).click();
      MapPage.stopAreaPopup
        .getLabel()
        .shouldBeVisible()
        .shouldHaveText(
          `${testStopLabels.stopAreaPrivateCode} ${testStopLabels.stopAreaName}`,
        );

      MapPage.stopAreaPopup.getAddStopButton().click();
      MapPage.stopAreaPopup.getLabel().should('not.exist');

      MapPage.map.clickRelativePoint(40, 55);

      MapPage.stopForm
        .getStopAreaInput()
        .shouldBeDisabled()
        .and('have.value', testStopLabels.stopAreaName);

      MapPage.stopForm.fillFormForNewStop({
        publicCode: 'H12345',
        validityStartISODate: '2022-01-01',
        priority: Priority.Standard,
        reasonForChange: 'Initial creation',
      });

      MapPage.stopForm.save();
      MapPage.gqlStopShouldBeCreatedSuccessfully();
      MapPage.checkStopSubmitSuccessToast();
      MapPage.map.stopPopUp.getLabel().shouldBeVisible();
    },
  );

  it(
    'should automatically recommend proper Public Code',
    { tags: [Tag.StopRegistry] },
    () => {
      const { stopForm: form } = MapPage;

      // Add 1st stop
      MapFooter.addStop();
      MapPage.map.waitForLoadToComplete();
      MapPage.map.clickAtCoordinates(24.9333, 60.1643);

      form.getPublicCodePrefixMissmatchWarning().should('not.exist');

      form.fillFormForNewStop({
        publicCode: 'H1234',
        stopPlace: testStopLabels.stopAreaPrivateCode,
        validityStartISODate: '2022-01-01',
        priority: Priority.Standard,
        reasonForChange: 'Initial creation',
      });
      form.save();
      MapPage.checkStopSubmitSuccessToast();
      MapPage.map.stopPopUp.getCloseButton().click();

      // Add another stop close to the 1st one
      MapFooter.addStop();
      MapPage.map.waitForLoadToComplete();
      MapPage.map.clickAtCoordinates(24.9331, 60.1643);

      form.getPublicCodeCandidate('H1235').should('exist');
      form.getPublicCodeCandidate('H0001').should('exist');
      form.fillFormForNewStop({
        publicCode: 'E1235',
        stopPlace: testStopLabels.stopAreaPrivateCode,
        validityStartISODate: '2022-01-01',
        priority: Priority.Standard,
      });
      form
        .getPublicCodePrefixMissmatchWarning()
        .shouldHaveText(
          'Pysäkki sijaitsee kunnan ”Helsinki” rajojen sisällä, joten sen tunnuksen pitäisi alkaa etuliitteellä H.',
        );
      form.getPublicCodeInput().clearAndType('H1235');
      form.getPublicCodePrefixMissmatchWarning().should('not.exist');
      form.save();
      MapPage.checkStopSubmitSuccessToast();
    },
  );
});
