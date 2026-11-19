export interface TerminusValues {
  finnishName: string;
  finnishShortName: string;
  swedishName: string;
  swedishShortName: string;
  englishName: string;
  englishShortName: string;
}

export class TerminusNameInputs {
  static getTerminusOriginFinnishNameInput() {
    return cy.getByTestId('TerminusNameInputs::origin::finnishNameInput');
  }

  static getTerminusOriginSwedishNameInput() {
    return cy.getByTestId('TerminusNameInputs::origin::swedishNameInput');
  }

  static getTerminusOriginEnglishNameInput() {
    return cy.getByTestId('TerminusNameInputs::origin::englishNameInput');
  }

  static getTerminusOriginFinnishShortNameInput() {
    return cy.getByTestId('TerminusNameInputs::origin::finnishShortNameInput');
  }

  static getTerminusOriginSwedishShortNameInput() {
    return cy.getByTestId('TerminusNameInputs::origin::swedishShortNameInput');
  }

  static getTerminusOriginEnglishShortNameInput() {
    return cy.getByTestId('TerminusNameInputs::origin::englishShortNameInput');
  }

  static getTerminusDestinationFinnishNameInput() {
    return cy.getByTestId('TerminusNameInputs::destination::finnishNameInput');
  }

  static getTerminusDestinationSwedishNameInput() {
    return cy.getByTestId('TerminusNameInputs::destination::swedishNameInput');
  }

  static getTerminusDestinationEnglishNameInput() {
    return cy.getByTestId('TerminusNameInputs::destination::englishNameInput');
  }

  static getTerminusDestinationFinnishShortNameInput() {
    return cy.getByTestId(
      'TerminusNameInputs::destination::finnishShortNameInput',
    );
  }

  static getTerminusDestinationSwedishShortNameInput() {
    return cy.getByTestId(
      'TerminusNameInputs::destination::swedishShortNameInput',
    );
  }

  static getTerminusDestinationEnglishShortNameInput() {
    return cy.getByTestId(
      'TerminusNameInputs::destination::englishShortNameInput',
    );
  }

  static fillTerminusNameInputsForm(
    origin: TerminusValues,
    destination: TerminusValues,
  ) {
    TerminusNameInputs.getTerminusOriginFinnishNameInput().clearAndType(
      origin.finnishName,
    );
    TerminusNameInputs.getTerminusOriginFinnishShortNameInput().clearAndType(
      origin.finnishShortName,
    );
    TerminusNameInputs.getTerminusOriginSwedishNameInput().clearAndType(
      origin.swedishName,
    );
    TerminusNameInputs.getTerminusOriginSwedishShortNameInput().clearAndType(
      origin.swedishShortName,
    );
    TerminusNameInputs.getTerminusOriginEnglishNameInput().clearAndType(
      origin.englishName,
    );
    TerminusNameInputs.getTerminusOriginEnglishShortNameInput().clearAndType(
      origin.englishShortName,
    );

    TerminusNameInputs.getTerminusDestinationFinnishNameInput().clearAndType(
      destination.finnishName,
    );
    TerminusNameInputs.getTerminusDestinationFinnishShortNameInput().clearAndType(
      destination.finnishShortName,
    );
    TerminusNameInputs.getTerminusDestinationSwedishNameInput().clearAndType(
      destination.swedishName,
    );
    TerminusNameInputs.getTerminusDestinationSwedishShortNameInput().clearAndType(
      destination.swedishShortName,
    );
    TerminusNameInputs.getTerminusDestinationEnglishNameInput().clearAndType(
      destination.englishName,
    );
    TerminusNameInputs.getTerminusDestinationEnglishShortNameInput().clearAndType(
      destination.englishShortName,
    );
  }

  static verifyOriginValues(originValues: TerminusValues) {
    TerminusNameInputs.getTerminusOriginFinnishNameInput().should(
      'have.value',
      originValues.finnishName,
    );
    TerminusNameInputs.getTerminusOriginFinnishShortNameInput().should(
      'have.value',
      originValues.finnishShortName,
    );
    TerminusNameInputs.getTerminusOriginSwedishNameInput().should(
      'have.value',
      originValues.swedishName,
    );
    TerminusNameInputs.getTerminusOriginSwedishShortNameInput().should(
      'have.value',
      originValues.swedishShortName,
    );
    TerminusNameInputs.getTerminusOriginEnglishNameInput().should(
      'have.value',
      originValues.englishName,
    );
    TerminusNameInputs.getTerminusOriginEnglishShortNameInput().should(
      'have.value',
      originValues.englishShortName,
    );
  }

  static verifyDestinationValues(destinationValues: TerminusValues) {
    TerminusNameInputs.getTerminusDestinationFinnishNameInput().should(
      'have.value',
      destinationValues.finnishName,
    );
    TerminusNameInputs.getTerminusDestinationFinnishShortNameInput().should(
      'have.value',
      destinationValues.finnishShortName,
    );
    TerminusNameInputs.getTerminusDestinationSwedishNameInput().should(
      'have.value',
      destinationValues.swedishName,
    );
    TerminusNameInputs.getTerminusDestinationSwedishShortNameInput().should(
      'have.value',
      destinationValues.swedishShortName,
    );
    TerminusNameInputs.getTerminusDestinationEnglishNameInput().should(
      'have.value',
      destinationValues.englishName,
    );
    TerminusNameInputs.getTerminusDestinationEnglishShortNameInput().should(
      'have.value',
      destinationValues.englishShortName,
    );
  }
}
