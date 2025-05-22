export class TerminalDetailsViewCard {
  getToggle = () => cy.getByTestId('TerminalDetailsSection::toggle');

  getContent = () => cy.getByTestId('TerminalDetailsSection::content');

  getPrivateCode = () => cy.getByTestId('TerminalDetailsViewCard::privateCode');

  getDescription = () => cy.getByTestId('TerminalDetailsViewCard::description');

  getNameFin = () => cy.getByTestId('TerminalDetailsViewCard::name');

  getNameSwe = () => cy.getByTestId('TerminalDetailsViewCard::nameSwe');

  getTerminalType = () =>
    cy.getByTestId('TerminalDetailsViewCard::terminalType');

  getDeparturePlatforms = () =>
    cy.getByTestId('TerminalDetailsViewCard::departurePlatforms');

  getArrivalPlatforms = () =>
    cy.getByTestId('TerminalDetailsViewCard::arrivalPlatforms');

  getLoadingPlatforms = () =>
    cy.getByTestId('TerminalDetailsViewCard::loadingPlatforms');

  getElectricCharging = () =>
    cy.getByTestId('TerminalDetailsViewCard::electricCharging');
}
