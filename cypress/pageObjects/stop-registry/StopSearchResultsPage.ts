export class StopSearchResultsPage {
  getContainer() {
    return cy.getByTestId('StopSearchResultsPage::Container');
  }

  getCloseResultsButton() {
    return cy.getByTestId('StopSearchResultsPage::closeButton');
  }

  getResultsTable() {
    return cy.getByTestId('StopSearchResultList::table');
  }

  getResultRows() {
    return this.getResultsTable().first().find('tbody tr');
  }

  getRowByLabel(label: string) {
    return cy.getByTestId(`StopTableRow::row::${label}`);
  }
}
