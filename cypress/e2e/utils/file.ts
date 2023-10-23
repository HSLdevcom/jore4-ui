import { DateTime } from 'luxon';

export const deleteExportFile = () => {
  const exportDate = DateTime.now().toISODate();
  const exportFilePath = `${Cypress.config(
    'downloadsFolder',
  )}/jore4-export-${exportDate}.csv`;
  cy.task('deleteFile', exportFilePath);
};
