export interface TerminusValues {
  finnishName: string;
  finnishShortName: string;
  swedishName: string;
  swedishShortName: string;
}

export class TerminusNameInputs {
  getTerminusOriginFinnishNameInput() {
    return cy.getByTestId('TerminusNameInputs::origin::finnishNameInput');
  }

  getTerminusOriginSwedishNameInput() {
    return cy.getByTestId('TerminusNameInputs::origin::swedishNameInput');
  }

  getTerminusOriginFinnishShortNameInput() {
    return cy.getByTestId('TerminusNameInputs::origin::finnishShortNameInput');
  }

  getTerminusOriginSwedishShortNameInput() {
    return cy.getByTestId('TerminusNameInputs::origin::swedishShortNameInput');
  }

  getTerminusDestinationFinnishNameInput() {
    return cy.getByTestId('TerminusNameInputs::destination::finnishNameInput');
  }

  getTerminusDestinationSwedishNameInput() {
    return cy.getByTestId('TerminusNameInputs::destination::swedishNameInput');
  }

  getTerminusDestinationFinnishShortNameInput() {
    return cy.getByTestId(
      'TerminusNameInputs::destination::finnishShortNameInput',
    );
  }

  getTerminusDestinationSwedishShortNameInput() {
    return cy.getByTestId(
      'TerminusNameInputs::destination::swedishShortNameInput',
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
