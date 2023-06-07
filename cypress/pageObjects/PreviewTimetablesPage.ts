import { BlockVehicleJourneysTable } from './BlockVehicleJourneysTable';
import { PriorityForm } from './PriorityForm';

export class PreviewTimetablesPage {
  priorityForm = new PriorityForm();

  blockVehicleJourneysTable = new BlockVehicleJourneysTable();

  getSaveButton() {
    return cy.getByTestId('PreviewTimetablesPage::saveButton');
  }
}
