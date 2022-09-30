import { Toast } from './Toast';

export class LineForm {
  toast = new Toast();

  getLabelInput() {
    return cy.getByTestId('LinePropertiesForm::label');
  }

  getFinnishNameInput() {
    return cy.getByTestId('LinePropertiesForm::finnishName');
  }

  getSwedishNameInput() {
    return cy.getByTestId('LinePropertiesForm::swedishName');
  }

  getFinnishShortNameInput() {
    return cy.getByTestId('LinePropertiesForm::finnishShortName');
  }

  getSwedishShortNameInput() {
    return cy.getByTestId('LinePropertiesForm::swedishShortName');
  }

  selectTransportTarget(target: string) {
    cy.getByTestId('LinePropertiesForm::transportTargetInput').click();
    cy.get('li').contains(target).click();
  }

  selectVehicleType(type: string) {
    cy.getByTestId('LinePropertiesForm::primaryVehicleModeInput').click();
    cy.get('li').contains(type).click();
  }

  selectLineType(type: string) {
    cy.getByTestId('LinePropertiesForm::typeOfLineInput').click();
    cy.get('li').contains(type).click();
  }

  save() {
    return cy.getByTestId('LineForm::saveButton').click();
  }

  cancel() {
    return cy.getByTestId('LineForm::cancelButton').click();
  }

  checkLineSubmitSuccess() {
    this.toast.checkSuccessToastHasMessage('Linja tallennettu');
  }
}
