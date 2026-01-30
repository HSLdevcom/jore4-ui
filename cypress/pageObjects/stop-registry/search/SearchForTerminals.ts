export class SearchForTerminals {
  static getTerminalLabel() {
    return cy.getByTestId('StopPlaceSearch::label');
  }

  static getTerminalLink() {
    return cy.getByTestId('StopPlaceSearch::link');
  }

  static getLocatorButton() {
    return cy.getByTestId('StopPlaceSearch::locatorButton');
  }

  static getActionMenu = () => cy.getByTestId('SearchHeader::actionMenu');

  static getActionMenuShowDetails = () =>
    cy.getByTestId('StopPlaceSearch::showStopPlaceDetails');

  static getActionMenuShowOnMap = () =>
    cy.getByTestId('StopPlaceSearch::showOnMap');

  static getNoStopsInTerminalText = () =>
    cy.getByTestId('TerminalSearch:noStopsText');

  static getNoStopsInTerminalLink = () =>
    cy.getByTestId('StopPlaceSearch::noStopsLink');
}
