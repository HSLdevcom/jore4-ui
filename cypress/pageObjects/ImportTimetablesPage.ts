import { ConfirmationDialog } from './ConfirmationDialog';
import { Toast } from './Toast';

export class ImportTimetablesPage {
  toast = new Toast();

  confirmationDialog = new ConfirmationDialog();

  getCancelButton() {
    return cy.getByTestId('ImportTimetablesPage::cancelButton');
  }

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

  verifyImportFormButtonsDisabled = () => {
    this.getCancelButton().should('be.disabled');
    this.getSaveButton().should('be.disabled');
    this.getPreviewButton()
      // This "button" is not actually a <button> so doesn't (and can't) have disabled attribute.
      .should('have.attr', 'aria-disabled', 'true');
  };

  getUploadButton() {
    return cy.getByTestId('ImportTimetablesPage::uploadButton');
  }

  selectFileToImport(fileName: string) {
    cy.get('input[type=file]')
      // Cypress cannot interact with the input component that is hidden
      // so we have to get it to show first
      .invoke('show')
      .selectFile(`uploads/${fileName}`);
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
