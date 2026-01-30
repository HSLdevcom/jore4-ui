import { TimeRangeControl } from './TimeRangeControl';
import { TimetableVersionTable } from './versions';

export class TimetableVersionsPage {
  static timetableVersionTable = TimetableVersionTable;

  static timeRangeControl = TimeRangeControl;

  static getCloseButton() {
    return cy.getByTestId('TimetableVersionsPage::closeButton');
  }
}
