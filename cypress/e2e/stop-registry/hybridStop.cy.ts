import {
  Priority,
  ReusableComponentsVehicleModeEnum,
  StopAreaInput,
  StopRegistryGeoJsonType,
  StopRegistryTransportModeType,
} from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';
import { Tag } from '../../enums';
import {
  FilterPanel,
  MapPage,
  StopDetailsPage,
  StopSearchResultsPage,
  Toast,
} from '../../pageObjects';
import { StopTransportModeIcon } from '../../pageObjects/stop-registry/StopTransportModeIcon';
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

      // Step 8: Remove the hybrid relation (via edit mode)
      StopDetailsPage.mirroredQuayDetails.cards().should('exist');
      StopDetailsPage.mirroredQuayDetails
        .cards()
        .first()
        .within(() => {
          StopDetailsPage.mirroredQuayDetails.getEditButton().click();
          StopDetailsPage.mirroredQuayDetails.getDeleteButton().click();
        });

      // Confirm removal in the dialog
      StopDetailsPage.mirroredQuayDetails.confirmationDialog
        .getConfirmButton()
        .click();

      // Step 9: Verify the mirrored card is gone
      StopDetailsPage.mirroredQuayDetails.cards().should('not.exist');
    });

    it('Should change the stop state of a mirrored quay', () => {
      cy.section('Create a bus stop on the map', () => {
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
      });

      cy.section('Navigate to stop details and make it hybrid', () => {
        StopDetailsPage.visit(busStopLabel);
        StopDetailsPage.page().shouldBeVisible();

        StopDetailsPage.titleRow.actionsMenuButton().click();
        StopDetailsPage.titleRow.actionsMenuMakeHybridButton().click();

        StopDetailsPage.makeHybridModal.modal().shouldBeVisible();
        StopDetailsPage.makeHybridModal.transportModeDropdown().click();
        cy.get('[role="option"]').contains('Raitiovaunu').click();

        StopDetailsPage.makeHybridModal.stopAreaInput().type(tramAreaCode);
        StopDetailsPage.makeHybridModal.stopAreaOption(tramAreaCode).click();
        StopDetailsPage.makeHybridModal.confirmButton().click();

        Toast.expectSuccessToast('Yhteiskäyttöpysäkki luotu onnistuneesti');
      });

      cy.section(
        'Verify the Details page lists correct Transport Mode icons',
        () => {
          StopTransportModeIcon.assertTransportModeIcons({
            inUse: [
              StopRegistryTransportModeType.Bus,
              StopRegistryTransportModeType.Tram,
            ],
          });
        },
      );

      cy.section('Ensure the stop shows correctly on the map', () => {
        StopDetailsPage.titleRow.openOnMapButton().click();
        MapPage.map.waitForLoadToComplete();

        FilterPanel.setShowStops(ReusableComponentsVehicleModeEnum.Bus, true);
        FilterPanel.setShowStops(ReusableComponentsVehicleModeEnum.Tram, true);
        MapPage.map
          .getStopByStopLabelAndPriority(busStopLabel, Priority.Standard)
          .shouldBeVisible()
          .and('have.attr', 'data-transport-modes', 'bus,tram');

        FilterPanel.setShowStops(ReusableComponentsVehicleModeEnum.Bus, false);
        MapPage.map
          .getStopByStopLabelAndPriority(busStopLabel, Priority.Standard)
          .shouldBeVisible();

        FilterPanel.setShowStops(ReusableComponentsVehicleModeEnum.Bus, true);
        FilterPanel.setShowStops(ReusableComponentsVehicleModeEnum.Tram, false);
        MapPage.map
          .getStopByStopLabelAndPriority(busStopLabel, Priority.Standard)
          .shouldBeVisible();

        FilterPanel.setShowStops(ReusableComponentsVehicleModeEnum.Bus, false);
        MapPage.map
          .getStopByStopLabelAndPriority(busStopLabel, Priority.Standard)
          .should('not.exist');
      });

      cy.section('Mark the tram stop to be out of use', () => {
        MapPage.getCloseButton().click();
        StopDetailsPage.mirroredQuayDetails.cards().should('exist');
        StopDetailsPage.mirroredQuayDetails
          .cards()
          .first()
          .within(() => {
            StopDetailsPage.mirroredQuayDetails.getEditButton().click();
          });

        StopDetailsPage.mirroredQuayDetails
          .cards()
          .first()
          .within(() => {
            StopDetailsPage.mirroredQuayDetails
              .getStopStateDropdownButton()
              .click();
          });

        StopDetailsPage.mirroredQuayDetails
          .getStopStateDropdownOptions()
          .contains('Pois käytöstä')
          .click();

        StopDetailsPage.mirroredQuayDetails
          .cards()
          .first()
          .within(() => {
            StopDetailsPage.mirroredQuayDetails.reasonForChange
              .getReasonForChangeInput()
              .type('E2E tilan muutos');

            StopDetailsPage.mirroredQuayDetails.getSaveButton().click();
          });

        Toast.expectSuccessToast();
      });

      cy.section('Verify the stop state is updated on the page', () => {
        StopDetailsPage.mirroredQuayDetails
          .cards()
          .first()
          .within(() => {
            cy.getByTestId('BasicDetailsSection::stopState').should(
              'contain',
              'Pois käytöstä',
            );
          });

        StopTransportModeIcon.assertTransportModeIcons({
          inUse: [StopRegistryTransportModeType.Bus],
          outOfUse: [StopRegistryTransportModeType.Tram],
        });
      });

      cy.section('Ensure the updated stop shows correctly on the map', () => {
        StopDetailsPage.titleRow.openOnMapButton().click();
        MapPage.map.waitForLoadToComplete();

        // Show as bus
        FilterPanel.setShowStops(ReusableComponentsVehicleModeEnum.Bus, true);
        MapPage.map
          .getStopByStopLabelAndPriority(busStopLabel, Priority.Standard)
          .shouldBeVisible()
          .and('have.attr', 'data-transport-modes', 'bus');

        // Does still also show under tram stops (it's just out of use)
        FilterPanel.setShowStops(ReusableComponentsVehicleModeEnum.Bus, false);
        FilterPanel.setShowStops(ReusableComponentsVehicleModeEnum.Tram, true);
        MapPage.map
          .getStopByStopLabelAndPriority(busStopLabel, Priority.Standard)
          .shouldBeVisible();
      });

      cy.section(
        'Ensure the updated stop shows correctly on the search',
        () => {
          cy.visit({
            url: '/stop-registry/search',
            qs: { query: busStopLabel },
          });

          StopSearchResultsPage.getContainer().should('be.visible');

          // Ordered by label.
          StopSearchResultsPage.getResultRows()
            .first()
            .within(() => {
              StopTransportModeIcon.assertTransportModeIcons({
                inUse: [StopRegistryTransportModeType.Bus],
                outOfUse: [StopRegistryTransportModeType.Tram],
              });
            });
        },
      );
    });
  },
);
