export class SearchForTerminals {
  getTerminalLabel() {
    return cy.getByTestId('TerminalSearch::label');
  }

  getTerminalLink() {
    return cy.getByTestId('TerminalSearch::link');
  }

  getLocatorButton() {
    return cy.getByTestId('TerminalSearch::locatorButton');
  }

  getActionMenu = () => cy.getByTestId('SearchHeader::actionMenu');

  getActionMenuShowDetails = () =>
    cy.getByTestId('TerminalSearch::showTerminalDetails');

  getActionMenuShowOnMap = () => cy.getByTestId('TerminalSearch::showOnMap');

  getNoStopsInTerminalText = () => cy.getByTestId('TerminalSearch:noStopsText');

  getNoStopsInTerminalLink = () =>
    cy.getByTestId('TerminalSearch::noStopsLink');
}
