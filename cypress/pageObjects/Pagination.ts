export class Pagination {
  getPreviousPageButton() {
    return cy.getByTestId('Pagination::page::previous');
  }

  getPageButton(pageNumber: number) {
    return cy.getByTestId(`Pagination::page::${pageNumber}`);
  }

  getNextPageButton() {
    return cy.getByTestId('Pagination::page::next');
  }
}
