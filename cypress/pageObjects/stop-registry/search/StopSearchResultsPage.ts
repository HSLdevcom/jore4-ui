export class StopSearchResultsPage {
  getContainer() {
    return cy.getByTestId('StopSearchResultsPage::Container');
  }

  getCloseResultsButton() {
    return cy.getByTestId('StopSearchResultsPage::closeButton');
  }

  getResultCount() {
    return cy.getByTestId('StopSearchResultsPage::resultCount');
  }

  getResultsTable() {
    return cy.getByTestId('StopSearchByStopResultList::table');
  }

  getResultRows() {
    return this.getResultsTable().first().find('tbody tr');
  }

  getRowByLabel(label: string) {
    return cy.getByTestId(`StopTableRow::row::${label}`);
  }

  getRowByNetexId(netexId: string) {
    return cy.get(`[data-netext-id='${netexId}']`);
  }

  getRowByScheduledStopPointId(scheduledStopPointId: string) {
    return cy.get(`[data-scheduled-stop-point-id='${scheduledStopPointId}'`);
  }

  getRowLinkByLabel(label: string) {
    return this.getRowByLabel(label).findByTestId('StopTableRow::link');
  }

  getRowPriority() {
    return cy.getByTestId('StopTableRow::priority');
  }
}
