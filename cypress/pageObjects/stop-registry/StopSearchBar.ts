export class StopSearchBar {
  getSearchInput() {
    return cy.getByTestId('StopSearchBar::searchInput');
  }

  getExpandToggle() {
    return cy.getByTestId('StopSearchBar::chevronToggle');
  }

  getSearchButton() {
    return cy.getByTestId('StopSearchBar::searchButton');
  }
}
