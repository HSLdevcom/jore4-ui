import { TimetablePriority } from '@hsl/jore4-test-db-manager';
import { ParentPageObject } from './types';

export class PassingTimesByStopSection {
  getParent: ParentPageObject['get'];

  dayType: string;

  priority: TimetablePriority;

  constructor(
    parent: ParentPageObject,
    dayType: string,
    priority: TimetablePriority,
  ) {
    this.getParent = () => parent.get();
    this.dayType = dayType;
    this.priority = priority;
  }

  get() {
    return this.getParent().findByTestId(
      `PassingTimesByStopSection::${this.dayType}::${this.priority}`,
    );
  }

  clickChangeValidityDate() {
    return this.get()
      .findByTestId('VehicleJourneyGroupInfo::changeValidityButton')
      .click();
  }

  getDayTypeDropdownButton() {
    return this.get().findByTestId('DayTypeDropdown::button');
  }

  getValidityTimeRange() {
    return this.get().findByTestId(
      'VehicleJourneyGroupInfo::validityRangeSpan',
    );
  }

  getTripCount() {
    return this.get().findByTestId('VehicleJourneyGroupInfo::tripCount');
  }

  getTripTimeRange() {
    return this.get().findByTestId('VehicleJourneyGroupInfo::tripTimeRange');
  }
}
