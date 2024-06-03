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

  getMinute() {
    return cy.getByTestId('PassingTimesByStopTableRowPassingMinute::button');
  }
}
