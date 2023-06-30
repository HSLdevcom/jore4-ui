import { ParentPageObject } from './types';
import { VehicleJourneyGroupInfo } from './VehicleJourneyGroupInfo';

export class VehicleServiceTable {
  vehicleJourneyGroupInfo = new VehicleJourneyGroupInfo();

  getParent: ParentPageObject['get'];

  dayType: string;

  constructor(parent: ParentPageObject, dayType: string) {
    this.getParent = () => parent.get();
    this.dayType = dayType;
  }

  get() {
    return this.getParent().findByTestId(
      `VehicleServiceTable::${this.dayType}`,
    );
  }

  clickChangeValidityDate() {
    return this.get()
      .findByTestId('VehicleJourneyGroupInfo::changeValidityButton')
      .click();
  }

  getHeadingButton() {
    return this.getParent().findByTestId('VehicleServiceTable::headingButton');
  }
}
