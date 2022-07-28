export class StopForm {
  getLabelInput() {
    return cy.getByTestId('stopForm::label');
  }

  getLongitudeInput() {
    return cy.getByTestId('stopForm::longitude');
  }

  getLatitudeInput() {
    return cy.getByTestId('stopForm::latitude');
  }

  fillStopForm(values: {
    label: string;
    longitude?: string;
    latitude?: string;
  }) {
    this.getLabelInput().type(values.label);
    if (values.latitude) {
      this.getLatitudeInput().clear().type(values.latitude);
    }
    if (values.longitude) {
      this.getLongitudeInput().clear().type(values.longitude);
    }
  }

  save(forceAction = false) {
    return cy.getByTestId('modal::saveButton').click({ force: forceAction });
  }
}
