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

  fillForm(values: StopFormInfo) {
    this.getLabelInput().clear().type(values.label);
    if (values.latitude) {
      this.getLatitudeInput().clear().type(values.latitude);
    }
    if (values.longitude) {
      this.getLongitudeInput().clear().type(values.longitude);
    }
  }

  /** Clicks the Edit stop modal's save button. Can be given forceAction = true
   * to force the click without waiting for it's actionability (If it's covered
   * by another element etc.).
   * https://docs.cypress.io/api/commands/click#Arguments
   */
  save(forceAction = false) {
    return cy
      .getByTestId('EditStopModal')
      .findByTestId('Modal::saveButton')
      .click({ force: forceAction });
  }
}
