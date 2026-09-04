import { Toast } from '../shared-components';

export class RouteReportDownloadMenu {
  static getMenuButton() {
    return cy.getByTestId('RouteReportDownloadMenu::menu');
  }

  static getEquipmentReportButton() {
    return cy.getByTestId('RouteEquipmentReport::button');
  }

  static getInfoSpotReportButton() {
    return cy.getByTestId('RouteInfoSpotReport::button');
  }

  static getDownloadedCSVReport(type: string) {
    Toast.expectSuccessToast('CSV raportti ladattu nimellä: ');
    return cy
      .getByTestId(`${type}::filename`)
      .then((filenameSpan) => filenameSpan.text())
      .then((filename) =>
        cy.task<string>('readDownloadedCSV', {
          possibleFileNames: [filename, 'download'],
          downloadsFolder: Cypress.config('downloadsFolder'),
          timeout: Cypress.config('taskTimeout'),
        }),
      );
  }

  static getDownloadedEquipmentReport() {
    return RouteReportDownloadMenu.getDownloadedCSVReport(
      'RouteEquipmentReport',
    );
  }

  static getDownloadedInfoSpotReport() {
    return RouteReportDownloadMenu.getDownloadedCSVReport(
      'RouteInfoSpotReport',
    );
  }
}
