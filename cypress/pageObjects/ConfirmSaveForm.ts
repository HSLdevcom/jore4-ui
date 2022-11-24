export class ConfirmSaveForm {
  setAsStandard() {
    return cy.getByTestId('ConfirmSaveForm::standardPriorityButton').click();
  }

  setAsDraft() {
    return cy.getByTestId('ConfirmSaveForm::draftPriorityButton').click();
  }

  setAsTemporary() {
    return cy.getByTestId('ConfirmSaveForm::temporaryPriorityButton').click();
  }

  setStartDate(isoDate: string) {
    // This invoke is a workaround to
    // prevent map from zooming out when typing '-' value to the date input
    return cy
      .getByTestId('ConfirmSaveForm::startDateInput')
      .invoke('removeAttr', 'type')
      .type(isoDate);
  }

  getEndDateInput() {
    return cy.getByTestId('ConfirmSaveForm::endDateInput');
  }

  setEndDate(isoDate: string) {
    // This invoke is a workaround to
    // prevent map from zooming out when typing '-' value to the date input
    return this.getEndDateInput().invoke('removeAttr', 'type').type(isoDate);
  }

  getIndefiniteCheckbox() {
    return cy.getByTestId('ConfirmSaveForm::indefiniteCheckbox');
  }

  setAsIndefinite(indefinite = true) {
    return indefinite
      ? this.getIndefiniteCheckbox().check()
      : this.getIndefiniteCheckbox().uncheck();
  }
}
