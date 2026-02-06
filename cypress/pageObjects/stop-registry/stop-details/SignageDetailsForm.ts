export class SignageDetailsForm {
  static getSignTypeDropdownButton() {
    return cy.getByTestId('SignageDetailsForm::signType::ListboxButton');
  }

  static getSignTypeDropdownOptions() {
    return cy.getByTestId('SignageDetailsForm::signType::ListboxOptions');
  }

  static getNumberOfFramesInput() {
    return cy.getByTestId('SignageDetailsForm::numberOfFrames');
  }

  static getSignageInstructionExceptionsInput() {
    return cy.getByTestId('SignageDetailsForm::signageInstructionExceptions');
  }

  static getReplacesRailSignCheckbox() {
    return cy.getByTestId('SignageDetailsForm::replacesRailSign');
  }
}
