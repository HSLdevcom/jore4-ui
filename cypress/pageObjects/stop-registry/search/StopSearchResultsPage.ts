import { Toast } from '../../shared-components/Toast';

export class StopSearchResultsPage {
  static getContainer() {
    return cy.getByTestId('StopSearchResultsPage::Container');
  }

  static getCloseResultsButton() {
    return cy.getByTestId('StopSearchResultsPage::closeButton');
  }

  static getResultCount() {
    return cy.getByTestId('StopSearchResultsPage::resultCount');
  }

  static getShowOnMapButton() {
    return cy.getByTestId('StopSearchResultsPage::showOnMapButton');
  }

  static getShowOnMapButtonLoading() {
    return cy.getByTestId('StopSearchResultsPage::showOnMapButton::loading');
  }

  static getResultsTable() {
    return cy.getByTestId('StopSearchByStopResultList::table');
  }

  static getResultRows() {
    return StopSearchResultsPage.getResultsTable().first().find('tbody tr');
  }

  static getRowByLabel(label: string) {
    return cy.getByTestId(`StopTableRow::row::${label}`);
  }

  static getRowByNetexId(netexId: string) {
    return cy.get(`[data-netex-id='${netexId}']`);
  }

  static getRowByScheduledStopPointId(scheduledStopPointId: string) {
    return cy.get(`[data-scheduled-stop-point-id='${scheduledStopPointId}']`);
  }

  static getRowLinkByLabel(label: string) {
    return StopSearchResultsPage.getRowByLabel(label).findByTestId(
      'StopTableRow::link',
    );
  }

  static getRowPriority() {
    return cy.getByTestId('StopTableRow::priority');
  }

  static getSelectInput() {
    return cy.getByTestId('StopTableRow::selectInput');
  }

  static getSelectAllStopsOfLineButton(line: string) {
    return cy.getByTestId(`StopSearchByLine::line::selectAll::${line}`);
  }

  static getSelectAllStopsOfRouteButton(route: string) {
    return cy.getByTestId(`StopSearchByLine::route::selectAll::${route}`);
  }

  static getSelectAllButton() {
    return cy.getByTestId('StopSearchResultsPage::selectAllButton');
  }

  static getResultsActionMenu() {
    return cy.getByTestId('StopSearchResultsPage::results::actionMenu');
  }

  static getDownloadEquipmentDetailsReportButton() {
    return cy.getByTestId('EquipmentReport::button');
  }

  static getDownloadInfoSpotDetailsReportButton() {
    return cy.getByTestId('InfoSpotReport::button');
  }

  static getDownloadedCSVReport(type: string) {
    Toast.expectSuccessToast('CSV raportti ladattu nimellä: ');
    return cy
      .getByTestId(`${type}::filename`)
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

  static getDownloadedEquipmentDetailsCSVReport() {
    return StopSearchResultsPage.getDownloadedCSVReport('EquipmentReport');
  }

  static getDownloadedInfoSpotDetailsCSVReport() {
    return StopSearchResultsPage.getDownloadedCSVReport('InfoSpotReport');
  }
}
