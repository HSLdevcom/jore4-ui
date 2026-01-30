export class Pagination {
  static getPreviousPageButton() {
    return cy.getByTestId('Pagination::page::previous');
  }

  static getPageButton(pageNumber: number) {
    return cy.getByTestId(`Pagination::page::${pageNumber}`);
  }

  static getNextPageButton() {
    return cy.getByTestId('Pagination::page::next');
  }
}
