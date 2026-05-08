import {
  Priority,
  ReusableComponentsVehicleModeEnum,
  StopAreaInput,
  StopRegistryGeoJsonType,
  StopRegistryTransportModeType,
} from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';
import { Tag } from '../../enums';
import { MapPage, StopDetailsPage, Toast } from '../../pageObjects';
import { InsertedStopRegistryIds } from '../utils';

// Test labels
const busStopLabel = 'H9901';
const busAreaCode = 'HYB01';
const tramAreaCode = 'HYB02';

// Coordinates where bus infra links are known to exist (same as createStop.cy.ts)
const testCoordinates = {
  lat: 60.164074274478054,
  lng: 24.93021804533524,
};

const stopAreaInput: Array<StopAreaInput> = [
  {
    StopArea: {
      transportMode: StopRegistryTransportModeType.Bus,
      name: { lang: 'fin', value: 'Hybrid bussi-alue' },
      privateCode: { type: 'HSL/TEST', value: busAreaCode },
      geometry: {
        coordinates: [testCoordinates.lng, testCoordinates.lat],
        type: StopRegistryGeoJsonType.Point,
      },
    },
    organisations: null,
  },
  {
    StopArea: {
      transportMode: StopRegistryTransportModeType.Tram,
      name: { lang: 'fin', value: 'Hybrid ratikka-alue' },
      privateCode: { type: 'HSL/TEST', value: tramAreaCode },
      geometry: {
        coordinates: [testCoordinates.lng, testCoordinates.lat],
        type: StopRegistryGeoJsonType.Point,
      },
    },
    organisations: null,
  },
];

describe(
  'Hybrid stop (multi-transport-mode)',
  { tags: [Tag.StopRegistry, Tag.Stops] },
  () => {
    beforeEach(() => {
      cy.task('resetDbs');

      cy.task<InsertedStopRegistryIds>('insertStopRegistryData', {
        stopPlaces: stopAreaInput,
        stopPointsRequired: false,
      });

      cy.setupTests();
      cy.mockLogin();
    });

    it('Should create a bus stop, make it hybrid (add tram), then remove tram', () => {
      // Step 1: Create a bus stop on the map
      MapPage.map.visit({
        zoom: 16,
        lat: testCoordinates.lat,
        lng: testCoordinates.lng,
      });

      MapPage.createStopAtLocation({
        stopFormInfo: {
          publicCode: busStopLabel,
          stopPlace: busAreaCode,
          validityStartISODate: '2024-01-01',
          priority: Priority.Standard,
          reasonForChange: 'E2E test',
        },
        clickRelativePoint: {
          xPercentage: 40,
          yPercentage: 55,
        },
        vehicleMode: ReusableComponentsVehicleModeEnum.Bus,
      });

      MapPage.gqlStopShouldBeCreatedSuccessfully();
      MapPage.checkStopSubmitSuccessToast();

      // Step 2: Navigate to stop details page
      StopDetailsPage.visit(busStopLabel);
      StopDetailsPage.page().shouldBeVisible();

      // Step 3: Open "Make hybrid" modal via extra actions menu
      StopDetailsPage.titleRow.actionsMenuButton().click();
      StopDetailsPage.titleRow.actionsMenuMakeHybridButton().click();

      // Step 4: Select tram transport mode
      StopDetailsPage.makeHybridModal.modal().shouldBeVisible();
      StopDetailsPage.makeHybridModal.transportModeDropdown().click();
      cy.get('[role="option"]').contains('Raitiovaunu').click();

      // Step 5: Search and select the tram stop area
      StopDetailsPage.makeHybridModal.stopAreaInput().type(tramAreaCode);
      StopDetailsPage.makeHybridModal.stopAreaOption(tramAreaCode).click();

      // Step 6: Confirm
      StopDetailsPage.makeHybridModal.confirmButton().click();

      Toast.expectSuccessToast('Yhteiskäyttöpysäkki luotu onnistuneesti');

      // Step 7: Verify the mirrored quay card appears
      StopDetailsPage.mirroredQuayDetails.cards().should('exist');

      // Step 8: Remove the hybrid relation
      StopDetailsPage.mirroredQuayDetails
        .cards()
        .first()
        .within(() => {
          StopDetailsPage.mirroredQuayDetails.removeButton().click();
        });

      // Confirm removal in the dialog
      StopDetailsPage.mirroredQuayDetails.confirmationDialog
        .getConfirmButton()
        .click();

      // Step 9: Verify the mirrored card is gone
      StopDetailsPage.mirroredQuayDetails.cards().should('not.exist');
    });
  },
);
