export class ExportToolBar {
  static getToggleSelectingButton() {
    return cy.getByTestId('ExportToolBar::toggleSelectingButton');
  }

  static getExportSelectedButton() {
    return cy.getByTestId('ExportToolBar::exportSelectedButton');
  }
}
