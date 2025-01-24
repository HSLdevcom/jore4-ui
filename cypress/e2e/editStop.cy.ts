/* eslint-disable jest/valid-expect */
import {
  Priority,
  ReusableComponentsVehicleModeEnum,
  StopInsertInput,
} from '@hsl/jore4-test-db-manager';
import {
  buildInfraLinksAlongRoute,
  buildStopsOnInfraLinks,
  getClonedBaseDbResources,
  testInfraLinkExternalIds,
} from '../datasets/base';
import { getClonedBaseStopRegistryData } from '../datasets/stopRegistry';
import { Tag } from '../enums';
import {
  ConfirmationDialog,
  FilterPanel,
  Map,
  StopForm,
  StopFormInfo,
  Toast,
  ToastType,
} from '../pageObjects';
import { UUID } from '../types';
import { SupportedResources, insertToDbHelper } from '../utils';
import {
  expectGraphQLCallToReturnError,
  expectGraphQLCallToSucceed,
} from '../utils/assertions';
import { debug } from '../utils/templateStringHelpers';
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
        lng: 24.93892259957684,
        lat: 60.1657872112159,
      };

      mapFilterPanel.toggleShowStops(ReusableComponentsVehicleModeEnum.Bus);

      map.waitForLoadToComplete();

      map
        .getStopByStopLabelAndPriority(stops[0].label, stops[0].priority)
        .click();

      map.stopPopUp.getMoveButton().click();

      // Point where the stop is moved on the map. Moving the stop here gives it the endCoordinates.
      // Map view zoom level should not be changed in the test since it would naturally affect this test location.
      map.clickRelativePoint(71, 35);

      confirmationDialog.getConfirmButton().click();

      expectGraphQLCallToSucceed('@gqlEditStop');
      expectGraphQLCallToSucceed('@gqlEditStopPlace').then((intercepted) => {
        const { body } = intercepted.response;
        expect(body.data, debug`Body:\n${body}`).to.deep.nested.include({
          'stop_registry.mutateStopPlace[0].geometry.coordinates': [
            endCoordinates.lng,
            endCoordinates.lat,
          ],
        });
      });

      toast.expectSuccessToast('Pysäkki muokattu');

      map.waitForLoadToComplete();

      map
        .getStopByStopLabelAndPriority(stops[0].label, stops[0].priority)
        .click();

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
        .click();

      map.stopPopUp.getDeleteButton().click();

      confirmationDialog.getConfirmButton().click();

      expectGraphQLCallToSucceed('@gqlRemoveStop');

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

      const updatedStopInfo: StopFormInfo = {
        label: 'Add timing place stop label',
        timingPlace: '1ALKU',
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
        .click();

      map.stopPopUp.getEditButton().click();

      stopForm.fillForm(updatedStopInfo);
      stopForm.save();

      confirmationDialog.getConfirmButton().click();

      expectGraphQLCallToSucceed('@gqlEditStop');
      expectGraphQLCallToSucceed('@gqlEditStopPlace').then((intercepted) => {
        const { body } = intercepted.response;
        const editedStopPlace = 'stop_registry.mutateStopPlace[0]';

        expect(body.data, debug`Body:\n${body}`).to.deep.nested.include({
          [`${editedStopPlace}.name.value`]: updatedStopInfo.label,
          [`${editedStopPlace}.geometry.coordinates`]: [
            testCoordinates2.lng,
            testCoordinates2.lat,
          ],
        });
      });

      toast.expectMultipleToasts([
        { type: ToastType.SUCCESS, message: 'Pysäkki muokattu' },
        { type: ToastType.WARNING, message: 'Pysäkkien suodattimia muutettu' },
      ]);

      map
        .getStopByStopLabelAndPriority(
          updatedStopInfo.label,
          // Assert non-null since priority is defined in the updatedStopInfo
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          updatedStopInfo.priority!,
        )
        .click();

      map.stopPopUp.getEditButton().click();

      stopForm.getLabelInput().should('have.value', updatedStopInfo.label);
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
        .click();

      map.stopPopUp.getEditButton().click();

      stopForm.getAddTimingPlaceButton().click();

      stopForm.createTimingPlaceForm.fillTimingPlaceFormAndSave({
        label: testTimingPlaceLabels.label1,
        description: 'New timing place description',
      });

      stopForm.save();

      confirmationDialog.getConfirmButton().click();

      toast.expectSuccessToast('Hastus-paikka luotu');

      expectGraphQLCallToSucceed('@gqlEditStop');

      map
        .getStopByStopLabelAndPriority(stops[0].label, stops[0].priority)
        .click();
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

  it('should not update StopPlace if StopPoint save fails', () => {
    mapFilterPanel.toggleShowStops(ReusableComponentsVehicleModeEnum.Bus);

    map.waitForLoadToComplete();

    map
      .getStopByStopLabelAndPriority(stops[0].label, stops[0].priority)
      .click();

    map.stopPopUp.getEditButton().click();

    // Reverse date range
    stopForm.fillForm({
      validityStartISODate: '2024-01-01',
      validityEndISODate: '2020-01-01',
      label: 'is needed',
    });
    stopForm.save();
    confirmationDialog.getConfirmButton().click();

    toast.expectDangerToast(
      'Tallennus epäonnistui, ApolloError: range lower bound must be less than or equal to range upper bound, range lower bound must be less than or equal to range upper bound',
    );
    expectGraphQLCallToReturnError('@gqlEditStop');
    // And then there is really no way to test, that the Tiamat update
    // query was not send out.
  });
});
