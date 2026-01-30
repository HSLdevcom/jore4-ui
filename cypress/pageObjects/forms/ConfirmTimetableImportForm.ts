import { TimetablesImportPriorityForm } from './TimetablesImportPriorityForm';

export class ConfirmTimetablesImportForm {
  static priorityForm = TimetablesImportPriorityForm;

  static getReplaceRadioButton() {
    return cy.getByTestId('ConfirmTimetablesImportForm::replaceRadioButton');
  }

  static getCombineRadioButton() {
    return cy.getByTestId('ConfirmTimetablesImportForm::combineRadioButton');
  }

  static getSaveButton() {
    return cy.getByTestId('ConfirmTimetablesImportForm::saveButton');
  }

  static getCancelButton() {
    return cy.getByTestId('ConfirmTimetablesImportForm::cancelButton');
  }
}
