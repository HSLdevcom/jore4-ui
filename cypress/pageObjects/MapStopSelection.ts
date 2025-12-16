export class MapStopSelection {
  getOpenButton() {
    return cy.getByTestId('Map::StopSelection::openButton');
  }

  getPanel() {
    return cy.getByTestId('Map::StopSelection::panel');
  }

  getActionMenu() {
    return cy.getByTestId('Map::StopSelection::actionMenu');
  }

  getEquipmentReportMenuItem() {
    return cy.getByTestId('EquipmentReport::button');
  }

  getInfoSpotReportMenuItem() {
    return cy.getByTestId('InfoSpotReport::button');
  }

  getEquipmentReportFileName() {
    return cy.getByTestId('EquipmentReport::filename');
  }

  getInfoSpotReportFileName() {
    return cy.getByTestId('InfoSpotReport::filename');
  }

  getResolvingSearchResults() {
    return cy.getByTestId('Map::StopSelection::resolvingSearchResults');
  }

  getResolvingSearchResultsFailed() {
    return cy.getByTestId('Map::StopSelection::resolvingSearchResultsFailed');
  }

  getNothingSelected() {
    return cy.getByTestId('Map::StopSelection::nothingSelected');
  }

  getListing() {
    return cy.getByTestId('Map::StopSelection::listing');
  }

  getLoadingMissingDetails() {
    return cy.getByTestId('Map::StopSelection::loadingMissingDetails');
  }

  getLoadingMissingDetailsFailed() {
    return cy.getByTestId('Map::StopSelection::loadingMissingDetailsFailed');
  }

  getRetryButton() {
    return cy.getByTestId('Map::StopSelection::retryButton');
  }

  getShowAllButton() {
    return cy.getByTestId('Map::StopSelection::showAllButton');
  }

  getSelectedStops() {
    return cy.get("[data-testid^='Map::StopSelection::Stop::']");
  }

  getSelectedStop(publicCode: string, priority?: string | null | undefined) {
    const idFragment = `Map::StopSelection::Stop::${publicCode}${priority ? `-${priority}` : ''}`;
    return cy.get(`[data-testid^='${idFragment}']`);
  }

  getRemoveSelectionButton() {
    return cy.getByTestId('Map::StopSelection::RemoveSelection');
  }
}
