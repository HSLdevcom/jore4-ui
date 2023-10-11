import { BlockVehicleJourneysTable } from './BlockVehicleJourneysTable';
import { ConfirmPreviewedTimetablesImportForm } from './ConfirmPreviewedTimetablesImportForm';
import { PriorityForm } from './PriorityForm';
import { VehicleScheduleFrameBlocksView } from './VehicleScheduleFrameBlocksView';

export class PreviewTimetablesPage {
  priorityForm = new PriorityForm();

  blockVehicleJourneysTable = new BlockVehicleJourneysTable();

  confirmPreviewedTimetablesImportForm =
    new ConfirmPreviewedTimetablesImportForm();

  vehicleScheduleFrameBlocksView = new VehicleScheduleFrameBlocksView();

  getSaveButton() {
    return cy.getByTestId('PreviewTimetablesPage::saveButton');
  }
}
