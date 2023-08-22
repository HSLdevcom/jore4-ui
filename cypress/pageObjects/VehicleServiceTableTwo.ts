import { ParentPageObject } from './types';

export class VehicleServiceTableTwo {
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
}
