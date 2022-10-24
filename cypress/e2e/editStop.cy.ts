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
  Toast,
} from '../pageObjects';
import { insertToDbHelper, removeFromDbHelper } from '../utils';

const test1StartCoordinates = [24.925251259734353, 60.16287920585574, 0];
const test1EndCoordinates = [24.924435868192024, 60.162622981678744];
const test2MoveCoordinates = [60.166533287996124, 24.935753563211073];

const infraLinks: InfraLinkInsertInput[] = [
  {
    ...(infrastructureLinks[0] as InfraLinkInsertInput),
    shape: {
      type: 'LineString',
      coordinates: [test1StartCoordinates, test1StartCoordinates],
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
      coordinates: test1StartCoordinates,
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
      lat: test1StartCoordinates[1],
      lng: test1StartCoordinates[0],
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
      mapFilterPanel.toggleShowStops(ReusableComponentsVehicleModeEnum.Bus);

      map.waitForMapToLoad();

      map.getStopByStopLabel(stops[0].label).click();

      map.stopPopUp.getMoveButton().click();

      map.clickRelativePoint(48, 52);

      confirmationDialog.getConfirmButton().click();

      cy.wait('@gqlEditStop').its('response.statusCode').should('equal', 200);

      toast.checkSuccessToastHasMessage('Pysäkki muokattu');

      // Wait is used only as a workaround to get the updated coordinates to show in the edit modal.
      // TODO: This can be refactored if a better solution is found.
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(100);

      map.getStopByStopLabel(stops[0].label).click();

      map.stopPopUp.getEditButton().click();

      stopForm.getLatitudeInput().should('have.value', test1EndCoordinates[1]);
      stopForm.getLongitudeInput().should('have.value', test1EndCoordinates[0]);
    },
  );

  it(
    'Should move a stop on the map by changing the coordinates',
    // Map opening seems to take time, so we increase the timeout
    { scrollBehavior: 'bottom', defaultCommandTimeout: 10000 },
    () => {
      const updatedStopInfo = {
        label: 'Moved stop new label',
        latitude: String(test2MoveCoordinates[0]),
        longitude: String(test2MoveCoordinates[1]),
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

      stopForm.getLatitudeInput().should('have.value', test2MoveCoordinates[0]);
      stopForm
        .getLongitudeInput()
        .should('have.value', test2MoveCoordinates[1]);
    },
  );
});
