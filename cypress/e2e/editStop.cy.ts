import {
  buildStop,
  InfraLinkInsertInput,
  InfrastructureNetworkDirectionEnum,
  InfrastructureNetworkInfrastructureLinkInsertInput,
  InfrastructureNetworkExternalSourceEnum,
  ReusableComponentsVehicleModeEnum,
  StopInsertInput,
  VehicleSubmodeOnInfraLinkInsertInput,
  ReusableComponentsVehicleSubmodeEnum,
} from '@hsl/jore4-test-db-manager';
import { ConfirmationDialog } from '../pageObjects/ConfirmationDialog';
import { FilterPanel } from '../pageObjects/FilterPanel';
import { Map } from '../pageObjects/Map';
import { StopForm } from '../pageObjects/StopForm';
import { insertToDbHelper, removeFromDbHelper } from '../utils';

// TODO: Better location for the test stop. Currently placed on top of another stop in the beginning.
const infrastructureLinks: InfrastructureNetworkInfrastructureLinkInsertInput[] =
  [
    {
      infrastructure_link_id: '3986bcc4-f3d7-44b8-b46a-0ade9d014af6',
      direction: InfrastructureNetworkDirectionEnum.Bidirectional,
      shape: {
        type: 'LineString',
        coordinates: [
          [24.925251259734353, 60.16287920585574, 15],
          [24.92832655782573, 60.16391811339392, 15],
        ],
      },
      estimated_length_in_metres: 10,
      external_link_source: InfrastructureNetworkExternalSourceEnum.DigiroadR,
      external_link_id: '1',
    },
  ];

const infraLinks: InfraLinkInsertInput[] = [
  {
    ...(infrastructureLinks[0] as InfraLinkInsertInput),
  },
];

const stops: StopInsertInput[] = [
  {
    ...buildStop({
      label: 'Move stop test stop',
      located_on_infrastructure_link_id: infraLinks[0].infrastructure_link_id,
    }),
    scheduled_stop_point_id: '0f6254d9-dc60-4626-a777-ce4d4381d38a',
  },
];

const vehicleSubmodeOnInfrastructureLink: VehicleSubmodeOnInfraLinkInsertInput[] =
  [
    {
      infrastructure_link_id: infrastructureLinks[0].infrastructure_link_id,
      vehicle_submode: ReusableComponentsVehicleSubmodeEnum.GenericBus,
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
    cy.visit(
      `/routes?mapOpen=true&lng=${infrastructureLinks[0].shape.coordinates[0][0]}&lat=${infrastructureLinks[0].shape.coordinates[0][1]}&z=${infrastructureLinks[0].shape.coordinates[0][2]}`,
    );
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

      map.stopMarkerShouldExist(stops[0].label);

      map.getStopByStopLabel(stops[0].label).click();

      map.stopPopUp.getEditButton().click();

      stopForm.getLatitudeInput().should('have.value', '60.16391811339392');
      stopForm.getLongitudeInput().should('have.value', '24.92832655782573');
    },
  );
});
