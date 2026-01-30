export class SearchResultsPage {
  static getRoutesSearchResultTable() {
    return cy.getByTestId('RoutesList::table');
  }

  static getLinesSearchResultTable() {
    return cy.getByTestId('LinesList::table');
  }

  static getRouteLineTableRowByLabel(label: string) {
    return SearchResultsPage.getLinesSearchResultTable().findByTestId(
      `RouteLineTableRow::row::${label}`,
    );
  }

  static getSearchResultsContainer() {
    return cy.getByTestId('SearchResultsPage::Container');
  }

  static getRoutesResultsButton() {
    return cy.getByTestId('ResultSelector::routes');
  }

  static getLinesResultsButton() {
    return cy.getByTestId('ResultSelector::lines');
  }

  static getShowRouteOnMapButton() {
    return cy.getByTestId('RouteTableRow::showRoute');
  }

  static getSelectionCheckbox(label: string) {
    return cy.getByTestId(`SearchResultsPage::selectionCheckbox::${label}`);
  }
}
