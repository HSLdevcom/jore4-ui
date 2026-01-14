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
    this.getTerminusOriginFinnishNameInput().clearAndType(origin.finnishName);
    this.getTerminusOriginFinnishShortNameInput().clearAndType(
      origin.finnishShortName,
    );
    this.getTerminusOriginSwedishNameInput().clearAndType(origin.swedishName);
    this.getTerminusOriginSwedishShortNameInput().clearAndType(
      origin.swedishShortName,
    );

    this.getTerminusDestinationFinnishNameInput().clearAndType(
      destination.finnishName,
    );
    this.getTerminusDestinationFinnishShortNameInput().clearAndType(
      destination.finnishShortName,
    );
    this.getTerminusDestinationSwedishNameInput().clearAndType(
      destination.swedishName,
    );
    this.getTerminusDestinationSwedishShortNameInput().clearAndType(
      destination.swedishShortName,
    );
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
