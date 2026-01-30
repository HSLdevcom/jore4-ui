export class TerminalDetailsViewCard {
  static getToggle = () => cy.getByTestId('TerminalDetailsSection::toggle');

  static getContent = () => cy.getByTestId('TerminalDetailsSection::content');

  static getPrivateCode = () =>
    cy.getByTestId('TerminalDetailsViewCard::privateCode');

  static getDescription = () =>
    cy.getByTestId('TerminalDetailsViewCard::description');

  static getNameFin = () => cy.getByTestId('TerminalDetailsViewCard::name');

  static getNameSwe = () => cy.getByTestId('TerminalDetailsViewCard::nameSwe');

  static getTerminalType = () =>
    cy.getByTestId('TerminalDetailsViewCard::terminalType');

  static getDeparturePlatforms = () =>
    cy.getByTestId('TerminalDetailsViewCard::departurePlatforms');

  static getArrivalPlatforms = () =>
    cy.getByTestId('TerminalDetailsViewCard::arrivalPlatforms');

  static getLoadingPlatforms = () =>
    cy.getByTestId('TerminalDetailsViewCard::loadingPlatforms');

  static getElectricCharging = () =>
    cy.getByTestId('TerminalDetailsViewCard::electricCharging');
}
