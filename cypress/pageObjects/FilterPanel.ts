import { ReusableComponentsVehicleModeEnum } from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';
import { capitalizeFirstLetter } from '../e2e/utils';

export class FilterPanel {
  toggleShowStops(vehicleMode: ReusableComponentsVehicleModeEnum) {
    return cy
      .getByTestId(
        `FilterPanel::toggleShowAll${capitalizeFirstLetter(vehicleMode)}Stops`,
      )
      .click();
  }
}
