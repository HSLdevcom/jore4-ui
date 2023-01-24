export class ViaForm {
  getViaFinnishNameInput() {
    return cy.getByTestId('ViaForm::finnishName');
  }

  getViaSwedishNameInput() {
    return cy.getByTestId('ViaForm::swedishName');
  }

  getViaFinnishShortNameInput() {
    return cy.getByTestId('ViaForm::finnishShortName');
  }

  getViaSwedishShortNameInput() {
    return cy.getByTestId('ViaForm::swedishShortName');
  }

  getSaveButton() {
    return cy.getByTestId('ViaForm::saveButton');
  }

  getRemoveButton() {
    return cy.getByTestId('ViaForm::removeButton');
  }
}
