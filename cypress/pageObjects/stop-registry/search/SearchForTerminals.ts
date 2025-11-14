export class SearchForTerminals {
  getTerminalLabel() {
    return cy.getByTestId('StopPlaceSearch::label');
  }

  getTerminalLink() {
    return cy.getByTestId('StopPlaceSearch::link');
  }

  getLocatorButton() {
    return cy.getByTestId('StopPlaceSearch::locatorButton');
  }

  getActionMenu = () => cy.getByTestId('SearchHeader::actionMenu');

  getActionMenuShowDetails = () =>
    cy.getByTestId('StopPlaceSearch::showStopPlaceDetails');

  getActionMenuShowOnMap = () => cy.getByTestId('StopPlaceSearch::showOnMap');

  getNoStopsInTerminalText = () => cy.getByTestId('TerminalSearch:noStopsText');

  getNoStopsInTerminalLink = () =>
    cy.getByTestId('StopPlaceSearch::noStopsLink');
}
