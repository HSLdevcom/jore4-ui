import { ParentPageObject } from './types';
import { VehicleJourneyGroupInfo } from './VehicleJourneyGroupInfo';

/**
 * This page object is marked as legacy as the new simpler page object
 * is taking place in pageObjects/timetables/VehicleServiceTable.ts
 * This constructor class pattern is probably a bit too heavy and we should
 * stick with simpler page objects and using .within() and .findByTestId()
 * methods
 */
export class VehicleServiceTableLegacy {
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
    return this.get().findByTestId('VehicleServiceTable::headingButton');
  }
}
