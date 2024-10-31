export class SearchForDropdown {
  getSearchForDropdown() {
    return cy.getByTestId('StopSearchBar::SearchForDropdown::ListboxButton');
  }

  getSearchForOptions() {
    return cy.getByTestId('StopSearchBar::SearchForDropdown::ListboxOptions');
  }

  openSearchForDropdown() {
    this.getSearchForDropdown().click();
  }

  selectSearchFor(searchFor: string) {
    this.getSearchForOptions().contains(searchFor).click();
  }
}
