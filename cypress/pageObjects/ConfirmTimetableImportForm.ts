import { TimetablesImportPriorityForm } from './TimetablesImportPriorityForm';

export class ConfirmTimetablesImportForm {
  priorityForm = new TimetablesImportPriorityForm();

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
