export interface StopFormInfo {
  label: string;
  longitude?: string;
  latitude?: string;
}

export class StopForm {
  getLabelInput() {
    return cy.getByTestId('StopFormComponent::label');
  }

  getLongitudeInput() {
    return cy.getByTestId('StopFormComponent::longitude');
  }

  getLatitudeInput() {
    return cy.getByTestId('StopFormComponent::latitude');
  }

  fillStopForm(values: StopFormInfo) {
    this.getLabelInput().type(values.label);
    if (values.latitude) {
      this.getLatitudeInput().clear().type(values.latitude);
    }
    if (values.longitude) {
      this.getLongitudeInput().clear().type(values.longitude);
    }
  }

  save(forceAction = false) {
    return cy.getByTestId('Modal::saveButton').click({ force: forceAction });
  }
}
