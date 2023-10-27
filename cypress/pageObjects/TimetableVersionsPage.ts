import { TimeRangeControl } from './TimeRangeControl';
import { TimetableVersionTableRow } from './TimetableVersionTableRow';

export class TimetableVersionsPage {
  timetableVersionTableRow = new TimetableVersionTableRow();

  timeRangeControl = new TimeRangeControl();

  getCloseButton() {
    return cy.getByTestId('TimetableVersionsPage::closeButton');
  }
}
