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
    this.getTerminusOriginFinnishNameInput()
      .clear({ force: true })
      .type(origin.finnishName, { force: true });
    this.getTerminusOriginFinnishShortNameInput()
      .clear({ force: true })
      .type(origin.finnishShortName, { force: true });
    this.getTerminusOriginSwedishNameInput()
      .clear({ force: true })
      .type(origin.swedishName, { force: true });
    this.getTerminusOriginSwedishShortNameInput()
      .clear({ force: true })
      .type(origin.swedishShortName, { force: true });

    this.getTerminusDestinationFinnishNameInput()
      .clear({ force: true })
      .type(destination.finnishName, { force: true });
    this.getTerminusDestinationFinnishShortNameInput()
      .clear({ force: true })
      .type(destination.finnishShortName, { force: true });
    this.getTerminusDestinationSwedishNameInput()
      .clear({ force: true })
      .type(destination.swedishName, { force: true });
    this.getTerminusDestinationSwedishShortNameInput()
      .clear({ force: true })
      .type(destination.swedishShortName, { force: true });
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
