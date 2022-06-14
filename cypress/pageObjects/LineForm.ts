import { Toast } from './Toast';

export class LineForm {
  toast = new Toast();

  getLabelInput() {
    return cy.getByTestId('LinePropertiesForm:label');
  }

  getFinnishNameInput() {
    return cy.getByTestId('LinePropertiesForm:finnishName');
  }

  selectTransportTarget(target: string) {
    cy.getByTestId('transport-target-input').click();
    cy.get('li').contains(target).click();
  }

  selectVehicleType(type: string) {
    cy.getByTestId('primary-vehicle-mode-input').click();
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

  checkSubmitSuccess() {
    this.toast
      .getSuccessToast()
      .contains('Linja tallennettu')
      .should('be.visible');
  }
}
