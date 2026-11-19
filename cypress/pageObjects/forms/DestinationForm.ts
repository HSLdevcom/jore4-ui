export class DestinationForm {
  static getFinnishNameInput() {
    return cy.getByTestId('DestinationForm::finnishName');
  }

  static getSwedishNameInput() {
    return cy.getByTestId('DestinationForm::swedishName');
  }

  static getEnglishNameInput() {
    return cy.getByTestId('DestinationForm::englishName');
  }

  static getFinnishShortNameInput() {
    return cy.getByTestId('DestinationForm::finnishShortName');
  }

  static getSwedishShortNameInput() {
    return cy.getByTestId('DestinationForm::swedishShortName');
  }

  static getEnglishShortNameInput() {
    return cy.getByTestId('DestinationForm::englishShortName');
  }

  static getSaveButton() {
    return cy.getByTestId('DestinationForm::saveButton');
  }

  static getRemoveButton() {
    return cy.getByTestId('DestinationForm::removeButton');
  }
}
