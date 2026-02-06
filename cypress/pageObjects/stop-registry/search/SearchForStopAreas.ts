export class SearchForStopAreas {
  static getStopAreaLabel() {
    return cy.getByTestId('StopPlaceSearch::label');
  }

  static getStopAreaLink() {
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

  static getNoStopsInStopAreaText = () =>
    cy.getByTestId('StopAreaSearch:noStopsText');

  static getNoStopsInStopAreaLink = () =>
    cy.getByTestId('StopPlaceSearch::noStopsLink');
}
