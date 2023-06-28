export class PassingTimesByStopTableRowPassingMinute {
  getArrivalTime() {
    return cy.getByTestId(
      'PassingTimesByStopTableRowPassingMinute::arrivalTime',
    );
  }

  getDepartureTime() {
    return cy.getByTestId(
      'PassingTimesByStopTableRowPassingMinute::departureTime',
    );
  }

  getHighlightButton() {
    return cy.getByTestId('PassingTimesByStopTableRowPassingMinute::button');
  }
}
