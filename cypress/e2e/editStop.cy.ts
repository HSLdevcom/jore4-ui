import {
  buildStop,
  InfraLinkInsertInput,
  infrastructureLinks,
  ReusableComponentsVehicleModeEnum,
  StopInsertInput,
  vehicleSubmodeOnInfrastructureLink,
} from '@hsl/jore4-test-db-manager';
import { DateTime } from 'luxon';
import {
  ConfirmationDialog,
  FilterPanel,
  Map,
  StopForm,
  StopFormInfo,
  Toast,
} from '../pageObjects';
import { insertToDbHelper, removeFromDbHelper } from '../utils';

// Point where stop is initially added and where map view is opened
const startCoordinates = [24.925251259734353, 60.16287920585574, 0];

const infraLinks: InfraLinkInsertInput[] = [
  {
    ...(infrastructureLinks[0] as InfraLinkInsertInput),
    shape: {
      type: 'LineString',
      coordinates: [startCoordinates, startCoordinates],
    },
  },
];

const vehicleSubmodesOnInfrastructureLink = [
  vehicleSubmodeOnInfrastructureLink[0],
];

const stops: StopInsertInput[] = [
  {
    ...buildStop({
      label: 'Move stop test stop',
      located_on_infrastructure_link_id: infraLinks[0].infrastructure_link_id,
    }),
    validity_start: DateTime.fromISO('2022-03-20T22:00:00+00:00'),
    scheduled_stop_point_id: '68684b40-c4db-4c72-b3b8-c3307dde7a72',
    measured_location: {
      type: 'Point',
      coordinates: startCoordinates,
    },
  },
];

const dbResources = {
  infraLinks,
  vehicleSubmodeOnInfrastructureLink: vehicleSubmodesOnInfrastructureLink,
  stops,
};

const deleteCreatedResources = () => {
  removeFromDbHelper(dbResources);
};

describe('Stop creation tests', () => {
  let mapFilterPanel: FilterPanel;
  let map: Map;
  let confirmationDialog: ConfirmationDialog;
  let stopForm: StopForm;
  let toast: Toast;

  beforeEach(() => {
    deleteCreatedResources();
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
      lat: startCoordinates[1],
      lng: startCoordinates[0],
    });
  });

  afterEach(() => {
    deleteCreatedResources();
  });

  it(
    'Should move a stop on the map',
    // Map opening seems to take time, so we increase the timeout
    { scrollBehavior: 'bottom', defaultCommandTimeout: 10000 },
    () => {
      // Coordinates for the point where the stop is moved in the test.
      const endCoordinates = [24.924435868192024, 60.162622981678744];

      mapFilterPanel.toggleShowStops(ReusableComponentsVehicleModeEnum.Bus);

      map.waitForMapToLoad();

      map.getStopByStopLabel(stops[0].label).click();

      map.stopPopUp.getMoveButton().click();

      // Point where the stop is moved on the map. Moving the stop here gives it the endCoordinates.
      // Map view zoom level should not be changed in the test since it would naturally affect this test location.
      map.clickRelativePoint(48, 52);

      confirmationDialog.getConfirmButton().click();

      cy.wait('@gqlEditStop').its('response.statusCode').should('equal', 200);

      toast.checkSuccessToastHasMessage('Pysäkki muokattu');

      // Workaround to get the updated coordinates to show in the stop edit modal.
      // TODO: Find a better way to make the coordinates update faster in the modal.
      mapFilterPanel.toggleShowStops(ReusableComponentsVehicleModeEnum.Bus);
      mapFilterPanel.toggleShowStops(ReusableComponentsVehicleModeEnum.Bus);

      map.getStopByStopLabel(stops[0].label).click();

      map.stopPopUp.getEditButton().click();

      stopForm.getLatitudeInput().should('have.value', endCoordinates[1]);
      stopForm.getLongitudeInput().should('have.value', endCoordinates[0]);
    },
  );

  it(
    'Should move a stop on the map by changing the coordinates',
    // Map opening seems to take time, so we increase the timeout
    { scrollBehavior: 'bottom', defaultCommandTimeout: 10000 },
    () => {
      const moveCoordinates = [60.166533287996124, 24.935753563211073];
      const updatedStopInfo: StopFormInfo = {
        label: 'Moved stop new label',
        latitude: String(moveCoordinates[0]),
        longitude: String(moveCoordinates[1]),
      };

      mapFilterPanel.toggleShowStops(ReusableComponentsVehicleModeEnum.Bus);

      map.waitForMapToLoad();

      map.getStopByStopLabel(stops[0].label).click();

      map.stopPopUp.getEditButton().click();

      stopForm.fillStopForm(updatedStopInfo);
      stopForm.save();

      confirmationDialog.getConfirmButton().click();

      cy.wait('@gqlEditStop').its('response.statusCode').should('equal', 200);

      toast.checkSuccessToastHasMessage('Pysäkki muokattu');

      map.getStopByStopLabel(updatedStopInfo.label).click();

      map.stopPopUp.getEditButton().click();

      stopForm
        .getLatitudeInput()
        .should('have.value', updatedStopInfo.latitude);
      stopForm
        .getLongitudeInput()
        .should('have.value', updatedStopInfo.longitude);
    },
  );
});
