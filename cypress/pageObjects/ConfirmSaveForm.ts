export class ConfirmSaveForm {
  setAsStandard(cy: Cypress.cy) {
    return cy.getById('confirmSaveForm:standardPriorityButton').click();
  }

  setAsDraft(cy: Cypress.cy) {
    return cy.getById('confirmSaveForm:draftPriorityButton').click();
  }

  setAsTemporary(cy: Cypress.cy) {
    return cy.getById('confirmSaveForm:temporaryPriorityButton').click();
  }

  setStartDate(cy: Cypress.cy, isoDate: string) {
    return cy.getById('confirmSaveForm:startDateInput').type(isoDate);
  }

  setEndDate(cy: Cypress.cy, isoDate: string) {
    return cy.getById('confirmSaveForm:endDateInput').type(isoDate);
  }

  getIndefiniteCheckbox(cy: Cypress.cy) {
    return cy.getById('confirmSaveForm:indefiniteCheckbox');
  }

  setAsIndefinite(cy: Cypress.cy, indefinite = true) {
    return indefinite
      ? this.getIndefiniteCheckbox(cy).check()
      : this.getIndefiniteCheckbox(cy).uncheck();
  }
}
