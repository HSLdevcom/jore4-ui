export class ConfirmPreviewedTimetablesImportForm {
  static getReplaceRadioButton() {
    return cy.getByTestId(
      'ConfirmPreviewedTimetablesImportForm::replaceRadioButton',
    );
  }

  static getCombineRadioButton() {
    return cy.getByTestId(
      'ConfirmPreviewedTimetablesImportForm::combineRadioButton',
    );
  }
}
