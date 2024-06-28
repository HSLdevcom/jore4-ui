import { TimetableVersionTableRow } from '../../TimetableVersionTableRow';

export class TimetableVersionTable {
  timetableVersionTableRow = new TimetableVersionTableRow();

  getRows() {
    return cy.getByTestId('TimetableVersionTableRow::row');
  }

  getNthRow(nth: number) {
    return cy.getByTestId('TimetableVersionTableRow::row').eq(nth);
  }

  openNthRowVersionDetailsPanel(rowNumber: number) {
    this.getRows()
      .eq(rowNumber)
      .findByTestId('TimetableVersionTableRow::actions')
      .click();

    cy.getByTestId('TimetableVersionTableRow::versionPanelMenuItem').click();
  }
}
