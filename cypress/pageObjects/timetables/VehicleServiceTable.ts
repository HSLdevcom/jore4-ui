import { VehicleJourneyGroupInfo } from '../VehicleJourneyGroupInfo';

export class VehicleServiceTable {
  vehicleJourneyGroupInfo = new VehicleJourneyGroupInfo();

  getHeadingButton() {
    return cy.getByTestId('VehicleServiceTable::headingButton');
  }
}
