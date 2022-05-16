export class LineForm {
  getLabelInput() {
    return cy.get('#label-input');
  }

  getFinnishNameInput() {
    return cy.get('#finnish-name-input');
  }

  selectTransportTarget(target: string) {
    cy.getByTestId('transport-target-input').click();
    cy.get('li').contains(target).click();
  }

  selectVehicleType(type: string) {
    cy.getByTestId('primary-vehicle-mode-input"').click();
    cy.get('li').contains(type).click();
  }

  selectLineType(type: string) {
    cy.getByTestId('type-of-line-input').click();
    cy.get('li').contains(type).click();
  }

  save() {
    return cy.getByTestId('lineForm:saveButton').click();
  }

  cancel() {
    return cy.getByTestId('lineForm:cancelButton').click();
  }
}
