import { BlockVehicleJourneysTable } from './BlockVehicleJourneysTable';
import { ConfirmPreviewedTimetablesImportForm } from './ConfirmPreviewedTimetablesImportForm';
import { TimetablesImportPriorityForm } from './TimetablesImportPriorityForm';
import { VehicleScheduleFrameBlocksView } from './VehicleScheduleFrameBlocksView';

export class PreviewTimetablesPage {
  priorityForm = new TimetablesImportPriorityForm();

  blockVehicleJourneysTable = new BlockVehicleJourneysTable();

  confirmPreviewedTimetablesImportForm =
    new ConfirmPreviewedTimetablesImportForm();

  vehicleScheduleFrameBlocksView = new VehicleScheduleFrameBlocksView();

  getSaveButton() {
    return cy.getByTestId('PreviewTimetablesPage::saveButton');
  }

  getTitle() {
    return cy.getByTestId('PreviewTimetablesPage::previewTitle');
  }

  getVehicleScheduleFrameBlockByLabel(label: string) {
    return cy.getByTestId(
      `VehicleScheduleFrameBlocksView::frameBlocks::${label}`,
    );
  }
}
