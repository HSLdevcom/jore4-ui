import {
  buildStop,
  infrastructureLinks,
  InfraLinkInsertInput,
  ReusableComponentsVehicleModeEnum,
  StopInsertInput,
  VehicleSubmodeOnInfraLinkInsertInput,
  ReusableComponentsVehicleSubmodeEnum,
} from '@hsl/jore4-test-db-manager';
import { ConfirmationDialog, FilterPanel, Map, StopForm } from '../pageObjects';
import { insertToDbHelper, removeFromDbHelper } from '../utils';

const testCoordinates = [24.925251259734353, 60.16287920585574];

const infraLinks: InfraLinkInsertInput[] = [
  {
    ...(infrastructureLinks[3] as InfraLinkInsertInput),
  },
];

const vehicleSubmodeOnInfrastructureLink: VehicleSubmodeOnInfraLinkInsertInput[] =
  [
    {
      infrastructure_link_id: infraLinks[0].infrastructure_link_id,
      vehicle_submode: ReusableComponentsVehicleSubmodeEnum.GenericBus,
    },
  ];

const stops: StopInsertInput[] = [
  {
    ...buildStop({
      label: 'Move stop test stop',
      located_on_infrastructure_link_id: infraLinks[0].infrastructure_link_id,
    }),
    scheduled_stop_point_id: '0f6254d9-dc60-4626-a777-ce4d4381d38a',
    measured_location: {
      type: 'Point',
      coordinates: [24.925251259734353, 60.16287920585574, 0],
    },
  },
];

const dbResources = {
  infraLinks,
  vehicleSubmodeOnInfrastructureLink,
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

  beforeEach(() => {
    deleteCreatedResources();
    insertToDbHelper(dbResources);

    mapFilterPanel = new FilterPanel();
    map = new Map();
    confirmationDialog = new ConfirmationDialog();
    stopForm = new StopForm();

    cy.setupTests();
    cy.mockLogin();
    map.visit({
      zoom: 15,
      lat: testCoordinates[1],
      lng: testCoordinates[0],
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

      map.getStopByStopLabel(stops[0].label).click();

      map.stopPopUp.getEditButton().click();

      stopForm.getLatitudeInput().should('have.value', testCoordinates[1]);
      stopForm.getLongitudeInput().should('have.value', testCoordinates[0]);
    },
  );
});
