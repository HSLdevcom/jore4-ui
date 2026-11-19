export class ViaForm {
  static getViaFinnishNameInput() {
    return cy.getByTestId('ViaForm::finnishName');
  }

  static getViaSwedishNameInput() {
    return cy.getByTestId('ViaForm::swedishName');
  }

  static getViaEnglishNameInput() {
    return cy.getByTestId('ViaForm::englishName');
  }

  static getViaFinnishShortNameInput() {
    return cy.getByTestId('ViaForm::finnishShortName');
  }

  static getViaSwedishShortNameInput() {
    return cy.getByTestId('ViaForm::swedishShortName');
  }

  static getViaEnglishShortNameInput() {
    return cy.getByTestId('ViaForm::englishShortName');
  }

  static getSaveButton() {
    return cy.getByTestId('ViaForm::saveButton');
  }

  static getRemoveButton() {
    return cy.getByTestId('ViaForm::removeButton');
  }
}
