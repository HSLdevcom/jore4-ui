import { BlockVehicleJourneysTable } from './BlockVehicleJourneysTable';
import { ConfirmPreviewedTimetablesImportForm } from './ConfirmPreviewedTimetablesImportForm';
import { ConfirmTimetablesImportForm } from './ConfirmTimetableImportForm';
import { PriorityForm } from './PriorityForm';
import { VehicleScheduleFrameBlocksView } from './VehicleScheduleFrameBlocksView';

export class PreviewTimetablesPage {
  priorityForm = new PriorityForm();

  blockVehicleJourneysTable = new BlockVehicleJourneysTable();

  confirmPreviewedTimetablesImportForm =
    new ConfirmPreviewedTimetablesImportForm();

  vehicleScheduleFrameBlocksView = new VehicleScheduleFrameBlocksView();

  confirmTimetablesImportForm = new ConfirmTimetablesImportForm();

  getSaveButton() {
    return cy.getByTestId('PreviewTimetablesPage::saveButton');
  }
}
