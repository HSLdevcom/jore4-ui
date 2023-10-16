import { BlockVehicleJourneysTable } from './BlockVehicleJourneysTable';
import { TimetablesImportPriorityForm } from './TimetablesImportPriorityForm';

export class PreviewTimetablesPage {
  priorityForm = new TimetablesImportPriorityForm();

  blockVehicleJourneysTable = new BlockVehicleJourneysTable();

  getSaveButton() {
    return cy.getByTestId('PreviewTimetablesPage::saveButton');
  }
}
