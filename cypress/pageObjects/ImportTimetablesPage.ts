import { Toast } from './Toast';

export class ImportTimetablesPage {
  toast = new Toast();

  getSaveButton() {
    return cy.getByTestId('ImportTimetablesPage::saveButton');
  }

  getPreviewButton() {
    return cy.getByTestId('ImportTimetablesPage::previewButton');
  }

  clickEnabledPreviewButton() {
    return (
      this.getPreviewButton()
        // Preview button is not instantly enabled
        // so we have to check that the 'aria-disabled' attribute is false
        .should('have.attr', 'aria-disabled', 'false')
        .click()
    );
  }

  getUploadButton() {
    return cy.getByTestId('ImportTimetablesPage::uploadButton');
  }
}
