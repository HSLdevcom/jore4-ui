import { VehicleJourneyGroupInfo } from './VehicleJourneyGroupInfo';

export class VehicleServiceTable {
  static vehicleJourneyGroupInfo = VehicleJourneyGroupInfo;

  static getHeadingButton() {
    return cy.getByTestId('VehicleServiceTable::headingButton');
  }
}
