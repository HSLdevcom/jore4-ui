export interface NewDepotStopFormInfo {
  label: string;
  latitude: string;
  longitude: string;
}

export class DepotStopForm {
  static getModal() {
    return cy.getByTestId('DepotStopModal');
  }

  static getLabelInput() {
    return cy.getByTestId('DepotStopForm::label');
  }

  static getLatitudeInput() {
    return cy.getByTestId('DepotStopForm::latitude');
  }

  static getLongitudeInput() {
    return cy.getByTestId('DepotStopForm::longitude');
  }

  static fillFormForNewDepotStop(values: NewDepotStopFormInfo) {
    DepotStopForm.getLabelInput().clearAndType(values.label);
    DepotStopForm.getLatitudeInput().clearAndType(values.latitude);
    DepotStopForm.getLongitudeInput().clearAndType(values.longitude);
  }

  static save() {
    return DepotStopForm.getModal()
      .findByTestId('DepotStopForm::saveButton')
      .click();
  }

  static cancel() {
    return DepotStopForm.getModal()
      .findByTestId('DepotStopForm::cancelButton')
      .click();
  }
}
