export class TimetableVersionTableRow {
  getRows() {
    return cy.getByTestId('TimetableVersionTableRow::row');
  }

  openNthRowVersionDetailsPanel(rowNumber: number) {
    this.getRows()
      .eq(rowNumber)
      .findByTestId('TimetableVersionTableRow::actions')
      .click();

    cy.getByTestId('TimetableVersionTableRow::versionPanelMenuItem').click();
  }
}
