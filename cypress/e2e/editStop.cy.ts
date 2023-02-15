import {
  buildStop,
  Priority,
  ReusableComponentsVehicleModeEnum,
  ReusableComponentsVehicleSubmodeEnum,
  ServicePatternVehicleModeOnScheduledStopPointInsertInput,
  StopInsertInput,
  timingPlaces,
  VehicleSubmodeOnInfraLinkInsertInput,
} from '@hsl/jore4-test-db-manager';
import { DateTime } from 'luxon';
import { Tag } from '../enums';
import {
  ConfirmationDialog,
  FilterPanel,
  Map,
  StopForm,
  StopFormInfo,
  Toast,
} from '../pageObjects';
import { insertToDbHelper, removeFromDbHelper } from '../utils';
import { deleteTimingPlacesByLabel } from './utils';

// Stops are created on these infralinks via insertToDbHelper or the map view.
// vehicleSubmodeOnInfrastructureLink information is needed for these infralinks.

const infraLinkIds = {
  infraLink1: '73bc2df9-f5af-4c38-a1dd-5ed1f71c90a8',
  infraLink2: 'ea69415a-9c54-4327-8836-f38b36d8fa99',
  infraLink3: '13de61c2-3fc9-4255-955f-0a2350c389e1',
  infraLink4: '4c098659-17d8-44e5-95a9-d8879468dd58',
};

const testTimingPlaceLabels = {
  label1: 'Test created timing place label 1',
};

const vehicleSubmodeOnInfrastructureLink: VehicleSubmodeOnInfraLinkInsertInput[] =
  [
    {
      infrastructure_link_id: infraLinkIds.infraLink1,
      vehicle_submode: ReusableComponentsVehicleSubmodeEnum.GenericBus,
    },
    {
      infrastructure_link_id: infraLinkIds.infraLink2,
      vehicle_submode: ReusableComponentsVehicleSubmodeEnum.GenericBus,
    },
    {
      infrastructure_link_id: infraLinkIds.infraLink3,
      vehicle_submode: ReusableComponentsVehicleSubmodeEnum.GenericBus,
    },
    {
      infrastructure_link_id: infraLinkIds.infraLink4,
      vehicle_submode: ReusableComponentsVehicleSubmodeEnum.GenericBus,
    },
  ];

// This point exists on infraLink1
const testCoordinates1 = {
  lng: 24.92492146851626,
  lat: 60.1634759878872,
  el: 0,
};

const stops: StopInsertInput[] = [
  {
    ...buildStop({
      label: 'Move stop test stop',
      located_on_infrastructure_link_id: infraLinkIds.infraLink1,
    }),
    validity_start: DateTime.fromISO('2022-03-20T22:00:00+00:00'),
    scheduled_stop_point_id: '68684b40-c4db-4c72-b3b8-c3307dde7a72',
    measured_location: {
      type: 'Point',
      coordinates: Object.values(testCoordinates1),
    },
  },
];

const vehicleModeOnScheduledStopPoint: ServicePatternVehicleModeOnScheduledStopPointInsertInput[] =
  [
    {
      scheduled_stop_point_id: stops[0].scheduled_stop_point_id,
      vehicle_mode: ReusableComponentsVehicleModeEnum.Bus,
    },
  ];

const dbResources = {
  vehicleSubmodeOnInfrastructureLink,
  stops,
  vehicleModeOnScheduledStopPoint,
  timingPlaces,
};

const clearDatabase = () => {
  removeFromDbHelper(dbResources);
  deleteTimingPlacesByLabel(Object.values(testTimingPlaceLabels));
};

