export class PassingTimesByStopTableRowPassingTime {
  getTimeContainer() {
    return cy.getByTestId(
      'PassingTimesByStopTableRowPassingTime::timeContainer',
    );
  }

  getHour() {
    return cy.getByTestId('PassingTimesByStopTableRowPassingTime::hour');
  }
}
