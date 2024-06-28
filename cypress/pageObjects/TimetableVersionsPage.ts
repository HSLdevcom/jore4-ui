import { TimeRangeControl } from './TimeRangeControl';
import { TimetableVersionTable } from './timetables';

export class TimetableVersionsPage {
  timetableVersionTable = new TimetableVersionTable();

  timeRangeControl = new TimeRangeControl();

  getCloseButton() {
    return cy.getByTestId('TimetableVersionsPage::closeButton');
  }
}
