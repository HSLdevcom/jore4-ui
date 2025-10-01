export class MapObservationDateControl {
  getObservationDateInput() {
    return cy.getByTestId('MapObservationDateControl::dateInput');
  }

  setObservationDate(isoDate: string) {
    this.getObservationDateInput().type(isoDate);
    this.getObservationDateInput().trigger('keyup', { keyCode: 13 });
  }
}
