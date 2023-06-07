export class ExportToolBar {
  getToggleSelectingButton() {
    return cy.getByTestId('ExportToolBar::toggleSelectingButton');
  }

  getExportSelectedButton() {
    return cy.getByTestId('ExportToolBar::exportSelectedButton');
  }
}
