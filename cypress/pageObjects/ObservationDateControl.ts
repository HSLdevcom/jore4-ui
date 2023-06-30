export class ObservationDateControl {
  getObservationDateInput() {
    return cy.getByTestId('ObservationDateControl::dateInput');
  }

  setObservationDate(isoDate: string) {
    this.getObservationDateInput().type(isoDate);
  }
}
