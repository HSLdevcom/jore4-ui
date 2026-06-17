import { ReusableComponentsVehicleModeEnum } from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';
import { capitalizeFirstLetter } from '../../e2e/utils';

export class FilterPanel {
  static getToggle(vehicleMode: ReusableComponentsVehicleModeEnum) {
    return cy.getByTestId(
      `FilterPanel::toggleShowAll${capitalizeFirstLetter(vehicleMode)}Stops`,
    );
  }

  static toggleShowStops(vehicleMode: ReusableComponentsVehicleModeEnum) {
    FilterPanel.getToggle(vehicleMode).click();
  }

  static setShowStops(
    vehicleMode: ReusableComponentsVehicleModeEnum,
    shouldBeActive: boolean,
  ) {
    FilterPanel.getToggle(vehicleMode).then((toggle) => {
      const isActive = toggle.attr('aria-pressed') === 'true';
      if (isActive !== shouldBeActive) {
        FilterPanel.toggleShowStops(vehicleMode);
      }
    });
  }
}
