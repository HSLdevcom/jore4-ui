export class MapStopSelection {
  static getOpenButton() {
    return cy.getByTestId('Map::StopSelection::openButton');
  }

  static getPanel() {
    return cy.getByTestId('Map::StopSelection::panel');
  }

  static getActionMenu() {
    return cy.getByTestId('Map::StopSelection::actionMenu');
  }

  static getEquipmentReportMenuItem() {
    return cy.getByTestId('EquipmentReport::button');
  }

  static getInfoSpotReportMenuItem() {
    return cy.getByTestId('InfoSpotReport::button');
  }

  static getEquipmentReportFileName() {
    return cy.getByTestId('EquipmentReport::filename');
  }

  static getInfoSpotReportFileName() {
    return cy.getByTestId('InfoSpotReport::filename');
  }

  static getResolvingSearchResults() {
    return cy.getByTestId('Map::StopSelection::resolvingSearchResults');
  }

  static getResolvingSearchResultsFailed() {
    return cy.getByTestId('Map::StopSelection::resolvingSearchResultsFailed');
  }

  static getNothingSelected() {
    return cy.getByTestId('Map::StopSelection::nothingSelected');
  }

  static getListing() {
    return cy.getByTestId('Map::StopSelection::listing');
  }

  static getLoadingMissingDetails() {
    return cy.getByTestId('Map::StopSelection::loadingMissingDetails');
  }

  static getLoadingMissingDetailsFailed() {
    return cy.getByTestId('Map::StopSelection::loadingMissingDetailsFailed');
  }

  static getRetryButton() {
    return cy.getByTestId('Map::StopSelection::retryButton');
  }

  static getShowAllButton() {
    return cy.getByTestId('Map::StopSelection::showAllButton');
  }

  static getSelectedStops() {
    return cy.get("[data-testid^='Map::StopSelection::Stop::']");
  }

  static getSelectedStop(
    publicCode: string,
    priority?: string | null | undefined,
  ) {
    const idFragment = `Map::StopSelection::Stop::${publicCode}${priority ? `-${priority}` : ''}`;
    return cy.get(`[data-testid^='${idFragment}']`);
  }

  static getRemoveSelectionButton() {
    return cy.getByTestId('Map::StopSelection::RemoveSelection');
  }
}
