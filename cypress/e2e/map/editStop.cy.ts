import {
  Priority,
  ReusableComponentsVehicleModeEnum,
  StopInsertInput,
} from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';
import {
  buildInfraLinksAlongRoute,
  buildStopsOnInfraLinks,
  getClonedBaseDbResources,
  testInfraLinkExternalIds,
} from '../../datasets/base';
import { getClonedBaseStopRegistryData } from '../../datasets/stopRegistry';
import { Tag } from '../../enums';
import {
  BaseStopFormInfo,
  ConfirmationDialog,
  CreateTimingPlaceForm,
  FilterPanel,
  Map,
  MapPage,
  NavigationBlockedDialog,
  PriorityForm,
  StopDetailsPage,
  StopForm,
  Toast,
  ToastType,
} from '../../pageObjects';
import { UUID } from '../../types';
import { SupportedResources, insertToDbHelper } from '../../utils';
import { expectGraphQLCallToSucceed } from '../../utils/assertions';
import { InsertedStopRegistryIds, mapViewport } from '../utils';

const testTimingPlaceLabels = {
  label1: 'Test created timing place label 1',
};

// Centers the stops on the screen
const testCoordinates1 = {
  lng: 24.93458814980886,
  lat: 60.16493319843619,
  el: 0,
};

