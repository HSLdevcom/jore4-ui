import { ValidityPeriodForm } from '../../ValidityPeriodForm';

export class CopyStopAreaForm {
  validity = new ValidityPeriodForm();

  getForm() {
    return cy.getByTestId('CopyStopAreaForm::form');
  }

  getVersionNameInput() {
    return cy.getByTestId('CopyStopAreaForm::versionName');
  }

  getVersionDescriptionInput() {
    return cy.getByTestId('CopyStopAreaForm::versionDescription');
  }

  getSubmitButton() {
    return cy.getByTestId('CopyStopAreaForm::submitButton');
  }

  getCancelButton() {
    return cy.getByTestId('CopyStopAreaForm::cancelButton');
  }
}
