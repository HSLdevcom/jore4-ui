export interface TerminusValues {
  finnishName: string;
  finnishShortName: string;
  swedishName: string;
  swedishShortName: string;
}

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

  fillTerminusNameInputsForm(
    origin: TerminusValues,
    destination: TerminusValues,
  ) {
    this.getTerminusOriginFinnishNameInput().type(origin.finnishName);
    this.getTerminusOriginFinnishShortNameInput().type(origin.finnishShortName);
    this.getTerminusOriginSwedishNameInput().type(origin.swedishName);
    this.getTerminusOriginSwedishShortNameInput().type(origin.swedishShortName);

    this.getTerminusDestinationFinnishNameInput().type(destination.finnishName);
    this.getTerminusDestinationFinnishShortNameInput().type(
      destination.finnishShortName,
    );
    this.getTerminusDestinationSwedishNameInput().type(destination.swedishName);
    this.getTerminusDestinationSwedishShortNameInput().type(
      destination.swedishShortName,
    );
  }
}