describe('Stop editing tests', { tags: [Tag.Stops, Tag.Map] }, () => {
  const baseDbResources = getClonedBaseDbResources();
  const baseStopRegistryData = getClonedBaseStopRegistryData();

  let dbResources: SupportedResources;
  let stops: StopInsertInput[];

  before(() => {
    cy.task<UUID[]>(
      'getInfrastructureLinkIdsByExternalIds',
      testInfraLinkExternalIds,
    ).then((infraLinkIds) => {
      stops = buildStopsOnInfraLinks(infraLinkIds);

      const infraLinksAlongRoute = buildInfraLinksAlongRoute(infraLinkIds);

      dbResources = {
        ...baseDbResources,
        stops,
        infraLinksAlongRoute,
      };
    });
  });

  beforeEach(() => {
    cy.task('resetDbs');

    insertToDbHelper(dbResources);

    cy.task<InsertedStopRegistryIds>(
      'insertStopRegistryData',
      baseStopRegistryData,
    ).then(() => {
      cy.setupTests();
      cy.mockLogin();
      Map.visit({
        // Zoom in so that the stops are not shown on top of each other
        zoom: 16,
        lat: testCoordinates1.lat,
        lng: testCoordinates1.lng,
      });
    });
  });

  it(
    'Should move a stop on the map',
    { tags: [Tag.Smoke], scrollBehavior: 'bottom', ...mapViewport },
    () => {
      // Coordinates for the point where the stop is moved in the test.
      const endCoordinates = {
        lng: 24.9389226,
        lat: 60.16557905,
      };

      FilterPanel.toggleShowStops(ReusableComponentsVehicleModeEnum.Bus);

      Map.waitForLoadToComplete();

      Map.getStopByStopLabelAndPriority(
        stops[0].label,
        stops[0].priority,
      ).click({ force: true });

      Map.stopPopUp.getMoveButton().click();

      // Point where the stop is moved on the map. Moving the stop here gives it the endCoordinates.
      // Map view zoom level should not be changed in the test since it would naturally affect this test location.
      Map.clickRelativePoint(71, 35);

      ConfirmationDialog.getConfirmButton().click();

      expectGraphQLCallToSucceed('@gqlEditStop');
      expectGraphQLCallToSucceed('@gqlEditStopPlace');

      Toast.expectSuccessToast('Pysäkki muokattu');
      Map.stopPopUp.getCloseButton().click();

      Map.waitForLoadToComplete();

      Map.getStopByStopLabelAndPriority(
        stops[0].label,
        stops[0].priority,
      ).click({ force: true });

      Map.stopPopUp.getEditButton().click();

      StopForm.getLatitudeInput().should('have.value', endCoordinates.lat);
      StopForm.getLongitudeInput().should('have.value', endCoordinates.lng);
    },
  );

  it('Should delete a stop', { scrollBehavior: 'bottom' }, () => {
    FilterPanel.toggleShowStops(ReusableComponentsVehicleModeEnum.Bus);

    Map.waitForLoadToComplete();

    Map.getStopByStopLabelAndPriority(stops[0].label, stops[0].priority).click({
      force: true,
    });

    Map.stopPopUp.getDeleteButton().click();

    ConfirmationDialog.getConfirmButton().click();

    expectGraphQLCallToSucceed('@gqlRemoveStop');
    expectGraphQLCallToSucceed('@gqlDeleteQuay');

    Toast.expectSuccessToast('Pysäkki poistettu');

    Map.getStopByStopLabelAndPriority(stops[0].label, stops[0].priority).should(
      'not.exist',
    );
  });

  it('Should copy a stop', () => {
    FilterPanel.toggleShowStops(ReusableComponentsVehicleModeEnum.Bus);

    Map.waitForLoadToComplete();

    Map.getStopByStopLabelAndPriority(stops[7].label, stops[0].priority).click({
      force: true,
    });

    Map.stopPopUp.getCopyButton().click();
    ConfirmationDialog.getConfirmButton().click();
    Map.clickRelativePoint(63, 22);

    // Check that public code is disabled and set
    cy.getByTestId('CopyStopModal').shouldBeVisible();
    StopForm.getPublicCodeInput().shouldBeDisabled();
    StopForm.getPublicCodeInput().should('have.value', stops[7].label);
    StopForm.getLatitudeInput().clearAndType('60.16654513');
    StopForm.getLongitudeInput().clearAndType('24.93727036');
    StopForm.getLocationFinInput().clearAndType('Kopioitu');
    StopForm.getLocationSweInput().clearAndType('Kopierad');
    StopForm.reasonForChange
      .getReasonForChangeInput()
      .clearAndType('Kopioitu versio');
    PriorityForm.setAsTemporary();
    cy.getByTestId('CopyStopModal::saveButton').click();

    expectGraphQLCallToSucceed('@gqlInsertQuayIntoStopPlace');
    expectGraphQLCallToSucceed('@gqlInsertStopPoint');
    expectGraphQLCallToSucceed('@gqlUpdateInfoSpot');
    Map.waitForLoadToComplete();
    Map.stopPopUp.getLabel().shouldBeVisible();

    // Open copied version
    cy.visit(
      `/stop-registry/stops/E2E008?observationDate=2020-03-20&priority=20`,
    );

    // Check that info spots were correctly copied
    StopDetailsPage.page().shouldBeVisible();
    StopDetailsPage.infoSpotsTabButton().click();
    StopDetailsPage.infoSpots.viewCard.getSectionContainers().shouldBeVisible();
    StopDetailsPage.infoSpots.viewCard
      .getLabel()
      .shouldHaveText('E2E_INFO_001');
    StopDetailsPage.infoSpots.viewCard.getNthPosterContainer(0).within(() => {
      StopDetailsPage.infoSpots.viewCard
        .getPosterLabel()
        .shouldHaveText('E2E_POSTER_001');
    });
  });

  it('Should edit stop info', { scrollBehavior: 'bottom' }, () => {
    const testCoordinates2 = {
      lng: 24.9389226,
      lat: 60.16557905,
    };

    const updatedStopInfo: BaseStopFormInfo = {
      timingPlace: '1ALKU',
      locationFin: 'Toinen sijainti',
      locationSwe: 'En annan plats',
      latitude: String(testCoordinates2.lat),
      longitude: String(testCoordinates2.lng),
      validityStartISODate: '2024-01-01',
      validityEndISODate: '2029-12-31',
      priority: Priority.Draft,
      reasonForChange: 'Updated stop info',
    };

    FilterPanel.toggleShowStops(ReusableComponentsVehicleModeEnum.Bus);

    Map.waitForLoadToComplete();

    Map.getStopByStopLabelAndPriority(stops[0].label, stops[0].priority).click({
      force: true,
    });

    Map.stopPopUp.getEditButton().click();

    StopForm.fillBaseForm(updatedStopInfo);
    StopForm.save();

    ConfirmationDialog.getConfirmButton().click();

    expectGraphQLCallToSucceed('@gqlEditStop');
    expectGraphQLCallToSucceed('@gqlEditStopPlace');

    Toast.expectMultipleToasts([
      { type: ToastType.SUCCESS, message: 'Pysäkki muokattu' },
      { type: ToastType.WARNING, message: 'Pysäkkien suodattimia muutettu' },
    ]);
    Map.stopPopUp.getCloseButton().click();

    Map.getStopByStopLabelAndPriority(
      stops[0].label,
      // Assert non-null since priority is defined in the updatedStopInfo
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      updatedStopInfo.priority!,
    ).click();

    Map.stopPopUp.getEditButton().click();

    StopForm.getPublicCodeInput().should('have.value', stops[0].label);
    StopForm.getTimingPlaceDropdown().should(
      'contain',
      updatedStopInfo.timingPlace,
    );
    StopForm.priorityForm.assertSelectedPriority(updatedStopInfo.priority);
    StopForm.changeValidityForm.validityPeriodForm
      .getStartDateInput()
      .should('have.value', updatedStopInfo.validityStartISODate);
    StopForm.changeValidityForm.validityPeriodForm
      .getEndDateInput()
      .should('have.value', updatedStopInfo.validityEndISODate);
    StopForm.getLocationFinInput().should(
      'have.value',
      updatedStopInfo.locationFin,
    );
    StopForm.getLocationSweInput().should(
      'have.value',
      updatedStopInfo.locationSwe,
    );
    StopForm.getLatitudeInput().should('have.value', testCoordinates2.lat);
    StopForm.getLongitudeInput().should('have.value', testCoordinates2.lng);
  });

  it('Should create a new timing place', { scrollBehavior: 'bottom' }, () => {
    FilterPanel.toggleShowStops(ReusableComponentsVehicleModeEnum.Bus);

    Map.waitForLoadToComplete();

    Map.getStopByStopLabelAndPriority(stops[0].label, stops[0].priority).click({
      force: true,
    });

    Map.stopPopUp.getEditButton().click();

    StopForm.getAddTimingPlaceButton().click();

    CreateTimingPlaceForm.fillTimingPlaceFormAndSave({
      label: testTimingPlaceLabels.label1,
      description: 'New timing place description',
    });

    Toast.expectSuccessToast('Hastus-paikka luotu');

    StopForm.save();

    ConfirmationDialog.getConfirmButton().click();

    expectGraphQLCallToSucceed('@gqlEditStop');
    StopForm.getModal().should('not.exist');
    expectGraphQLCallToSucceed('@gqlGetMapStops');

    Map.getStopByStopLabelAndPriority(stops[0].label, stops[0].priority).click({
      force: true,
    });
    expectGraphQLCallToSucceed('@gqlGetStopInfoForEditingOnMap');

    Map.stopPopUp.getEditButton().click();

    StopForm.getTimingPlaceDropdown().type(testTimingPlaceLabels.label1);

    // Wait for the search results before trying to find the result list item
    expectGraphQLCallToSucceed('@gqlGetTimingPlacesForCombobox');

    cy.get('[role="listbox"]').should('contain', testTimingPlaceLabels.label1);
  });

  it('should not update StopPoint if StopPlace save fails', () => {
    FilterPanel.toggleShowStops(ReusableComponentsVehicleModeEnum.Bus);

    Map.waitForLoadToComplete();

    Map.getStopByStopLabelAndPriority(stops[0].label, stops[0].priority).click({
      force: true,
    });

    Map.stopPopUp.getEditButton().click();

    StopForm.fillBaseForm({
      validityStartISODate: '2024-01-01',
      validityEndISODate: '2029-12-31',
    });

    cy.intercept('POST', '/api/graphql/v1/graphql?q=EditStopPlace', {
      statusCode: 500,
    });

    StopForm.save();
    ConfirmationDialog.getConfirmButton().click();

    Toast.expectDangerToast(
      'Pysäkkien päivitys pysäkkirekisteriin epäonnistui! Muutoksia ei ole myöskään viety linjastoon. Syy: Response not successful: Received status code 500',
    );
  });

  it('should warn if StopPlace save succeeds but Stop Point fails', () => {
    FilterPanel.toggleShowStops(ReusableComponentsVehicleModeEnum.Bus);

    Map.waitForLoadToComplete();

    Map.getStopByStopLabelAndPriority(stops[0].label, stops[0].priority).click({
      force: true,
    });

    Map.stopPopUp.getEditButton().click();

    StopForm.fillBaseForm({
      validityStartISODate: '2024-01-01',
      validityEndISODate: '2029-12-31',
    });

    cy.intercept('POST', '/api/graphql/v1/graphql?q=EditStop', {
      statusCode: 500,
    });

    StopForm.save();
    ConfirmationDialog.getConfirmButton().click();

    Toast.expectDangerToast(
      'Pysäkkien tiedot on päivitetty pysäkkirekisteriin, mutta niiden vienti linjastoon epäonnistui! Tallennusta on syytä yrittää uudelleen! Syy: Response not successful: Received status code 500',
    );
  });

  it(
    'Should prevent copy creating an overlapping stop',
    { scrollBehavior: 'bottom' },
    () => {
      FilterPanel.toggleShowStops(ReusableComponentsVehicleModeEnum.Bus);

      Map.waitForLoadToComplete();

      Map.getStopByStopLabelAndPriority(
        stops[7].label,
        stops[0].priority,
      ).click({ force: true });

      Map.stopPopUp.getCopyButton().click();
      ConfirmationDialog.getConfirmButton().click();
      Map.clickRelativePoint(63, 22);

      // Check that public code is disabled and set
      cy.getByTestId('CopyStopModal').shouldBeVisible();
      StopForm.getPublicCodeInput().shouldBeDisabled();
      StopForm.getPublicCodeInput().should('have.value', stops[7].label);
      StopForm.getLatitudeInput().clearAndType('60.16654513');
      StopForm.getLongitudeInput().clearAndType('24.93727036');
      StopForm.getLocationFinInput().clearAndType('Kopioitu');
      StopForm.getLocationSweInput().clearAndType('Kopierad');
      StopForm.reasonForChange
        .getReasonForChangeInput()
        .clearAndType('Kopioitu versio');
      PriorityForm.setAsStandard();
      cy.getByTestId('CopyStopModal::saveButton').click();

      Toast.expectDangerToast(
        'Pysäkin kopiointi epäonnistui: voimassaoloaika ja prioriteetti aiheuttavat päällekkäisyyden olemassa olevan version kanssa.',
      );
    },
  );

  it('Should warn about unsaved forms', { scrollBehavior: 'bottom' }, () => {
    FilterPanel.toggleShowStops(ReusableComponentsVehicleModeEnum.Bus);

    Map.waitForLoadToComplete();

    Map.getStopByStopLabelAndPriority(stops[0].label, stops[0].priority).click({
      force: true,
    });

    Map.stopPopUp.getEditButton().click();

    StopForm.getLatitudeInput().clearAndType('1.0');

    StopForm.getAddTimingPlaceButton().click();
    CreateTimingPlaceForm.fillTimingPlaceForm({
      label: testTimingPlaceLabels.label1,
      description: 'New timing place description',
    });

    CreateTimingPlaceForm.getCloseButton().click();
    NavigationBlockedDialog.getTitle()
      .shouldBeVisible()
      .shouldHaveText('Hylätäänkö muutokset?');
    NavigationBlockedDialog.getResetButton().click();
    NavigationBlockedDialog.getTitle().should('not.exist');

    CreateTimingPlaceForm.getAddTimingPlaceSubmitButton().click();
    Toast.expectSuccessToast('Hastus-paikka luotu');

    StopForm.getModal().within(() => {
      cy.getByTestId('ModalHeader::closeButton').click();
    });
    NavigationBlockedDialog.getTitle()
      .shouldBeVisible()
      .shouldHaveText('Hylätäänkö muutokset?');
    NavigationBlockedDialog.getResetButton().click();
    NavigationBlockedDialog.getTitle().should('not.exist');

    MapPage.getCloseButton().click();
    NavigationBlockedDialog.getTitle()
      .shouldBeVisible()
      .shouldHaveText('Hylätäänkö muutokset?');
    NavigationBlockedDialog.getProceedButton().click();
    NavigationBlockedDialog.getTitle().should('not.exist');
    MapPage.getCloseButton().should('not.exist');
  });
});
