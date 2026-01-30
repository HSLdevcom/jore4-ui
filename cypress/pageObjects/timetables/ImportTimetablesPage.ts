import { ConfirmationDialog } from '../shared-components/ConfirmationDialog';
import { Toast } from '../shared-components/Toast';

export class ImportTimetablesPage {
  static toast = Toast;

  static confirmationDialog = ConfirmationDialog;

  static getAbortButton() {
    return cy.getByTestId('ImportTimetablesPage::abortButton');
  }

  static getSaveButton() {
    return cy.getByTestId('ImportTimetablesPage::saveButton');
  }

  static getPreviewButton() {
    return cy.getByTestId('ImportTimetablesPage::previewButton');
  }

  static clickPreviewButton() {
    return (
      ImportTimetablesPage.getPreviewButton()
        // Preview button is not instantly enabled
        // so we have to check that the 'aria-disabled' attribute is false
        .should('have.attr', 'aria-disabled', 'false')
        .click()
    );
  }

  static verifyImportFormButtonsDisabled() {
    ImportTimetablesPage.getAbortButton().should('be.disabled');
    ImportTimetablesPage.getSaveButton().should('be.disabled');
    ImportTimetablesPage.getPreviewButton()
      // This "button" is not actually a <button> so doesn't (and can't) have disabled attribute.
      .should('have.attr', 'aria-disabled', 'true');
  }

  static getUploadButton() {
    return cy.getByTestId('ImportTimetablesPage::uploadButton');
  }

  static selectFileToImport(fileName: string) {
    cy.get('input[type=file]')
      // Cypress cannot interact with the input component that is hidden
      // so we have to get it to show first
      .invoke('show')
      .selectFile(`uploads/${fileName}`);
  }

  static selectFilesToImport(fileNames: string[]) {
    // prepend each filename with the uploads directory name
    const filePaths = fileNames.map((item) => `uploads/${item}`);
    cy.get('input[type=file]')
      // Cypress cannot interact with the input component that is hidden
      // so we have to get it to show first
      .invoke('show')
      .selectFile(filePaths);
  }
}
