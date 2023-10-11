export class ConfirmPreviewedTimetablesImportForm {
  getReplaceRadioButton() {
    return cy.getByTestId(
      'ConfirmPreviewedTimetablesImportForm::replaceRadioButton',
    );
  }

  getCombineRadioButton() {
    return cy.getByTestId(
      'ConfirmPreviewedTimetablesImportForm::combineRadioButton',
    );
  }
}
