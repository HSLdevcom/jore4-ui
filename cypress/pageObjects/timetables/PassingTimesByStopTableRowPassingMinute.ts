export class PassingTimesByStopTableRowPassingMinute {
  static getArrivalTime() {
    return cy.getByTestId(
      'PassingTimesByStopTableRowPassingMinute::arrivalTime',
    );
  }

  static getDepartureTime() {
    return cy.getByTestId(
      'PassingTimesByStopTableRowPassingMinute::departureTime',
    );
  }

  static getMinute() {
    return cy.getByTestId('PassingTimesByStopTableRowPassingMinute::button');
  }
}
