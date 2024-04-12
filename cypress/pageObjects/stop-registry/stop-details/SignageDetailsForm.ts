export class SignageDetailsForm {
  getSignTypeDropdownButton() {
    return cy.getByTestId('SignageDetailsForm::signType::ListboxButton');
  }

  getSignTypeDropdownOptions() {
    return cy.getByTestId('SignageDetailsForm::signType::ListboxOptions');
  }

  getNumberOfFramesInput() {
    return cy.getByTestId('SignageDetailsForm::numberOfFrames');
  }

  getSignageInstructionExceptionsInput() {
    return cy.getByTestId('SignageDetailsForm::signageInstructionExceptions');
  }

  getLineSignageCheckbox() {
    return cy.getByTestId('SignageDetailsForm::lineSignage');
  }

  getReplacesRailSignCheckbox() {
    return cy.getByTestId('SignageDetailsForm::replacesRailSign');
  }

  getMainLineSignCheckbox() {
    return cy.getByTestId('SignageDetailsForm::mainLineSign');
  }
}
