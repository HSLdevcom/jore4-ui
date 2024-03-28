export class SignageDetailsViewCard {
  getContainer() {
    return cy.getByTestId('SignageDetailsViewCard::container');
  }

  getSignType() {
    return cy.getByTestId('SignageDetailsViewCard::signType');
  }

  getNumberOfFrames() {
    return cy.getByTestId('SignageDetailsViewCard::numberOfFrames');
  }

  getLineSignage() {
    return cy.getByTestId('SignageDetailsViewCard::lineSignage');
  }

  getSignageInstructionExceptions() {
    return cy.getByTestId(
      'SignageDetailsViewCard::signageInstructionExceptions',
    );
  }

  getReplacesRailSign() {
    return cy.getByTestId('SignageDetailsViewCard::replacesRailSign');
  }

  getMainLineSign() {
    return cy.getByTestId('SignageDetailsViewCard::mainLineSign');
  }
}
