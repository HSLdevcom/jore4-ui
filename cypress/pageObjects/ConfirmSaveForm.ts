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
    return cy
      .getByTestId('confirmSaveForm:startDateInput')
      .invoke('removeAttr', 'type')
      .type(isoDate);
  }

  setEndDate(isoDate: string) {
    return cy.getByTestId('confirmSaveForm:endDateInput').type(isoDate);
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
