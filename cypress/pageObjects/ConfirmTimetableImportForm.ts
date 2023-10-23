import { PriorityForm } from './PriorityForm';

export class ConfirmTimetablesImportForm {
  priorityForm = new PriorityForm();

  getReplaceRadioButton() {
    return cy.getByTestId('ConfirmTimetablesImportForm::replaceRadioButton');
  }

  getCombineRadioButton() {
    return cy.getByTestId('ConfirmTimetablesImportForm::combineRadioButton');
  }

  getSaveButton() {
    return cy.getByTestId('ConfirmTimetablesImportForm::saveButton');
  }
}