describe('Stop editing tests', () => {
  let mapFilterPanel: FilterPanel;
  let map: Map;
  let confirmationDialog: ConfirmationDialog;
  let stopForm: StopForm;
  let toast: Toast;

  beforeEach(() => {
    clearDatabase();
    insertToDbHelper(dbResources);

    mapFilterPanel = new FilterPanel();
    map = new Map();
    confirmationDialog = new ConfirmationDialog();
    stopForm = new StopForm();
    toast = new Toast();

    cy.setupTests();
    cy.mockLogin();
    map.visit({
      zoom: 15,
      lat: testCoordinates1.lat,
      lng: testCoordinates1.lng,
    });
  });

  afterEach(() => {
    clearDatabase();
  });

  it(
    'Should move a stop on the map',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    { tags: Tag.Stops, scrollBehavior: 'bottom' },
    () => {
      // Coordinates for the point where the stop is moved in the test.
      const endCoordinates = { lng: 24.92410607697449, lat: 60.16321976836281 };

      mapFilterPanel.toggleShowStops(ReusableComponentsVehicleModeEnum.Bus);

      map.waitForLoadToComplete();

      map
        .getStopByStopLabelAndPriority(stops[0].label, stops[0].priority)
        .click();

      map.stopPopUp.getMoveButton().click();

      // Point where the stop is moved on the map. Moving the stop here gives it the endCoordinates.
      // Map view zoom level should not be changed in the test since it would naturally affect this test location.
      map.clickRelativePoint(48, 52);

      confirmationDialog.getConfirmButton().click();

      cy.wait('@gqlEditStop').its('response.statusCode').should('equal', 200);

      toast.checkSuccessToastHasMessage('Pysäkki muokattu');

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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    { tags: Tag.Stops, scrollBehavior: 'bottom' },
    () => {
      mapFilterPanel.toggleShowStops(ReusableComponentsVehicleModeEnum.Bus);

      map.waitForLoadToComplete();

      map
        .getStopByStopLabelAndPriority(stops[0].label, stops[0].priority)
        .click();

      map.stopPopUp.getDeleteButton().click();

      confirmationDialog.getConfirmButton().click();

      cy.wait('@gqlRemoveStop').its('response.statusCode').should('equal', 200);

      toast.checkSuccessToastHasMessage('Pysäkki poistettu');

      map
        .getStopByStopLabelAndPriority(stops[0].label, stops[0].priority)
        .should('not.exist');
    },
  );

  it(
    'Should edit stop info',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    { tags: Tag.Stops, scrollBehavior: 'bottom' },
    () => {
      const testCoordinates2 = {
        lng: 24.92904198486008,
        lat: 60.16490775039894,
      };

      const updatedStopInfo: StopFormInfo = {
        label: 'Add timing place stop label',
        // seed timing places should always have label defined
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        timingPlace: timingPlaces[0].label!,
        latitude: String(testCoordinates2.lat),
        longitude: String(testCoordinates2.lng),
        validityStartISODate: '2019-01-01',
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

      cy.wait('@gqlEditStop').its('response.statusCode').should('equal', 200);

      toast.checkSuccessToastHasMessage('Pysäkki muokattu');

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
      stopForm.changeValidityForm
        .getStartDateInput()
        .should('have.value', updatedStopInfo.validityStartISODate);
      stopForm.changeValidityForm
        .getEndDateInput()
        .should('have.value', updatedStopInfo.validityEndISODate);
      stopForm.getLatitudeInput().should('have.value', testCoordinates2.lat);
      stopForm.getLongitudeInput().should('have.value', testCoordinates2.lng);
    },
  );

  it(
    'Should create a new timing place',
    // Map opening seems to take time, so we increase the timeout
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
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

      toast.checkSuccessToastHasMessage('Hastus-paikka luotu');

      cy.wait('@gqlEditStop').its('response.statusCode').should('equal', 200);

      map
        .getStopByStopLabelAndPriority(stops[0].label, stops[0].priority)
        .click();
      map.stopPopUp.getEditButton().click();

      stopForm
        .getTimingPlaceDropdown()
        .click()
        .find('ul')
        .should('contain', testTimingPlaceLabels.label1);
    },
  );
});
