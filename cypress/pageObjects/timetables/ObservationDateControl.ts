export class ObservationDateControl {
  static getObservationDateInput() {
    return cy.getByTestId('ObservationDateControl::dateInput');
  }

  static setObservationDate(isoDate: string) {
    ObservationDateControl.getObservationDateInput().type(isoDate);
    ObservationDateControl.getObservationDateInput().trigger('keyup', {
      keyCode: 13,
    });
  }
}
