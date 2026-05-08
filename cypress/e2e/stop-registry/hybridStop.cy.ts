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
      cy.getByTestId('StopTitleRow::extraActions::menu').click();
      cy.getByTestId('StopTitleRow::extraActions::makeHybrid').click();

      // Step 4: Select tram transport mode
      cy.getByTestId('MakeHybridStopModal').shouldBeVisible();
      cy.getByTestId('MakeHybridStopModal::transportMode::ListboxButton').click();
      cy.get('[role="option"]').contains('Raitiovaunu').click();

      // Step 5: Search and select the tram stop area
      cy.getByTestId('MakeHybridStopModal::stopAreaInput').type(tramAreaCode);
      cy.getByTestId(`MakeHybridStopModal::stopArea::${tramAreaCode}`).click();

      // Step 6: Confirm
      cy.getByTestId('MakeHybridStopModal::confirm').click();

      Toast.expectSuccessToast('Yhteiskäyttöpysäkki luotu onnistuneesti');

      // Step 7: Verify the mirrored quay card appears
      // The page should now show a mirrored quay details card
      cy.get('[data-testid^="MirroredQuayDetails::"]').should('exist');

      // Step 8: Remove the hybrid relation
      cy.get('[data-testid$="::remove"]')
        .filter('[data-testid^="MirroredQuayDetails::"]')
        .click();

      // Confirm removal in the dialog
      cy.getByTestId('ConfirmationDialog::confirmButton').click();

      // Step 9: Verify the mirrored card is gone
      cy.get('[data-testid^="MirroredQuayDetails::"]').should('not.exist');
    });
  },
);
