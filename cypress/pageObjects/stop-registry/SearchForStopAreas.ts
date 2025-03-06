export class SearchForStopAreas {
  getStopAreaLabel() {
    return cy.getByTestId('StopAreaSearch::label');
  }

  getStopAreaLink() {
    return cy.getByTestId('StopAreaSearch::link');
  }

  getLocatorButton() {
    return cy.getByTestId('StopAreaSearch::locatorButton');
  }

  getActionMenu = () => cy.getByTestId('StopAreaHeader::actionMenu');

  getActionMenuShowDetails = () =>
    cy.getByTestId('StopAreaSearch::showStopAreaDetails');

  getActionMenuShowOnMap = () => cy.getByTestId('StopAreaSearch::showOnMap');
}
