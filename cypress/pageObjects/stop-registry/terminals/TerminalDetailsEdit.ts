export class TerminalDetailsEdit {
  getPrivateCode = () => cy.getByTestId('TerminalDetailsEdit::privateCode');

  getDescription = () => cy.getByTestId('TerminalDetailsEdit::description');

  getName = () => cy.getByTestId('TerminalDetailsEdit::name');

  getNameSwe = () => cy.getByTestId('TerminalDetailsEdit::nameSwe');

  getTerminalType = () =>
    cy.getByTestId('TerminalDetailsEdit::terminalType::ListboxButton');

  selectTerminalType(type: string) {
    cy.getByTestId('TerminalDetailsEdit::terminalType::ListboxButton').click();
    cy.get('[role="option"]').contains(type).click();
  }

  getDeparturePlatforms = () =>
    cy.getByTestId('TerminalDetailsEdit::departurePlatforms');

  getArrivalPlatforms = () =>
    cy.getByTestId('TerminalDetailsEdit::arrivalPlatforms');

  getLoadingPlatforms = () =>
    cy.getByTestId('TerminalDetailsEdit::loadingPlatforms');

  getElectricCharging = () =>
    cy.getByTestId('TerminalDetailsEdit::electricCharging');
}
