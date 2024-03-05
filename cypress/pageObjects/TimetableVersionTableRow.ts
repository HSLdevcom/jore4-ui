export class TimetableVersionTableRow {
  getRow() {
    return cy.getByTestId('TimetableVersionTableRow::row');
  }

  openNthRowVersionDetailsPanel(rowNumber: number) {
    this.getRow()
      .eq(rowNumber)
      .findByTestId('TimetableVersionTableRow::actions')
      .click();

    cy.getByTestId('TimetableVersionTableRow::versionPanelMenuItem').click();
  }
}
