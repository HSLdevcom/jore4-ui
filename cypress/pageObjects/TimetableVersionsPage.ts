import { TimetableVersionTableRow } from './TimetableVersionTableRow';

export class TimetableVersionsPage {
  timetableVersionTableRow = new TimetableVersionTableRow();

  getCloseButton() {
    return cy.getByTestId('TimetableVersionsPage::closeButton');
  }
}
