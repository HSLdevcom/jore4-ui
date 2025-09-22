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
} from '../datasets/base';
import { getClonedBaseStopRegistryData } from '../datasets/stopRegistry';
import { Tag } from '../enums';
import {
  BaseStopFormInfo,
  ConfirmationDialog,
  FilterPanel,
  Map,
  MapPage,
  NavigationBlockedDialog,
  StopForm,
  Toast,
  ToastType,
} from '../pageObjects';
import { UUID } from '../types';
import { SupportedResources, insertToDbHelper } from '../utils';
import { expectGraphQLCallToSucceed } from '../utils/assertions';
import { InsertedStopRegistryIds, mapViewport } from './utils';

const testTimingPlaceLabels = {
  label1: 'Test created timing place label 1',
};

// Centers the stops on the screen
const testCoordinates1 = {
  lng: 24.93458814980886,
  lat: 60.16493319843619,
  el: 0,
};

describe('Stop editing tests', () => {
  const mapFilterPanel = new FilterPanel();
  const map = new Map();
  const confirmationDialog = new ConfirmationDialog();
  const stopForm = new StopForm();
  const toast = new Toast();

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
      map.visit({
        // Zoom in so that the stops are not shown on top of each other
        zoom: 16,
        lat: testCoordinates1.lat,
        lng: testCoordinates1.lng,
      });
    });
  });

  it(
    'Should move a stop on the map',
    { tags: Tag.Stops, scrollBehavior: 'bottom', ...mapViewport },
    () => {
      // Coordinates for the point where the stop is moved in the test.
      const endCoordinates = {
        lng: 24.93892259957707,
        lat: 60.16576852992367,
      };

      mapFilterPanel.toggleShowStops(ReusableComponentsVehicleModeEnum.Bus);

      map.waitForLoadToComplete();

      map
        .getStopByStopLabelAndPriority(stops[0].label, stops[0].priority)
        .click({ force: true });

      map.stopPopUp.getMoveButton().click();

      // Point where the stop is moved on the map. Moving the stop here gives it the endCoordinates.
      // Map view zoom level should not be changed in the test since it would naturally affect this test location.
      map.clickRelativePoint(71, 35);

      confirmationDialog.getConfirmButton().click();

      expectGraphQLCallToSucceed('@gqlEditStop');
      expectGraphQLCallToSucceed('@gqlEditStopPlace');

      toast.expectSuccessToast('Pysäkki muokattu');
      map.stopPopUp.getCloseButton().click();

      map.waitForLoadToComplete();

      map
        .getStopByStopLabelAndPriority(stops[0].label, stops[0].priority)
        .click({ force: true });

      map.stopPopUp.getEditButton().click();

      stopForm.getLatitudeInput().should('have.value', endCoordinates.lat);
      stopForm.getLongitudeInput().should('have.value', endCoordinates.lng);
    },
  );

  it(
    'Should delete a stop',
    { tags: Tag.Stops, scrollBehavior: 'bottom' },
    () => {
      mapFilterPanel.toggleShowStops(ReusableComponentsVehicleModeEnum.Bus);

      map.waitForLoadToComplete();

      map
        .getStopByStopLabelAndPriority(stops[0].label, stops[0].priority)
        .click({ force: true });

      map.stopPopUp.getDeleteButton().click();

      confirmationDialog.getConfirmButton().click();

      expectGraphQLCallToSucceed('@gqlRemoveStop');
      expectGraphQLCallToSucceed('@gqlDeleteQuay');

      toast.expectSuccessToast('Pysäkki poistettu');

      map
        .getStopByStopLabelAndPriority(stops[0].label, stops[0].priority)
        .should('not.exist');
    },
  );

  it(
    'Should edit stop info',
    { tags: Tag.Stops, scrollBehavior: 'bottom' },
    () => {
      const testCoordinates2 = {
        lng: 24.92904198486008,
        lat: 60.16490775039894,
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
      };

      mapFilterPanel.toggleShowStops(ReusableComponentsVehicleModeEnum.Bus);

      map.waitForLoadToComplete();

      map
        .getStopByStopLabelAndPriority(stops[0].label, stops[0].priority)
        .click({ force: true });

      map.stopPopUp.getEditButton().click();

      // Problems with NavigationBlocker appearing mid-typing without this wait
      // Needs to be fixed properly later
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(300);
      stopForm.fillBaseForm(updatedStopInfo);
      stopForm.save();

      confirmationDialog.getConfirmButton().click();

      expectGraphQLCallToSucceed('@gqlEditStop');
      expectGraphQLCallToSucceed('@gqlEditStopPlace');

      toast.expectMultipleToasts([
        { type: ToastType.SUCCESS, message: 'Pysäkki muokattu' },
        { type: ToastType.WARNING, message: 'Pysäkkien suodattimia muutettu' },
      ]);
      map.stopPopUp.getCloseButton().click();

      map
        .getStopByStopLabelAndPriority(
          stops[0].label,
          // Assert non-null since priority is defined in the updatedStopInfo
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          updatedStopInfo.priority!,
        )
        .click();

      map.stopPopUp.getEditButton().click();

      stopForm.getPublicCodeInput().should('have.value', stops[0].label);
      stopForm
        .getTimingPlaceDropdown()
        .should('contain', updatedStopInfo.timingPlace);
      stopForm.priorityForm.assertSelectedPriority(updatedStopInfo.priority);
      stopForm.changeValidityForm.validityPeriodForm
        .getStartDateInput()
        .should('have.value', updatedStopInfo.validityStartISODate);
      stopForm.changeValidityForm.validityPeriodForm
        .getEndDateInput()
        .should('have.value', updatedStopInfo.validityEndISODate);
      stopForm
        .getLocationFinInput()
        .should('have.value', updatedStopInfo.locationFin);
      stopForm
        .getLocationSweInput()
        .should('have.value', updatedStopInfo.locationSwe);
      stopForm.getLatitudeInput().should('have.value', testCoordinates2.lat);
      stopForm.getLongitudeInput().should('have.value', testCoordinates2.lng);
    },
  );

  it(
    'Should create a new timing place',
    { tags: Tag.Stops, scrollBehavior: 'bottom' },
    () => {
      mapFilterPanel.toggleShowStops(ReusableComponentsVehicleModeEnum.Bus);

      map.waitForLoadToComplete();

      map
        .getStopByStopLabelAndPriority(stops[0].label, stops[0].priority)
        .click({ force: true });

      map.stopPopUp.getEditButton().click();

      stopForm.getAddTimingPlaceButton().click();

      stopForm.createTimingPlaceForm.fillTimingPlaceFormAndSave({
        label: testTimingPlaceLabels.label1,
        description: 'New timing place description',
      });

      toast.expectSuccessToast('Hastus-paikka luotu');

      stopForm.save();

      confirmationDialog.getConfirmButton().click();

      expectGraphQLCallToSucceed('@gqlEditStop');
      stopForm.getModal().should('not.exist');
      expectGraphQLCallToSucceed('@gqlGetMapStops');

      map
        .getStopByStopLabelAndPriority(stops[0].label, stops[0].priority)
        .click({ force: true });
      expectGraphQLCallToSucceed('@gqlGetStopInfoForEditingOnMap');

      map.stopPopUp.getEditButton().click();

      stopForm.getTimingPlaceDropdown().type(testTimingPlaceLabels.label1);

      // Wait for the search results before trying to find the result list item
      expectGraphQLCallToSucceed('@gqlGetTimingPlacesForCombobox');

      stopForm
        .getTimingPlaceDropdown()
        .find('[role="listbox"]')
        .should('contain', testTimingPlaceLabels.label1);
    },
  );

  it('should not update StopPoint if StopPlace save fails', () => {
    mapFilterPanel.toggleShowStops(ReusableComponentsVehicleModeEnum.Bus);

    map.waitForLoadToComplete();

    map
      .getStopByStopLabelAndPriority(stops[0].label, stops[0].priority)
      .click({ force: true });

    map.stopPopUp.getEditButton().click();

    // Problems with NavigationBlocker appearing mid-typing without this wait
    // Needs to be fixed properly later
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(300);
    stopForm.fillBaseForm({
      validityStartISODate: '2024-01-01',
      validityEndISODate: '2029-12-31',
    });

    cy.intercept('POST', '/api/graphql/v1/graphql?q=EditStopPlace', {
      statusCode: 500,
    });

    stopForm.save();
    confirmationDialog.getConfirmButton().click();

    toast.expectDangerToast(
      'Pysäkkien päivitys pysäkkirekisteriin epäonnistui! Muutoksia ei ole myöskään viety linjastoon. Syy: Response not successful: Received status code 500',
    );
  });

  it('should warn if StopPlace save succeeds but Stop Point fails', () => {
    mapFilterPanel.toggleShowStops(ReusableComponentsVehicleModeEnum.Bus);

    map.waitForLoadToComplete();

    map
      .getStopByStopLabelAndPriority(stops[0].label, stops[0].priority)
      .click({ force: true });

    map.stopPopUp.getEditButton().click();

    // Problems with NavigationBlocker appearing mid-typing without this wait
    // Needs to be fixed properly later
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(300);
    stopForm.fillBaseForm({
      validityStartISODate: '2024-01-01',
      validityEndISODate: '2029-12-31',
    });

    cy.intercept('POST', '/api/graphql/v1/graphql?q=EditStop', {
      statusCode: 500,
    });

    stopForm.save();
    confirmationDialog.getConfirmButton().click();

    toast.expectDangerToast(
      'Pysäkkien tiedot on päivitetty pysäkkirekisteriin, mutta niiden vienti linjastoon epäonnistui! Tallennusta on syytä yrittää uudelleen! Syy: Response not successful: Received status code 500',
    );
  });

  it(
    'Should warn about unsaved forms',
    { tags: Tag.Stops, scrollBehavior: 'bottom' },
    () => {
      const mapPage = new MapPage();
      const navBlock = new NavigationBlockedDialog();
      mapFilterPanel.toggleShowStops(ReusableComponentsVehicleModeEnum.Bus);

      map.waitForLoadToComplete();

      map
        .getStopByStopLabelAndPriority(stops[0].label, stops[0].priority)
        .click({ force: true });

      map.stopPopUp.getEditButton().click();

      // Problems with NavigationBlocker appearing mid-typing without this wait
      // Needs to be fixed properly later
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(300);
      stopForm.getLatitudeInput().clearAndType('1.0');

      stopForm.getAddTimingPlaceButton().click();
      stopForm.createTimingPlaceForm.fillTimingPlaceForm({
        label: testTimingPlaceLabels.label1,
        description: 'New timing place description',
      });

      stopForm.createTimingPlaceForm.getCloseButton().click();
      navBlock
        .getTitle()
        .shouldBeVisible()
        .shouldHaveText('Hylätäänkö muutokset?');
      navBlock.getResetButton().click();
      navBlock.getTitle().should('not.exist');

      stopForm.createTimingPlaceForm.getAddTimingPlaceSubmitButton().click();
      toast.expectSuccessToast('Hastus-paikka luotu');

      stopForm.getModal().within(() => {
        cy.getByTestId('ModalHeader::closeButton').click();
      });
      navBlock
        .getTitle()
        .shouldBeVisible()
        .shouldHaveText('Hylätäänkö muutokset?');
      navBlock.getResetButton().click();
      navBlock.getTitle().should('not.exist');

      mapPage.getCloseButton().click();
      navBlock
        .getTitle()
        .shouldBeVisible()
        .shouldHaveText('Hylätäänkö muutokset?');
      navBlock.getProceedButton().click();
      navBlock.getTitle().should('not.exist');
      mapPage.getCloseButton().should('not.exist');
    },
  );
});
