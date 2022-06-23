export class TerminusNameInputs {
  getTerminusOriginFinnishNameInput() {
    return cy.getByTestId('terminusNamesForm:origin:finnishNameInput');
  }

  getTerminusOriginSwedishNameInput() {
    return cy.getByTestId('terminusNamesForm:origin:swedishNameInput');
  }

  getTerminusOriginFinnishShortNameInput() {
    return cy.getByTestId('terminusNamesForm:origin:finnishShortNameInput');
  }

  getTerminusOriginSwedishShortNameInput() {
    return cy.getByTestId('terminusNamesForm:origin:swedishShortNameInput');
  }

  getTerminusDestinationFinnishNameInput() {
    return cy.getByTestId('terminusNamesForm:destination:finnishNameInput');
  }

  getTerminusDestinationSwedishNameInput() {
    return cy.getByTestId('terminusNamesForm:destination:swedishNameInput');
  }

  getTerminusDestinationFinnishShortNameInput() {
    return cy.getByTestId(
      'terminusNamesForm:destination:finnishShortNameInput',
    );
  }

  getTerminusDestinationSwedishShortNameInput() {
    return cy.getByTestId(
      'terminusNamesForm:destination:swedishShortNameInput',
    );
  }
}
