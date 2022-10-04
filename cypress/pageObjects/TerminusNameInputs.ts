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
    this.getTerminusOriginFinnishNameInput().clear().type(origin.finnishName);
    this.getTerminusOriginFinnishShortNameInput()
      .clear()
      .type(origin.finnishShortName);
    this.getTerminusOriginSwedishNameInput().clear().type(origin.swedishName);
    this.getTerminusOriginSwedishShortNameInput()
      .clear()
      .type(origin.swedishShortName);

    this.getTerminusDestinationFinnishNameInput()
      .clear()
      .type(destination.finnishName);
    this.getTerminusDestinationFinnishShortNameInput()
      .clear()
      .type(destination.finnishShortName);
    this.getTerminusDestinationSwedishNameInput()
      .clear()
      .type(destination.swedishName);
    this.getTerminusDestinationSwedishShortNameInput()
      .clear()
      .type(destination.swedishShortName);
  }

  verifyOriginValues(originValues: TerminusValues) {
    this.getTerminusOriginFinnishNameInput().should(
      'have.value',
      originValues.finnishName,
    );
    this.getTerminusOriginFinnishShortNameInput().should(
      'have.value',
      originValues.finnishShortName,
    );
    this.getTerminusOriginSwedishNameInput().should(
      'have.value',
      originValues.swedishName,
    );
    this.getTerminusOriginSwedishShortNameInput().should(
      'have.value',
      originValues.swedishShortName,
    );
  }

  verifyDestinationValues(destinationValues: TerminusValues) {
    this.getTerminusDestinationFinnishNameInput().should(
      'have.value',
      destinationValues.finnishName,
    );
    this.getTerminusDestinationFinnishShortNameInput().should(
      'have.value',
      destinationValues.finnishShortName,
    );
    this.getTerminusDestinationSwedishNameInput().should(
      'have.value',
      destinationValues.swedishName,
    );
    this.getTerminusDestinationSwedishShortNameInput().should(
      'have.value',
      destinationValues.swedishShortName,
    );
  }
}
