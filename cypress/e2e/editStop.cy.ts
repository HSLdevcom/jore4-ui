import {
  buildStop,
  InfraLinkInsertInput,
  infrastructureLinks,
  ReusableComponentsVehicleModeEnum,
  StopInsertInput,
  vehicleSubmodeOnInfrastructureLink,
} from '@hsl/jore4-test-db-manager';
import {
  ConfirmationDialog,
  FilterPanel,
  Map,
  StopForm,
  Toast,
} from '../pageObjects';
import { insertToDbHelper, removeFromDbHelper } from '../utils';

const startCoordinates = [24.925251259734353, 60.16287920585574, 0];
const endCoordinates = [24.924435868192024, 60.162622981678744];

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
      mapFilterPanel.toggleShowStops(ReusableComponentsVehicleModeEnum.Bus);

      map.waitForMapToLoad();

      map.getStopByStopLabel(stops[0].label).click();

      map.stopPopUp.getMoveButton().click();

      map.clickRelativePoint(48, 52);

      confirmationDialog.getConfirmButton().click();

      cy.wait('@gqlEditStop').its('response.statusCode').should('equal', 200);

      toast.checkSuccessToastHasMessage('Pysäkki muokattu');

      // Visit the page again to refresh the coordinates shown in the stop edit modal.
      // TODO: Check at some point if the test passes without map.visit.

      map.visit({
        zoom: 15,
        lat: startCoordinates[1],
        lng: startCoordinates[0],
      });

      mapFilterPanel.toggleShowStops(ReusableComponentsVehicleModeEnum.Bus);

      map.getStopByStopLabel(stops[0].label).click();

      map.stopPopUp.getEditButton().click();

      stopForm.getLatitudeInput().should('have.value', endCoordinates[1]);
      stopForm.getLongitudeInput().should('have.value', endCoordinates[0]);
    },
  );
});
