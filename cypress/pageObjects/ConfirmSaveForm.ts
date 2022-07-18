export class ConfirmSaveForm {
  setAsStandard() {
    return cy.getByTestId('confirmSaveForm:standardPriorityButton').click();
  }

  setAsDraft() {
    return cy.getByTestId('confirmSaveForm:draftPriorityButton').click();
  }

  setAsTemporary() {
    return cy.getByTestId('confirmSaveForm:temporaryPriorityButton').click();
  }

  setStartDate(isoDate: string) {
    // This invoke is a workaround to
    // prevent map from zooming out when typing '-' value to the date input
    return cy
      .getByTestId('confirmSaveForm:startDateInput')
      .invoke('removeAttr', 'type')
      .type(isoDate);
  }

  setEndDate(isoDate: string) {
    // This invoke is a workaround to
    // prevent map from zooming out when typing '-' value to the date input
    return cy
      .getByTestId('confirmSaveForm:endDateInput')
      .invoke('removeAttr', 'type')
      .type(isoDate);
  }

  getIndefiniteCheckbox() {
    return cy.getByTestId('confirmSaveForm:indefiniteCheckbox');
  }

  setAsIndefinite(indefinite = true) {
    return indefinite
      ? this.getIndefiniteCheckbox().check()
      : this.getIndefiniteCheckbox().uncheck();
  }
}
