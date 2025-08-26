export class TerminalInfoSpotsSection {
  getContainer = () => cy.getByTestId('TerminalInfoSpotsSection::container');

  getTitle = () => cy.getByTestId('TerminalInfoSpotsSection::title');
}
