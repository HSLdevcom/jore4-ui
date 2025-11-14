export class SearchForStopAreas {
  getStopAreaLabel() {
    return cy.getByTestId('StopPlaceSearch::label');
  }

  getStopAreaLink() {
    return cy.getByTestId('StopPlaceSearch::link');
  }

  getLocatorButton() {
    return cy.getByTestId('StopPlaceSearch::locatorButton');
  }

  getActionMenu = () => cy.getByTestId('SearchHeader::actionMenu');

  getActionMenuShowDetails = () =>
    cy.getByTestId('StopPlaceSearch::showStopPlaceDetails');

  getActionMenuShowOnMap = () => cy.getByTestId('StopPlaceSearch::showOnMap');

  getNoStopsInStopAreaText = () => cy.getByTestId('StopAreaSearch:noStopsText');

  getNoStopsInStopAreaLink = () =>
    cy.getByTestId('StopPlaceSearch::noStopsLink');
}
