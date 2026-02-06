export class TerminalDetailsEdit {
  static getPrivateCode = () =>
    cy.getByTestId('TerminalDetailsEdit::privateCode');

  static getDescription = () =>
    cy.getByTestId('TerminalDetailsEdit::description');

  static getName = () => cy.getByTestId('TerminalDetailsEdit::name');

  static getNameSwe = () => cy.getByTestId('TerminalDetailsEdit::nameSwe');

  static getTerminalType = () =>
    cy.getByTestId('TerminalDetailsEdit::terminalType::ListboxButton');

  static selectTerminalType(type: string) {
    cy.getByTestId('TerminalDetailsEdit::terminalType::ListboxButton').click();
    cy.getByTestId(
      `TerminalDetailsEdit::terminalType::ListboxOptions::${type}`,
    ).click();
  }

  static getDeparturePlatforms = () =>
    cy.getByTestId('TerminalDetailsEdit::departurePlatforms');

  static getArrivalPlatforms = () =>
    cy.getByTestId('TerminalDetailsEdit::arrivalPlatforms');

  static getLoadingPlatforms = () =>
    cy.getByTestId('TerminalDetailsEdit::loadingPlatforms');

  static getElectricCharging = () =>
    cy.getByTestId('TerminalDetailsEdit::electricCharging');
}
