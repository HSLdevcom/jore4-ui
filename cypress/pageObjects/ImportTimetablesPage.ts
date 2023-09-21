import { Toast } from './Toast';

export class ImportTimetablesPage {
  toast = new Toast();

  getSaveButton() {
    return cy.getByTestId('ImportTimetablesPage::saveButton');
  }

  getPreviewButton() {
    return cy.getByTestId('ImportTimetablesPage::previewButton');
  }

  clickPreviewButton() {
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

  selectFilesToImport(fileNames: string[]) {
    // prepend each filename with the uploads directory name
    const filePaths = fileNames.map((item) => `uploads/${item}`);
    cy.get('input[type=file]')
      // Cypress cannot interact with the input component that is hidden
      // so we have to get it to show first
      .invoke('show')
      .selectFile(filePaths);
  }
}
