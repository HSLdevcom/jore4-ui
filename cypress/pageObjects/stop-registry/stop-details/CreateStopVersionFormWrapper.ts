import { Priority } from '@hsl/jore4-test-db-manager';

export interface CreateStopVersionStateWrapper {
  versionName: string;
  versionDescription: string;
  priority: Priority;
  startDate: string;
  endDate?: string | null;
  // TODO : indefinite
}

export class CreateStopVersionFormWrapper {

  getFormContent() {
    return cy.getByTestId('CreateStopVersionForm::content');
  }

  getVersionNameInput() {
    return cy.getByTestId('CreateStopVersionForm::versionName');
  }

  getVersionDescriptionInput() {
    return cy.getByTestId('CreateStopVersionForm::versionDescription');
  }

  getStartDateInput() {
    return cy.getByTestId('CreateStopVersionForm::startDate');
  }

  getEndDateInput() {
    return cy.getByTestId('CreateStopVersionForm::endDate');
  }

  getPriorityInput(priority: Priority) {
    return cy.getByTestId(
      `PriorityForm::${Priority[priority.valueOf()].toLowerCase()}PriorityButton`,
    );
  }

  getSubmitButton() {
    return cy.getByTestId('CreateStopVersionForm::submitButton');
  }

  getCancelButton() {
    return cy.getByTestId('CreateStopVersionForm::submitButton');
  }

  fillForm(values: CreateStopVersionStateWrapper) {
    this.getVersionNameInput().clear().type(values.versionName);
    this.getVersionDescriptionInput().clear().type(values.versionDescription);
    this.getStartDateInput().clear().type(values.startDate);
    if (values.endDate) {
      this.getEndDateInput().clear().type(values.endDate);
    }
    this.getPriorityInput(values.priority).click();
  }
}
