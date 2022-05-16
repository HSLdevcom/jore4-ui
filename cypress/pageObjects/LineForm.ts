export class LineForm {
  getLabelInput(cy: Cypress.cy) {
    return cy.get('#label-input');
  }

  getFinnishNameInput(cy: Cypress.cy) {
    return cy.get('#finnish-name-input');
  }

  selectTransportTarget(cy: Cypress.cy, target: string) {
    cy.getById('linePropertiesForm:transportTargetDropdown').click();
    cy.get('li').contains(target).click();
  }

  selectVehicleType(cy: Cypress.cy, type: string) {
    cy.getById('linePropertiesForm:vehicleModeDropdown').click();
    cy.get('li').contains(type).click();
  }

  selectLineType(cy: Cypress.cy, type: string) {
    cy.getById('linePropertiesForm:lineTypeDropdown').click();
    cy.get('li').contains(type).click();
  }

  save(cy: Cypress.cy) {
    return cy.getById('lineForm:saveButton').click();
  }

  cancel(cy: Cypress.cy) {
    return cy.getById('lineForm:cancelButton').click();
  }
}
