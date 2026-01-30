export class SignageDetailsViewCard {
  static getContainer() {
    return cy.getByTestId('SignageDetailsViewCard::container');
  }

  static getSignType() {
    return cy.getByTestId('SignageDetailsViewCard::signType');
  }

  static getNumberOfFrames() {
    return cy.getByTestId('SignageDetailsViewCard::numberOfFrames');
  }

  static getSignageInstructionExceptions() {
    return cy.getByTestId(
      'SignageDetailsViewCard::signageInstructionExceptions',
    );
  }

  static getReplacesRailSign() {
    return cy.getByTestId('SignageDetailsViewCard::replacesRailSign');
  }
}
