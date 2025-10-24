import { Toast } from '../../Toast';

export class StopSearchResultsPage {
  toast = new Toast();

  getContainer() {
    return cy.getByTestId('StopSearchResultsPage::Container');
  }

  getCloseResultsButton() {
    return cy.getByTestId('StopSearchResultsPage::closeButton');
  }

  getResultCount() {
    return cy.getByTestId('StopSearchResultsPage::resultCount');
  }

  getShowOnMapButton() {
    return cy.getByTestId('StopSearchResultsPage::showOnMapButton');
  }

  getShowOnMapButtonLoading() {
    return cy.getByTestId('StopSearchResultsPage::showOnMapButton::loading');
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
    return cy.get(`[data-scheduled-stop-point-id='${scheduledStopPointId}']`);
  }

  getRowLinkByLabel(label: string) {
    return this.getRowByLabel(label).findByTestId('StopTableRow::link');
  }

  getRowPriority() {
    return cy.getByTestId('StopTableRow::priority');
  }

  getSelectInput() {
    return cy.getByTestId('StopTableRow::selectInput');
  }

  getSelectAllButton() {
    return cy.getByTestId('StopSearchResultsPage::selectAllButton');
  }

  getDownloadAsCSVButton() {
    return cy.getByTestId('DownloadResultsAsCSVButton::button');
  }

  getDownloadAsCSVButtonLoading() {
    return cy.getByTestId('DownloadResultsAsCSVButton::loading');
  }

  getDownloadedCSVReport() {
    this.toast.expectSuccessToast('CSV raportti ladattu nimellä: ');
    return cy
      .getByTestId('DownloadResultsAsCSVButton::filename')
      .then((filenameSpan) => filenameSpan.text())
      .then((filename) =>
        cy.task('readDownloadedCSV', {
          // File should be found with the given filename, but when running the
          // tests in Github for some reason the file endsup being called 'download'
          possibleFileNames: [filename, 'download'],

          downloadsFolder: Cypress.config('downloadsFolder'),
          timeout: Cypress.config('taskTimeout'),
        }),
      );
  }
}
