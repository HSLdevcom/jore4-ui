export class MapObservationDateControl {
  static getObservationDateInput() {
    return cy.getByTestId('MapObservationDateControl::dateInput');
  }

  static setObservationDate(isoDate: string) {
    MapObservationDateControl.getObservationDateInput().type(isoDate);
    MapObservationDateControl.getObservationDateInput().trigger('keyup', {
      keyCode: 13,
    });
  }
}
