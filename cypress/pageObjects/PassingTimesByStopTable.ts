export class PassingTimesByStopTable {
  getTableRow(stopLabel: string) {
    return cy.getByTestId(`PassingTimesByStopTableRow::${stopLabel}`);
  }
}
