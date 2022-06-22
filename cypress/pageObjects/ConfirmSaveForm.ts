export class ConfirmSaveForm {
  setAsStandard(forceAction = false) {
    return cy.getByTestId('confirmSaveForm:standardPriorityButton').click({ force: forceAction });
  }

  setAsDraft(forceAction = false) {
    return cy.getByTestId('confirmSaveForm:draftPriorityButton').click({ force: forceAction });
  }

  setAsTemporary(forceAction = false) {
    return cy.getByTestId('confirmSaveForm:temporaryPriorityButton').click({ force: forceAction });
  }

  setStartDate(isoDate: string, forceAction = false) {
    return cy.getByTestId('confirmSaveForm:startDateInput').type(isoDate, { force: forceAction } );
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
